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
import { FunctionDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TSDoc, TSDocRemarks } from "@powerlines/plugin-alloy/typescript";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import type { CommandTree } from "@shell-shock/core";
import {
  getAppBin,
  getAppTitle,
  isDynamicPathSegment
} from "@shell-shock/core/plugin-utils";
import { useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import { joinPaths } from "@stryke/path";
import { camelCase } from "@stryke/string-format/camel-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
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
  const theme = useTheme();

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
          "underline",
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
        <Show when={command.tags && command.tags.length > 0}>
          {code`writeLine(\`\${bold(textColors.heading.secondary("Tags: "))} ${command.tags
            .map(
              tag =>
                `\${textColors.tags.${camelCase(
                  tag
                )} ? textColors.tags.${camelCase(
                  tag
                )}(inverse(" ${tag} ")) : textColors.tags.$default(inverse(" ${tag} "))}`
            )
            .join(" ")}\`, { padding: ${(theme.padding.app ?? 1) * 2} }); `}
        </Show>
        <Show
          when={!command.virtual}
          fallback={
            <VirtualCommandHelpDisplay
              options={Object.values(command.options)}
              commands={command.children ?? {}}
            />
          }>
          <CommandHelpDisplay command={command} />
        </Show>
        <Show when={isSetString(command.docs)}>
          {code`writeLine(textColors.body.tertiary(\`More information can be found in the ${
            command.path
              ? `${command.title} command`
              : getAppTitle(context, false)
          } documentation at \${link("${
            command.docs
          }")}\${textColors.body.tertiary(".")}\`), { padding: ${(theme.padding.app ?? 1) * 2} });
          writeLine(""); `}
          <hbr />
        </Show>
        <Show when={Object.keys(command.children).length > 0}>
          {code`help(\`Running a specific command with the help flag (via: \${inlineCode("${getAppBin(
            context
          )}${
            command.segments && command.segments.length > 0
              ? ` ${command.segments.join(" ")}`
              : ""
          } <specific command> --help")}) or the help command with the specific command as arguments (via: \${inlineCode("${getAppBin(
            context
          )}${
            command.segments && command.segments.length > 0
              ? ` ${command.segments.join(" ")}`
              : ""
          } help <specific command>")}) will provide additional information that is specific to that command.\`);
        writeLine("");`}
        </Show>
      </FunctionDeclaration>
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
