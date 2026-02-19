/* -------------------------------------------------------------------

                  ⚡ Storm Software - Shell Shock

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

import { code, Show, splitProps } from "@alloy-js/core";
import {
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocInternal,
  TSDocLink,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppTitle } from "@shell-shock/core/plugin-utils/context-helpers";
import defu from "defu";
import type { ScriptPresetContext } from "../types/plugin";
import { IsVerbose } from "./helpers";

export interface UtilsBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {}

/**
 * Generates utilities for detecting terminal color support.
 */
export function EnvSupportUtilities() {
  return (
    <>
      <VarDeclaration
        export
        const
        name="isTTY"
        doc="Detect if stdout.TTY is available"
        initializer={code`Boolean(process.stdout && process.stdout.isTTY);`}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="isMinimal"
        doc="Detect if the current environment is minimal (CI, non-TTY, etc.)"
        initializer={code` env.MINIMAL || isCI || isTest || !isTTY; `}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="isInteractive"
        doc="Detect if the current environment is interactive"
        initializer={code` !isMinimal && process.stdin?.isTTY && env.TERM !== "dumb" && !hasFlag(["no-interactive", "non-interactive", "no-interact"]); `}
      />
    </>
  );
}

/**
 * Generates utilities for detecting terminal color support.
 */
