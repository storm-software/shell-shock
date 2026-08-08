/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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
import { Spacing } from "@power-plant/alloy-js/core/components/spacing";
import { usePowerlines } from "@shell-shock/core/contexts/power-plant";
import { getAppBin, getAppTitle } from "@shell-shock/core/plugin-utils";
import type { UpdateBuiltinProps } from "@shell-shock/plugin-update/components/update-builtin";
import { UpdateBuiltin as BaseUpdateBuiltin } from "@shell-shock/plugin-update/components/update-builtin";
import { defu } from "defu";
import type { CLIPresetContext } from "../types/plugin";

/**
 * A component to generate the `executeUpdate` function in the `shell-shock:update` builtin module.
 */
export function ExecuteUpdateFunctionDeclaration() {
  const context = usePowerlines<CLIPresetContext>();

  return (
    <Show when={context.config.updateType !== false}>
      <FunctionDeclaration
        export
        async
        name="executeUpdate"
        doc={`Run update processing for the ${getAppTitle(
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
                context.config.updateType !== false &&
                (context.config.updateType === "confirm" ||
                  context.config.updateType === "manual")
              }
              fallback={
                <>
                  {code`spinner.stop();
                    info(\`A new version of ${getAppTitle(
                      context,
                      true
                    )} is available: \${red(\`v\${(result as CheckForUpdatesSuccessResult).currentVersion}\`)} \${textColors.body.tertiary("➜")} \${green(\`v\${(result as CheckForUpdatesSuccessResult).latestVersion}\`)}\${(result as CheckForUpdatesSuccessResult).package?.date ? textColors.body.tertiary(\` (updated on \${(result as CheckForUpdatesSuccessResult).package?.date})\`) : ""}\`);

                    try {
                      await update();
                      spinner.success("Update successful! Please restart the application to apply the update.");

                      writeLine("");
                      help(\`The changelog for this release can be viewed by running the \${inlineCode("${getAppBin(
                        context
                      )} changelog")} command.\`);

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
                  context.config.updateType !== false &&
                  context.config.updateType === "manual"
                    ? ` \\nPlease run \`${getAppBin(
                        context
                      )} update\` to update to the latest version.`
                    : ""
                }\`); `}
              <Spacing />
              <Show
                when={
                  context.config.updateType !== false &&
                  context.config.updateType === "confirm"
                }>
                {code`const willUpdateNow = await confirm({
                  message: \`Would you like to update to v\${(result as CheckForUpdatesSuccessResult).latestVersion} now?\`,
                  initialValue: true
                });
                if (isCancel(willUpdateNow)) {
                  return;
                }

                if (willUpdateNow) {
                  spinner.text = \`Updating ${getAppTitle(
                    context,
                    true
                  )} to v\${(result as CheckForUpdatesSuccessResult).latestVersion}...\`;
                  spinner.start();

                  try {
                    await update();
                    spinner.success("Update successful! Please restart the application to apply the update.");

                    writeLine("");
                    help(\`The changelog for this release can be viewed by running the \${inlineCode("${getAppBin(
                      context
                    )} changelog")} command.\`);

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
                  )} update\` command. Please remember that keeping your application up to date is important for ensuring you have the latest features, performance improvements, and security patches.");
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
 * A built-in update module for Shell Shock.
 */
export function UpdateBuiltin(props: UpdateBuiltinProps) {
  const [{ children, builtinImports }, rest] = splitProps(props, [
    "children",
    "builtinImports"
  ]);

  return (
    <BaseUpdateBuiltin
      {...rest}
      builtinImports={defu(builtinImports ?? {}, {
        console: ["createSpinner", "debug", "info"],
        prompts: ["waitForKeyPress"]
      })}>
      <ExecuteUpdateFunctionDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BaseUpdateBuiltin>
  );
}
