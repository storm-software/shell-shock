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
import { code, computed } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  getAppDescription,
  getAppTitle
} from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import type { ThemeColorVariant } from "@shell-shock/plugin-theme/types/theme";
import { useTheme } from "../contexts";
import type { ScriptPresetContext } from "../types";

export interface BannerFunctionDeclarationProps {
  variant?: ThemeColorVariant;
  consoleFnName?: "log" | "info" | "warn" | "error" | "debug";
  command?: CommandTree;
  children?: Children;
}

/**
 * A component to generate the `banner` function for a specific command or application.
 *
 * @remarks
 * This function will display a banner in the console with the application's name, version, and description. It can be customized with different variants for styling and supports conditional rendering based on flags or environment variables.
 */
export function BannerFunctionDeclaration(
  props: BannerFunctionDeclarationProps
) {
  const {
    consoleFnName = "log",
    variant = "primary",
    command,
    children
  } = props;

  const theme = useTheme();
  const context = usePowerlines<ScriptPresetContext>();

  const header = computed(
    () =>
      `${theme.labels.banner.header[variant] || getAppTitle(context)} v${context.packageJson.version || "1.0.0"}`
  );
  const description = computed(
    () => command?.description || getAppDescription(context)
  );
  const footer = computed(() => theme.labels.banner.footer[variant]);

  const title = computed(() =>
    getAppTitle(context) ||
    /(?:cli|command line|command-line)\s+(?:application|app)?$/.test(
      header.value.toLowerCase()
    )
      ? header.value
          .replace(`v${context.packageJson.version || "1.0.0"}`, "")
          .trim()
      : `${header.value
          .replace(`v${context.packageJson.version || "1.0.0"}`, "")
          .trim()} Command Line Application`
  );

  return (
    <>
      <FunctionDeclaration
        name="banner"
        doc={`Write the ${getAppTitle(context)} application banner ${
          command ? `for the ${command.title} command ` : ""
        }to the console.`}>
        <BannerFunctionBodyDeclaration
          title={title.value}
          header={header.value}
          description={description.value}
          footer={footer.value}
          variant={variant}
          consoleFnName={consoleFnName}
          command={command}
          insertNewlineBeforeCommand>
          {children}
        </BannerFunctionBodyDeclaration>
      </FunctionDeclaration>
    </>
  );
}

export interface BannerFunctionBodyDeclarationProps extends BannerFunctionDeclarationProps {
  title?: string;
  header?: string;
  footer?: string;
  description: string;
  insertNewlineBeforeCommand?: boolean;
}

/**
 * A component to generate the `banner` function's body for a specific command or application.
 *
 * @remarks
 * This function will display a banner in the console with the application's name, version, and description. It can be customized with different variants for styling and supports conditional rendering based on flags or environment variables.
 */
export function BannerFunctionBodyDeclaration(
  props: BannerFunctionBodyDeclarationProps
) {
  const {
    consoleFnName = "log",
    variant = "primary",
    title,
    header,
    footer,
    description,
    command,
    children,
    insertNewlineBeforeCommand = false
  } = props;

  const theme = useTheme();

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
      {code`
        if (hasFlag("no-banner") || hasFlag("hide-banner") || isCI || isMinimal) {
          return;
        } `}
      <hbr />
      <hbr />
      {children}
      <hbr />
      <hbr />
      {code`writeLine(colors.border.banner.outline.${variant}("${
        theme.borderStyles.banner.outline[variant].topLeft
      }") + ${
        theme.icons.banner.header[variant]
          ? `colors.border.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].top
            }".repeat(6)) + " " + ${
              theme.icons.banner.header[variant]
                ? `colors.text.banner.header.${variant}("${
                    theme.icons.banner.header[variant]
                  }") + " " + colors.border.banner.outline.${variant}("${
                    theme.borderStyles.banner.outline[variant].top
                  }") + " " +`
                : ""
            } colors.bold(colors.text.banner.header.${variant}("${
              header
            }")) + " " + colors.border.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].top
            }".repeat(Math.max(process.stdout.columns - ${
              6 +
              (theme.icons.banner.header[variant]
                ? theme.icons.banner.header[variant].length + 3
                : 0) +
              (header ? header.length + 2 : 0) +
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
          ${title ? `"${title}"` : "title"},
          Math.max(process.stdout.columns - ${totalPadding.value}, 0)
        ).forEach((line) => {
          writeLine(colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.bold(colors.text.banner.title.${variant}(line)) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });

        ${
          command?.title
            ? `${
                insertNewlineBeforeCommand
                  ? `writeLine(colors.border.banner.outline.${variant}("${
                      theme.borderStyles.banner.outline[variant].left
                    }") + " ".repeat(Math.max(process.stdout.columns - ${
                      bannerPadding.value
                    })) + colors.border.banner.outline.${variant}("${
                      theme.borderStyles.banner.outline[variant].right
                    }"), { consoleFn: console.${consoleFnName} }); `
                  : ""
              }
            ${`writeLine(colors.border.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].left
            }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi("${command.title}").length + ${
              bannerPadding.value
            })) / 2), 0)) + colors.bold(colors.text.banner.command.${
              variant
            }("${command.title}")) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi("${command.title}").length + ${
              bannerPadding.value
            })) / 2), 0)) + colors.border.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].right
            }"), { consoleFn: console.${consoleFnName} }); `} `
            : ""
        }

        splitText(
          colors.bold(${
            command?.title
              ? "colors.text.banner.description"
              : "colors.text.banner.command"
          }.${variant}("${description.replace(/"/g, '\\"')}")),
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
          footer
            ? `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                8 + (footer ? footer.length : 0) + bannerPadding.value
              }, 0))) + " " + ${
                footer
                  ? `colors.bold(colors.text.banner.footer.${variant}("${footer}"))`
                  : ""
              } + " " + colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(6))`
            : `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                bannerPadding.value
              }, 0)))`
        } + colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].bottomRight
        }"), { consoleFn: console.${consoleFnName} });
`}
    </>
  );
}
