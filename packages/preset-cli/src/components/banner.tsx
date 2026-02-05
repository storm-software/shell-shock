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

import { code, computed } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { useCommand } from "@shell-shock/core/contexts/command";
import {
  getAppDescription,
  getAppTitle
} from "@shell-shock/core/plugin-utils/context-helpers";
import type { ThemeColorVariant } from "@shell-shock/plugin-theme/types/theme";
import { useTheme } from "@shell-shock/preset-script/contexts/theme";
import type { ScriptPresetContext } from "@shell-shock/preset-script/types/plugin";
import { render } from "cfonts";

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

  const titleLines = computed(() => {
    const result = render(getAppTitle(context), {
      font: "tiny",
      align: "left",
      colors: ["system"],
      background: "transparent",
      letterSpacing: 1,
      lineHeight: 1,
      gradient: false,
      transitionGradient: false,
      env: "node"
    });
    if (!result) {
      return [getAppTitle(context)];
    }

    return result.array;
  });

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

        const titleLines = [${titleLines.value
          .map(line => JSON.stringify(line))
          .join(", ")}];
        const title = Math.max(...titleLines.map(line => stripAnsi(line).trim().length)) > Math.max(process.stdout.columns - ${
          totalPadding.value
        }, 0)
          ? ["${title.value}"]
          : titleLines;

        writeLine(colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].topLeft
        }") + ${
          theme.icons.banner.header[variant]
            ? `colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].top
              }".repeat(4)) + " " + ${
                theme.icons.banner.header[variant]
                  ? `colors.text.banner.header.${variant}("${
                      theme.icons.banner.header[variant]
                    }") + " " + colors.border.banner.outline.${variant}("${
                      theme.borderStyles.banner.outline[variant].top
                    }") + " " +`
                  : ""
              } colors.bold(colors.text.banner.header.${variant}("${
                header.value
              }")) + " " + colors.border.banner.outline.${variant}("${
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

        writeLine(colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].left
        }") + " ".repeat(Math.max(process.stdout.columns - ${
          bannerPadding.value
        })) + colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].right
        }"), { consoleFn: console.${consoleFnName} });

        title.map(line => line.trim()).forEach((line) => {
          writeLine(colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].left
          }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.text.banner.title.${
            variant
          }(line) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
            bannerPadding.value
          })) / 2), 0)) + colors.border.banner.outline.${variant}("${
            theme.borderStyles.banner.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });

        writeLine(colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].left
        }") + " ".repeat(Math.max(process.stdout.columns - ${
          bannerPadding.value
        })) + colors.border.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].right
        }"), { consoleFn: console.${consoleFnName} });

        ${
          command?.title
            ? `writeLine(colors.border.banner.outline.${variant}("${
                theme.borderStyles.banner.outline[variant].left
              }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
                bannerPadding.value
              })) / 2), 0)) + colors.bold(colors.text.banner.command.${
                variant
              }("${command.title}")) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
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
                6 +
                (footer.value ? footer.value.length : 0) +
                bannerPadding.value
              }, 0))) + " " + ${
                footer.value
                  ? `colors.bold(colors.text.banner.footer.${variant}("${footer.value}"))`
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
