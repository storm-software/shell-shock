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
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript";
import {
  TSDoc,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { joinPaths } from "@stryke/path";
import type { HelpPluginContext } from "../types/plugin";

/**
 * The Help command's handler wrapper for the Shell Shock project.
 */
export function HelpCommand() {
  const context = usePowerlines<HelpPluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "help", "command.ts")}
      imports={{
        "node:os": "os",
        "node:fs/promises": ["readFile", "writeFile"]
      }}
      builtinImports={{
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
        <TSDocParam name="options">
          {`The options for the help command. This can include various flags and parameters to customize the behavior of the help command, such as specifying a particular command to show help for, or toggling the display of additional information.`}
        </TSDocParam>
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
        {code` return;`}
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
