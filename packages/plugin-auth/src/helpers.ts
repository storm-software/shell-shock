/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

 This code was released as part of the Shell Shock project. Shell Shock
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/shell-shock.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/shell-shock
 Documentation:            https://docs.stormsoftware.com/projects/shell-shock
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { CommandTree } from "@shell-shock/core";
import { join } from "node:path";
import type { AuthPluginContext, AuthPluginOptions } from "./types/plugin";

/** Copy only public configuration; credentials and arbitrary callbacks cannot enter generated code. */
export function authConfiguration(
  options: AuthPluginOptions
): AuthPluginOptions {
  for (const [name, value] of [
    ["issuer", options.issuer],
    ["loginUrl", options.loginUrl]
  ] as const) {
    if (value === undefined && name === "loginUrl") continue;
    const url = new URL(value!);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.hash ||
      url.search
    ) {
      throw new Error(
        `Authentication ${name} must be an HTTPS URL without credentials, query, or fragment.`
      );
    }
  }
  if (!options.clientId?.trim() || !options.namespace?.trim()) {
    throw new Error(
      "Authentication requires a clientId and a unique application namespace."
    );
  }
  if (options.tokenEnv && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(options.tokenEnv)) {
    throw new Error(
      "Authentication tokenEnv must be an environment variable name."
    );
  }
  if (options.tokenEnv && (!options.runtime || !options.audience?.trim())) {
    throw new Error(
      "Environment credentials require a runtime validator module and expected audience."
    );
  }
  if (options.scopes?.some(scope => !scope || /\s/.test(scope))) {
    throw new Error(
      "Authentication scopes must be nonempty individual scope names."
    );
  }
  if (
    options.runtime &&
    (!options.runtime.file?.trim() ||
      (options.runtime.export !== undefined &&
        !/^[A-Za-z_$][\w$]*$/.test(options.runtime.export)))
  ) {
    throw new Error(
      "Authentication runtime requires a module file and valid export name."
    );
  }
  if (
    options.loginTimeoutMs !== undefined &&
    (!Number.isFinite(options.loginTimeoutMs) ||
      options.loginTimeoutMs <= 0 ||
      options.loginTimeoutMs > 300_000)
  ) {
    throw new Error(
      "Authentication loginTimeoutMs must be between 1 and 300000 milliseconds."
    );
  }
  if (
    options.requestTimeoutSeconds !== undefined &&
    (!Number.isFinite(options.requestTimeoutSeconds) ||
      options.requestTimeoutSeconds < 1 ||
      options.requestTimeoutSeconds > 30)
  ) {
    throw new Error(
      "Authentication requestTimeoutSeconds must be between 1 and 30 seconds."
    );
  }
  return {
    issuer: options.issuer,
    clientId: options.clientId,
    namespace: options.namespace,
    scopes: [...new Set(["openid", ...(options.scopes ?? [])])],
    ...(options.loginUrl === undefined ? {} : { loginUrl: options.loginUrl }),
    ...(options.tokenEnv === undefined ? {} : { tokenEnv: options.tokenEnv }),
    ...(options.audience === undefined ? {} : { audience: options.audience }),
    ...(options.loginTimeoutMs === undefined
      ? {}
      : { loginTimeoutMs: options.loginTimeoutMs }),
    ...(options.requestTimeoutSeconds === undefined
      ? {}
      : { requestTimeoutSeconds: options.requestTimeoutSeconds }),
    ...(options.runtime === undefined
      ? {}
      : {
          runtime: {
            file: options.runtime.file,
            export: options.runtime.export ?? "default"
          }
        })
  };
}

export const AUTH_COMMANDS = ["login", "logout", "whoami"] as const;

/** Reserve all auth command names atomically rather than silently keeping an unrelated handler. */
export function registerAuthCommands(context: AuthPluginContext): void {
  context.inputs ??= [];
  const normalize = (name: string) =>
    context.config.isCaseSensitive ? name : name.toLowerCase();
  for (const name of AUTH_COMMANDS) {
    if (
      context.inputs.some(input =>
        [input.id, input.name, input.path, ...(input.alias ?? [])].some(
          value =>
            typeof value === "string" && normalize(value) === normalize(name)
        )
      )
    ) {
      throw new Error(
        `Authentication command '${name}' already exists. Rename the conflicting command or alias.`
      );
    }
  }
  for (const name of AUTH_COMMANDS) {
    context.inputs.push({
      id: name,
      name,
      path: name,
      segments: [name],
      alias: [],
      title:
        name === "whoami"
          ? "Current User"
          : name === "login"
            ? "Log In"
            : "Log Out",
      description:
        name === "whoami"
          ? "Display the authenticated user."
          : name === "login"
            ? "Sign in securely using a browser."
            : "Remove locally stored credentials and attempt token revocation.",
      tags: ["Authentication"],
      protected: false,
      virtual: false,
      entry: {
        file: join(context.entryPath, name, "index.ts"),
        input: { file: join(context.entryPath, name, "command.ts") }
      }
    });
  }
}

/** Bootstrap commands must not require an authenticated ancestor. */
export function assertAuthCommands(
  commands: Record<string, CommandTree>
): void {
  const visit = (command: CommandTree, inherited: boolean) => {
    const protectedCommand = inherited || command.protected === true;
    if (
      AUTH_COMMANDS.includes(command.name as (typeof AUTH_COMMANDS)[number]) &&
      protectedCommand
    ) {
      throw new Error(
        `Authentication command '${command.name}' cannot be protected, including through an ancestor.`
      );
    }
    for (const child of Object.values(command.children ?? {}))
      visit(child, protectedCommand);
  };
  for (const command of Object.values(commands)) {
    let inherited = false;
    const visited = new Set<CommandTree>();
    let parent = command.parent;
    while (parent && !visited.has(parent)) {
      visited.add(parent);
      inherited ||= parent.protected === true;
      parent = parent.parent;
    }
    visit(command, inherited);
  }
}
