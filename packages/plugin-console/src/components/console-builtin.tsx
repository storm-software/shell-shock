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

import type { Children } from "@alloy-js/core";
import { code, For, Show } from "@alloy-js/core";
import type { FunctionDeclarationProps } from "@alloy-js/typescript";
import {
  ElseClause,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import {
  ClassDeclaration,
  ClassField,
  ClassMethod,
  ClassPropertyGet,
  ClassPropertySet
} from "@powerlines/plugin-alloy/typescript";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocExample,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { IsNotDebug, IsNotVerbose } from "@shell-shock/core/components/helpers";
import { useColors, useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import type {
  AnsiWrappers,
  BaseAnsiStylesKeys
} from "@shell-shock/plugin-theme/helpers/ansi-utils";
import type {
  ThemeMessageVariant,
  ThemeResolvedConfig
} from "@shell-shock/plugin-theme/types/theme";
import { getIndefiniteArticle } from "@stryke/string-format/vowels";
import { defu } from "defu";

export function AnsiHelpersDeclarations() {
  return (
    <>
      <VarDeclaration
        const
        export
        name="beep"
        doc="The ASCII Bell character, which can be used to trigger a beep sound in the console.">
        {code` "\\u0007"; `}
      </VarDeclaration>
      <Spacing />
      <VarDeclaration
        const
        export
        name="cursor"
        doc="An object containing ANSI escape codes for controlling the console cursor.">
        {code` {
          to(x, y) {
            if (!y) {
              return \`\\x1B[\${x + 1}G\`;
            }

            return \`\\x1B[\${y + 1};\${x + 1}H\`;
          },
          move(x, y) {
            let ret = '';

            if (x < 0) {
              ret += \`\\x1B[\${-x}D\`;
            } else if (x > 0) {
              ret += \`\\x1B[\${x}C\`;
            }

            if (y < 0) {
              ret += \`\\x1B[\${-y}A\`;
            } else if (y > 0) {
              ret += \`\\x1B[\${y}B\`;
            }

            return ret;
          },
          up: (count = 1) => \`\\x1B[\${count}A\`,
          down: (count = 1) => \`\\x1B[\${count}B\`,
          forward: (count = 1) => \`\\x1B[\${count}C\`,
          backward: (count = 1) => \`\\x1B[\${count}D\`,
          nextLine: (count = 1) => "\\x1B[E".repeat(count),
          prevLine: (count = 1) => "\\x1B[F".repeat(count),
          left: "\\x1B[G",
          hide: "\\x1B[?25l",
          show: "\\x1B[?25h",
          save: "\\x1B7",
          restore: "\\x1B8"
        } `}
      </VarDeclaration>
      <Spacing />
      <VarDeclaration
        const
        export
        name="erase"
        doc="An object containing ANSI escape codes for erasing parts of the console.">
        {code` {
          screen: "\\x1B[2J",
          up: (count = 1) => "\\x1B[1J".repeat(count),
          down: (count = 1) => "\\x1B[J".repeat(count),
          line: "\\x1B[2K",
          lineEnd: "\\x1B[K",
          lineStart: "\\x1B[1K",
          lines(count) {
            let lineClear = "";
            for (let i = 0; i < count; i++) {
              lineClear += this.line + (i < count - 1 ? cursor.up() : "");
            }

            if (count) {
              lineClear += cursor.left;
            }

            return lineClear;
          }
        } `}
      </VarDeclaration>
      <Spacing />
      <VarDeclaration
        const
        export
        name="scroll"
        doc="An object containing ANSI escape codes for scrolling the console.">
        {code` {
          up: (count = 1) => "\\x1B[S".repeat(count),
          down: (count = 1) => "\\x1B[T".repeat(count)
        } `}
      </VarDeclaration>
      <Spacing />
      <FunctionDeclaration
        export
        name="clear"
        doc="A helper function to clear the console based on a count of lines"
        parameters={[
          {
            name: "current",
            type: "string",
            doc: "The current console output to be cleared"
          },
          {
            name: "consoleWidth",
            type: "number",
            doc: "The number of characters per line in the console"
          }
        ]}>
        {code`if (!consoleWidth) {
          return erase.line + cursor.to(0);
        }

        let rows = 0;
        const lines = current.split(/\\r?\\n/);
        for (let line of lines) {
          rows += 1 + Math.floor(Math.max([...stripAnsi(line)].length - 1, 0) / consoleWidth);
        }

        return erase.lines(rows); `}
      </FunctionDeclaration>
      <Spacing />
    </>
  );
}

/**
 * A component to generate a console message function in a Shell Shock project.
 */
function ColorFunction({
  ansi16,
  ansi256,
  ansi16m
}: Record<"ansi16" | "ansi256" | "ansi16m", AnsiWrappers>) {
  return code` (text: string) => {
    try {
      if (!isColorSupported) {
        return String(text);
      }

      if (colorSupportLevels.stdout === 1) {
        return wrapAnsi(text, "${ansi16.open}", "${ansi16.close}");
      } else if (colorSupportLevels.stdout === 2) {
        return wrapAnsi(text, "${ansi256.open}", "${ansi256.close}");
      }

      return wrapAnsi(text, "${ansi16m.open}", "${ansi16m.close}");
    } catch {
      return String(text);
    }
  }
`;
}

/**
 * A component to generate an object containing functions for coloring text in a Shell Shock project.
 */
export function ColorsDeclaration() {
  const colors = useColors();

  return (
    <>
      <TypeDeclaration
        export
        name="AnsiColor"
        doc="The available ANSI colors for console text.">
        <For
          each={Object.keys(colors.ansi16).filter(color => color !== "theme")}>
          {(color, idx) => `${idx > 0 ? " | " : ""}"${color}"`}
        </For>
      </TypeDeclaration>
      <Spacing />
      <hbr />
      {code`
      /**
      * A recursive type that defines theme colors for console text.
      *
      * @remarks
      * This type allows for nested theme color definitions, enabling complex theming structures for console applications.
      */
     export type ThemeColors<T> = T extends object ? { [K in keyof T]: ThemeColors<T[K]>; } : ((text: string) => string); `}
      <Spacing />
      <TypeDeclaration
        export
        name="Colors"
        doc="An object containing functions for coloring console applications. Each function corresponds to a terminal color. See {@link AnsiColor} for available colors.">
        {code`Record<AnsiColor, (text: string) => string> & ThemeColors<ThemeColorsResolvedConfig>`}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="An object containing functions for coloring console applications. Each function corresponds to a terminal color. See {@link Colors} for available colors." />
      <VarDeclaration
        const
        export
        name="colors"
        type="Colors"
        initializer={
          <>
            {code` {
          `}
            <hbr />
            <For
              each={Object.keys(colors.ansi16).filter(
                color => color !== "theme"
              )}
              comma
              doubleHardline
              enderPunctuation>
              {color => (
                <>
                  {code`${color}: `}
                  <ColorFunction
                    ansi16={colors.ansi16[color as BaseAnsiStylesKeys]}
                    ansi256={colors.ansi256[color as BaseAnsiStylesKeys]}
                    ansi16m={colors.ansi16m[color as BaseAnsiStylesKeys]}
                  />
                </>
              )}
            </For>
            <hbr />
            {code`text: {
                    banner: {
                      header: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.header.primary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.header.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.header.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.header.secondary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.header.secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.header.secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.header.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.header.tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.header.tertiary
                            }
                          />
                        )}
                      },
                      footer: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.footer.primary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.footer.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.footer.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.footer.secondary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.footer.secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.footer.secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.footer.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.footer.tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.footer.tertiary
                            }
                          />
                        )}
                      },
                      command: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.command.primary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.command.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.command.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.command.secondary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.command.secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.command.secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.command.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.command.tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.command.tertiary
                            }
                          />
                        )},
                      },
                      title: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.title.primary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.title.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.title.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.title.secondary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.title.secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.title.secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.title.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.title.tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.title.tertiary
                            }
                          />
                        )},
                      },
                      link: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.link.primary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.link.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.link.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.link.secondary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.link.secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.link.secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.link.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.link.tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.link.tertiary
                            }
                          />
                        )},
                      },
                      description: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.description
                                .primary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.description
                                .primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.description
                                .primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.description
                                .secondary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.description
                                .secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.description
                                .secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.banner.description
                                .tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.text.banner.description
                                .tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.description
                                .tertiary
                            }
                          />
                        )},
                      }
                    },
                    heading: {
                      primary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.heading.primary}
                          ansi256={colors.ansi256.theme.text.heading.primary}
                          ansi16m={colors.ansi16m.theme.text.heading.primary}
                        />
                      )},
                      secondary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.heading.secondary}
                          ansi256={colors.ansi256.theme.text.heading.secondary}
                          ansi16m={colors.ansi16m.theme.text.heading.secondary}
                        />
                      )},
                      tertiary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.heading.tertiary}
                          ansi256={colors.ansi256.theme.text.heading.tertiary}
                          ansi16m={colors.ansi16m.theme.text.heading.tertiary}
                        />
                      )},
                    },
                    body: {
                      primary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.body.primary}
                          ansi256={colors.ansi256.theme.text.body.primary}
                          ansi16m={colors.ansi16m.theme.text.body.primary}
                        />
                      )},
                      secondary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.body.secondary}
                          ansi256={colors.ansi256.theme.text.body.secondary}
                          ansi16m={colors.ansi16m.theme.text.body.secondary}
                        />
                      )},
                      tertiary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.body.tertiary}
                          ansi256={colors.ansi256.theme.text.body.tertiary}
                          ansi16m={colors.ansi16m.theme.text.body.tertiary}
                        />
                      )},
                      link: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.body.link}
                          ansi256={colors.ansi256.theme.text.body.link}
                          ansi16m={colors.ansi16m.theme.text.body.link}
                        />
                      )}
                    },
                    message: {
                      link: {
                        help: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.message.link.help}
                            ansi256={
                              colors.ansi256.theme.text.message.link.help
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.help
                            }
                          />
                        )},
                        success: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.link.success
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.link.success
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.success
                            }
                          />
                        )},
                        info: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.message.link.info}
                            ansi256={
                              colors.ansi256.theme.text.message.link.info
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.info
                            }
                          />
                        )},
                        debug: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.message.link.debug}
                            ansi256={
                              colors.ansi256.theme.text.message.link.debug
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.debug
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.link.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.link.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.warning
                            }
                          />
                        )},
                        danger: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.link.danger
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.link.danger
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.danger
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.message.link.error}
                            ansi256={
                              colors.ansi256.theme.text.message.link.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.link.error
                            }
                          />
                        )}
                      },
                      header: {
                        help: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.help
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.help
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.help
                            }
                          />
                        )},
                        success: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.success
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.success
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.success
                            }
                          />
                        )},
                        info: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.info
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.info
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.info
                            }
                          />
                        )},
                        debug: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.debug
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.debug
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.debug
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.warning
                            }
                          />
                        )},
                        danger: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.danger
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.danger
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.danger
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.header.error
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.header.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.header.error
                            }
                          />
                        )}
                      },
                      footer: {
                        help: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.help
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.help
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.help
                            }
                          />
                        )},
                        success: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.success
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.success
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.success
                            }
                          />
                        )},
                        info: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.info
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.info
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.info
                            }
                          />
                        )},
                        debug: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.debug
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.debug
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.debug
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.warning
                            }
                          />
                        )},
                        danger: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.danger
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.danger
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.danger
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.footer.error
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.footer.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.footer.error
                            }
                          />
                        )}
                      },
                      description: {
                        help: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description.help
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description.help
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description.help
                            }
                          />
                        )},
                        success: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description
                                .success
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description
                                .success
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description
                                .success
                            }
                          />
                        )},
                        info: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description.info
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description.info
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description.info
                            }
                          />
                        )},
                        debug: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description.debug
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description
                                .debug
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description
                                .debug
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description
                                .warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description
                                .warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description
                                .warning
                            }
                          />
                        )},
                        danger: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description
                                .danger
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description
                                .danger
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description
                                .danger
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.message.description.error
                            }
                            ansi256={
                              colors.ansi256.theme.text.message.description
                                .error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.message.description
                                .error
                            }
                          />
                        )}
                      }
                    },
                    usage: {
                      bin: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.bin}
                          ansi256={colors.ansi256.theme.text.usage.bin}
                          ansi16m={colors.ansi16m.theme.text.usage.bin}
                        />
                      )},
                      command: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.command}
                          ansi256={colors.ansi256.theme.text.usage.command}
                          ansi16m={colors.ansi16m.theme.text.usage.command}
                        />
                      )},
                      dynamic: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.dynamic}
                          ansi256={colors.ansi256.theme.text.usage.dynamic}
                          ansi16m={colors.ansi16m.theme.text.usage.dynamic}
                        />
                      )},
                      options: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.options}
                          ansi256={colors.ansi256.theme.text.usage.options}
                          ansi16m={colors.ansi16m.theme.text.usage.options}
                        />
                      )},
                      arguments: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.arguments}
                          ansi256={colors.ansi256.theme.text.usage.arguments}
                          ansi16m={colors.ansi16m.theme.text.usage.arguments}
                        />
                      )},
                      description: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.description}
                          ansi256={colors.ansi256.theme.text.usage.description}
                          ansi16m={colors.ansi16m.theme.text.usage.description}
                        />
                      )}
                    },
                    prompt: {
                      icon: {
                        active: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.prompt.icon.active}
                            ansi256={
                              colors.ansi256.theme.text.prompt.icon.active
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.icon.active
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.icon.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.icon.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.icon.warning
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.prompt.icon.error}
                            ansi256={
                              colors.ansi256.theme.text.prompt.icon.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.icon.error
                            }
                          />
                        )},
                        submitted: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.icon.submitted
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.icon.submitted
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.icon.submitted
                            }
                          />
                        )},
                        cancelled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.icon.cancelled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.icon.cancelled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.icon.cancelled
                            }
                          />
                        )},
                        disabled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.icon.disabled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.icon.disabled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.icon.disabled
                            }
                          />
                        )}
                      },
                      message: {
                        active: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.message.active
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.message.active
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.message.active
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.message.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.message.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.message.warning
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.message.error
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.message.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.message.error
                            }
                          />
                        )},
                        submitted: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.message.submitted
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.message.submitted
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.message.submitted
                            }
                          />
                        )},
                        cancelled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.message.cancelled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.message.cancelled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.message.cancelled
                            }
                          />
                        )},
                        disabled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.message.disabled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.message.disabled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.message.disabled
                            }
                          />
                        )}
                      },
                      input: {
                        active: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.active
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.active
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.active
                            }
                          />
                        )},
                        inactive: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.inactive
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.inactive
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.inactive
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.warning
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.prompt.input.error}
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.error
                            }
                          />
                        )},
                        submitted: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.submitted
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.submitted
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.submitted
                            }
                          />
                        )},
                        cancelled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.cancelled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.cancelled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.cancelled
                            }
                          />
                        )},
                        disabled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.disabled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.disabled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.disabled
                            }
                          />
                        )},
                        placeholder: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.input.placeholder
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.input.placeholder
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.input.placeholder
                            }
                          />
                        )}
                      },
                      description: {
                        active: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description.active
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description
                                .active
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description
                                .active
                            }
                          />
                        )},
                        inactive: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description
                                .inactive
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description
                                .inactive
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description
                                .inactive
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description
                                .warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description
                                .warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description
                                .warning
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description.error
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description.error
                            }
                          />
                        )},
                        submitted: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description
                                .submitted
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description
                                .submitted
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description
                                .submitted
                            }
                          />
                        )},
                        cancelled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description
                                .cancelled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description
                                .cancelled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description
                                .cancelled
                            }
                          />
                        )},
                        disabled: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.prompt.description
                                .disabled
                            }
                            ansi256={
                              colors.ansi256.theme.text.prompt.description
                                .disabled
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.prompt.description
                                .disabled
                            }
                          />
                        )}
                      }
                    },
                    spinner: {
                      icon: {
                        active: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.icon.active
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.icon.active
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.icon.active
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.icon.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.icon.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.icon.warning
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.spinner.icon.error}
                            ansi256={
                              colors.ansi256.theme.text.spinner.icon.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.icon.error
                            }
                          />
                        )},
                        success: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.icon.success
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.icon.success
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.icon.success
                            }
                          />
                        )},
                        info: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.spinner.icon.info}
                            ansi256={
                              colors.ansi256.theme.text.spinner.icon.info
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.icon.info
                            }
                          />
                        )},
                        help: ${(
                          <ColorFunction
                            ansi16={colors.ansi16.theme.text.spinner.icon.help}
                            ansi256={
                              colors.ansi256.theme.text.spinner.icon.help
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.icon.help
                            }
                          />
                        )}
                      },
                      message: {
                        active: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.message.active
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.message.active
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.message.active
                            }
                          />
                        )},
                        warning: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.message.warning
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.message.warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.message.warning
                            }
                          />
                        )},
                        error: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.message.error
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.message.error
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.message.error
                            }
                          />
                        )},
                        success: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.message.success
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.message.success
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.message.success
                            }
                          />
                        )},
                        info: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.message.info
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.message.info
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.message.info
                            }
                          />
                        )},
                        help: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.text.spinner.message.help
                            }
                            ansi256={
                              colors.ansi256.theme.text.spinner.message.help
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.spinner.message.help
                            }
                          />
                        )}
                      }
                    }
                  },
                  border: {
                    banner: {
                      outline: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.border.banner.outline.primary
                            }
                            ansi256={
                              colors.ansi256.theme.border.banner.outline.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.banner.outline.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.border.banner.outline
                                .secondary
                            }
                            ansi256={
                              colors.ansi256.theme.border.banner.outline
                                .secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.banner.outline
                                .secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.border.banner.outline.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.border.banner.outline
                                .tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.banner.outline
                                .tertiary
                            }
                          />
                        )}
                      },
                      divider: {
                        primary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.border.banner.divider.primary
                            }
                            ansi256={
                              colors.ansi256.theme.border.banner.divider.primary
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.banner.divider.primary
                            }
                          />
                        )},
                        secondary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.border.banner.divider
                                .secondary
                            }
                            ansi256={
                              colors.ansi256.theme.border.banner.divider
                                .secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.banner.divider
                                .secondary
                            }
                          />
                        )},
                        tertiary: ${(
                          <ColorFunction
                            ansi16={
                              colors.ansi16.theme.border.banner.divider.tertiary
                            }
                            ansi256={
                              colors.ansi256.theme.border.banner.divider
                                .tertiary
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.banner.divider
                                .tertiary
                            }
                          />
                        )}
                      }
                  },
                  app: {
                    table: {
                      primary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.border.app.table.primary}
                          ansi256={
                            colors.ansi256.theme.border.app.table.primary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.table.primary
                          }
                        />
                      )},
                      secondary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.table.secondary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.table.secondary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.table.secondary
                          }
                        />
                      )},
                      tertiary: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.border.app.table.tertiary}
                          ansi256={
                            colors.ansi256.theme.border.app.table.tertiary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.table.tertiary
                          }
                        />
                      )}
                    },
                    divider: {
                      primary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.divider.primary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.divider.primary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.divider.primary
                          }
                        />
                      )},
                      secondary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.divider.secondary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.divider.secondary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.divider.secondary
                          }
                        />
                      )},
                      tertiary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.divider.tertiary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.divider.tertiary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.divider.tertiary
                          }
                        />
                      )}
                    }
                  },
                  message: {
                    outline: {
                      help: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.help
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.help
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.help
                          }
                        />
                      )},
                      success: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.success
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.success
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.success
                          }
                        />
                      )},
                      info: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.info
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.info
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.info
                          }
                        />
                      )},
                      debug: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.debug
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.debug
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.debug
                          }
                        />
                      )},
                      warning: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.warning
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.warning
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.warning
                          }
                        />
                      )},
                      danger: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.danger
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.danger
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.danger
                          }
                        />
                      )},
                      error: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.outline.error
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.outline.error
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.outline.error
                          }
                        />
                      )}
                    },
                    divider: {
                      help: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.help
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.help
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.help
                          }
                        />
                      )},
                      success: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.success
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.success
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.success
                          }
                        />
                      )},
                      info: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.info
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.info
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.info
                          }
                        />
                      )},
                      debug: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.debug
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.debug
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.debug
                          }
                        />
                      )},
                      warning: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.warning
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.warning
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.warning
                          }
                        />
                      )},
                      danger: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.danger
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.danger
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.danger
                          }
                        />
                      )},
                      error: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.message.divider.error
                          }
                          ansi256={
                            colors.ansi256.theme.border.message.divider.error
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.message.divider.error
                          }
                        />
                      )}
                    }
                  }
                }
              }
`}
          </>
        }
      />
    </>
  );
}

/**
 * A component to generate the `writeLine` function in the `shell-shock:console` builtin module.
 */
export function WriteLineFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <FunctionDeclaration
        name="adjustIndex"
        parameters={[
          {
            name: "line",
            type: "string"
          },
          {
            name: "index",
            type: "number"
          }
        ]}
        returnType="number">
        {code`let adjustedIndex = 0;

        const segments = line.match(/\\x1b\\[(\\d|;)+m.*\\x1b\\[(\\d|;)+m/gi);
        if (segments && segments.length > 0) {
          segments.reduce((count, matched) => {
            if (count < index) {
              const stripped = stripAnsi(matched);
              if (count + stripped.length < index) {
                count += stripped.length;
                adjustedIndex += matched.length;
              } else {
                adjustedIndex += index - count + (matched.slice(0, index - count).match(/\\x1b\\[(\\d|;)+m/g)?.join("")?.length ?? 0);
                count = index;
              }
            }

            return count;
          }, 0);
        } else {
          adjustedIndex = index;
        }

        return adjustedIndex - (line.slice(0, adjustedIndex).match(/\\x1b\\[/g)?.length ?? 0); `}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="breakLine"
        parameters={[
          {
            name: "line",
            type: "string"
          },
          {
            name: "index",
            type: "number"
          }
        ]}
        returnType="[string, string]">
        {code`const first = line.slice(0, index);
        const second = line.slice(index);

        // Match all ANSI escape sequences in the first string
        const ansiRegex = /[\\x1b\\u009b][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007))|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))/g;

        const openCodes: string[] = [];
        const closeCodes: string[] = [];
        let match: RegExpExecArray | null;

        while ((match = ansiRegex.exec(first)) !== null) {
          const code = match[0];
          // Check if this is a reset/close code (e.g., \\x1b[0m, \\x1b[39m, \\x1b[49m, etc.)
          if (/\\x1b\\[(?:0|22|23|24|27|28|29|39|49)m/.test(code)) {
            // A close/reset code cancels the last open code
            openCodes.pop();
            closeCodes.pop();
          } else {
            openCodes.push(code);
            // Derive a close code: map SGR open codes to their reset counterparts
            const sgrMatch = code.match(/\\x1b\\[(\\d+)m/);
            if (sgrMatch) {
              const n = parseInt(sgrMatch[1]!, 10);
              let closeCode: string;
              if (n >= 30 && n <= 37) closeCode = "\\x1b[39m";
              else if (n >= 40 && n <= 47) closeCode = "\\x1b[49m";
              else if (n >= 90 && n <= 97) closeCode = "\\x1b[39m";
              else if (n >= 100 && n <= 107) closeCode = "\\x1b[49m";
              else if (n === 1) closeCode = "\\x1b[22m";
              else if (n === 2) closeCode = "\\x1b[22m";
              else if (n === 3) closeCode = "\\x1b[23m";
              else if (n === 4) closeCode = "\\x1b[24m";
              else if (n === 7) closeCode = "\\x1b[27m";
              else if (n === 8) closeCode = "\\x1b[28m";
              else if (n === 9) closeCode = "\\x1b[29m";
              else closeCode = "\\x1b[0m";
              closeCodes.push(closeCode);
            } else {
              closeCodes.push("\\x1b[0m");
            }
          }
        }

        // Append close codes to the end of "first" (in reverse order)
        const closeSequence = closeCodes.slice().reverse().join("");
        // Prepend open codes to the start of "second"
        const openSequence = openCodes.join("");

        return [first.replace(/^\\s+/, "").replace(/\\s+$/, "") + closeSequence, openSequence + second.replace(/^\\s+/, "").replace(/\\s+$/, "")]; `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Split text into multiple lines based on a maximum length.">
        <TSDocRemarks>
          {`This function splits the provided text into multiple lines based on the specified maximum length, ensuring that words are not broken in the middle.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="text">
          {`The text to split into multiple lines.`}
        </TSDocParam>
        <TSDocParam name="maxLength">
          {`The maximum length of each line.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="splitText"
        parameters={[
          {
            name: "text",
            type: "string"
          },
          {
            name: "maxLength",
            type: "number | SizeToken"
          }
        ]}>
        {code`
  let line = text;
  let result = [] as string[];

  const calculatedMaxLength = isSizeToken(maxLength) ? calculateWidth(maxLength) : maxLength;
  while (stripAnsi(line).length > calculatedMaxLength || line.indexOf("\\n") !== -1) {
    if (line.indexOf("\\n") !== -1) {
      result.push(...splitText(line.slice(0, line.indexOf("\\n")).replace(/(\\r)?\\n/, ""), calculatedMaxLength));
      line = line.indexOf("\\n") + 1 < line.length
        ? line.slice(line.indexOf("\\n") + 1)
        : "";
    } else {
      const index = [" ", "/", ".", ",", "-", ":", "|", "@", "+"].reduce((ret, split) => {
        let current = ret;
        while (stripAnsi(line).indexOf(split, current + 1) !== -1 && stripAnsi(line).indexOf(split, current + 1) <= calculatedMaxLength) {
          current = line.indexOf(split, adjustIndex(line, current + 1));
        }

        return current;
      }, -1);
      if (index === -1) {
        break;
      }

      const lines = breakLine(line, index);
      result.push(lines[0]);
      line = lines[1];
    }
  }

  while (stripAnsi(line).length > calculatedMaxLength) {
    const lines = breakLine(line, calculatedMaxLength);
    result.push(lines[0]);
    line = lines[1];
  }

  result.push(line);
  return result;
`}
      </FunctionDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="WriteLineOptions"
        doc="Options for writing a line to the console.">
        <TSDoc heading="Padding to apply to the line">
          <TSDocRemarks>
            {`The amount of padding (in spaces) to apply to the line when writing to the console. This value is applied to both the left and right sides of the line. If not specified, the default padding defined in the current theme configuration will be used.`}
          </TSDocRemarks>
        </TSDoc>
        <InterfaceMember name="padding" optional type="number" />
        <hbr />
        <TSDoc heading="Console function to use for writing the line">
          <TSDocRemarks>
            {`The console function to use for writing the line. If not specified, the default console function \`console.log\` will be used.`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.method}
            defaultValue={`\`console.log\``}
          />
        </TSDoc>
        <InterfaceMember
          name="consoleFn"
          optional
          type="(text: string) => void"
        />
        <hbr />
        <TSDoc heading="Color of the line text">
          <TSDocRemarks>
            {`The color to apply to the line text when writing to the console. This can be one of the predefined color themes: "primary", "secondary", or "tertiary". If not specified, no specific coloring will be applied to the text (the default/system terminal text color will likely be used).`}
          </TSDocRemarks>
          <hbr />
        </TSDoc>
        <InterfaceMember
          name="color"
          optional
          type='"primary" | "secondary" | "tertiary"'
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Write a line to the console.">
        <TSDocRemarks>
          {`This function writes a line to the console, applying the appropriate padding as defined in the current theme configuration and wrapping as needed.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="text">
          {`The line text to write to the console.`}
        </TSDocParam>
        <TSDocParam name="options">{`The options to apply when writing the line to the console.`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="writeLine"
        parameters={[
          {
            name: "text",
            type: "string | number | boolean | null",
            optional: true
          },
          {
            name: "options",
            type: "WriteLineOptions",
            default: "{}"
          }
        ]}>
        {code`const consoleFn = options.consoleFn ?? console.log;
        const color = options.color;
if (text === undefined || text === null || text === "") {
  consoleFn("");
  return;
}

consoleFn(\`\${" ".repeat(Math.max(options.padding ?? ${
          theme.padding.app
        }, 0))}\${color ? colors.text.body[color](String(text)) : String(text)}\`);
`}
      </FunctionDeclaration>
    </>
  );
}

export type MessageFunctionDeclarationProps = Partial<
  Pick<FunctionDeclarationProps, "parameters">
> & {
  type:
    | "success"
    | "help"
    | "info"
    | "debug"
    | "verbose"
    | "warn"
    | "danger"
    | "error";
  variant: ThemeMessageVariant;
  color?: ThemeMessageVariant;
  consoleFnName: "log" | "info" | "warn" | "error" | "debug";
  description: string;
  prefix?: Children;
  timestamp?: boolean;
};

/**
 * A component to generate the message functions in the `shell-shock:console` builtin module.
 */
export function MessageFunctionDeclaration(
  props: MessageFunctionDeclarationProps
) {
  const {
    type,
    variant,
    consoleFnName,
    description,
    prefix,
    parameters,
    timestamp,
    color = variant
  } = props;

  const theme = useTheme();

  return (
    <>
      <TSDoc
        heading={`Write ${getIndefiniteArticle(
          description
        )} ${description} message to the console.`}>
        <TSDocRemarks>
          {`This function initializes the Powerlines environment configuration object.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="message">
          {`The message to write to the console.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name={type}
        parameters={
          parameters ?? [
            {
              name: "message",
              type: "string",
              optional: false
            }
          ]
        }>
        <Show when={Boolean(prefix)}>
          {prefix}
          <hbr />
          <hbr />
        </Show>
        {code`
        if (!message) {
          return;
        }

        ${
          !theme.labels.message.footer[variant] && timestamp
            ? `const timestamp = \`\${colors.text.message.footer.${
                color
              }(new Date().toLocaleDateString())} \${colors.border.message.outline.${
                color
              }("${
                theme.borderStyles.message.outline[variant].bottom
              }")} \${colors.text.message.footer.${
                color
              }(new Date().toLocaleTimeString())}\`; `
            : ""
        }

        writeLine("");
        writeLine(colors.border.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].topLeft
        }") + ${
          theme.labels.message.header[variant] ||
          theme.icons.message.header[variant]
            ? `colors.border.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(4)) + " " + ${
                theme.icons.message.header[variant]
                  ? `colors.border.message.outline.${color}("${
                      theme.icons.message.header[variant]
                    }") + " " +`
                  : ""
              } colors.bold(colors.text.message.header.${color}("${
                theme.labels.message.header[variant]
              }")) + " " + colors.border.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].topLeft.length +
                4 +
                (theme.icons.message.header[variant]
                  ? 2 + (theme.labels.message.header[variant] ? 0 : 1)
                  : 0) +
                (theme.labels.message.header[variant]
                  ? theme.labels.message.header[variant].length + 2
                  : 0) +
                theme.borderStyles.message.outline[variant].topRight.length
              }, 0)))`
            : `colors.border.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].topLeft.length +
                theme.borderStyles.message.outline[variant].topRight.length
              }, 0)))`
        } + colors.border.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].topRight
        }"), { consoleFn: console.${consoleFnName} });
        splitText(
          message,
          Math.max(process.stdout.columns - ${
            (Math.max(theme.padding.app, 0) +
              Math.max(theme.padding.message, 0)) *
              2 +
            theme.borderStyles.message.outline[variant].left.length +
            theme.borderStyles.message.outline[variant].right.length
          }, 0)
        ).forEach((line) => {
          writeLine(colors.border.message.outline.${color}("${
            theme.borderStyles.message.outline[variant].left +
            " ".repeat(Math.max(theme.padding.message, 0))
          }") + colors.text.message.description.${color}(line) + " ".repeat(Math.max(process.stdout.columns - (stripAnsi(line).length + ${
            Math.max(theme.padding.app, 0) * 2 +
            Math.max(theme.padding.message, 0) +
            theme.borderStyles.message.outline[variant].left.length +
            theme.borderStyles.message.outline[variant].right.length
          }), 0)) + colors.border.message.outline.${color}("${
            theme.borderStyles.message.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });
        writeLine(colors.border.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].bottomLeft
        }") + ${
          theme.labels.message.footer[variant] || timestamp
            ? `colors.border.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                4 +
                (theme.labels.message.footer[variant]
                  ? theme.labels.message.footer[variant].length + 2
                  : 0) +
                theme.borderStyles.message.outline[variant].bottomLeft.length +
                theme.borderStyles.message.outline[variant].bottomRight.length
              }${
                !theme.labels.message.footer[variant] && timestamp
                  ? " - (stripAnsi(timestamp).length + 2)"
                  : ""
              }, 0))) + " " + ${`colors.bold(colors.text.message.footer.${color}(${
                theme.labels.message.footer[variant]
                  ? `"${theme.labels.message.footer[variant]}"`
                  : timestamp && "timestamp"
              }))`} + " " + colors.border.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(4))`
            : `colors.border.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].bottomLeft.length +
                theme.borderStyles.message.outline[variant].bottomRight.length
              }, 0)))`
        } + colors.border.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].bottomRight
        }"), { consoleFn: console.${consoleFnName} });
`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `wrapAnsi` function in the `shell-shock:console` builtin module.
 */
