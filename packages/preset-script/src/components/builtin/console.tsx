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

import { code, For, Show } from "@alloy-js/core";
import type { ParameterDescriptor } from "@alloy-js/typescript";
import {
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

      {code`export type ThemeColors<T> = T extends object ? { [K in keyof T]: ThemeColor<T[K]>; } : ((text: string) => string); `}

      <TypeDeclaration export name="Colors">
        {code`Record<AnsiColor, (text: string) => string> & ThemeColors<ThemeColorsConfig>`}
      </TypeDeclaration>

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
            {code`theme: {
                    text: {
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
                            ansi256={
                              colors.ansi256.theme.text.banner.description
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.banner.description
                            }
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
                            ansi256={
                              colors.ansi256.theme.text.heading.secondary
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.heading.secondary
                            }
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
                              ansi16={
                                colors.ansi16.theme.text.message.link.help
                              }
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
                              ansi16={
                                colors.ansi16.theme.text.message.link.info
                              }
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
                              ansi16={
                                colors.ansi16.theme.text.message.link.error
                              }
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
                                colors.ansi16.theme.text.message.description
                                  .help
                              }
                              ansi256={
                                colors.ansi256.theme.text.message.description
                                  .help
                              }
                              ansi16m={
                                colors.ansi16m.theme.text.message.description
                                  .help
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
                                colors.ansi16.theme.text.message.description
                                  .info
                              }
                              ansi256={
                                colors.ansi256.theme.text.message.description
                                  .info
                              }
                              ansi16m={
                                colors.ansi16m.theme.text.message.description
                                  .info
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
                                colors.ansi16.theme.text.message.description
                                  .error
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
                            ansi256={
                              colors.ansi256.theme.text.usage.description
                            }
                            ansi16m={
                              colors.ansi16m.theme.text.usage.description
                            }
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
                                colors.ansi16.theme.border.banner.outline
                                  .primary
                              }
                              ansi256={
                                colors.ansi256.theme.border.banner.outline
                                  .primary
                              }
                              ansi16m={
                                colors.ansi16m.theme.border.banner.outline
                                  .primary
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
                                colors.ansi16.theme.border.banner.outline
                                  .tertiary
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
                                colors.ansi16.theme.border.banner.divider
                                  .primary
                              }
                              ansi256={
                                colors.ansi256.theme.border.banner.divider
                                  .primary
                              }
                              ansi16m={
                                colors.ansi16m.theme.border.banner.divider
                                  .primary
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
                                colors.ansi16.theme.border.banner.divider
                                  .tertiary
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
                              colors.ansi256.theme.border.message.outline
                                .success
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.message.outline
                                .success
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
                              colors.ansi256.theme.border.message.outline
                                .warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.message.outline
                                .warning
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
                              colors.ansi256.theme.border.message.divider
                                .success
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.message.divider
                                .success
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
                              colors.ansi256.theme.border.message.divider
                                .warning
                            }
                            ansi16m={
                              colors.ansi16m.theme.border.message.divider
                                .warning
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
      <InterfaceDeclaration export name="WriteLineOptions">
        <InterfaceMember
          doc={
            <TSDoc heading="Padding to apply to the line">
              <TSDocRemarks>
                {`The amount of padding (in spaces) to apply to the line when writing to the console. This value is applied to both the left and right sides of the line. If not specified, the default padding defined in the current theme configuration will be used.`}
              </TSDocRemarks>
            </TSDoc>
          }
          name="padding"
          optional
          type="number"
        />
        <InterfaceMember
          doc={
            <TSDoc heading="Console function to use for writing the line">
              <TSDocRemarks>
                {`The console function to use for writing the line. If not specified, the default console function \`console.log\` will be used.`}
              </TSDocRemarks>
              <TSDocDefaultValue
                type={ReflectionKind.method}
                defaultValue={`\`console.log\``}
              />
            </TSDoc>
          }
          name="consoleFn"
          optional
          type="(text: string) => void"
        />
      </InterfaceDeclaration>

      <TSDoc heading="Write a line to the console.">
        <TSDocRemarks>
          {`This function writes a line to the console, applying the appropriate padding as defined in the current theme configuration and wrapping as needed.`}
        </TSDocRemarks>

        <TSDocParam name="text">
          {`The line text to write to the console.`}
        </TSDocParam>
        <TSDocParam name="padding">{`Padding to apply to the line`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
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

const str = String(text);
const padding = Math.max(options.padding ?? ${theme.padding.app}, 0);

if (stripAnsi(str).length + padding * 2 <= process.stdout.columns) {
  consoleFn(\`\${" ".repeat(padding)}\${str}\`);
} else {
  const words = str.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (line.length + stripAnsi(word).length + 1 <= process.stdout.columns - padding * 2) {
      line += (line ? " " : "") + word;
    } else {
      consoleFn(\`\${" ".repeat(padding)}\${line}\`);
      line = word;
    }
  }

  if (line && stripAnsi(line).length > 0) {
    consoleFn(\`\${" ".repeat(padding)}\${line}\`);
  }
}
`}
      </FunctionDeclaration>
    </>
  );
}

