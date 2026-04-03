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
import { FunctionDeclaration, IfStatement } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
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
    <FunctionDeclaration
      export
      async
      name="showBanner"
      doc={`Write the ${getAppTitle(context, true)} command-line interface application banner ${
        command ? `for the ${command.title} command ` : ""
      }to the console.`}
      parameters={[{ name: "sleepTimeoutMs", type: "number", default: 500 }]}>
      {children}
      <IfStatement condition={code`isInteractive && !isHelp`}>
        {code`await sleep(sleepTimeoutMs);`}
      </IfStatement>
    </FunctionDeclaration>
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
        if (useApp().get("banner") || hasFlag("no-banner") || hasFlag("hide-banner") || isMinimal) {
          return;
        }

        useApp().set("banner", true); `}
      <Spacing />
      <Show when={insertNewlineBeforeBanner}>{code`writeLine(""); `}</Show>
      <Spacing />

      {code`
      writeLine(borderColors.banner.outline.${variant}("${
        theme.borderStyles.banner.outline[variant].topLeft
      }") + ${
        theme.icons.banner.header[variant]
          ? `borderColors.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].top
            }".repeat(6)) + " " + ${
              theme.icons.banner.header[variant]
                ? `textColors.banner.header.${variant}("${
                    theme.icons.banner.header[variant]
                  }") + " " + borderColors.banner.outline.${variant}("${
                    theme.borderStyles.banner.outline[variant].top
                  }") + " " +`
                : ""
            } bold(textColors.banner.header.${variant}("${
              header
            }")) + " " + borderColors.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].top
            }".repeat(Math.max(process.stdout.columns - ${
              6 +
              (theme.icons.banner.header[variant]
                ? theme.icons.banner.header[variant].length + 3
                : 0) +
              (header ? header.length + 2 : 0) +
              bannerPadding.value
            }, 0)))`
          : `borderColors.banner.outline.${variant}("${
              theme.borderStyles.banner.outline[variant].top
            }".repeat(Math.max(process.stdout.columns - ${
              bannerPadding.value
            }, 0)))`
      } + borderColors.banner.outline.${variant}("${
        theme.borderStyles.banner.outline[variant].topRight
      }"), { consoleFn: console.${consoleFnName} }); `}

      <Show
        when={!!children}
        fallback={
          <Show when={isSetString(title)}>
            <For each={title ? title.split("\n") : []} hardline>
              {line => code`splitText("${line}",
          Math.max(process.stdout.columns - ${totalPadding.value}, 20)
        ).forEach((line) => {
          writeLine(borderColors.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + bold(textColors.banner.title.${variant}(line)) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + borderColors.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        }); `}
            </For>
          </Show>
        }>
        {children}
      </Show>
      <Spacing />

      <Show when={isSetString(command?.title) && !!command?.path}>
        <Show when={insertNewlineBeforeCommand}>
          {code`writeLine(borderColors.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(process.stdout.columns - ${
            bannerPadding.value
          })) + borderColors.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} }); `}
        </Show>
        {`writeLine(borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].left
        }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi("${
          command?.title
        }").length ${command?.icon ? " + 3" : ""} + ${
          bannerPadding.value
        })) / 2), 0)) + bold(textColors.banner.command.${
          variant
        }("${command?.icon ? `${command.icon}  ` : ""}${command?.title}")) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi("${command?.title}").length ${
          command?.icon ? " + 3" : ""
        } + ${
          bannerPadding.value
        })) / 2), 0)) + borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].right
        }"), { consoleFn: console.${consoleFnName} }); `}
      </Show>
      <Spacing />

      {code`splitText(
          bold(${
            command?.title
              ? "textColors.banner.description"
              : "textColors.banner.command"
          }.${variant}(\`${formatDescription(description)}\`)),
          Math.max(${
            command?.title
              ? `${totalPadding.value} * 2 > process.stdout.columns / 2 ? process.stdout.columns - 6 : process.stdout.columns - ${totalPadding.value}`
              : `process.stdout.columns - ${totalPadding.value}`
          } , 20)
        ).forEach((line) => {
          writeLine(borderColors.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + textColors.banner.description.${variant}(line) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + borderColors.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });
        ${
          insertNewlineAfterDescription
            ? `writeLine(borderColors.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].left
              }") + " ".repeat(Math.max(process.stdout.columns - ${
                bannerPadding.value
              })) + borderColors.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].right
              }"), { consoleFn: console.${consoleFnName} });`
            : ""
        }
        writeLine(borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].bottomLeft
        }") + ${
          footer
            ? `borderColors.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                8 + (footer ? footer.length : 0) + bannerPadding.value
              }, 0))) + " " + ${
                footer
                  ? `bold(textColors.banner.footer.${variant}("${footer}"))`
                  : ""
              } + " " + borderColors.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(6))`
            : `borderColors.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].bottom
              }".repeat(Math.max(process.stdout.columns - ${
                bannerPadding.value
              }, 0)))`
        } + borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].bottomRight
        }"), { consoleFn: console.${consoleFnName} });

        writeLine(""); `}
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