export function ColorSupportUtilities() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="GetColorSupportLevelOptions"
        doc="Options for the getColorSupportLevel function">
        <InterfaceMember
          name="ignoreFlags"
          type="boolean"
          doc="Indicates if the function should skip checking command-line flags for color support"
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Checks if a specific flag is present in the command line arguments.">
        <TSDocLink>
          {"https://github.com/sindresorhus/has-flag/blob/main/index.js"}
        </TSDocLink>
        <TSDocParam name="flag">
          {'The flag to check for, e.g., "color", "no-color".'}
        </TSDocParam>
        <TSDocParam name="argv">
          {
            "The command line arguments to check against. Defaults to global Deno args or process args."
          }
        </TSDocParam>
        <TSDocReturns>
          {"True if the flag is present, false otherwise."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="getColorSupportLevel"
        parameters={[
          { name: "stream", type: "NodeJS.WriteStream & { fd: 1 | 2; }" },
          {
            name: "options",
            type: "GetColorSupportLevelOptions",
            default: "{ ignoreFlags: false }"
          }
        ]}>
        {code`const { ignoreFlags } = options;

        let forceColor: number | undefined;
        if (env.FORCE_COLOR !== undefined) {
          forceColor = !env.FORCE_COLOR
            ? 0
            : typeof env.FORCE_COLOR === "boolean"
            ? 1
            : typeof env.FORCE_COLOR === "number" &&
              [0, 1, 2, 3].includes(Math.min(env.FORCE_COLOR as number, 3))
            ? Math.min(env.FORCE_COLOR as number, 3)
            : undefined;
        }

        if (ignoreFlags !== true && forceColor === undefined) {
          if (
            hasFlag("no-color") ||
            hasFlag("no-colors") ||
            hasFlag("color=false") ||
            hasFlag("color=never")
          ) {
            return 0;
          }

          if (
            hasFlag("color=16m") ||
            hasFlag("color=full") ||
            hasFlag("color=truecolor")
          ) {
            return 3;
          }

          if (hasFlag("color=256")) {
            return 2;
          }

          if (
            hasFlag("color") ||
            hasFlag("colors") ||
            hasFlag("color=true") ||
            hasFlag("color=always")
          ) {
            forceColor = 1;
          }
        }

        const level = Boolean(env.TF_BUILD) || Boolean(env.AGENT_NAME)
          ? 1
          : stream &&
              !(isTTY || (stream && stream.isTTY)) &&
              forceColor === undefined
            ? 0
            : env.TERM === "dumb"
              ? forceColor || 0
              : isWindows
                ? Number(os.release().split(".")[0]) >= 10 &&
                  Number(os.release().split(".")[2]) >= 10_586
                  ? Number(os.release().split(".")[2]) >= 14_931
                    ? 3
                    : 2
                  : 1
                : isCI
                  ? Boolean(env.GITHUB_ACTIONS) ||
                    Boolean(env.GITEA_ACTIONS) ||
                    Boolean(env.CIRCLECI)
                    ? 3
                    : Boolean(env.TRAVIS) ||
                      Boolean(env.APPVEYOR) ||
                      Boolean(env.GITLAB_CI) ||
                      Boolean(env.BUILDKITE) ||
                      Boolean(env.DRONE) ||
                      env.CI_NAME === "codeship"
                      ? 1
                      : forceColor || 0
                  : Boolean(env.TEAMCITY_VERSION)
                    ? /^(?:9\.0*[1-9]\d*\.|\d{2,}\.)/.test(String(env.TEAMCITY_VERSION) || "")
                      ? 1
                      : 0
                    : String(env.COLORTERM) === "truecolor" ||
                        env.TERM === "xterm-kitty"
                      ? 3
                      : Boolean(env.TERM_PROGRAM)
                        ? env.TERM_PROGRAM === "iTerm.app"
                          ? Number.parseInt(
                              (env.TERM_PROGRAM_VERSION || "").split(".")[0] as string,
                              10
                            ) >= 3
                            ? 3
                            : 2
                          : env.TERM_PROGRAM === "Apple_Terminal"
                            ? 2
                            : 0
                        : /-256(?:color)?$/i.test(env.TERM || "")
                          ? 2
                          : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
                                env.TERM || ""
                              )
                            ? 1
                            : Boolean(env.COLORTERM);

        return typeof level === "boolean" || level === 0
          ? false
          : {
              level,
              hasBasic: true,
              has256: level >= 2,
              has16m: level >= 3,
            };

  `}
      </FunctionDeclaration>
      <Spacing />
      <VarDeclaration
        export
        const
        name="colorSupportLevels"
        doc="Detect the terminal color support level in the current environment"
        initializer={code` {
    stdout: getColorSupportLevel(process.stdout),
    stderr: getColorSupportLevel(process.stderr),
  }; `}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="isColorSupported"
        doc="Detect if terminal color is supported in the current environment"
        initializer={code` Boolean(colorSupportLevels.stdout); `}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="isUnicodeSupported"
        doc="Detect if Unicode characters are supported in the current environment"
        initializer={code` !isWindows
            ? env.TERM !== "linux"
            : Boolean(env.WT_SESSION) ||
                Boolean(env.TERMINUS_SUBLIME) ||
                env.ConEmuTask === "{cmd::Cmder}" ||
                env.TERM_PROGRAM === "Terminus-Sublime" ||
                env.TERM_PROGRAM === "vscode" ||
                env.TERM === "xterm-256color" ||
                env.TERM === "alacritty" ||
                env.TERM === "rxvt-unicode" ||
                env.TERM === "rxvt-unicode-256color" ||
                env.TERMINAL_EMULATOR === "JetBrains-JediTerm"; `}
      />
    </>
  );
}

/**
 * Generates utilities for detecting terminal color support.
 */

