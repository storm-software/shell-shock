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

import { code } from "@alloy-js/core";
import { TypescriptFile } from "@power-plant/alloy-js/typescript";
import { getPrefix } from "@powerlines/plugin-alloy/helpers/prefix";
import {
  BuiltinFile,
  usePowerlines
} from "@shell-shock/core/contexts/power-plant";
import { isAbsolute, resolve } from "node:path";
import { AUTH_COMMANDS, authConfiguration } from "../helpers";
import type { AuthPluginContext } from "../types/plugin";

/** Generated singleton; secrets are obtained at runtime, never rendered into source. */
export function AuthBuiltin() {
  const context = usePowerlines<AuthPluginContext>();
  const { runtime, ...options } = authConfiguration(context.config.auth);
  const imports = {
    "@shell-shock/plugin-auth/runtime": ["createAuth"],
    ...(runtime
      ? {
          [isAbsolute(runtime.file)
            ? runtime.file
            : resolve(
                context.config.cwd,
                context.config.root ?? ".",
                runtime.file
              )]: [
            {
              name: runtime.export ?? "default",
              alias: "authRuntimeOverrides",
              ...(runtime.export === "default" || !runtime.export
                ? { default: true }
                : {})
            }
          ]
        }
      : {})
  };
  return (
    <BuiltinFile
      id="auth"
      description="Secure authentication helpers for protected commands."
      imports={imports}>
      {code`
const auth = createAuth({
  ${runtime ? "...authRuntimeOverrides," : ""}
  ...${JSON.stringify(options)}
});
export const login = () => auth.login();
export const logout = () => auth.logout();
export const whoami = () => auth.whoami();
export const requireAuth = () => auth.requireAuth();
export const getAccessToken = () => auth.getAccessToken();
`}
    </BuiltinFile>
  );
}

/** Emit before command reflection so the generated inputs can be resolved. */
export function AuthCommands() {
  const context = usePowerlines<AuthPluginContext>();
  return (
    <>
      {AUTH_COMMANDS.map(name => (
        <TypescriptFile
          path={resolve(context.entryPath, name, "command.ts")}
          prefix={getPrefix(context)}
          builtinImports={{ auth: [name], console: ["writeLine"] }}>
          {code`
export const metadata = { protected: false, tags: ["Authentication"] };
export default async function handler() {
  ${
    name === "logout"
      ? `await logout();
  writeLine(${JSON.stringify(context.config.auth.tokenEnv ? `Local credentials removed. If ${context.config.auth.tokenEnv} is set, remove it separately.` : "Local credentials removed.")});`
      : name === "login"
        ? `await login();
  writeLine("Signed in successfully.");`
        : `const user = await whoami();
  writeLine(JSON.stringify(user));`
  }
}
`}
        </TypescriptFile>
      ))}
    </>
  );
}
