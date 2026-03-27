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
import { FunctionDeclaration, IfStatement } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  TSDoc,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import type { CommandTree } from "@shell-shock/core";
import {
  getAppTitle,
  isDynamicPathSegment
} from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import defu from "defu";
import type { HelpPluginContext } from "../types";
import { CommandHelpDisplay, VirtualCommandHelpDisplay } from "./display";

/**
 * The `updateVersionCheckFile` handler function declaration code for the Shell Shock project.
 */
export function HelpFunctionDeclaration() {
  return (
    <>
      <TSDoc heading="A helper function that updates the version check file.">
        <TSDocRemarks>
          {`This function is used to update the version check file with the current timestamp. It can be used in the CLI upgrade command to record the last time a check for updates was performed. The function writes a "version-check.json" file in the data directory, which contains a timestamp of the last check for updates.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocReturns>
          {`A promise that resolves to a boolean indicating whether a check for updates is required.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="updateVersionCheckFile"
        returnType="void">
        <IfStatement condition={code`!existsSync(paths.data)`}>
          {code`await mkdir(paths.data, { recursive: true }); `}
        </IfStatement>
        {code`await writeFile(join(paths.data, "version-check.json"), JSON.stringify({ timestamp: new Date().getTime() }), "utf8"); `}
      </FunctionDeclaration>
    </>
  );
}

export interface HelpBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {
  /**
   * The command to generate the `help` function declaration for.
   */
  command: CommandTree;
}

/**
 * A built-in help module for Shell Shock.
 */
export function HelpBuiltin(props: HelpBuiltinProps) {
  const [{ command, children }, rest] = splitProps(props, [
    "command",
    "children"
  ]);
  const context = usePowerlines<HelpPluginContext>();

  return (
    <BuiltinFile
      id={joinPaths(
        "help",
        ...command.segments.filter(segment => !isDynamicPathSegment(segment))
      )}
      description={
        command.path
          ? `A collection of utility functions that assist in displaying help information for the ${
              command.title
            } command.`
          : `A collection of utility functions that assist in displaying help information for the ${getAppTitle(
              context,
              true
            )} command-line interface application.`
      }
      {...rest}
      builtinImports={defu(rest.builtinImports ?? {}, {
        utils: ["isUnicodeSupported"],
        console: ["splitText", "writeLine", "colors", "help", "table", "link"]
      })}>
      <FunctionDeclaration
        export
        name="showHelp"
        doc={`Display help information for the ${
          command.path
            ? `${command.title} command`
            : `${getAppTitle(context, true)} application`
        }.`}
        parameters={[]}>
        <Show
          when={!command.isVirtual}
          fallback={
            <VirtualCommandHelpDisplay
              options={Object.values(command.options)}
              commands={command.children ?? {}}
            />
          }>
          <CommandHelpDisplay command={command} />
        </Show>
      </FunctionDeclaration>
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
