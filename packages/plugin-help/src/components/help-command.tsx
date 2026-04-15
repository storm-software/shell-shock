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

import { code, computed, For, Show } from "@alloy-js/core";
import {
  ElseClause,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript";
import {
  TSDoc,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { joinPaths } from "@stryke/path";
import { pascalCase } from "@stryke/string-format/pascal-case";
import type { HelpPluginContext } from "../types/plugin";

/**
 * A temporary placeholder component for the help command. The actual content of this component will be rendered in the `prepare` step of the help plugin, after the command list has been fully resolved. This is necessary to ensure that the help command's entry file is generated, and to avoid any issues with missing files or circular dependencies during the rendering process.
 */
export function TemporaryHelpCommand() {
  const context = usePowerlines<HelpPluginContext>();

  return (
    <TypescriptFile path={joinPaths(context.entryPath, "help", "command.ts")}>
      {code` // Temporary placeholder file to ensure the help command's entry file is generated. The actual content of this file will be rendered in the \`prepare\` step of this plugin, after the command list has been fully resolved. `}
      <Spacing />
      <TSDoc heading="Display command usage details and other useful information to the user.">
        <TSDocParam name="segments">
          {`The command segments for the command to show help for. This is used to determine which command's help information to display. If no segments are provided, general help information about the CLI application will be displayed.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[
          { name: "segments", type: "string[]", default: "[]" }
        ]}></FunctionDeclaration>
    </TypescriptFile>
  );
}

export interface HelpCommandsProps {
  segments: string[][];
}

/**
 * The Help command's handler wrapper for the Shell Shock project.
 */
export function HelpCommand(props: HelpCommandsProps) {
  const context = usePowerlines<HelpPluginContext>();

  const helpImports = computed(() =>
    props.segments
      ? props.segments.reduce(
          (ret, segments) => {
            ret[joinPaths("help", ...segments)] = [
              {
                name: "showHelp",
                alias: `showHelp${segments
                  .map(segment => pascalCase(segment.replace(/-/g, "")))
                  .join("")}`
              }
            ];
            return ret;
          },
          {} as Record<string, { name: string; alias: string }[]>
        )
      : {}
  );

  const commandSegmentsList = props.segments ?? [];

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "help", "command.ts")}
      imports={{
        "node:os": "os",
        "node:fs/promises": ["readFile", "writeFile"]
      }}
      builtinImports={{
        ...helpImports.value,
        help: ["showHelp"],
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
      }}>
      <TSDoc heading="Display command usage details and other useful information to the user.">
        <TSDocParam name="segments">
          {`The command segments for the command to show help for. This is used to determine which command's help information to display. If no segments are provided, general help information about the CLI application will be displayed.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[{ name: "segments", type: "string[]", default: "[]" }]}>
        <Show
          when={commandSegmentsList.length > 0}
          fallback={code`showHelp(); `}>
          <For each={commandSegmentsList} doubleHardline>
            {(segments, index) => (
              <Show
                when={index > 0}
                fallback={
                  <IfStatement
                    condition={code`segments.join("/").toLowerCase() === "${segments
                      .join("/")
                      .toLowerCase()}"`}>
                    {code` showHelp${segments
                      .map(segment => pascalCase(segment))
                      .join("")}(); `}
                  </IfStatement>
                }>
                <ElseIfClause
                  condition={code`segments.join("/").toLowerCase() === "${segments
                    .join("/")
                    .toLowerCase()}"`}>
                  {code` showHelp${segments
                    .map(segment => pascalCase(segment))
                    .join("")}(); `}
                </ElseIfClause>
              </Show>
            )}
          </For>
          <ElseClause>{code`showHelp(); `}</ElseClause>
        </Show>
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