export function WrapAnsiFunction() {
  return (
    <>
      <TSDoc heading="Applies ANSI escape codes to a string.">
        <TSDocRemarks>
          {`Split text by /\\\\x1b[\\[|\\]][0-9;]*m/ and wrap non-ANSI parts with open/closeing tags.`}
        </TSDocRemarks>

        <TSDocExample>
          {`const result = wrapAnsi("Hello\\\\x1b[31mWorld\\\\x1b[0mAgain", "\\\\x1b[36m", "\\\\x1b[39");\nconsole.log(result); // "\\\\x1b[36mHello\\\\x1b[39\\\\x1b[31mWorld\\\\x1b[0m\\\\x1b[36mAgain\\\\x1b[39"`}
        </TSDocExample>

        <TSDocParam name="text">
          {`The text to apply ANSI codes to.`}
        </TSDocParam>
        <TSDocParam name="open">{`The opening ANSI code.`}</TSDocParam>
        <TSDocParam name="close">{`The closing ANSI code.`}</TSDocParam>
        <TSDocReturns>{`The text with ANSI codes applied.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="wrapAnsi"
        parameters={[
          {
            name: "text",
            type: "string | number",
            optional: false
          },
          {
            name: "open",
            type: "string",
            optional: false
          },
          { name: "close", type: "string", optional: false }
        ]}>
        {code`const str = String(text);
        const tokens = [] as string[];

        let last = 0;
        let match: RegExpExecArray | null;
        while ((match = /\\\\x1b[\\[|\\]][0-9;]*m/g.exec(str)) !== null) {
          if (match.index > last) tokens.push(str.slice(last, match.index));
          tokens.push(match[0]);
          last = match.index + match[0].length;
        }

        if (last < str.length) {
          tokens.push(str.slice(last));
        }

        let result = "";
        for (let i = 0; i < tokens.length; i++) {
          const seg = tokens[i]!;
          if (/^\\\\x1b[\\[|\\]][0-9;]*m$/.test(seg)) {
            result += seg;
            continue;
          }

          if (!seg) {
            continue;
          }

          result += i > 0 && /^\\\\x1b[\\[|\\]][0-9;]*m$/.test(tokens[i - 1]!) && i + 1 < tokens.length && /^\\\\x1b[\\[|\\]][0-9;]*m$/.test(tokens[i + 1]!)
            ? seg
            : \`\${open}\${seg}\${close}\`;
        }

        return result;
`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `stripAnsi` function in the `shell-shock:console` builtin module.
 */
export function StripAnsiFunctionDeclaration() {
  return (
    <>
      <TSDoc heading="Removes ANSI escape codes from a string.">
        <TSDocExample>
          {`const result = stripAnsi("Hello\\\\x1b[31mWorld\\\\x1b[0mAgain"); // "HelloWorldAgain"`}
        </TSDocExample>

        <TSDocParam name="text">
          {`The text to strip ANSI codes from.`}
        </TSDocParam>
        <TSDocReturns>{`The text with ANSI codes removed.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="stripAnsi"
        parameters={[
          {
            name: "text",
            type: "string | number",
            optional: false
          }
        ]}>
        {code`return String(text).replace(new RegExp([
          String.raw\`[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)\`,
          String.raw\`(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))\`
        ].join("|"), "g"), "");`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `stripAnsi` function in the `shell-shock:console` builtin module.
 */
export function DividerFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <InterfaceDeclaration
        export
        name="DividerOptions"
        doc="Options for formatting the divider line written to console.">
        <InterfaceMember
          name="width"
          optional
          type="number"
          doc="The width of the divider line. If not specified, the divider will span the full width of the console, minus the padding."
        />
        <hbr />
        <TSDoc heading="The border of the divider line. Can be 'primary', 'secondary', 'tertiary', or 'none'. If not specified, the default border style will be used.">
          <TSDocRemarks>
            {`The value provided will determine the border style and color based on the current theme configuration.`}
          </TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="primary"
          />
        </TSDoc>
        <InterfaceMember
          name="border"
          optional
          type='"primary" | "secondary" | "tertiary"'
          doc="The border style/color of the divider line. Can be 'primary', 'secondary', 'tertiary', or 'none'. If not specified, the default border style will be used."
        />
        <hbr />
        <TSDoc heading="Padding to apply to the line">
          <TSDocRemarks>
            {`The amount of padding (in spaces) to apply to the line when writing to the console. This value is applied to both the left and right sides of the line. If not specified, the default padding defined in the current theme configuration will be used.`}
          </TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.number}
            defaultValue={theme.padding.app * 4}
          />
        </TSDoc>
        <InterfaceMember name="padding" optional type="number" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Write a divider line to the console.">
        <TSDocExample>
          {`divider({ width: 50, border: "primary" }); // Writes a divider line of width 50 with primary border.`}
        </TSDocExample>
        <TSDocParam name="options">
          {`Options for formatting the divider line.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="divider"
        parameters={[
          {
            name: "options",
            type: "DividerOptions",
            optional: false
          }
        ]}>
        {code`const padding = options.padding ?? ${Math.max(theme.padding.app, 1) * 4};
        const width = options.width ?? (process.stdout.columns - (Math.max(padding, 0) * 2));
        const border = options.border === "tertiary" ? colors.border.app.divider.tertiary("${
          theme.borderStyles.app.divider.tertiary.top
        }") : options.border === "secondary" ? colors.border.app.divider.secondary("${
          theme.borderStyles.app.divider.secondary.top
        }") : colors.border.app.divider.primary("${
          theme.borderStyles.app.divider.primary.top
        }");

        writeLine(" ".repeat(Math.max(padding - ${theme.padding.app}, 0)) + border.repeat(Math.max(width / ${
          theme.borderStyles.app.divider.primary.top.length ?? 1
        }, 0)));
        `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `link` function in the `shell-shock:console` builtin module.
 */
export function LinkFunctionDeclaration() {
  return (
    <>
      <TSDoc heading="Render a hyperlink in the console.">
        <TSDocParam name="url">
          {`The URL to render as a hyperlink.`}
        </TSDocParam>
        <TSDocParam name="text">
          {`The text to display for the link. If not provided, the URL will be used as the text.`}
        </TSDocParam>
        <TSDocReturns>{`The formatted hyperlink string.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="link"
        parameters={[
          {
            name: "url",
            type: "string",
            optional: false
          },
          { name: "text", type: "string", optional: true }
        ]}>
        <IfStatement condition={code`isHyperlinkSupported()`}>
          {code`return \`\\x1b]8;;\${url}\\u0007\${text ?? url}\\x1b]8;;\\u0007\`;`}
        </IfStatement>
        <hbr />
        <IfStatement condition={code`isColorSupported`}>
          {code`return colors.underline(colors.text.body.link(\`$\{text ?? url\} $\{url\}\`));`}
        </IfStatement>
        <hbr />
        {code`return \`$\{text ?? url\} $\{url\}\`;`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `spinner` function in the `shell-shock:console` builtin module.
 */
export function SpinnerFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <TypeDeclaration name="WriteStream">
        {`NodeJS.WriteStream;`}
      </TypeDeclaration>
      <Spacing />
      <VarDeclaration
        const
        name="activeHooksPerStream"
        initializer="new Set();"
      />
      <Spacing />
      <InterfaceDeclaration
        export
        name="SpinnerOptions"
        doc="Options for configuring the spinner.">
        <InterfaceMember
          name="message"
          optional
          type="string"
          doc="The message text to display next to the spinner. Defaults to an empty string."
        />
        <hbr />
        <InterfaceMember
          name="stream"
          optional
          type="WriteStream"
          doc="The output stream to write the spinner to. Defaults to process.stderr."
        />
        <hbr />
        <InterfaceMember
          name="spinner"
          optional
          type="ThemeSpinnerResolvedConfig | SpinnerPreset"
          doc="The spinner animation to use. Should be an object with a 'frames' property (an array of strings representing each frame of the animation) and an 'interval' property (the time in milliseconds between each frame). If not specified, a default spinner animation will be used."
        />
      </InterfaceDeclaration>

      <Spacing />
      <ClassDeclaration name="Spinner">
        <ClassField name="frames" isPrivateMember type="string[]" />
        <hbr />
        <ClassField name="interval" isPrivateMember type="number" />
        <hbr />
        <ClassField name="currentFrame" isPrivateMember type="number">
          {code`-1`}
        </ClassField>
        <hbr />
        <ClassField
          name="timer"
          isPrivateMember
          optional
          type="NodeJS.Timeout"
        />
        <hbr />
        <ClassField name="message" isPrivateMember type="string">
          {code`""`}
        </ClassField>
        <hbr />
        <ClassField name="stream" isPrivateMember type="WriteStream">
          {code`process.stderr`}
        </ClassField>
        <hbr />
        <ClassField name="lines" isPrivateMember type="number">
          {code`0`}
        </ClassField>
        <hbr />
        <ClassField
          name="exitHandlerBound"
          isPrivateMember
          type="(signal: any) => void">
          {code`() => {}`}
        </ClassField>
        <hbr />
        <ClassField name="lastSpinnerFrameTime" isPrivateMember type="number">
          {code`0`}
        </ClassField>
        <hbr />
        <ClassField name="isSpinning" isPrivateMember type="boolean">
          {code`false`}
        </ClassField>
        <hbr />
        <ClassField
          name="hookedStreams"
          isPrivateMember
          type='Map<WriteStream, { write?: WriteStream["write"]; originalWrite: WriteStream["write"]; hookedWrite: WriteStream["write"] }>'>
          {code`new Map()`}
        </ClassField>
        <hbr />
        <ClassField name="isInternalWrite" isPrivateMember type="boolean">
          {code`false`}
        </ClassField>
        <hbr />
        <ClassField name="isDeferringRender" isPrivateMember type="boolean">
          {code`false`}
        </ClassField>
        <Spacing />
        {code`constructor(options: SpinnerOptions = {}) {
          const spinner = (typeof options.spinner === "string" ? resolveSpinner(options.spinner as SpinnerPreset) : options.spinner) ?? ${JSON.stringify(
            theme.spinner
          )};
          this.#frames = spinner.frames;
          this.#interval = spinner.interval;

          if (options.message) {
            this.#message = options.message;
          }
          if (options.stream) {
            this.#stream = options.stream;
          }

          this.#exitHandlerBound = this.#exitHandler.bind(this);
        }

        #internalWrite(action: () => unknown) {
          this.#isInternalWrite = true;
          try {
            return action();
          } finally {
            this.#isInternalWrite = false;
          }
        }

        #stringifyChunk(chunk: string | Uint8Array<ArrayBufferLike> | ArrayBufferLike) {
          if (chunk === undefined || chunk === null) {
            return "";
          }

          if (typeof chunk === "string") {
            return chunk;
          }

          if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
            return Buffer.from(chunk).toString("utf8");
          }

          return String(chunk);
        }

        #withSynchronizedOutput(action: () => unknown) {
          if (!isInteractive) {
            return action();
          }

          try {
            this.#write("\\u001B[?2026h");
            return action();
          } finally {
            this.#write("\\u001B[?2026l");
          }
        }

        #hookStream(stream: WriteStream) {
          if (!stream || this.#hookedStreams.has(stream) || typeof stream.write !== "function") {
            return;
          }

          if (activeHooksPerStream.has(stream)) {
            return;
          }

          const originalWrite = stream.write;
          const hookedWrite = ((...writeArguments: Parameters<WriteStream["write"]>) => this.#hookedWrite(stream, originalWrite, writeArguments)) as WriteStream["write"];

          this.#hookedStreams.set(stream, {originalWrite, hookedWrite});
          activeHooksPerStream.add(stream);
          stream.write = hookedWrite;
        }

        #installHook() {
          if (!isInteractive || this.#hookedStreams.size > 0) {
            return;
          }

          const streamsToHook = new Set([this.#stream]);
          if (isInteractive && (this.#stream === process.stdout || this.#stream === process.stderr)) {
            streamsToHook.add(process.stdout);
            streamsToHook.add(process.stderr);
          }

          for (const stream of streamsToHook) {
            this.#hookStream(stream);
          }
        }

        #uninstallHook() {
          for (const [stream, hookInfo] of this.#hookedStreams) {
            if (stream.write === hookInfo.hookedWrite) {
              stream.write = hookInfo.originalWrite;
            }

            activeHooksPerStream.delete(stream);
          }

          this.#hookedStreams.clear();
        }

        #hookedWrite(stream: WriteStream, originalWrite: typeof stream.write, writeArguments: Parameters<typeof stream.write>) {
          const [chunk, callback] = writeArguments;

          if (this.#isInternalWrite || !this.isSpinning) {
            return originalWrite.call(stream, chunk);
          }

          if (this.#lines > 0) {
            this.clear();
          }

          const chunkString = this.#stringifyChunk(chunk);
          const chunkTerminatesLine = chunkString.at(-1) === "\\n";
          const writeResult = originalWrite.call(stream, chunk);

          if (chunkTerminatesLine) {
            this.#isDeferringRender = false;
          } else if (chunkString !== "") {
            this.#isDeferringRender = true;
          }

          if (this.isSpinning && !this.#isDeferringRender) {
            this.#render();
          }

          return writeResult;
        }

        #stopWithIcon(icon: string, message: string) {
          return this.stop(\` \${icon}  \${message ?? this.#message}\`);
        }

        #render() {
          if (this.#isDeferringRender) {
            return;
          }

          if (this.#currentFrame === -1 || Date.now() - this.#lastSpinnerFrameTime >= this.#interval) {
            this.#currentFrame = ++this.#currentFrame % this.#frames.length;
            this.#lastSpinnerFrameTime = Date.now();
          }

          let display = \`\${colors.text.spinner.icon.active(this.#frames[this.#currentFrame])} \${colors.text.spinner.message.active(this.#message)}\`;
          if (!isInteractive) {
            display += "\\n";
          }

          if (isInteractive) {
            this.#withSynchronizedOutput(() => {
              this.clear();
              this.#write(display);
            });
          } else {
            this.#write(display);
          }

          if (isInteractive) {
            this.#lines = this.#lineCount(display);
          }
        }

        #write(message: string) {
          this.#internalWrite(() => {
            this.#stream.write(message);
          });
        }

        #lineCount(message: string) {
          const width = this.#stream.columns ?? 80;
          const lines = stripVTControlCharacters(message).split("\\n");

          let lineCount = 0;
          for (const line of lines) {
            lineCount += Math.max(1, Math.ceil(line.length / width));
          }

          return lineCount;
        }

        #hideCursor() {
          if (isInteractive) {
            this.#write("\\u001B[?25l");
          }
        }

        #showCursor() {
          if (isInteractive) {
            this.#write("\\u001B[?25h");
          }
        }

        #subscribeToProcessEvents() {
          process.once("SIGINT", this.#exitHandlerBound);
          process.once("SIGTERM", this.#exitHandlerBound);
        }

        #unsubscribeFromProcessEvents() {
          process.off("SIGINT", this.#exitHandlerBound);
          process.off("SIGTERM", this.#exitHandlerBound);
        }

        #exitHandler(signal: any) {
          if (this.isSpinning) {
            this.stop();
          }

          process.exit(signal === "SIGINT" ? 130 : (signal === "SIGTERM" ? 143 : 1));
        } `}
        <ClassPropertyGet
          public
          name="isSpinning"
          type="boolean"
          doc="Whether the spinner is currently active and spinning.">
          {code`return this.#isSpinning;`}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertySet
          public
          name="message"
          type="string"
          doc="Set the message displayed by the spinner.">
          {code`this.#message = value;`}
        </ClassPropertySet>
        <Spacing />
        <ClassPropertyGet
          public
          name="message"
          type="string"
          doc="Get the message displayed by the spinner.">
          {code`return this.#message;`}
        </ClassPropertyGet>
        <Spacing />
        <ClassMethod
          name="start"
          doc="Start the spinner animation."
          parameters={[{ name: "message", type: "string" }]}>
          <IfStatement condition={code`message !== undefined`}>
            {code`this.#message = message;`}
          </IfStatement>
          <IfStatement condition={code`this.isSpinning`}>
            {code`return this;`}
          </IfStatement>
          {code`this.#isSpinning = true;
          this.#hideCursor();
          this.#installHook();
          this.#render();
          this.#subscribeToProcessEvents();

          if (isInteractive) {
            this.#timer = setInterval(() => {
              this.#render();
            }, this.#interval);
          }

          return this;
          `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="stop"
          doc="Stop the spinner animation."
          parameters={[
            { name: "finalMessage", optional: true, type: "string" }
          ]}>
          {code`if (!this.isSpinning) {
            return this;
          }

          const shouldWriteNewline = this.#isDeferringRender;
          this.#isSpinning = false;
          if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = undefined;
          }

          this.#isDeferringRender = false;
          this.#uninstallHook();
          this.#showCursor();
          this.clear();
          this.#unsubscribeFromProcessEvents();

          if (finalMessage) {
            const prefix = shouldWriteNewline ? "\\n" : "";
            this.#stream.write(\`\${prefix}\${finalMessage}\\n\`);
          }

          return this;

          `}
        </ClassMethod>
        <Spacing />
        <ClassMethod name="clear" doc="Clear the spinner animation.">
          {code`if (!isInteractive) {
            return this;
          }

          if (this.#lines === 0) {
            return this;
          }

          this.#internalWrite(() => {
            this.#stream.cursorTo(0);

            for (let index = 0; index < this.#lines; index++) {
              if (index > 0) {
                this.#stream.moveCursor(0, -1);
              }

              this.#stream.clearLine(1);
            }
          });

          this.#lines = 0;
          return this; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="success"
          doc="Mark the spinner as successful."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(colors.text.spinner.icon.success("${
            theme.icons.spinner.success
          }"), colors.text.spinner.message.success(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="error"
          doc="Mark the spinner as failed."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(colors.text.spinner.icon.error("${
            theme.icons.spinner.error
          }"), colors.text.spinner.message.error(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="warning"
          doc="Mark the spinner as warning."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(colors.text.spinner.icon.warning("${
            theme.icons.spinner.warning
          }"), colors.text.spinner.message.warning(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="info"
          doc="Mark the spinner as informational."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(colors.text.spinner.icon.info("${
            theme.icons.spinner.info
          }"), colors.text.spinner.message.info(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="help"
          doc="Mark the spinner as help."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(colors.text.spinner.icon.help("${
            theme.icons.spinner.help
          }"), colors.text.spinner.message.help(message)); `}
        </ClassMethod>
        <Spacing />
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="Render a spinner in the console.">
        <TSDocParam name="options">
          {`Options for configuring the spinner, including the message to display, the output stream to write to, and the spinner animation to use.`}
        </TSDocParam>
        <TSDocReturns>{`An instance of the Spinner class, which can be used to control the spinner animation (e.g., start, stop, mark as success/error, etc.).`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="createSpinner"
        parameters={[
          {
            name: "options",
            type: "SpinnerOptions",
            optional: true
          }
        ]}>
        {code`return new Spinner(options);`}
      </FunctionDeclaration>
    </>
  );
}

function extractBorderOptionsObject(
  direction:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight",
  theme: ThemeResolvedConfig
): string {
  return `borderOptions.${
    direction
  } === "primary" ? colors.border.app.table.primary("${
    theme.borderStyles.app.table.primary[direction]
  }") : borderOptions.${
    direction
  } === "secondary" ? colors.border.app.table.secondary("${
    theme.borderStyles.app.table.secondary[direction]
  }") : borderOptions.${
    direction
  } === "tertiary" ? colors.border.app.table.tertiary("${
    theme.borderStyles.app.table.tertiary[direction]
  }") : !borderOptions.${direction} || borderOptions.${
    direction
  } === "none" ? "" : borderOptions.${direction}`;
}

function extractBorderOptionsString(
  direction:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight",
  theme: ThemeResolvedConfig
): string {
  return `borderOptions === "primary" ? colors.border.app.table.primary("${
    theme.borderStyles.app.table.primary[direction]
  }") : borderOptions === "secondary" ? colors.border.app.table.secondary("${
    theme.borderStyles.app.table.secondary[direction]
  }") : borderOptions === "tertiary" ? colors.border.app.table.tertiary("${
    theme.borderStyles.app.table.tertiary[direction]
  }") : !borderOptions || borderOptions === "none" ? "" : borderOptions`;
}

/**
 * Props for the TableFunctionDeclaration component.
 */
export type TableFunctionDeclarationProps = Omit<
  FunctionDeclarationProps,
  "parameters" | "name"
>;

/**
 * A component to generate the table functions in the `shell-shock:console` builtin module.
 */
export function TableFunctionDeclaration(props: TableFunctionDeclarationProps) {
  const theme = useTheme();

  return (
    <>
      <TypeDeclaration
        export
        name="SizeToken"
        doc="A type representing the width size of an item in the console.">
        {code`"full" | "1/1" | "1/2" | "1/3" | "1/4" | "1/5" | "1/6" | "1/12" | "1/24" | "100%" | "50%" | "33.33%" | "25%" | "20%" | "10%" | "5%" | "2.5%"`}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="Determine if a value is a valid size token.">
        <TSDocRemarks>
          {`This function checks if the provided value is a valid size token, which can be one of the predefined strings representing common width sizes (e.g., "full", "1/2", "1/3", etc.) or percentage strings (e.g., "50%").`}
        </TSDocRemarks>
        <TSDocParam name="value">{`The value to check for being a valid size token.`}</TSDocParam>
        <TSDocReturns>{`True if the value is a valid size token, false otherwise.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        doc="Determines if the provided value is a valid size token."
        name="isSizeToken"
        parameters={[
          {
            name: "value",
            type: "any"
          }
        ]}
        returnType="value is SizeToken">
        <IfStatement
          condition={code`["full", "1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/12", "1/24", "100%", "50%", "33.33%", "25%", "20%", "10%", "5%", "2.5%"].includes(value)`}>
          {code`return true; `}
        </IfStatement>
        {code`return false; `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Calculate the width in characters based on the provided width size.">
        <TSDocRemarks>
          {`This function calculates the width in characters based on the provided width size, which can be a predefined string (e.g., "full", "1/2", "1/3", etc.) or a percentage string (e.g., "50%"). The calculation is based on the current width of the console (process.stdout.columns).`}
        </TSDocRemarks>
        <TSDocParam name="size">
          {`The width size to calculate. This can be a predefined string (e.g., "full", "1/2", "1/3", etc.) or a percentage string (e.g., "50%").`}
        </TSDocParam>
        <TSDocReturns>{`The calculated width in characters.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="calculateWidth"
        parameters={[
          {
            name: "size",
            type: "SizeToken",
            optional: false
          }
        ]}
        returnType="number">
        <IfStatement condition={code`["full", "100%", "1/1"]. includes(size)`}>
          {code`return process.stdout.columns;`}
        </IfStatement>
        <ElseIfClause condition={code`["1/2", "50%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 2);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/3", "33.33%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 3);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/4", "25%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 4);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/5", "20%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 5);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/6", "10%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 6);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/12", "5%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 12);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/24", "2.5%"].includes(size)`}>
          {code`return Math.round(process.stdout.columns / 24);`}
        </ElseIfClause>
        <ElseClause>
          {code`
            const match = size.match(/(\\d+(\\.\\d+)?)%/);
            if (match) {
              return Math.round((process.stdout.columns * parseFloat(match[1])) / 100);
            }

            throw new Error(\`Invalid width size: \${size}\`);
          `}
        </ElseClause>
        <hbr />
        <hbr />
      </FunctionDeclaration>

      <TypeDeclaration
        export
        name="BorderOption"
        doc="The border options applied to table cells.">
        {code`"primary" | "secondary" | "tertiary" | "none" | string; `}
      </TypeDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableOutputOptions"
        doc="Options to customize the output of the {@link table} function.">
        <TSDoc heading="Border variant for the table cell.">
          <TSDocRemarks>
            {`The border variant to use for the table cell. This determines the color and style of the border around the cell.`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.property}
            defaultValue="primary"
          />
        </TSDoc>
        <InterfaceMember
          name="border"
          optional
          type="BorderOption | { top?: BorderOption; right?: BorderOption; bottom?: BorderOption; left?: BorderOption; topLeft?: BorderOption; topRight?: BorderOption; bottomLeft?: BorderOption; bottomRight?: BorderOption; }"
        />
        <hbr />
        <TSDoc heading="Padding for the table cell.">
          <TSDocRemarks>
            {`The amount of padding (in spaces) to apply to the table cell. This value is applied to both the left and right sides of the cell. If not specified, the default table padding defined in the current theme configuration will be used.`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.property}
            defaultValue={`\`${theme.padding.table}\``}
          />
        </TSDoc>
        <InterfaceMember name="padding" optional type="number" />
        <hbr />
        <TSDoc heading="Alignment for the table cell.">
          <TSDocRemarks>
            {`The alignment for the table cell. This determines how the text within the cell is aligned. If not specified, the default alignment is "left".`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.property}
            defaultValue="left"
          />
        </TSDoc>
        <InterfaceMember
          name="align"
          optional
          type='"left" | "right" | "center"'
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableCellOptions"
        extends="TableOutputOptions"
        doc="Options for a specific table cell provided to the {@link table} function.">
        <InterfaceMember
          name="value"
          optional
          type="string"
          doc="The actual string value of the table cell."
        />
        <hbr />
        <TSDoc heading="Width of the table cell.">
          <TSDocRemarks>
            {`The width of the table cell (where 1 is a single character in the terminal). If not specified, the width will be determined based on the content of the cell and the available space in the console.`}
          </TSDocRemarks>
        </TSDoc>
        <InterfaceMember
          name="maxWidth"
          type="number | SizeToken | undefined"
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableRowOptions"
        extends="TableOutputOptions"
        doc="Options for a specific table row provided to the {@link table} function.">
        <InterfaceMember
          name="values"
          optional
          type="(string | TableCellOptions)[]"
          doc="The actual string values of the table row's cells."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableOptions"
        extends="TableOutputOptions"
        doc="Options for a specific table cell provided to the {@link table} function.">
        <InterfaceMember
          name="values"
          optional
          type="(string | TableCellOptions)[][]"
          doc="The actual string values of the table's rows' cells."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="Dimensions"
        doc="The height and width for a specific table/cell used internally in the {@link table} function.">
        <InterfaceMember
          name="height"
          type="number"
          doc="The height of the row/cell (where 1 is a single line in the terminal)."
        />
        <hbr />
        <InterfaceMember
          name="width"
          type="number"
          doc="The width of the row/cell (where 1 is a single character in the terminal)."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="TableCellBorder"
        doc="The resolved complete border styles for a table cell.">
        <InterfaceMember
          name="top"
          type="string"
          doc="The top border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="bottom"
          type="string"
          doc="The bottom border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="right"
          type="string"
          doc="The right border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="left"
          type="string"
          doc="The left border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="topLeft"
          type="string"
          doc="The top-left border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="topRight"
          type="string"
          doc="The top-right border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="bottomLeft"
          type="string"
          doc="The bottom-left border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="bottomRight"
          type="string"
          doc="The bottom-right border style of the table cell."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <TypeDeclaration
        name="TableCell"
        doc="The internal state of a formatted table cell in the {@link table} function.">
        {code`Required<Omit<TableCellOptions, "maxWidth" | "border">> & Dimensions & {
          border: TableCellBorder;
          maxWidth?: number;
        };
        `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="Write a table to the console.">
        <TSDocRemarks>
          {`This function writes a table to the console, applying the appropriate padding as defined in the current theme configuration and wrapping as needed.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="options">
          {`Options to customize the table output.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        {...props}
        name="table"
        parameters={[
          {
            name: "options",
            type: "TableOptions | TableRowOptions[] | TableCellOptions[][] | string[] | string[][]",
            optional: false
          }
        ]}>
        <IfStatement
          condition={code`!options ||
            (!Array.isArray(options) && (typeof options !== "object" || !options.values || !Array.isArray(options.values) || options.values.length === 0)) ||
            (Array.isArray(options) && !options.every(item => typeof item === "object" || typeof item === "string" || Array.isArray(item))) `}>
          {code`return;`}
        </IfStatement>
        <hbr />
        <hbr />
        <VarDeclaration
          let
          name="cells"
          type={`TableCell[][]`}
          initializer={code`[];`}
        />
        <hbr />
        {code`
        const extractTableCell = (cell: string | TableCellOptions, columnIndex: number, rowLength: number, opts?: TableOutputOptions): TableCell => {
          if (typeof cell === "string") {
            const borderOptions = opts?.border || "primary";

            let border = {} as TableCellBorder;
            if (typeof borderOptions === "object") {
              border = {
                top: ${extractBorderOptionsObject("top", theme)},
                bottom: ${extractBorderOptionsObject("bottom", theme)},
                left: ${extractBorderOptionsObject("left", theme)},
                right: ${extractBorderOptionsObject("right", theme)},
                topLeft: ${extractBorderOptionsObject("topLeft", theme)},
                topRight: ${extractBorderOptionsObject("topRight", theme)},
                bottomLeft: ${extractBorderOptionsObject("bottomLeft", theme)},
                bottomRight: ${extractBorderOptionsObject("bottomRight", theme)},
              };
            } else {
              border.top = ${extractBorderOptionsString("top", theme)};
              border.bottom = ${extractBorderOptionsString("bottom", theme)};
              border.left = ${extractBorderOptionsString("left", theme)};
              border.right = ${extractBorderOptionsString("right", theme)};
              border.topLeft = ${extractBorderOptionsString("topLeft", theme)};
              border.topRight = ${extractBorderOptionsString("topRight", theme)};
              border.bottomLeft = ${extractBorderOptionsString("bottomLeft", theme)};
              border.bottomRight = ${extractBorderOptionsString("bottomRight", theme)};
            }

            const padding = Math.max(0, opts?.padding ?? ${theme.padding.table}) * (columnIndex === 0 || columnIndex === rowLength - 1 ? 2 : 1);
            const value = cell ?? "";
            const width = stripAnsi(value).length + padding * 2;

            return {
              value,
              height: 1,
              width,
              border,
              padding,
              align: opts?.align || "left",
            };
          } else {
            const borderOptions = cell.border || opts?.border || "primary";

            let border = {} as TableCellBorder;
            if (typeof borderOptions === "object") {
              border = {
                top: ${extractBorderOptionsObject("top", theme)},
                bottom: ${extractBorderOptionsObject("bottom", theme)},
                left: ${extractBorderOptionsObject("left", theme)},
                right: ${extractBorderOptionsObject("right", theme)},
                topLeft: ${extractBorderOptionsObject("topLeft", theme)},
                topRight: ${extractBorderOptionsObject("topRight", theme)},
                bottomLeft: ${extractBorderOptionsObject("bottomLeft", theme)},
                bottomRight: ${extractBorderOptionsObject("bottomRight", theme)},
              };
            } else {
              border.top = ${extractBorderOptionsString("top", theme)};
              border.bottom = ${extractBorderOptionsString("bottom", theme)};
              border.left = ${extractBorderOptionsString("left", theme)};
              border.right = ${extractBorderOptionsString("right", theme)};
              border.topLeft = ${extractBorderOptionsString("topLeft", theme)};
              border.topRight = ${extractBorderOptionsString("topRight", theme)};
              border.bottomLeft = ${extractBorderOptionsString("bottomLeft", theme)};
              border.bottomRight = ${extractBorderOptionsString("bottomRight", theme)};
            }

            const padding = Math.max(0, cell.padding ?? opts?.padding ?? ${
              theme.padding.table
            });
            const value = cell.value ?? "";
            const width = stripAnsi(value).length + padding * 2;
            const maxWidth = cell.maxWidth ? typeof cell.maxWidth === "number" ? cell.maxWidth : calculateWidth(cell.maxWidth) : undefined;

            return {
              value,
              height: 1,
              width,
              maxWidth,
              border,
              padding,
              align: cell.align || opts?.align || "left",
            };
          }
        };

        let colMaxWidths = [] as (number | undefined)[];
    `}
        <hbr />
        <IfStatement condition={code`Array.isArray(options)`}>
          <IfStatement
            condition={code`options.every(row => typeof row === "string" || (typeof row === "object" && !Array.isArray(row) && !("values" in row)))`}>
            {code`cells.push(options.map((cell, index) => extractTableCell(cell as string | TableCellOptions, index, options.length)));`}
          </IfStatement>
          <ElseClause>
            {code`
          cells.push(
            ...options.map(row => Array.isArray(row)
              ? row.reduce((cellRow, cell, index) => {
                if (colMaxWidths.length <= index) {
                  colMaxWidths.push(undefined);
                }
                const newCell = extractTableCell(cell, index, row.length);
                if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                  colMaxWidths[index] = newCell.maxWidth;
                }
                cellRow.push(newCell);
                return cellRow;
              }, [] as TableCell[])
              : (row as TableRowOptions).values?.reduce((cellRow, cell, index) => {
                if (colMaxWidths.length <= index) {
                  colMaxWidths.push(undefined);
                }
                const newCell = extractTableCell(cell, index, (row as TableRowOptions).values?.length ?? 1, row as TableRowOptions);
                if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                  colMaxWidths[index] = newCell.maxWidth;
                }
                cellRow.push(newCell);
                return cellRow;
              }, [] as TableCell[]) ?? []
            )
          );
            `}
          </ElseClause>
        </IfStatement>
        <ElseClause>
          {code`
        cells.push(
          ...options.values!.map(row => Array.isArray(row)
            ? row.reduce((cellRow, cell, index) => {
              if (colMaxWidths.length <= index) {
                colMaxWidths.push(undefined);
              }
              const newCell = extractTableCell(cell, index, row.length);
              if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                colMaxWidths[index] = newCell.maxWidth;
              }
              cellRow.push(newCell);
              return cellRow;
            }, [] as TableCell[])
            : (row as TableRowOptions).values?.reduce((cellRow, cell, index) => {
              if (colMaxWidths.length <= index) {
                colMaxWidths.push(undefined);
              }
              const newCell = extractTableCell(cell, index, (row as TableRowOptions).values?.length ?? 1, options);
              if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                colMaxWidths[index] = newCell.maxWidth;
              }
              cellRow.push(newCell);
              return cellRow;
            }, [] as TableCell[]) ?? []
          )
        );

          `}
        </ElseClause>
        <hbr />
        {code`
cells = cells.filter(row => row.length > 0);
if (cells.length === 0) {
  return;
}

cells.forEach(row => row.forEach((cell, index) => {
  if (colMaxWidths[index] && cell.maxWidth !== colMaxWidths[index]!) {
    cell.maxWidth = colMaxWidths[index]!;
  }
}));

// Calculate table dimensions
let colWidths = [] as number[];
let rowDims = [] as Dimensions[];

const calculateRowDimensions = () => {
  colWidths = [];
  return cells.reduce((dims, row) => {
    dims.push(row.reduce((dim, cell, index) => {
      dim.width += cell.width;
      if (cell.height > dim.height) {
        dim.height = cell.height;
      }
      if (!colWidths[index] || cell.width > colWidths[index]!) {
        colWidths[index] = cell.width;
      }

      return dim;
    }, { width: 0, height: 0 } as Dimensions));

    return dims;
  }, [] as Dimensions[]);
}

let recalculate!: boolean;
do {
  recalculate = false;
  rowDims = calculateRowDimensions();

  if (!recalculate && colWidths.some((colWidth, index) => colMaxWidths[index] && colWidth > colMaxWidths[index]!)) {
    (colWidths.map((colWidth, index) => colMaxWidths[index] && colWidth > colMaxWidths[index]! ? index : undefined).filter(colWidth => colWidth !== undefined) as number[]).forEach(index => {
      cells.forEach(row => {
        const cell = row[index]!;
        if (colMaxWidths[index] && cell.width > colMaxWidths[index]) {
          const lines = splitText(
            cell.value,
            colMaxWidths[index] - cell.padding * 2,
          );

          cell.value = lines.join("\\n");
          cell.height = lines.length;
          cell.width = Math.max(...lines.map(line => stripAnsi(line).length)) + cell.padding * 2;

          recalculate = true;
        }
      });
    });
  }

  rowDims.forEach((row, rowIndex) => {
    if (!recalculate && row.width > Math.max(process.stdout.columns - ${
      Math.max(theme.padding.app, 0) * 2
    }, 0)) {
      const cell = cells[rowIndex]!.reduce((largestCell, cell) => {
        if (cell.width > largestCell.width) {
          return cell;
        }
        return largestCell;
      }, cells[rowIndex]![0]!);

      const lines = splitText(
        cell.value,
        Math.min(Math.max(process.stdout.columns - ${
          Math.max(theme.padding.app, 0) * 2
        } - (row.width - (cell.width - cell.padding * 2)), 0),
        cell.maxWidth ?? Number.POSITIVE_INFINITY)
      );

      cell.value = lines.join("\\n");
      cell.height = lines.length;
      cell.width = Math.max(...lines.map(line => stripAnsi(line).length)) + cell.padding * 2;

      recalculate = true;
    }
  });

  if (!recalculate && colWidths.reduce((a, b) => a + b, 0) > Math.max(process.stdout.columns - ${
    Math.max(theme.padding.app, 0) * 2
  }, 0)) {
    let colIndex = 0;
    const cell = cells.reduce((ret, row) => {
      return row.reduce((largest, current, index) => {
        if (largest.width < current.width) {
          colIndex = index;
          return current;
        }
        return largest;
      }, ret);
    }, cells[0]![0]!);

    const lines = splitText(
      cell.value,
      Math.min(Math.max(process.stdout.columns - ${
        Math.max(theme.padding.app, 0) * 2
      } - (colWidths.filter((_, i) => i !== colIndex).reduce((a, b) => a + b, 0)) - cell.padding * 2, 0),
      cell.maxWidth ?? Number.POSITIVE_INFINITY)
    );

    cell.value = lines.join("\\n");
    cell.height = lines.length;
    cell.width = Math.max(...lines.map(line => stripAnsi(line).length)) + cell.padding * 2;

    recalculate = true;
  }
} while (recalculate);

// Render table
cells.forEach((row, rowIndex) => {
  const outputs = [] as string[][];
  row.forEach((cell, colIndex) => {
    const lines = cell.value.split("\\n");
    while (lines.length < rowDims[rowIndex]!.height) {
      lines.push("");
    }

    outputs.push(lines.map(line => {
      let paddedContent = "";
      switch (cell.align) {
        case "right":
          paddedContent = " ".repeat(Math.max(colWidths[colIndex] - stripAnsi(line).length - cell.padding, 0)) + line + " ".repeat(cell.padding);
          break;
        case "center":
          const leftPadding = Math.floor((colWidths[colIndex] - stripAnsi(line).length - cell.padding) / 2);
          const rightPadding = colWidths[colIndex] - stripAnsi(line).length - leftPadding;
          paddedContent = " ".repeat(leftPadding) + line + " ".repeat(rightPadding);
          break;
        case "left":
        default:
          paddedContent = " ".repeat(cell.padding) + line + " ".repeat(Math.max(colWidths[colIndex] - stripAnsi(line).length - cell.padding, 0));
          break;
      }

      if (colIndex === row.length - 1) {
        return cell.border.left + paddedContent + cell.border.right;
      } else {
        return cell.border.left + paddedContent;
      }
    }));
  });

  for (let index = 0; index < rowDims[rowIndex]!.height; index++) {
    writeLine(outputs.map(output => output[index] ?? "").join(""));
  }
});
`}
      </FunctionDeclaration>
    </>
  );
}

export type ConsoleBuiltinProps = Pick<
  BuiltinFileProps,
  "children" | "imports" | "builtinImports"
>;

/**
 * A built-in console utilities module for Shell Shock.
 */
export function ConsoleBuiltin(props: ConsoleBuiltinProps) {
  const { children, imports, builtinImports } = props;

  return (
    <BuiltinFile
      id="console"
      description="A collection of helper utilities to assist in generating content meant for display in the console."
      imports={defu(imports, {
        "@shell-shock/plugin-theme/types/theme": [
          { name: "ThemeColorsResolvedConfig", type: true },
          { name: "ThemeSpinnerResolvedConfig", type: true }
        ],
        "@shell-shock/plugin-theme/helpers/spinners": [
          { name: "SpinnerPreset", type: true },
          { name: "resolveSpinner" }
        ],
        "node:buffer": ["WithImplicitCoercion"],
        "node:util": ["stripVTControlCharacters"]
      })}
      builtinImports={defu(builtinImports, {
        utils: [
          "hasFlag",
          "isMinimal",
          "isInteractive",
          "isColorSupported",
          "colorSupportLevels",
          "isHyperlinkSupported"
        ],
        env: ["env", "isDevelopment", "isDebug"]
      })}>
      <AnsiHelpersDeclarations />
      <Spacing />
      <StripAnsiFunctionDeclaration />
      <Spacing />
      <WrapAnsiFunction />
      <Spacing />
      <ColorsDeclaration />
      <Spacing />
      <WriteLineFunctionDeclaration />
      <Spacing />
      <LinkFunctionDeclaration />
      <Spacing />
      <DividerFunctionDeclaration />
      <Spacing />
      <SpinnerFunctionDeclaration />
      <Spacing />
      <MessageFunctionDeclaration
        type="help"
        variant="help"
        consoleFnName="log"
        description="help"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="success"
        variant="success"
        consoleFnName="info"
        description="success"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="info"
        variant="info"
        consoleFnName="info"
        description="informational"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="debug"
        variant="debug"
        consoleFnName="debug"
        description="debug"
        timestamp
        prefix={
          <IfStatement condition={<IsNotDebug />}>{code`return; `}</IfStatement>
        }
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="verbose"
        variant="info"
        color="debug"
        consoleFnName="debug"
        description="verbose"
        timestamp
        prefix={
          <IfStatement
            condition={<IsNotVerbose />}>{code`return; `}</IfStatement>
        }
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="warn"
        variant="warning"
        consoleFnName="warn"
        description="warning"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="danger"
        variant="danger"
        consoleFnName="error"
        description="destructive/danger"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="error"
        variant="error"
        consoleFnName="error"
        description="error"
        timestamp
        parameters={[
          {
            name: "err",
            type: "string | Error",
            optional: false
          }
        ]}
        prefix={
          <>
            <VarDeclaration let name="message" type="string | undefined" />
            <Spacing />
            <IfStatement condition={code`(err as Error)?.message`}>
              {code`message = (err as Error).message;`}
            </IfStatement>
            <ElseClause>{code`message = String(err);`}</ElseClause>
            <Spacing />
            <IfStatement condition={code`env.STACKTRACE`}>
              <IfStatement condition={code`(err as Error)?.stack`}>
                {code`message += " \\n\\n" + ((err as Error).stack || "");`}
              </IfStatement>
              <ElseClause>{code`message += " \\n\\n" + ((new Error(" ")).stack || "").split("\\n").slice(2).map(line => line.trim()).join("\\n");`}</ElseClause>
            </IfStatement>
          </>
        }
      />
      <Spacing />
      <TableFunctionDeclaration />
      <Spacing />
      {children}
      <Spacing />
    </BuiltinFile>
  );
}
