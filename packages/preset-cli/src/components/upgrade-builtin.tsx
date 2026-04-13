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

import { code, Show, splitProps } from "@alloy-js/core";
import {
  ElseClause,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { getAppBin, getAppTitle } from "@shell-shock/core/plugin-utils";
import type { UpgradeBuiltinProps } from "@shell-shock/plugin-upgrade/components/upgrade-builtin";
import { UpgradeBuiltin as BaseUpgradeBuiltin } from "@shell-shock/plugin-upgrade/components/upgrade-builtin";
import { defu } from "defu";
import type { CLIPresetContext } from "../types/plugin";

/**
 * A component to generate the `executeUpgrade` function in the `shell-shock:upgrade` builtin module.
 */
export function ExecuteUpgradeFunctionDeclaration() {
  const context = usePowerlines<CLIPresetContext>();

  return (
    <Show when={context.config.upgradeType !== false}>
      <FunctionDeclaration
        export
        async
        name="executeUpgrade"
        doc={`Run upgrade processing for the ${getAppTitle(
          context,
          true
        )} application.`}>
        <IfStatement condition={code`await isCheckForUpdatesRequired()`}>
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
          <IfStatement
            condition={code`(result as CheckForUpdatesErrorResult)?.isError`}>
            {code`spinner.error(\`An error occurred while checking for ${getAppTitle(
              context,
              true
            )} application updates. Please try again later - if the problem persists, please contact support.\`);
              debug((result as CheckForUpdatesErrorResult).error); `}
          </IfStatement>
          <ElseIfClause
            condition={code`!(result as CheckForUpdatesSuccessResult)?.isUpToDate`}>
            <Show
              when={
                context.config.upgradeType !== false &&
                (context.config.upgradeType === "confirm" ||
                  context.config.upgradeType === "manual")
              }
              fallback={
                <>
                  {code`spinner.stop();
                    info(\`A new version of ${getAppTitle(
                      context,
                      true
                    )} is available: \${red(\`v\${(result as CheckForUpdatesSuccessResult).currentVersion}\`)} \${textColors.body.tertiary("➜")} \${green(\`v\${(result as CheckForUpdatesSuccessResult).latestVersion}\`)}\${(result as CheckForUpdatesSuccessResult).package?.date ? textColors.body.tertiary(\` (updated on \${(result as CheckForUpdatesSuccessResult).package?.date})\`) : ""}\`);

                    try {
                      await upgrade();
                      spinner.success("Update successful! Please restart the application to apply the update.");

                      writeLine("");
                      help(\`You can view the changelog for this release at any time by running the \${inlineCode("${getAppBin(
                        context
                      )} changelog --latest")} command.\`);

                      writeLine("");
                      writeLine("Press any key to exit the application...");

                      await waitForKeyPress();
                      return;
                    } catch (err) {
                      spinner.error(\`An error occurred while updating ${getAppTitle(
                        context,
                        true
                      )} to v\${(result as CheckForUpdatesSuccessResult).latestVersion}. Please try again later - if the problem persists, please contact support.\`);
                      debug(err);
                    } `}
                  <Spacing />
                </>
              }>
              {code`spinner.stop();
                warn(\`A new version of ${getAppTitle(
                  context,
                  true
                )} is available: \${red(\`v\${(result as CheckForUpdatesSuccessResult).currentVersion}\`)} \${textColors.body.tertiary("➜")} \${green(\`v\${(result as CheckForUpdatesSuccessResult).latestVersion}\`)}\${(result as CheckForUpdatesSuccessResult).package.date ? textColors.body.tertiary(\` (updated on \${(result as CheckForUpdatesSuccessResult).package.date})\`) : ""}${
                  context.config.upgradeType !== false &&
                  context.config.upgradeType === "manual"
                    ? ` \\nPlease run \`${getAppBin(
                        context
                      )} upgrade\` to upgrade to the latest version.`
                    : ""
                }\`); `}
              <Spacing />
              <Show
                when={
                  context.config.upgradeType !== false &&
                  context.config.upgradeType === "confirm"
                }>
                {code`const willUpgradeNow = await confirm({
                  message: \`Would you like to update to v\${(result as CheckForUpdatesSuccessResult).latestVersion} now?\`,
                  initialValue: true
                });
                if (isCancel(willUpgradeNow)) {
                  return;
                }

                if (willUpgradeNow) {
                  spinner.text = \`Updating ${getAppTitle(
                    context,
                    true
                  )} to v\${(result as CheckForUpdatesSuccessResult).latestVersion}...\`;
                  spinner.start();

                  try {
                    await upgrade();
                    spinner.success("Update successful! Please restart the application to apply the update.");

                    writeLine("");
                    help(\`You can view the changelog for this release at any time by running the \${inlineCode("${getAppBin(
                      context
                    )} changelog --latest")} command.\`);

                    writeLine("");
                    writeLine("Press any key to exit the application...");

                    await waitForKeyPress();
                    return;
                  } catch (err) {
                    spinner.error(\`An error occurred while updating ${getAppTitle(
                      context,
                      true
                    )} to v\${(result as CheckForUpdatesSuccessResult).latestVersion}. Please try again later - if the problem persists, please contact support.\`);
                    return { error: err };
                  }
                } else {
                  help("Updates can be performed at any time by running the \`${getAppBin(
                    context
                  )} upgrade\` command. Please remember that keeping your application up to date is important for ensuring you have the latest features, performance improvements, and security patches.");
                } `}
              </Show>
            </Show>
          </ElseIfClause>
          <ElseClause>{code`spinner.success("Currently running the latest version of ${getAppTitle(
            context,
            true
          )}.");
            writeLine("");
            `}</ElseClause>
        </IfStatement>
      </FunctionDeclaration>
    </Show>
  );
}

/**
 * A built-in upgrade module for Shell Shock.
 */
export function UpgradeBuiltin(props: UpgradeBuiltinProps) {
  const [{ children, builtinImports }, rest] = splitProps(props, [
    "children",
    "builtinImports"
  ]);

  return (
    <BaseUpgradeBuiltin
      {...rest}
      builtinImports={defu(builtinImports ?? {}, {
        console: ["createSpinner", "debug", "info"],
        prompts: ["waitForKeyPress"]
      })}>
      <ExecuteUpgradeFunctionDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BaseUpgradeBuiltin>
  );
}
