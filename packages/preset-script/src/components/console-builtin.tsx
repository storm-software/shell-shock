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
import { code, computed, For, Show } from "@alloy-js/core";
import type { FunctionDeclarationProps } from "@alloy-js/typescript";
import {
  ElseClause,
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocExample,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { useCommand } from "@shell-shock/core/contexts/command";
import {
  getAppDescription,
  getAppTitle
} from "@shell-shock/core/plugin-utils/context-helpers";
import type {
  ThemeColorVariant,
  ThemeMessageVariant,
  ThemeResolvedConfig
} from "@shell-shock/plugin-theme/types/theme";
import { getIndefiniteArticle } from "@stryke/string-format/vowels";
import { useColors, useTheme } from "../contexts/theme";
import type { AnsiWrappers, BaseAnsiStylesKeys } from "../helpers/ansi-utils";
import type { ScriptPresetContext } from "../types/plugin";

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
      <hbr />
      <hbr />
      <hbr />
      {code`
      /**
      * A recursive type that defines theme colors for console text.
      *
      * @remarks
      * This type allows for nested theme color definitions, enabling complex theming structures for console applications.
      */
     export type ThemeColors<T> = T extends object ? { [K in keyof T]: ThemeColors<T[K]>; } : ((text: string) => string); `}
      <hbr />
      <hbr />
      <TypeDeclaration
        export
        name="Colors"
        doc="An object containing functions for coloring console applications. Each function corresponds to a terminal color. See {@link AnsiColor} for available colors.">
        {code`Record<AnsiColor, (text: string) => string> & ThemeColors<ThemeColorsResolvedConfig>`}
      </TypeDeclaration>
      <hbr />
      <hbr />
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
                      subcommand: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.subcommand}
                          ansi256={colors.ansi256.theme.text.usage.subcommand}
                          ansi16m={colors.ansi16m.theme.text.usage.subcommand}
                        />
                      )},
                      options: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.options}
                          ansi256={colors.ansi256.theme.text.usage.options}
                          ansi16m={colors.ansi16m.theme.text.usage.options}
                        />
                      )},
                      params: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.params}
                          ansi256={colors.ansi256.theme.text.usage.params}
                          ansi16m={colors.ansi16m.theme.text.usage.params}
                        />
                      )},
                      description: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.usage.description}
                          ansi256={colors.ansi256.theme.text.usage.description}
                          ansi16m={colors.ansi16m.theme.text.usage.description}
                        />
                      )}
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
        name="splitText"
        parameters={[
          {
            name: "text",
            type: "string"
          },
          {
            name: "maxLength",
            type: "number"
          }
        ]}>
        {code`
  let line = text;
  let result = [] as string[];

  while (stripAnsi(line).length > maxLength) {
    if (line.indexOf("\\n") !== -1 && stripAnsi(line).indexOf("\\n") <= maxLength) {
      result.push(line.slice(0, line.indexOf("\\n")));
      line = line.slice(line.indexOf("\\n") + 1);
    } else {
      const index = [" ", "/", "\\\\", ".", ",", "-", ":", "|", "@", "+"].reduce((ret, split) => {
        let current = ret;
        while (stripAnsi(line).indexOf(split, current + 1) !== -1 && stripAnsi(line).indexOf(split, current + 1) <= maxLength && (!/.*\\([^)]*$/.test(stripAnsi(line).slice(0, line.indexOf(split, current + 1))) || !/^[^(]*\\).*/.test(stripAnsi(line).slice(line.indexOf(split, current + 1) + 1)) || stripAnsi(line).slice(line.indexOf(split, current + 1) + 1).replace(/^.*\\)/, "").indexOf(split) !== -1)) {
          current = line.indexOf(split, current + 1);
        }

        return current;
      }, -1);
      if (index === -1) {
        break;
      }

      result.push(line.slice(0, index));
      line = line.slice(index + 1);
    }
  }

  while (stripAnsi(line).length > maxLength) {
    result.push(line.slice(0, maxLength));
    line = line.slice(maxLength + 1);
  }

  if (line.length > 0) {
    result.push(line);
  }

  return result;
`}
      </FunctionDeclaration>
      <hbr />
      <hbr />
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
      <hbr />
      <hbr />
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
    timestamp
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
                variant
              }(new Date().toLocaleDateString())} \${colors.border.message.outline.${
                variant
              }("${
                theme.borderStyles.message.outline[variant].bottom
              }")} \${colors.text.message.footer.${
                variant
              }(new Date().toLocaleTimeString())}\`; `
            : ""
        }
        writeLine(colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].topLeft
        }") + ${
          theme.labels.message.header[variant] ||
          theme.icons.message.header[variant]
            ? `colors.border.message.outline.${variant}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(4)) + " " + ${
                theme.icons.message.header[variant]
                  ? `colors.border.message.outline.${variant}("${
                      theme.icons.message.header[variant]
                    }") + " " +`
                  : ""
              } colors.text.message.header.${variant}("${
                theme.labels.message.header[variant]
              }") + " " + colors.border.message.outline.${variant}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                4 +
                (theme.icons.message.header[variant]
                  ? theme.icons.message.header[variant].length +
                    1 +
                    (theme.labels.message.header[variant] ? 0 : 1)
                  : 0) +
                (theme.labels.message.header[variant]
                  ? theme.labels.message.header[variant].length + 2
                  : 0) +
                theme.borderStyles.message.outline[variant].topLeft.length +
                theme.borderStyles.message.outline[variant].topRight.length
              }, 0)))`
            : `colors.border.message.outline.${variant}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].topLeft.length +
                theme.borderStyles.message.outline[variant].topRight.length
              }, 0)))`
        } + colors.border.message.outline.${variant}("${
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
          writeLine(colors.border.message.outline.${variant}("${
            theme.borderStyles.message.outline[variant].left +
            " ".repeat(Math.max(theme.padding.message, 0))
          }") + colors.text.message.description.${variant}(line) + " ".repeat(Math.max(process.stdout.columns - (stripAnsi(line).length + ${
            Math.max(theme.padding.app, 0) * 2 +
            Math.max(theme.padding.message, 0) +
            theme.borderStyles.message.outline[variant].left.length +
            theme.borderStyles.message.outline[variant].right.length
          }), 0)) + colors.border.message.outline.${variant}("${
            theme.borderStyles.message.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });
        writeLine(colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].bottomLeft
        }") + ${
          theme.labels.message.footer[variant] || timestamp
            ? `colors.border.message.outline.${variant}("${
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
              }, 0))) + " " + ${
                theme.labels.message.footer[variant]
                  ? `colors.text.message.footer.${variant}("${theme.labels.message.footer[variant]}")`
                  : timestamp && "timestamp"
              } + " " + colors.border.message.outline.${variant}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(4))`
            : `colors.border.message.outline.${variant}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].bottomLeft.length +
                theme.borderStyles.message.outline[variant].bottomRight.length
              }, 0)))`
        } + colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].bottomRight
        }"), { consoleFn: console.${consoleFnName} });
`}
      </FunctionDeclaration>
    </>
  );
}

