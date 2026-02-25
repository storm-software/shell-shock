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

import { code, computed, Show } from "@alloy-js/core";
import {
  ElseClause,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  getAppBin,
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
            default: context.config.upgrade !== false ? "true" : "false"
          }
        ]}>
        <BannerFunctionBodyDeclaration
          header={header.value}
          description={description.value}
          footer={footer.value}
          variant={variant}
          consoleFnName={consoleFnName}
          command={command}
          insertNewlineAfterDescription>
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
        <Show when={context.config.upgrade !== false}>
          <IfStatement
            condition={code`upgradeCheck && (await isCheckForUpdatesRequired())`}>
            <VarDeclaration
              const
              name="spinner"
              initializer={code`createSpinner({
                            message: "Checking for updates..."
                          }).start(); `}
            />
            <VarDeclaration
              const
              name="result"
              initializer={code`await checkForUpdates({ force: true }); `}
            />
            <IfStatement condition={code`!result.isUpToDate`}>
              <Show
                when={
                  context.config.upgrade !== false &&
                  (context.config.upgrade.type === "confirm" ||
                    context.config.upgrade.type === "manual")
                }
                fallback={
                  <>
                    {code`spinner.stop();
                    info(\`A new version of ${getAppTitle(
                      context,
                      true
                    )} is available: \${colors.red(\`v\${result.currentVersion}\`)} \${colors.text.body.tertiary("➜")} \${colors.green(\`v\${result.latestVersion}\`)}\${result.package.date ? colors.text.body.tertiary(\` (updated on \${result.package.date})\`) : ""}\`);

                    try {
                      await upgrade();
                      spinner.success("Update successful! Please restart the application to apply the update.");

                      writeLine("");
                      writeLine("Press any key to exit application...");

                      await waitForKeyPress();
                      return;
                    } catch (err) {
                      spinner.error(\`An error occurred while updating ${getAppTitle(
                        context,
                        true
                      )} to v\${result.latestVersion}. Please try again later - if the problem persists, please contact support.\`);
                      debug(err);
                    } `}
                    <Spacing />
                  </>
                }>
                {code`spinner.stop();
                warn(\`A new version of ${getAppTitle(
                  context,
                  true
                )} is available: \${colors.red(\`v\${result.currentVersion}\`)} \${colors.text.body.tertiary("➜")} \${colors.green(\`v\${result.latestVersion}\`)}\${result.package.date ? colors.text.body.tertiary(\` (updated on \${result.package.date})\`) : ""}${
                  context.config.upgrade !== false &&
                  context.config.upgrade.type === "manual"
                    ? ` \\nPlease run \`${getAppBin(
                        context
                      )} update\` to upgrade to the latest version.`
                    : ""
                }\`); `}
                <Spacing />
                <Show
                  when={
                    context.config.upgrade !== false &&
                    context.config.upgrade.type === "confirm"
                  }>
                  {code`const willUpgradeNow = await confirm({
                  message: \`Would you like to update to v\${result.latestVersion} now?\`,
                  initialValue: true
                });
                if (isCancel(willUpgradeNow)) {
                  return;
                }

                if (willUpgradeNow) {
                  spinner.text = \`Updating ${getAppTitle(
                    context,
                    true
                  )} to v\${result.latestVersion}...\`;
                  spinner.start();

                  try {
                    await upgrade();
                    spinner.success("Update successful! Please restart the application to apply the update.");

                    writeLine("");
                    writeLine("Press any key to exit application...");

                    await waitForKeyPress();
                    return;
                  } catch (err) {
                    spinner.error(\`An error occurred while updating ${getAppTitle(
                      context,
                      true
                    )} to v\${result.latestVersion}. Please try again later - if the problem persists, please contact support.\`);
                    return { error: err };
                  }
                } else {
                  help("Updates can be performed at any time by running the \`${getAppBin(
                    context
                  )} update\` command. Please remember that keeping your application up to date is important for ensuring you have the latest features, performance improvements, and security patches.");
                } `}
                </Show>
              </Show>
            </IfStatement>
            <ElseIfClause condition={code`result.isError`}>
              {code`spinner.error(\`An error occurred while checking for ${getAppTitle(
                context,
                true
              )} application updates. Please try again later - if the problem persists, please contact support.\`);
              debug(result.error); `}
            </ElseIfClause>
            <ElseClause>{code`spinner.success("Currently running the latest version of ${getAppTitle(
              context,
              true
            )}.");
            writeLine("");
            `}</ElseClause>
          </IfStatement>
        </Show>
      </FunctionDeclaration>
    </>
  );
}
