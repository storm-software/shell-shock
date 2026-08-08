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

import { code } from "@alloy-js/core";
import {
  FunctionDeclaration,
  InterfaceDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@power-plant/alloy-js/core";
import {
  InterfaceMember,
  TypescriptFile
} from "@power-plant/alloy-js/typescript";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocRemarks
} from "@power-plant/alloy-js/typescript/components/tsdoc";
import { usePowerlines } from "@shell-shock/core/contexts/power-plant";
import { joinPaths } from "@stryke/path";
import type { UpdatePluginContext } from "../types/plugin";

/**
 * The Update command's handler wrapper for the Shell Shock project.
 */
export function UpdateCommand() {
  const context = usePowerlines<UpdatePluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "update", "command.ts")}
      imports={{
        "node:os": "os",
        "node:fs/promises": ["readFile", "writeFile"]
      }}
      builtinImports={{
        console: [
          "textColors",
          "bold",
          "writeLine",
          "success",
          "warn",
          "stripAnsi"
        ]
      }}>
      <TSDoc heading="Options for the Update command." />
      <InterfaceDeclaration export name="UpdateOptions">
        <TSDoc heading="Whether to update to the latest version.">
          <TSDocRemarks>{`If set to \`true\`, the command will attempt to update to the latest version. This option takes precedence over the \`version\` option.`}</TSDocRemarks>
          <TSDocDefaultValue type="boolean" defaultValue={false} />
        </TSDoc>
        <InterfaceMember name="latest" type="boolean" />
        <Spacing />
        <TSDoc heading="A specific application version to update to.">
          <TSDocRemarks>{`The command will attempt to update to the specified version. The version should be a valid semantic version string, or \`latest\` to update to the latest version.`}</TSDocRemarks>
          <TSDocDefaultValue type="string" defaultValue="latest" />
        </TSDoc>
        <InterfaceMember name="version" type="string" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Handler logic for the \`update\` command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[{ name: "options", type: "UpdateOptions" }]}>
        {code` return;`}
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