export interface MessageFunctionProps {
  type?:
    | "success"
    | "help"
    | "info"
    | "verbose"
    | "warning"
    | "danger"
    | "error";
}

/**
 * A component to generate the message functions in the `shell-shock:console` builtin module.
 */
export function MessageFunction(props: MessageFunctionProps) {
  const { type } = props;

  return (
    <>
      <TSDoc
        heading={`Write ${
          type === "error" || type === "info" ? "an" : "a"
        } ${type ? (type === "info" ? "informational" : type) : ""} message to the console.`}>
        <TSDocRemarks>
          {`This function initializes the Powerlines environment configuration object.`}
        </TSDocRemarks>

        <Show when={!type}>
          <TSDocParam name="type">
            {`The type of message to write to the console.`}
          </TSDocParam>
        </Show>
        <TSDocParam name="message">
          {`The message(s) to write to the console.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name={type || "message"}
        parameters={
          [
            !type && {
              name: "type",
              type: `"success" | "help" | "info" | "verbose" | "warning" | "danger" | "error"`,
              optional: false
            },
            {
              name: "message",
              type: "string",
              optional: false
            }
          ].filter(Boolean) as ParameterDescriptor[]
        }>
        {code`writeLine(message, { consoleFn: console.${
          type === "warning"
            ? "warn"
            : type === "error" || type === "danger"
              ? "error"
              : type === "info"
                ? "info"
                : type === "verbose"
                  ? "debug"
                  : "log"
        } });`}
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
        const tokens: string[] = [];

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

          result += i > 0 && /^\\\\u001b[\\[|\\]][0-9;]*m$/.test(tokens[i - 1]!) && i + 1 < tokens.length && ansiExactRegex.test(tokens[i + 1]!) ? seg : \`\${open}\${seg}\${close}\`;
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
          {code`return colors.underline(colors.theme.text.body.link(\`$\{text ?? url\} $\{url\}\`));`}
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
      builtinImports={{
        utils: [
          "isColorSupported",
          "colorSupportLevels",
          "isHyperlinkSupported"
        ]
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
      <MessageFunction type="help" />
      <hbr />
      <hbr />
      <MessageFunction type="success" />
      <hbr />
      <hbr />
      <MessageFunction type="info" />
      <hbr />
      <hbr />
      <MessageFunction type="verbose" />
      <hbr />
      <hbr />
      <MessageFunction type="warning" />
      <hbr />
      <hbr />
      <MessageFunction type="danger" />
      <hbr />
      <hbr />
      <MessageFunction type="error" />
      <hbr />
      <hbr />
      <MessageFunction />
      <hbr />
      <hbr />
    </BuiltinFile>
  );
}
