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
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocExample,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import type { ThemeMessageVariant } from "@shell-shock/plugin-theme/types/theme";
import { useColors, useTheme } from "../../contexts/theme";
import type {
  AnsiWrappers,
  BaseAnsiStylesKeys
} from "../../helpers/ansi-utils";

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
      <TypeDeclaration export name="AnsiColor">
        <For
          each={Object.keys(colors.ansi16).filter(color => color !== "theme")}>
          {(color, idx) => `${idx > 0 ? " | " : ""}"${color}"`}
        </For>
      </TypeDeclaration>
      <hbr />
      <hbr />
      {code`export type ThemeColors<T> = T extends object ? { [K in keyof T]: ThemeColors<T[K]>; } : ((text: string) => string); `}
      <hbr />
      <hbr />
      <TypeDeclaration export name="Colors">
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
                      title: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.banner.title}
                          ansi256={colors.ansi256.theme.text.banner.title}
                          ansi16m={colors.ansi16m.theme.text.banner.title}
                        />
                      )},
                      header: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.banner.header}
                          ansi256={colors.ansi256.theme.text.banner.header}
                          ansi16m={colors.ansi16m.theme.text.banner.header}
                        />
                      )},
                      footer: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.banner.footer}
                          ansi256={colors.ansi256.theme.text.banner.footer}
                          ansi16m={colors.ansi16m.theme.text.banner.footer}
                        />
                      )},
                      command: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.banner.command}
                          ansi256={colors.ansi256.theme.text.banner.command}
                          ansi16m={colors.ansi16m.theme.text.banner.command}
                        />
                      )},
                      description: ${(
                        <ColorFunction
                          ansi16={colors.ansi16.theme.text.banner.description}
                          ansi256={colors.ansi256.theme.text.banner.description}
                          ansi16m={colors.ansi16m.theme.text.banner.description}
                        />
                      )}
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
                      )}
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
                    outline: {
                      primary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.outline.primary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.outline.primary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.outline.primary
                          }
                        />
                      )},
                      secondary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.outline.secondary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.outline.secondary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.outline.secondary
                          }
                        />
                      )},
                      tertiary: ${(
                        <ColorFunction
                          ansi16={
                            colors.ansi16.theme.border.app.outline.tertiary
                          }
                          ansi256={
                            colors.ansi256.theme.border.app.outline.tertiary
                          }
                          ansi16m={
                            colors.ansi16m.theme.border.app.outline.tertiary
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
export function WriteLineFunction() {
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
        name={"splitText"}
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
        while (stripAnsi(line).indexOf(split, current + 1) !== -1 && stripAnsi(line).indexOf(split, current + 1) <= maxLength) {
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
      <InterfaceDeclaration export name="WriteLineOptions">
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
        <TSDocParam name="padding">{`Padding to apply to the line`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        name={"writeLine"}
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
if (text === undefined || text === null || text === "") {
  consoleFn("");
  return;
}

consoleFn(\`\${" ".repeat(Math.max(options.padding ?? ${theme.padding.app}, 0))}\${String(text)}\`);
`}
      </FunctionDeclaration>
    </>
  );
}

export type MessageFunctionProps = Partial<
  Pick<FunctionDeclarationProps, "parameters">
> & {
  type: "success" | "help" | "info" | "verbose" | "warn" | "danger" | "error";
  variant: ThemeMessageVariant;
  consoleFnName: "log" | "info" | "warn" | "error" | "debug";
  description: string;
  prefix?: Children;
};

/**
 * A component to generate the message functions in the `shell-shock:console` builtin module.
 */
export function MessageFunction(props: MessageFunctionProps) {
  const { type, variant, consoleFnName, description, prefix, parameters } =
    props;

  const theme = useTheme();

  return (
    <>
      <TSDoc
        heading={`Write ${
          ["a", "e", "i", "o", "u"].includes(description.charAt(0)) ? "an" : "a"
        } ${description} message to the console.`}>
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

        writeLine(colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].topLeft
        }") + colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].top
        }".repeat(Math.max(process.stdout.columns - ${
          (Math.max(theme.padding.app, 0) +
            Math.max(theme.padding.message, 0)) *
            2 +
          theme.borderStyles.message.outline[variant].topLeft.length +
          theme.borderStyles.message.outline[variant].topRight.length
        }, 0) / ${
          theme.borderStyles.message.outline[variant].top.length ?? 1
        })) + colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].topRight
        }"), { consoleFn: console.${consoleFnName}
        });
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
          }") + line + colors.border.message.outline.${variant}("${
            " ".repeat(Math.max(theme.padding.message, 0)) +
            theme.borderStyles.message.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });
        writeLine(colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].bottomLeft
        }") + colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].bottom
        }".repeat(Math.max(process.stdout.columns - ${
          (Math.max(theme.padding.app, 0) +
            Math.max(theme.padding.message, 0)) *
            2 +
          theme.borderStyles.message.outline[variant].bottomLeft.length +
          theme.borderStyles.message.outline[variant].bottomRight.length
        }, 0) / ${
          theme.borderStyles.message.outline[variant].bottom.length ?? 1
        })) + colors.border.message.outline.${variant}("${
          theme.borderStyles.message.outline[variant].bottomRight
        }"), { consoleFn: console.${consoleFnName}
        });
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
export function StripAnsiFunction() {
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
 * A component to generate the `link` function in the `shell-shock:console` builtin module.
 */
export function LinkFunction() {
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

/**
 * A built-in console utilities module for Shell Shock.
 */
export function ConsoleBuiltin() {
  return (
    <BuiltinFile
      id="console"
      description="A collection of helper utilities to assist in generating content meant for display in the console."
      imports={{
        "@shell-shock/plugin-theme/types/theme": ["ThemeColorsResolvedConfig"]
      }}
      builtinImports={{
        utils: [
          "hasFlag",
          "isColorSupported",
          "colorSupportLevels",
          "isHyperlinkSupported"
        ],
        env: ["env", "isDevelopment", "isDebug"]
      }}>
      <StripAnsiFunction />
      <hbr />
      <hbr />
      <WrapAnsiFunction />
      <hbr />
      <hbr />
      <ColorsDeclaration />
      <hbr />
      <hbr />
      <WriteLineFunction />
      <hbr />
      <hbr />
      <LinkFunction />
      <hbr />
      <hbr />
      <MessageFunction
        type="help"
        variant="help"
        consoleFnName="log"
        description="help"
      />
      <hbr />
      <hbr />
      <MessageFunction
        type="success"
        variant="success"
        consoleFnName="info"
        description="success"
      />
      <hbr />
      <hbr />
      <MessageFunction
        type="info"
        variant="info"
        consoleFnName="info"
        description="informational"
      />
      <hbr />
      <hbr />
      <MessageFunction
        type="verbose"
        variant="info"
        consoleFnName="debug"
        description="verbose/debug"
        prefix={
          <IfStatement
            condition={code`!(isDevelopment || isDebug || env.LOG_LEVEL === "debug" || hasFlag(["verbose", "verbose=true", "verbose=always", "debug"]))`}>{code`return; `}</IfStatement>
        }
      />
      <hbr />
      <hbr />
      <MessageFunction
        type="warn"
        variant="warning"
        consoleFnName="warn"
        description="warning"
      />
      <hbr />
      <hbr />
      <MessageFunction
        type="danger"
        variant="danger"
        consoleFnName="error"
        description="destructive/danger"
      />
      <hbr />
      <hbr />
      <MessageFunction
        type="error"
        variant="error"
        consoleFnName="error"
        description="error"
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
            <IfStatement
              condition={code`(err as Error)?.message`}>{code`message = (err as Error)?.message;`}</IfStatement>
            <ElseClause>{code`message = String(err);`}</ElseClause>
          </>
        }
      />
      <hbr />
      <hbr />
    </BuiltinFile>
  );
}
