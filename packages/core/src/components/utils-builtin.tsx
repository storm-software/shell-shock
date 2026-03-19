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
import defu from "defu";
import type { Context } from "../types/context";

export interface UtilsBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {}

/**
 * Generates the `findSuggestions` function for suggesting corrections for potentially misspelled options or commands.
 */
export function FindSuggestionsDeclaration() {
  const context = usePowerlines<Context>();

  return (
    <>
      <VarDeclaration
        const
        name="deburred"
        initializer={code` {
          "\\xc0": "A",  "\\xc1": "A", "\\xc2": "A", "\\xc3": "A", "\\xc4": "A", "\\xc5": "A",
          "\\xe0": "a",  "\\xe1": "a", "\\xe2": "a", "\\xe3": "a", "\\xe4": "a", "\\xe5": "a",
          "\\xc7": "C",  "\\xe7": "c",
          "\\xd0": "D",  "\\xf0": "d",
          "\\xc8": "E",  "\\xc9": "E", "\\xca": "E", "\\xcb": "E",
          "\\xe8": "e",  "\\xe9": "e", "\\xea": "e", "\\xeb": "e",
          "\\xcc": "I",  "\\xcd": "I", "\\xce": "I", "\\xcf": "I",
          "\\xec": "i",  "\\xed": "i", "\\xee": "i", "\\xef": "i",
          "\\xd1": "N",  "\\xf1": "n",
          "\\xd2": "O",  "\\xd3": "O", "\\xd4": "O", "\\xd5": "O", "\\xd6": "O", "\\xd8": "O",
          "\\xf2": "o",  "\\xf3": "o", "\\xf4": "o", "\\xf5": "o", "\\xf6": "o", "\\xf8": "o",
          "\\xd9": "U",  "\\xda": "U", "\\xdb": "U", "\\xdc": "U",
          "\\xf9": "u",  "\\xfa": "u", "\\xfb": "u", "\\xfc": "u",
          "\\xdd": "Y",  "\\xfd": "y", "\\xff": "y",
          "\\xc6": "Ae", "\\xe6": "ae",
          "\\xde": "Th", "\\xfe": "th",
          "\\xdf": "ss",
          "\\u0100": "A",  "\\u0102": "A", "\\u0104": "A",
          "\\u0101": "a",  "\\u0103": "a", "\\u0105": "a",
          "\\u0106": "C",  "\\u0108": "C", "\\u010a": "C", "\\u010c": "C",
          "\\u0107": "c",  "\\u0109": "c", "\\u010b": "c", "\\u010d": "c",
          "\\u010e": "D",  "\\u0110": "D", "\\u010f": "d", "\\u0111": "d",
          "\\u0112": "E",  "\\u0114": "E", "\\u0116": "E", "\\u0118": "E", "\\u011a": "E",
          "\\u0113": "e",  "\\u0115": "e", "\\u0117": "e", "\\u0119": "e", "\\u011b": "e",
          "\\u011c": "G",  "\\u011e": "G", "\\u0120": "G", "\\u0122": "G",
          "\\u011d": "g",  "\\u011f": "g", "\\u0121": "g", "\\u0123": "g",
          "\\u0124": "H",  "\\u0126": "H", "\\u0125": "h", "\\u0127": "h",
          "\\u0128": "I",  "\\u012a": "I", "\\u012c": "I", "\\u012e": "I", "\\u0130": "I",
          "\\u0129": "i",  "\\u012b": "i", "\\u012d": "i", "\\u012f": "i", "\\u0131": "i",
          "\\u0134": "J",  "\\u0135": "j",
          "\\u0136": "K",  "\\u0137": "k", "\\u0138": "k",
          "\\u0139": "L",  "\\u013b": "L", "\\u013d": "L", "\\u013f": "L", "\\u0141": "L",
          "\\u013a": "l",  "\\u013c": "l", "\\u013e": "l", "\\u0140": "l", "\\u0142": "l",
          "\\u0143": "N",  "\\u0145": "N", "\\u0147": "N", "\\u014a": "N",
          "\\u0144": "n",  "\\u0146": "n", "\\u0148": "n", "\\u014b": "n",
          "\\u014c": "O",  "\\u014e": "O", "\\u0150": "O",
          "\\u014d": "o",  "\\u014f": "o", "\\u0151": "o",
          "\\u0154": "R",  "\\u0156": "R", "\\u0158": "R",
          "\\u0155": "r",  "\\u0157": "r", "\\u0159": "r",
          "\\u015a": "S",  "\\u015c": "S", "\\u015e": "S", "\\u0160": "S",
          "\\u015b": "s",  "\\u015d": "s", "\\u015f": "s", "\\u0161": "s",
          "\\u0162": "T",  "\\u0164": "T", "\\u0166": "T",
          "\\u0163": "t",  "\\u0165": "t", "\\u0167": "t",
          "\\u0168": "U",  "\\u016a": "U", "\\u016c": "U", "\\u016e": "U", "\\u0170": "U", "\\u0172": "U",
          "\\u0169": "u",  "\\u016b": "u", "\\u016d": "u", "\\u016f": "u", "\\u0171": "u", "\\u0173": "u",
          "\\u0174": "W",  "\\u0175": "w",
          "\\u0176": "Y",  "\\u0177": "y", "\\u0178": "Y",
          "\\u0179": "Z",  "\\u017b": "Z", "\\u017d": "Z",
          "\\u017a": "z",  "\\u017c": "z", "\\u017e": "z",
          "\\u0132": "IJ", "\\u0133": "ij",
          "\\u0152": "Oe", "\\u0153": "oe",
          "\\u0149": "n", "\\u017f": "s"
        } as Record<string, string>; `}
      />
      <Spacing />
      <TSDoc heading="A utility function that takes an input string and a list of possible matches, and returns a list of suggested matches based on the Levenshtein distance between the input and the possible matches.">
        <TSDocRemarks>
          {
            "This function is intended to be used to suggest corrections for potentially misspelled options or commands."
          }
        </TSDocRemarks>
        <Spacing />
        <TSDocInternal />
        <Spacing />
        <TSDocParam name="input">
          {"The input string to check for potential matches."}
        </TSDocParam>
        <TSDocParam name="options">
          {"A list of possible matches to compare against the input."}
        </TSDocParam>
        <TSDocReturns>
          {"A list of suggested matches based on the Levenshtein distance."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="findSuggestions"
        parameters={[
          {
            name: "input",
            type: "string"
          },
          {
            name: "options",
            type: "string[]"
          }
        ]}
        returnType="string[]">
        <VarDeclaration
          const
          name="normalizedInput"
          initializer={code`String(input ?? "")${
            context.config.isCaseSensitive ? "" : ".toLowerCase()"
          }.trim().replaceAll(/[\\s\\-_\\.]+/gu, " ").replace(/[\\\\xc0-\\\\xd6\\\\xd8-\\\\xf6\\\\xf8-\\\\xff\\\\u0100-\\\\u017f]/g, key => deburred[key]).replace(/[\\\\u0300-\\\\u036f\\\\ufe20-\\\\ufe2f\\\\u20d0-\\\\u20ff]/g, ""); `}
        />
        <Spacing />
        {code`
        if (!normalizedInput || options.length === 0) {
          return [];
        }

        const threshold = Math.ceil(normalizedInput.length * 0.25) || 1;
        const results: Array<{ option: string; distance: number }> = [];

        for (const option of options) {
          const normalizedOption = String(option ?? "")${
            context.config.isCaseSensitive ? "" : ".toLowerCase()"
          }.trim().replaceAll(/[\\s\\-_\\.]+/gu, " ").replace(/[\\\\xc0-\\\\xd6\\\\xd8-\\\\xf6\\\\xf8-\\\\xff\\\\u0100-\\\\u017f]/g, key => deburred[key]).replace(/[\\\\u0300-\\\\u036f\\\\ufe20-\\\\ufe2f\\\\u20d0-\\\\u20ff]/g, "");

          if (!normalizedOption) {
            continue;
          }

          const lenA = normalizedInput.length;
          const lenB = normalizedOption.length;

          if (Math.abs(lenA - lenB) > threshold) {
            continue;
          }

          let distance: number;
          if (lenA === 0) {
            distance = lenB;
          } else if (lenB === 0) {
            distance = lenA;
          } else if (lenA <= 32) {
            const peq: Record<string, number> = {};
            for (let i = 0; i < lenA; i++) {
              const c = normalizedInput[i]!;
              peq[c] = (peq[c] || 0) | (1 << i);
            }

            let pv = -1;
            let mv = 0;
            let score = lenA;

            for (let j = 0; j < lenB; j++) {
              const eq = peq[normalizedOption[j]!] || 0;
              const xv = eq | mv;
              const xh = ((eq & pv) + pv) ^ pv ^ eq;
              let ph = mv | ~(xh | pv);
              let mh = pv & xh;

              if ((ph >>> (lenA - 1)) & 1) {
                score++;
              }
              if ((mh >>> (lenA - 1)) & 1) {
                score--;
              }

              ph = (ph << 1) | 1;
              mh = mh << 1;
              pv = mh | ~(xv | ph);
              mv = ph & xv;
            }

            distance = score;
          } else {
            const row = new Array(lenB + 1);
            for (let j = 0; j <= lenB; j++) {
              row[j] = j;
            }

            for (let i = 1; i <= lenA; i++) {
              let prev = i;
              for (let j = 1; j <= lenB; j++) {
                const val = normalizedInput[i - 1] === normalizedOption[j - 1]
                  ? row[j - 1]
                  : Math.min(row[j - 1], prev, row[j]) + 1;
                row[j - 1] = prev;
                prev = val;
              }
              row[lenB] = prev;
            }

            distance = row[lenB];
          }

          if (distance <= threshold) {
            results.push({ option, distance });
          }
        }

        return results.sort((a, b) => a.distance - b.distance).map(r => r.option);
        `}
      </FunctionDeclaration>
    </>
  );
}

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
        <Spacing />
        <TSDocInternal />
        <Spacing />
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
   * A utility hook function to get the command-line arguments from the application context.
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
      <TSDoc heading="A utility function to pause execution for a specified duration, which can be used in prompt interactions to create delays or timeouts. The function returns a promise that resolves after the specified duration in milliseconds, allowing it to be used with async/await syntax for easier handling of asynchronous prompt logic.">
        <TSDocParam name="durationMs">
          {`The duration to sleep in milliseconds.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves after the specified duration, allowing for asynchronous delays in prompt interactions.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="sleep"
        parameters={[{ name: "durationMs", type: "number" }]}
        returnType="Promise<void>">{code`return new Promise((resolve) => setTimeout(resolve, durationMs)); `}</FunctionDeclaration>
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
      <FindSuggestionsDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
