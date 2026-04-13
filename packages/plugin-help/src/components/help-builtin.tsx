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

import { Show, splitProps } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TSDoc, TSDocRemarks } from "@powerlines/plugin-alloy/typescript";
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
        console: [
          "splitText",
          "writeLine",
          "inlineCode",
          "textColors",
          "inverse",
          "bold",
          "help",
          "table",
          "link"
        ]
      })}>
      <TSDoc
        heading={`Utility functions for displaying help information for the ${
          command.path
            ? `${command.title} command`
            : `${getAppTitle(context, true)} application`
        }.`}>
        <TSDocRemarks>
          {`This module contains utility functions that assist in displaying help information for the ${
            command.path
              ? `${command.title} command`
              : `${getAppTitle(context, true)} application`
          }. The main function exported by this module is the \`showHelp\` function, which can be used to display help information for the specified command or application. This function can be called from within the command's handler or from any other part of the application where help information needs to be displayed.`}
        </TSDocRemarks>
      </TSDoc>
      <FunctionDeclaration
        export
        name="showHelp"
        doc={`Display help information for the ${
          command.path
            ? `${command.title} command`
            : `${getAppTitle(context, true)} application`
        }.`}>
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