export function HyperlinkSupportUtilities() {
  return (
    <>
      <FunctionDeclaration
        name="parseVersion"
        parameters={[{ name: "version", type: "string", default: '""' }]}>
        {code`if (/^\d{3,4}$/.test(version)) {
        const match = /(\d{1,2})(\d{2})/.exec(version) ?? [];

        return {
          major: 0,
          minor: Number.parseInt(match[1]!, 10),
          patch: Number.parseInt(match[2]!, 10)
        };
      }

      const versionParts = (version ?? "")
        .split(".")
        .map(n => Number.parseInt(n, 10));

      return {
        major: versionParts[0],
        minor: versionParts[1],
        patch: versionParts[2]
      }; `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Check if the current environment/terminal supports hyperlinks in the terminal.">
        <TSDocReturns>
          {"True if the current environment/terminal supports hyperlinks."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="isHyperlinkSupported"
        returnType="boolean">
        {code`if (Boolean(env.FORCE_HYPERLINK)) {
          return true;
        }

        if (Boolean(env.NETLIFY)) {
          return true;
        } else if (isColorSupported || isTTY) {
          return false;
        } else if (Boolean(env.WT_SESSION)) {
          return true;
        } else if (isWindows || isMinimal || Boolean(env.TEAMCITY_VERSION)) {
          return false;
        } else if (Boolean(env.TERM_PROGRAM)) {
          const version = parseVersion(env.TERM_PROGRAM_VERSION);

          switch (String(env.TERM_PROGRAM)) {
            case "iTerm.app": {
              if (version.major === 3) {
                return version.minor !== undefined && version.minor >= 1;
              }

              return version.major !== undefined && version.major > 3;
            }
            case "WezTerm": {
              return version.major !== undefined && version.major >= 20_200_620;
            }

            case "vscode": {
              if (Boolean(env.CURSOR_TRACE_ID)) {
                return true;
              }

              return (
                version.minor !== undefined &&
                version.major !== undefined &&
                (version.major > 1 || (version.major === 1 && version.minor >= 72))
              );
            }

            case "ghostty": {
              return true;
            }
          }
        }

        if (Boolean(env.VTE_VERSION)) {
          if (env.VTE_VERSION === "0.50.0") {
            return false;
          }

          const version = parseVersion(env.VTE_VERSION);
          return (
            (version.major !== undefined && version.major > 0) ||
            (version.minor !== undefined && version.minor >= 50)
          );
        }

        if (String(env.TERM) === "alacritty") {
          return true;
        }

        return false; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * Generates utilities for detecting terminal color support.
 */
export function ArgsUtilities() {
  return (
    <>
      <TSDoc heading="Retrieves the command line arguments from Deno or Node.js environments.">
        <TSDocRemarks>
          {
            "This function is only intended for internal use. Please use `useArgs()` instead."
          }
        </TSDocRemarks>
        <hbr />
        <hbr />
        <TSDocInternal />
        <hbr />
        <hbr />
        <TSDocReturns>
          {
            "An array of command line arguments from Deno or Node.js environments."
          }
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="getArgs" returnType="string[]">
        {code`return ((globalThis as { Deno?: { args: string[] } })?.Deno?.args ?? process.argv ?? []) as string[];`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Checks if a specific flag is present in the command line arguments.">
        <TSDocLink>
          {"https://github.com/sindresorhus/has-flag/blob/main/index.js"}
        </TSDocLink>
        <TSDocParam name="flag">
          {
            'The flag (or an array of flags/aliases) to check for, e.g., "color", "no-color".'
          }
        </TSDocParam>
        <TSDocParam name="argv">
          {
            "The command line arguments to check against. Defaults to global Deno args or process args."
          }
        </TSDocParam>
        <TSDocReturns>
          {"True if the flag is present, false otherwise."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="hasFlag"
        parameters={[
          { name: "flag", type: "string | string[]" },
          {
            name: "argv",
            type: "string[]",
            default: "useArgs()"
          }
        ]}>
        <VarDeclaration
          const
          name="position"
          type="number"
          initializer={code`(Array.isArray(flag) ? flag : [flag]).reduce((ret, f) => {
            const pos = argv.findIndex(arg => (f.startsWith("-") ? "" : (f.length === 1 ? "-" : "--") + f)?.toLowerCase() === arg?.toLowerCase() || arg?.toLowerCase().startsWith((f.length === 1 ? "-" : "--") + f + "="));
            return pos !== -1 ? pos : ret;
          }, -1);`}
        />
        <hbr />
        {code`return position !== -1 && argv.indexOf("--") === -1 || position < argv.indexOf("--");`}
      </FunctionDeclaration>
      <Spacing />
      <VarDeclaration
        export
        name="isHelp"
        type="boolean"
        initializer={code` !isCI && hasFlag(["help", "h", "?"]); `}
      />
    </>
  );
}

/**
 * The `exit` handler function declaration code for the Shell Shock project.
 */
export function ExitFunctionDeclaration() {
  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <InterfaceDeclaration
        export
        name="ExitOptions"
        doc="Options for the exit handler function.">
        <InterfaceMember
          name="exception"
          optional
          type="string | Error"
          doc="An optional exception that caused the exit. This can be a string message or an Error object."
        />
        <hbr />
        <InterfaceMember
          name="skipProcessExit"
          optional
          type="boolean"
          doc="Indicates whether the exit function should manually exit the process or not. If set to true, the exit function will not call process.exit() and will allow the application to continue running. If set to false or not specified, the exit function will call process.exit() to terminate the application."
        />
        <hbr />
        <InterfaceMember
          name="isSynchronous"
          optional
          type="boolean"
          doc="Indicates whether the exit function should perform synchronous operations only. If set to true, the exit function will avoid any asynchronous operations during exit. If set to false or not specified, the exit function may perform asynchronous operations as needed."
        />
        <hbr />
        <InterfaceMember
          name="signal"
          optional
          type="number"
          doc="The signal number that triggered the exit. This is typically used when the shutdown is initiated by a system signal (e.g., SIGINT, SIGTERM)."
        />
        <hbr />
        <InterfaceMember
          name="startDate"
          optional
          type="Date"
          doc="A Date object representing the timestamp when the process started. This can be used to measure the duration of the shutdown process."
        />
      </InterfaceDeclaration>
      <Spacing />
      <VarDeclaration
        let
        name="isExiting"
        type="boolean"
        initializer={code`false;`}
      />
      <VarDeclaration
        const
        name="callbackAsyncQueue"
        type="Array<[(code: number | string) => Promise<void> | void, number]>"
        initializer={code`[];`}
      />
      <VarDeclaration
        const
        name="callbackSyncQueue"
        type="Array<(code: number | string) => void>"
        initializer={code`[];`}
      />
      <Spacing />
      <FunctionDeclaration
        export
        async
        name="exit"
        parameters={[
          {
            name: "options",
            type: "ExitOptions",
            default: "{}"
          }
        ]}>
        {code`
          try {
            if (isExiting) {
              return;
            }

            isExiting = true;

            let exitCode: number | string = 0;
            if ((options.signal !== undefined && options.signal > 0) || options.exception) {
              exitCode = 128 + (options.signal ?? 1);
            } else if (typeof process.exitCode === "number" || typeof process.exitCode === "string") {
              exitCode = process.exitCode;
            }

            if (options.exception) {
              error(\`A fatal error occured while running the application - please contact the ${getAppTitle(
                context
              )} support team\${options.exception && typeof options.exception !== "symbol" ? \`: \\n\\n\${typeof options.exception === "string" ? options.exception : options.exception.message}\` : "."}\`);
            }

            const terminate = (force = false) => { `}
        <IfStatement
          condition={<IsVerbose />}>{code`writeLine("");`}</IfStatement>
        <hbr />
        {code`
              verbose(\`The ${getAppTitle(
                context
              )} application exited \${options.exception ? \`early due to an exception\` : "successfully"}\${options.startDate ? \`. Total processing time is \${Date.now() - options.startDate.getTime() > 5000 ? Math.floor((Date.now() - options.startDate.getTime()) / 1000) : Date.now() - options.startDate.getTime()} \${Date.now() - options.startDate.getTime() > 5000 ? "seconds" : "milliseconds"}\` : ""}...\`);
              if (!options.skipProcessExit) {
                process.nextTick(() => process.exit(exitCode));
              }
            };

            for (const callbackSync of callbackSyncQueue) {
              callbackSync(exitCode);
            }

            if (!options.isSynchronous) {
              const promises = [];
              let forceAfter = 0;
              for (const [callbackAsync, wait] of callbackAsyncQueue) {
                forceAfter = Math.max(forceAfter, wait);
                promises.push(Promise.resolve(callbackAsync(exitCode)));
              }

              const asyncTimer = setTimeout(() => {
                terminate(true);
              }, forceAfter);
              await Promise.all(promises);
              clearTimeout(asyncTimer);
            }

            terminate();
          } catch (err) {
            error(\`The exit process failed to complete\${(err as Error).message ? \` - (err as Error).message\` : ""}. Please contact the ${getAppTitle(
              context
            )} support team.\`);

            if (!options.skipProcessExit) {
              process.nextTick(() => process.exit(1));
            }
          }
        `}
      </FunctionDeclaration>
    </>
  );
}

export function ContextUtilities() {
  return code`
  /**
   * The global Shell Shock - Application context instance.
   *
   * @internal
   */
  export let internal_appContext = new AsyncLocalStorage<Map<string, any>>();

  /**
   * Get the Shell Shock - Application context for the current application.
   *
   * @param options - The options to use when getting the context.
   * @returns The Shell Shock - Application context for the current application or undefined if the context is not available.
   */
  export function useApp(): Map<string, any> | undefined {
    return internal_appContext.getStore();
  }

  /**
   * A utility hook function to get the command line arguments from the application context.
   *
   * @returns An array of command line arguments from the application context.
   * @throws If the application context is not available.
   */
  export function useArgs(): string[] {
    return useApp()?.get("args") ?? getArgs();
  }

  /**
   * The context object for the current command execution, containing the command path and segments.
   */
  export interface CommandContext {
    path: string;
    segments: string[];
  }

  /**
   * The global Shell Shock - Command context instance.
   *
   * @internal
   */
  export let internal_commandContext = new AsyncLocalStorage<CommandContext>();

  /**
   * Get the Shell Shock - Command context for the current application.
   *
   * @param options - The options to use when getting the context.
   * @returns The Shell Shock - Command context for the current application.
   * @throws If the Shell Shock - Command context is not available.
   */
  export function useCommand(): CommandContext {
    const result = internal_commandContext.getStore();
    if (!result) {
      throw new Error(
        \`The Shell Shock - Command context is not available. Make sure to call useCommand() within a valid context scope.\`
      );
    }
    return result;
  }

  /**
   * A utility hook function to get the individual segments of the current command path.
   *
   * @returns An array of command path segments.
   * @throws If the command context is not available.
   */
  export function useSegments(): string[] {
    return useCommand().segments;
  }

  /**
   * A utility hook function to get the full command path as a string.
   *
   * @returns The full command path as a string.
   * @throws If the command context is not available.
   */
  export function usePath(): string {
    return useCommand().path;
  }
  `;
}

/**
 * A built-in utilities module for Shell Shock.
 */
export function UtilsBuiltin(props: UtilsBuiltinProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  return (
    <BuiltinFile
      id="utils"
      description="A collection of helper utilities that ease command-line application development."
      {...rest}
      imports={defu(rest.imports ?? {}, {
        "node:os": "os",
        "node:process": "process",
        "node:async_hooks": ["AsyncLocalStorage"]
      })}
      builtinImports={defu(rest.builtinImports ?? {}, {
        console: ["error", "verbose", "writeLine"],
        env: ["env", "isCI", "isTest", "isWindows", "isDevelopment", "isDebug"]
      })}>
      <Spacing />
      <ContextUtilities />
      <Spacing />
      <ArgsUtilities />
      <Spacing />
      <EnvSupportUtilities />
      <Spacing />
      <HyperlinkSupportUtilities />
      <Spacing />
      <ColorSupportUtilities />
      <Spacing />
      <ExitFunctionDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