export interface BannerFunctionDeclarationProps {
  variant?: ThemeColorVariant;
  consoleFnName?: "log" | "info" | "warn" | "error" | "debug";
  title?: string;
}

/**
 * A component to generate the `banner` function in the `shell-shock:console` builtin module.
 */
export function BannerFunctionDeclaration(
  props: BannerFunctionDeclarationProps
) {
  const {
    consoleFnName = "log",
    variant = "primary",
    title: titleProp
  } = props;

  const theme = useTheme();

  const context = usePowerlines<ScriptPresetContext>();
  const command = useCommand();

  const header = computed(
    () =>
      `${theme.labels.banner.header[variant] || getAppTitle(context)} v${context.packageJson.version || "1.0.0"}`
  );
  const description = computed(
    () => command?.description || getAppDescription(context)
  );
  const footer = computed(() => theme.labels.banner.footer[variant]);

  const title = computed(() =>
    titleProp ||
    /(?:cli|command-line|command line)\s+(?:application|app)?$/.test(
      header.value.toLowerCase()
    )
      ? header.value
          .replace(`v${context.packageJson.version || "1.0.0"}`, "")
          .trim()
      : `${header.value
          .replace(`v${context.packageJson.version || "1.0.0"}`, "")
          .trim()} Command-Line Application`
  );

  const bannerPadding = computed(
    () =>
      Math.max(theme.padding.app, 0) * 2 +
      theme.borderStyles.banner.outline[variant].left.length +
      theme.borderStyles.banner.outline[variant].right.length
  );
  const totalPadding = computed(
    () => Math.max(theme.padding.banner, 0) * 2 + bannerPadding.value
  );

  return (
    <>
      <FunctionDeclaration
        export
        name="banner"
        doc="Write the application banner to the console.">
        {code`
        if (hasFlag("no-banner") || hasFlag("hide-banner") || isCI || isMinimal) {
          return;
        }

        writeLine(colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].topLeft
        }") + ${
          theme.icons.banner.header[variant]
            ? `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].top
              }".repeat(4)) + " " + ${
                theme.icons.banner.header[variant]
                  ? `colors.border.banner.outline.${variant}("${
                      theme.icons.banner.header[variant]
                    }") + " " + colors.text.banner.header.${variant}("${
                      theme.borderStyles.banner.outline[variant].top
                    }") + " " +`
                  : ""
              } colors.text.banner.header.${variant}("${
                header.value
              }") + " " + colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].top
              }".repeat(Math.max(process.stdout.columns - ${
                4 +
                (theme.icons.banner.header[variant]
                  ? theme.icons.banner.header[variant].length + 3
                  : 0) +
                (header.value ? header.value.length + 2 : 0) +
                bannerPadding.value
              }, 0)))`
            : `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].top
              }".repeat(Math.max(process.stdout.columns - ${
                bannerPadding.value
              }, 0)))`
        } + colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].topRight
        }"), { consoleFn: console.${consoleFnName} });

        splitText(
          colors.text.banner.title.${variant}("${title.value}"),
          Math.max(process.stdout.columns - ${totalPadding.value}, 0)
        ).forEach((line) => {
          writeLine(colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.text.banner.description.${
            variant
          }(line) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });

        ${
          command?.title
            ? `writeLine(colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottomLeft
              }") + " ".repeat(Math.max(process.stdout.columns - ${
                bannerPadding.value
              })) + colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottomRight
              }"), { consoleFn: console.${consoleFnName} });

            writeLine(colors.border.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].left
            }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
              bannerPadding.value
            })) / 2), 0)) + colors.text.banner.command.${
              variant
            }("${command.title}") + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
              bannerPadding.value
            })) / 2), 0)) + colors.border.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].right
            }"), { consoleFn: console.${consoleFnName} }); `
            : ""
        }

        splitText(
          ${
            command?.title
              ? "colors.text.banner.description"
              : "colors.text.banner.command"
          }.${variant}("${description.value.replace(/"/g, '\\"')}"),
          Math.max(process.stdout.columns - ${totalPadding.value}, 0)
        ).forEach((line) => {
          writeLine(colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.text.banner.description.${variant}(line) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });

        writeLine(colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].bottomLeft
        }") + ${
          footer.value
            ? `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                4 +
                (footer.value ? footer.value.length : 0) +
                bannerPadding.value
              }, 0))) + " " + ${
                footer.value
                  ? `colors.text.banner.footer.${variant}("${footer.value}")`
                  : ""
              } + " " + colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(4))`
            : `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                bannerPadding.value
              }, 0)))`
        } + colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].bottomRight
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
          {`Split text by /\\\\u001b[\\[|\\]][0-9;]*m/ and wrap non-ANSI parts with open/closeing tags.`}
        </TSDocRemarks>

        <TSDocExample>
          {`const result = wrapAnsi("Hello\\\\u001b[31mWorld\\\\u001b[0mAgain", "\\\\u001b[36m", "\\\\u001b[39");\nconsole.log(result); // "\\\\u001b[36mHello\\\\u001b[39\\\\u001b[31mWorld\\\\u001b[0m\\\\u001b[36mAgain\\\\u001b[39"`}
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
        while ((match = /\\\\u001b[\\[|\\]][0-9;]*m/g.exec(str)) !== null) {
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
          if (/^\\\\u001b[\\[|\\]][0-9;]*m$/.test(seg)) {
            result += seg;
            continue;
          }

          if (!seg) {
            continue;
          }

          result += i > 0 && /^\\\\u001b[\\[|\\]][0-9;]*m$/.test(tokens[i - 1]!) && i + 1 < tokens.length && /^\\\\u001b[\\[|\\]][0-9;]*m$/.test(tokens[i + 1]!)
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
          {`const result = stripAnsi("Hello\\\\u001b[31mWorld\\\\u001b[0mAgain"); // "HelloWorldAgain"`}
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
      <hbr />
      <hbr />
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
          {code`return \`\\u001b]8;;\${url}\\u0007\${text ?? url}\\u001b]8;;\\u0007\`;`}
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
        name="BorderOption"
        doc="The border options applied to table cells.">
        {code`"primary" | "secondary" | "tertiary" | "none" | string; `}
      </TypeDeclaration>
      <hbr />
      <hbr />
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
      <hbr />
      <hbr />
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
      </InterfaceDeclaration>
      <hbr />
      <hbr />
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
      <hbr />
      <hbr />
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
      <hbr />
      <hbr />
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
      <hbr />
      <hbr />
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
      <hbr />
      <hbr />
      <TypeDeclaration
        name="TableCell"
        doc="The internal state of a formatted table cell in the {@link table} function.">
        {code`Required<Omit<TableCellOptions, "border">> & Dimensions & {
          border: TableCellBorder;
        };
        `}
      </TypeDeclaration>
      <hbr />
      <hbr />
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
        const extractTableCell = (cell: string | TableCellOptions, opts?: TableOutputOptions): TableCell => {
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

            const padding = Math.max(0, opts?.padding ?? ${theme.padding.table});
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

            return {
              value,
              height: 1,
              width,
              border,
              padding,
              align: cell.align || opts?.align || "left",
            };
          }
        };
    `}
        <hbr />
        <IfStatement condition={code`Array.isArray(options)`}>
          <IfStatement
            condition={code`options.every(row => typeof row === "string" || (typeof row === "object" && !Array.isArray(row) && !("values" in row)))`}>
            {code`cells.push(options.map(cell => extractTableCell(cell as string | TableCellOptions)));`}
          </IfStatement>
          <ElseClause>
            {code`
          cells.push(
            ...options.map(row => Array.isArray(row)
              ? row.reduce((cellRow, cell) => {
                cellRow.push(extractTableCell(cell));
                return cellRow;
              }, [] as TableCell[])
              : (row as TableRowOptions).values?.reduce((cellRow, cell) => {
                cellRow.push(extractTableCell(cell, row as TableRowOptions));
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
            ? row.reduce((cellRow, cell) => {
              cellRow.push(extractTableCell(cell));
              return cellRow;
            }, [] as TableCell[])
            : (row as TableRowOptions).values?.reduce((cellRow, cell) => {
              cellRow.push(extractTableCell(cell, options));
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
        Math.max(process.stdout.columns - ${
          Math.max(theme.padding.app, 0) * 2
        } - (row.width - (cell.width - cell.padding * 2)), 0)
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
      return row.reduce((largest, current, i) => {
        if (largest.width < current.width) {
          colIndex = i;
          return current;
        }
        return largest;
      }, ret);
    }, cells[0]![0]!);

    const lines = splitText(
      cell.value,
      Math.max(process.stdout.columns - ${
        Math.max(theme.padding.app, 0) * 2
      } - (colWidths.filter((_, i) => i !== colIndex).reduce((a, b) => a + b, 0)) - cell.padding * 2, 0)
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

/**
 * A built-in console utilities module for Shell Shock.
 */
export function ConsoleBuiltin() {
  return (
    <BuiltinFile
      id="console"
      description="A collection of helper utilities to assist in generating content meant for display in the console."
      imports={{
        "@shell-shock/plugin-theme/types/theme": [
          { name: "ThemeColorsResolvedConfig", type: true }
        ]
      }}
      builtinImports={{
        utils: [
          "hasFlag",
          "isMinimal",
          "isColorSupported",
          "colorSupportLevels",
          "isHyperlinkSupported"
        ],
        env: ["env", "isDevelopment", "isDebug", "isCI"]
      }}>
      <StripAnsiFunctionDeclaration />
      <hbr />
      <hbr />
      <WrapAnsiFunction />
      <hbr />
      <hbr />
      <ColorsDeclaration />
      <hbr />
      <hbr />
      <WriteLineFunctionDeclaration />
      <hbr />
      <hbr />
      <LinkFunctionDeclaration />
      <hbr />
      <hbr />
      <DividerFunctionDeclaration />
      <hbr />
      <hbr />
      <BannerFunctionDeclaration />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="help"
        variant="help"
        consoleFnName="log"
        description="help"
      />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="success"
        variant="success"
        consoleFnName="info"
        description="success"
      />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="info"
        variant="info"
        consoleFnName="info"
        description="informational"
      />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="debug"
        variant="debug"
        consoleFnName="debug"
        description="debug"
        timestamp
        prefix={
          <IfStatement
            condition={code`!isDevelopment && !isDebug && env.LOG_LEVEL !== "debug"`}>{code`return; `}</IfStatement>
        }
      />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="verbose"
        variant="debug"
        consoleFnName="debug"
        description="verbose"
        timestamp
        prefix={
          <IfStatement
            condition={code`!(isDevelopment || isDebug || env.LOG_LEVEL === "debug" || hasFlag(["verbose", "verbose=true", "verbose=always"]))`}>{code`return; `}</IfStatement>
        }
      />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="warn"
        variant="warning"
        consoleFnName="warn"
        description="warning"
      />
      <hbr />
      <hbr />
      <MessageFunctionDeclaration
        type="danger"
        variant="danger"
        consoleFnName="error"
        description="destructive/danger"
      />
      <hbr />
      <hbr />
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
            <hbr />
            <hbr />
            <IfStatement condition={code`(err as Error)?.message`}>
              {code`message = (err as Error).message;`}
              <IfStatement
                condition={code`env.STACKTRACE && (err as Error)?.stack`}>
                {code`message += " \\n\\n" + (err as Error).stack;`}
              </IfStatement>
            </IfStatement>
            <ElseClause>{code`message = String(err);`}</ElseClause>
          </>
        }
      />
      <hbr />
      <hbr />
      <TableFunctionDeclaration />
      <hbr />
      <hbr />
    </BuiltinFile>
  );
}
