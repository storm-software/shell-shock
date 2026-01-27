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

import { code } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  TSDoc,
  TSDocRemarks
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { useTheme } from "@shell-shock/preset-script/contexts/theme";
import type { ScriptPresetContext } from "@shell-shock/preset-script/types/plugin";
import { titleCase } from "@stryke/string-format/title-case";
import { render } from "cfonts";
// import {
//   getOrganizationName,
//   getWorkspaceName
// } from "powerlines/plugin-utils/context-helpers";

export interface BannerFunctionDeclarationProps {
  /**
   * The title to display in the banner.
   *
   * @remarks
   * If not provided, the application title from the configuration will be used.
   */
  title?: string;

  /**
   * The sub-title text to display in the banner.
   *
   * @remarks
   * This will be displayed in small text below the title.
   */
  subTitle?: string;

  /**
   * The description of the command/application to display in the banner.
   *
   * @remarks
   * This text will be displayed in small text below the title.
   */
  description?: string;

  /**
   * An optional header to display above the banner. If not provided, the application's name and version will be displayed. If set to `false`, no header will be displayed.
   *
   * @remarks
   * This can be used to provide additional context or information before the banner. It will be displayed in the border surrounding the banner.
   */
  header?: string | false;

  /**
   * An optional footer to display below the banner. If not provided, the organization name or workspace name will be used. If set to `false`, no footer will be displayed.
   *
   * @remarks
   * This can be used to provide additional context or information after the banner. It will be displayed in the border surrounding the banner.
   */
  footer?: string | false;
}

/**
 * The `banner` handler function declaration code for the Shell Shock project.
 */
export function BannerFunctionDeclaration(
  props: BannerFunctionDeclarationProps
) {
  const { title: propTitle, description: propDescription } = props;

  const context = usePowerlines<ScriptPresetContext>();
  const theme = useTheme();

  const title = propTitle || titleCase(context.config.title);
  const description = propDescription || context.config.description;
  // const header =
  //   propHeader !== false
  //     ? propHeader ||
  //       `${title} ${context.packageJson?.version ? `v${context.packageJson.version}` : ""}`.trim()
  //     : undefined;
  // const footer =
  //   propFooter !== false
  //     ? propFooter ||
  //       titleCase(getOrganizationName(context) || getWorkspaceName(context))
  //     : undefined;

  const renderedTitle = render(title, {
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

  return (
    <>
      <TSDoc heading={`Write the application banner display to the console.`}>
        <TSDocRemarks>
          {`This function should be run at the start of an application and should identify the current application/command to the user.`}
        </TSDocRemarks>
      </TSDoc>
      <FunctionDeclaration name="banner">
        {code`
        writeLine(colors.border.banner.outline.primary("${
          theme.borderStyles.banner.outline.primary.topLeft
        }") + colors.border.banner.outline.primary("${
          theme.borderStyles.banner.outline.primary.top
        }".repeat(Math.max(process.stdout.columns - ${
          (Math.max(theme.padding.app, 0) + Math.max(theme.padding.banner, 0)) *
            2 +
          theme.borderStyles.banner.outline.primary.topLeft.length +
          theme.borderStyles.banner.outline.primary.topRight.length
        }, 0) / ${
          theme.borderStyles.banner.outline.primary.top.length ?? 1
        })) + colors.border.banner.outline.primary("${
          theme.borderStyles.banner.outline.primary.topRight
        }"), { consoleFn: console.info });

        ${
          renderedTitle
            ? renderedTitle.array
                .map(
                  line =>
                    `writeLine(colors.border.banner.outline.primary("${
                      theme.borderStyles.banner.outline.primary.left
                    }") +
                    " ".repeat(Math.max(theme.padding.banner, 0)) +
                    colors.text.banner.title("${line}") +
                    " ".repeat(Math.max(theme.padding.banner, 0)) +
                    colors.border.banner.outline.primary("${
                      theme.borderStyles.banner.outline.primary.right
                    }"), { consoleFn: console.info });`
                )
                .join(`\n`)
            : ""
        }

        splitText(
          ${description ? code`"${description.replace(/"/g, '\\"')}"` : "''"},
          Math.max(process.stdout.columns - ${
            (Math.max(theme.padding.app, 0) +
              Math.max(theme.padding.banner, 0)) *
              2 +
            theme.borderStyles.banner.outline.primary.left.length +
            theme.borderStyles.banner.outline.primary.right.length
          }, 0)
        ).forEach((line) => {
          writeLine(colors.border.banner.outline.primary("${
            theme.borderStyles.banner.outline.primary.left +
            " ".repeat(Math.max(theme.padding.banner, 0))
          }") + colors.text.banner.description(line) + colors.border.banner.outline.primary("${
            " ".repeat(Math.max(theme.padding.banner, 0)) +
            theme.borderStyles.banner.outline.primary.right
          }"), { consoleFn: console.info });
        });
        writeLine(colors.border.banner.outline.primary("${
          theme.borderStyles.banner.outline.primary.bottomLeft
        }") + colors.border.banner.outline.primary("$"{
          theme.borderStyles.banner.outline.primary.bottom
        }".repeat(Math.max(process.stdout.columns - ${
          (Math.max(theme.padding.app, 0) + Math.max(theme.padding.banner, 0)) *
            2 +
          theme.borderStyles.banner.outline.primary.bottomLeft.length +
          theme.borderStyles.banner.outline.primary.bottomRight.length
        }, 0) / ${
          theme.borderStyles.banner.outline.primary.bottom.length ?? 1
        })) + colors.border.banner.outline.primary("${
          theme.borderStyles.banner.outline.primary.bottomRight
        }"), { consoleFn: console.info });
`}
      </FunctionDeclaration>
    </>
  );
}
