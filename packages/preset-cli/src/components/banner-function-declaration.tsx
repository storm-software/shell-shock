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
import { FunctionDeclaration, IfStatement } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  getAppDescription,
  getAppTitle
} from "@shell-shock/core/plugin-utils/context-helpers";
import { useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import type { BannerFunctionDeclarationProps } from "@shell-shock/preset-script/components/banner-function-declaration";
import { BannerFunctionBodyDeclaration } from "@shell-shock/preset-script/components/banner-function-declaration";
import { render } from "cfonts";
import type { CLIPresetContext } from "../types/plugin";

/**
 * A component to generate the `banner` function in the `shell-shock:console` builtin module.
 */
export function BannerFunctionDeclaration(
  props: BannerFunctionDeclarationProps
) {
  const { consoleFnName = "log", variant = "primary", command } = props;

  const theme = useTheme();

  const context = usePowerlines<CLIPresetContext>();

  const header = computed(
    () =>
      `${theme.labels.banner.header[variant] || getAppTitle(context)} v${
        context.packageJson.version || "1.0.0"
      }`
  );
  const footer = computed(() => theme.labels.banner.footer[variant]);
  const title = computed(() =>
    getAppTitle(context, true).replace(
      `v${context.packageJson.version || "1.0.0"}`,
      ""
    )
  );
  const description = computed(
    () => command?.description || getAppDescription(context)
  );

  const titleLines = computed(() => {
    const result = render(getAppTitle(context, true), {
      font: "tiny",
      align: "left",
      background: "transparent",
      letterSpacing: 1,
      lineHeight: 1,
      gradient: false,
      transitionGradient: false,
      env: "node"
    });
    if (!result) {
      return [`${getAppTitle(context, true)} Command-Line Interface`];
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
        async
        name="banner"
        doc={`Write the ${getAppTitle(context, true)} application banner ${
          command ? `for the ${command.title} command ` : ""
        }to the console.`}
        parameters={[
          { name: "pause", type: "number", default: 500 },
          {
            name: "upgradeCheck",
            default:
              context.config.upgrade?.type === "auto" ||
              context.config.upgrade?.type === "confirm"
                ? "true"
                : "false"
          }
        ]}>
        <BannerFunctionBodyDeclaration
          header={header.value}
          description={description.value}
          footer={footer.value}
          variant={variant}
          consoleFnName={consoleFnName}
          command={command}>
          {code`const titleLines = [${titleLines.value
            .map(line => JSON.stringify(line.trim()))
            .join(", ")}];
        const title = Math.max(...titleLines.map(line => stripAnsi(line).length)) > Math.max(process.stdout.columns - ${
          totalPadding.value
        }, 0) ? "${title.value}" : \`\\n\${titleLines.join("\\n")}\\n\`; `}
        </BannerFunctionBodyDeclaration>
        <IfStatement condition={code`isInteractive && !isHelp`}>
          {code`await sleep(pause);`}
        </IfStatement>
        <IfStatement condition={code`upgradeCheck`}>
          {code`const result = await checkForUpdates();`}
          <IfStatement condition={code`result?.updateAvailable`}>
            {code`
            info(\`A new version of ${getAppTitle(
              context,
              true
            )} is available: \${colors.red(\`v\${result.currentVersion}\`)} \${colors.text.body.tertiary("➜")} \${colors.green(\`v\${result.latestVersion}\`)}\${result.package.date ? colors.text.body.tertiary(\` (updated on \${result.package.date})\`) : ""}\`);
            `}
          </IfStatement>
        </IfStatement>
      </FunctionDeclaration>
    </>
  );
}
