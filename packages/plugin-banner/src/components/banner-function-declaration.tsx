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
import { code, computed, Show } from "@alloy-js/core";
import { FunctionDeclaration, IfStatement } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  TSDoc,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import {
  formatDescription,
  getAppDescription,
  getAppTitle
} from "@shell-shock/core/plugin-utils";
import type { CommandTree } from "@shell-shock/core/types/command";
import { useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import type { ThemeColorVariant } from "@shell-shock/plugin-theme/types/theme";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { BannerPluginContext } from "../types";

export interface BannerFunctionDeclarationWrapperProps {
  command?: CommandTree;
  children?: Children;
}

/**
 * A component to generate the `banner` function for a specific command or application.
 *
 * @remarks
 * This function will display a banner in the console with the application's name, version, and description. It can be customized with different variants for styling and supports conditional rendering based on flags or environment variables.
 */
export function BannerFunctionDeclarationWrapper(
  props: BannerFunctionDeclarationWrapperProps
) {
  const { command, children } = props;

  const context = usePowerlines<BannerPluginContext>();

  return (
    <>
      <TSDoc
        heading={`Write the ${getAppTitle(context, true)} command-line interface application banner ${
          command ? `for the ${command.title} command ` : ""
        }to the console.`}>
        <TSDocParam name="sleepTimeoutMs">
          {`The amount of time in milliseconds to sleep before displaying the banner. This can be used to create a delay before the banner is shown, allowing for any necessary setup or initialization to occur first. The default value is 500 milliseconds.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="showBanner"
        parameters={[{ name: "sleepTimeoutMs", type: "number", default: 500 }]}>
        {children}
        <IfStatement condition={code`isInteractive && !isHelp()`}>
          {code`await sleep(sleepTimeoutMs);`}
        </IfStatement>
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
  insertNewlineBeforeBanner?: boolean;
  insertNewlineAfterDescription?: boolean;
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
    insertNewlineBeforeCommand = false,
    insertNewlineBeforeBanner = true,
    insertNewlineAfterDescription = false
  } = props;

  const theme = useTheme();

  const borderStyle = theme.borderStyles.banner.outline[variant];
  const icon = theme.icons.banner.header[variant];

  const bannerPadding = computed(
    () =>
      Math.max(theme.padding.app, 0) * 2 +
      borderStyle.left.length +
      borderStyle.right.length
  );
  const innerPadding = computed(() => Math.max(theme.padding.banner, 2));
  const totalPadding = computed(
    () => Math.max(theme.padding.banner, 0) * 2 + bannerPadding.value
  );
  const headerRepeat = computed(() =>
    Math.max(Math.floor(innerPadding.value / 2) - 1, 2)
  );
  const headerStaticWidth = computed(
    () =>
      borderStyle.topLeft.length +
      headerRepeat.value +
      (icon ? 1 + icon.length + 1 + borderStyle.top.length + 1 : 1) +
      (header ? header.length : 0) +
      1 +
      borderStyle.topRight.length
  );
  const footerStaticWidth = computed(
    () =>
      borderStyle.bottomLeft.length +
      1 +
      (footer ? footer.length : 0) +
      1 +
      headerRepeat.value +
      borderStyle.bottomRight.length
  );

  return (
    <>
      {code`
        if (useMeta().get("banner") || hasFlag("no-banner") || hasFlag("hide-banner") || isMinimal) {
          return;
        }

        useMeta().set("banner", true); `}
      <Spacing />
      <Show when={insertNewlineBeforeBanner}>{code`writeLine(""); `}</Show>
      <Spacing />
      {code`writeLine(borderColors.banner.outline.${variant}("${
        borderStyle.topLeft
      }") + borderColors.banner.outline.${
        variant
      }("${borderStyle.top}".repeat(${headerRepeat.value}))${
        icon
          ? ` + " " + textColors.banner.header.${
              variant
            }("${icon}") + " " + borderColors.banner.outline.${variant}("${
              borderStyle.top
            }")`
          : ""
      } + " " + bold(textColors.banner.header.${variant}("${formatDescription(
        header || ""
      )}")) + " " + borderColors.banner.outline.${
        variant
      }("${borderStyle.top}".repeat(Math.max(getTerminalSize().columns - ${
        headerStaticWidth.value
      }, 0))) + borderColors.banner.outline.${
        variant
      }("${borderStyle.topRight}"), { consoleFn: console.${consoleFnName} }); `}
      <Spacing />
      <Show when={isSetString(title) && !children}>
        {code`splitText("${formatDescription(
          title || ""
        )}", Math.max(getTerminalSize().columns - ${
          totalPadding.value
        }, 20)).forEach((line) => {
    writeLine(borderColors.banner.outline.${variant}("${
      borderStyle.left
    }") + " ".repeat(Math.max(Math.floor((getTerminalSize().columns - (stripAnsi(line).length + ${
      bannerPadding.value
    })) / 2), 0)) + bold(textColors.banner.title.${
      variant
    }(line)) + " ".repeat(Math.max(Math.ceil((getTerminalSize().columns - (stripAnsi(line).length + ${
      bannerPadding.value
    })) / 2), 0)) + borderColors.banner.outline.${variant}("${
      borderStyle.right
    }"), { consoleFn: console.${consoleFnName} });
  }); `}
      </Show>
      {children}
      <Show when={isSetString(command?.title)}>
        <Show when={insertNewlineBeforeCommand}>
          {code`writeLine(borderColors.banner.outline.${variant}("${
            borderStyle.left
          }") + " ".repeat(Math.max(getTerminalSize().columns - ${
            bannerPadding.value
          }, 0)) + borderColors.banner.outline.${variant}("${
            borderStyle.right
          }"), { consoleFn: console.${consoleFnName} }); `}
        </Show>
        {code`writeLine(borderColors.banner.outline.${variant}("${
          borderStyle.left
        }") + " ".repeat(Math.max(Math.floor((getTerminalSize().columns - (stripAnsi("${formatDescription(
          command?.title || ""
        )}").length + ${
          bannerPadding.value
        })) / 2), 0)) + bold(textColors.banner.command.${
          variant
        }("${formatDescription(
          command?.title || ""
        )}")) + " ".repeat(Math.max(Math.ceil((getTerminalSize().columns - (stripAnsi("${formatDescription(
          command?.title || ""
        )}").length + ${
          bannerPadding.value
        })) / 2), 0)) + borderColors.banner.outline.${variant}("${
          borderStyle.right
        }"), { consoleFn: console.${consoleFnName} }); `}
      </Show>
      <Spacing />
      {code`splitText(bold(textColors.banner.${
        command ? "description" : "command"
      }.${variant}(\`${formatDescription(description)}\`)), Math.max(${
        command
          ? `${
              totalPadding.value * 2
            } > getTerminalSize().columns / 2 ? getTerminalSize().columns - ${Math.max(
              bannerPadding.value + 4,
              6
            )} : `
          : ""
      }getTerminalSize().columns - ${
        totalPadding.value
      }, 20)).forEach((line) => {
    writeLine(borderColors.banner.outline.${
      variant
    }("${borderStyle.left}") + " ".repeat(Math.max(Math.floor((getTerminalSize().columns - (stripAnsi(line).length + ${
      bannerPadding.value
    })) / 2), 0)) + textColors.banner.description.${
      variant
    }(line) + " ".repeat(Math.max(Math.ceil((getTerminalSize().columns - (stripAnsi(line).length + ${
      bannerPadding.value
    })) / 2), 0)) + borderColors.banner.outline.${variant}("${
      borderStyle.right
    }"), { consoleFn: console.${consoleFnName} });
  }); `}
      <Spacing />
      <Show when={insertNewlineAfterDescription}>
        {code`writeLine(borderColors.banner.outline.${variant}("${
          borderStyle.left
        }") + " ".repeat(Math.max(getTerminalSize().columns - ${
          bannerPadding.value
        }, 0)) + borderColors.banner.outline.${variant}("${
          borderStyle.right
        }"), { consoleFn: console.${consoleFnName} }); `}
      </Show>
      <Spacing />
      {code`writeLine(borderColors.banner.outline.${variant}("${
        borderStyle.bottomLeft
      }") + ${
        footer
          ? `borderColors.banner.outline.${variant}("${
              borderStyle.bottom
            }".repeat(Math.max(getTerminalSize().columns - ${
              footerStaticWidth.value
            }, 0))) + " " + bold(textColors.banner.footer.${
              variant
            }("${formatDescription(
              footer
            )}")) + " " + borderColors.banner.outline.${variant}("${
              borderStyle.bottom
            }".repeat(${headerRepeat.value}))`
          : `borderColors.banner.outline.${variant}("${
              borderStyle.bottom
            }".repeat(Math.max(getTerminalSize().columns - ${
              borderStyle.bottomLeft.length + borderStyle.bottomRight.length
            }, 0)))`
      } + borderColors.banner.outline.${variant}("${
        borderStyle.bottomRight
      }"), { consoleFn: console.${consoleFnName} }); `}
      <Spacing />
      {code`writeLine(""); `}
    </>
  );
}

