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
  InterfaceDeclaration,
  InterfaceMember,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
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
import defu from "defu";

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
      <TSDoc heading="Checks if a specific flag is present in the command-line arguments.">
        <TSDocLink>
          {"https://github.com/sindresorhus/has-flag/blob/main/index.js"}
        </TSDocLink>
        <TSDocParam name="flag">
          {'The flag to check for, e.g., "color", "no-color".'}
        </TSDocParam>
        <TSDocParam name="argv">
          {
            "The command-line arguments to check against. Defaults to global Deno args or process args."
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
      <TSDoc heading="Retrieves the command-line arguments from Deno or Node.js environments.">
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
            "An array of command-line arguments from Deno or Node.js environments."
          }
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="getArgs" returnType="string[]">
        {code`return ((globalThis as { Deno?: { args: string[] } })?.Deno?.args ?? process.argv ?? []) as string[];`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Checks if a specific flag is present in the command-line arguments.">
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
            "The command-line arguments to check against. Defaults to global Deno args or process args."
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
 * Generates the `spawn` function declaration, which is a cross-platform utility for spawning child processes with proper color support and environment variable handling.
 */
export function SpawnFunctionDeclaration() {
  return (
    <>
      <FunctionDeclaration
        async
        name="resolveCommand"
        parameters={[
          {
            name: "command",
            type: "string"
          },
          {
            name: "options",
            type: "Record<string, any>",
            default: "{}"
          },
          {
            name: "pathExt",
            type: "string",
            default:
              'process.env.PATHEXT || [".EXE", ".CMD", ".BAT", ".COM"].join(delimiter)'
          }
        ]}>
        {code`const env = options.env || process.env;
        const cwd = process.cwd();
        if (!!options.cwd && process.chdir !== undefined && !(process.chdir as any).disabled) {
          try {
            process.chdir(options.cwd);
          } catch (err) {
            // Do nothing
          }
        }

        let resolved;
        try {
          let extensions = [""];
          if (isWindows) {
            extensions = pathExt.split(delimiter).flatMap((item) => [item, item.toLowerCase()]);
            if (command.includes(".") && extensions[0] !== "") {
              extensions.unshift("");
            }
          }

          for (const envPart of (command.match(new RegExp(\`[\${posix.sep}\${sep === posix.sep ? "" : sep}]\`.replace(/(\\\\)/g, "\\\\$1"))))
            ? [...(isWindows ? [process.cwd()] : []), ...(process.env.PATH || "").split(delimiter)]
            : [""]
          ) {
            const part =  \`\${!(/^".*"$/.test(envPart) ? envPart.slice(1, -1) : envPart) && new RegExp(\`^\\.\${new RegExp(\`[\${posix.sep}\${sep === posix.sep ? "" : sep}]\`.replace(/(\\\\)/g, "\\\\$1")).source}\`).test(command) ? command.slice(0, 2) : ""}\${join(/^".*"$/.test(envPart) ? envPart.slice(1, -1) : envPart, command)}\`;
            for (const extension of extensions) {
              if (isWindows) {
                const filePath = part + extension;
                if ((await stat(filePath)).isFile() && extensions.some((ext) => filePath.substring(filePath.length - ext.length).toLowerCase() === ext.toLowerCase())) {
                  resolved = filePath;
                  break;
                }
              } else {
                const file = await stat(part + extension);
                if (file.isFile() && (file.mode & 0o111) !== 0) {
                  resolved = part + extension;
                  break;
                }
              }
            }
          }
        } catch (err) {
          // Do nothing
        } finally {
          if (!!options.cwd && process.chdir !== undefined && !(process.chdir as any).disabled) {
            process.chdir(cwd);
          }
        }


        if (resolved) {
          resolved = resolve(
            options.cwd ? options.cwd : "",
            resolved
          );
        }

        return resolved; `}
      </FunctionDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="SpawnBaseOptions"
        doc="Options for the `spawn` handler function.">
        <InterfaceMember
          name="stdout"
          optional
          type="(data: string) => void"
          doc="The writable stream to use for prompt output, defaults to process.stdout"
        />
        <hbr />
        <InterfaceMember
          name="stderr"
          optional
          type="(data: string) => void"
          doc="The writable stream to use for prompt error output, defaults to process.stderr"
        />
        <hbr />
        <InterfaceMember
          name="rejectOnError"
          optional
          type="boolean"
          doc="Whether to reject the promise on error. Defaults to false."
        />
        <hbr />
        <InterfaceMember
          name="file"
          optional
          type="string"
          doc="The file to execute."
        />
        <hbr />
        <InterfaceMember
          name="shell"
          optional
          type="boolean | string"
          doc="If true, runs command inside of a shell. Uses '/bin/sh' on UNIX, and process.env.ComSpec on Windows. If a string is provided, it specifies the shell to use."
        />
        <hbr />
        <InterfaceMember
          name="forceShell"
          optional
          type="boolean"
          doc="If true, forces the command to run inside of a shell, even if the command is a file."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TypeDeclaration export name="SpawnOptions">
        {code`SpawnBaseOptions & Parameters<typeof _spawn>[1]`}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="A function to spawn child processes with proper color support and environment variable handling.">
        <TSDocParam name="command">{`The command to execute.`}</TSDocParam>
        <TSDocParam name="args">
          {`The command-line arguments to pass to the command. Defaults to an empty array.`}
        </TSDocParam>
        <TSDocParam name="options">
          {`Additional options for spawning the process, such as the current working directory (\`cwd\`).`}
        </TSDocParam>
        <TSDocReturns>{`The result of the spawned process.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="spawn"
        parameters={[
          { name: "command", type: "string" },
          {
            name: "args",
            type: "string[] | SpawnOptions",
            default: "{} as SpawnOptions"
          },
          {
            name: "options",
            type: "SpawnOptions",
            default: "{} as SpawnOptions"
          }
        ]}>
        {code`const normalized = {
          command,
          args: [] as string[],
          options: options as SpawnOptions | any,
          file: undefined as string | undefined,
          original: {
            command,
            args,
          },
        };

        if (args) {
          if (Array.isArray(args)) {
            if (args.length > 0) {
              normalized.args = args.slice(0);
            }
          } else {
            normalized.options = { ...args } as SpawnOptions | any;
            normalized.args = [];
          }
        }

        if (!normalized.options.shell && isWindows) {
          normalized.file = (await resolveCommand(normalized.command, normalized.options)) || (await resolveCommand(normalized.command, normalized.options, delimiter));

          let commandFile = normalized.file;
          if (normalized.file) {
            let shebang: string | undefined;
            const buffer = Buffer.alloc(150);

            try {
              const fd = openSync(normalized.file, "r");
              await promisify(read)(fd, buffer, 0, 150, 0);
              closeSync(fd);
            } catch (err) {
              // Do nothing
            }

            const matched = buffer.toString().match(/^#!(.*)/);
            if (matched) {
              const [path, argument] = matched[0].replace(/#! ?/, "").split(" ");
	            const binary = path.split("/").pop();
              if (binary === "env") {
                shebang = argument;
              } else {
                shebang = argument ? \`\${binary} \${argument}\` : binary;
              }
            }

            if (shebang) {
              normalized.args.unshift(normalized.file);
              normalized.command = shebang;

              commandFile = await resolveCommand(normalized.command, normalized.options);
            }
          }

          if (commandFile && (normalized.options.forceShell || /\\.(?:com|exe)$/i.test(commandFile))) {
            normalized.command = normalize(normalized.command).replace(/([()\\][%!^"\`<>&|;, *?])/g, "^$1");

            normalized.args = ["/d", "/s", "/c", \`"\${normalized.command} \${normalized.args.map(arg =>
              \`\${arg}\`.replace(/(?=(\\\\+?)?)\\1"/g, "$1$1\\"").replace(/(?=(\\\\+?)?)\\1$/, "$1$1")
            ).map(arg =>
              \`"\${arg}"\`.replace(/([()\\][%!^"\`<>&|;, *?])/g, "^$1")
            ).map(arg =>
              /node_modules[\\\\/].bin[\\\\/][^\\\\/]+\\.cmd$/i.test(commandFile) ? arg.replace(/([()\\][%!^"\`<>&|;, *?])/g, "^$1") : arg
            ).join(" ")}"\`];
            normalized.command = process.env.comspec || "cmd.exe";
            normalized.options.windowsVerbatimArguments = true;
          }
        }

        let stdout = "";
        let stderr = "";

        const child = _spawn(normalized.command, normalized.args, {
          cwd: process.cwd(),
          env: {
            ...process.env,
            FORCE_COLOR: isColorSupported ? "1" : "0",
          },
          ...normalized.options,
        }) as ReturnType<typeof _spawn>;

        if (isWindows) {
          const emit = child.emit;
          child.emit = (eventName: string | symbol, ...eventArgs: any[]) => {
            if (eventName === "exit") {
              let err: Error | null = null;
              if (eventArgs[0] === 1 && !normalized.file) {
                err = Object.assign(new Error(\`spawn \${normalized.original.command} ENOENT\`), {
                  code: "ENOENT",
                  errno: "ENOENT",
                  syscall: \`spawn \${normalized.original.command}\`,
                  path: normalized.original.command,
                  spawnargs: normalized.original.args,
                });
              }

              if (err) {
                return emit.call(child, "error", err);
              }
            }

            return emit.apply(child, [eventName, ...eventArgs]);
          };
        }

        return new Promise((resolve, reject) => {
          if (normalized.options.stdin !== undefined) {
            child.stdin?.write(normalized.options.stdin);
          }

          child.stdin?.end();

          child.stdout?.on("data", data => {
            stdout += data;
            if (normalized.options.stdout) {
              normalized.options.stdout(data);
            }
          });

          child.stderr?.on("data", data => {
            stderr += data;
            if (normalized.options.stderr) {
              normalized.options.stderr(data);
            }
          });

          if (normalized.options.rejectOnError) {
            child.addListener("error", reject);
          }

          child.on("close", code => {
            if (code !== 0 && normalized.options.rejectOnError) {
              reject(stderr);
            } else {
              resolve({ stdout, stderr });
            }
          });
        }); `}
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
   * @returns An array of command-line arguments from the application context.
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
        "node:path": [
          "resolve",
          "delimiter",
          "normalize",
          "join",
          "posix",
          "sep"
        ],
        "node:fs": ["openSync", "closeSync", "read"],
        "node:fs/promises": ["stat"],
        "node:util": ["promisify"],
        "node:child_process": [{ name: "spawn", alias: "_spawn" }],
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
      <SpawnFunctionDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