export interface BannerFunctionDeclarationProps extends BannerFunctionDeclarationWrapperProps {
  variant?: ThemeColorVariant;
  consoleFnName?: "log" | "info" | "warn" | "error" | "debug";
  insertNewlineBeforeBanner?: boolean;
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
    children,
    insertNewlineBeforeBanner = true
  } = props;

  const theme = useTheme();
  const context = usePowerlines<BannerPluginContext>();

  const header = computed(
    () =>
      `${theme.labels.banner.header[variant] || getAppTitle(context, false)} v${
        context.packageJson.version || "1.0.0"
      }`
  );
  const footer = computed(() => theme.labels.banner.footer[variant]);
  const title = computed(
    () =>
      context.config.banner.title ||
      getAppTitle(context, true).replace(
        `v${context.packageJson.version || "1.0.0"}`,
        ""
      )
  );
  const description = computed(
    () => command?.description || getAppDescription(context)
  );

  return (
    <BannerFunctionDeclarationWrapper command={command}>
      <BannerFunctionBodyDeclaration
        title={!children ? title.value : undefined}
        header={header.value}
        description={description.value}
        footer={footer.value}
        variant={variant}
        consoleFnName={consoleFnName}
        command={command}
        insertNewlineBeforeCommand
        insertNewlineBeforeBanner={insertNewlineBeforeBanner}>
        {children}
      </BannerFunctionBodyDeclaration>
    </BannerFunctionDeclarationWrapper>
  );
}
