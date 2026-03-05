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
import {
  FunctionDeclaration,
  InterfaceDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  InterfaceMember,
  TypescriptFile
} from "@powerlines/plugin-alloy/typescript";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocRemarks
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
        "node:os": ["os"],
        "node:fs/promises": ["readFile", "writeFile"]
      }}
      builtinImports={{
        console: ["colors", "writeLine", "success", "warn", "stripAnsi"]
      }}>
      <TSDoc heading="Options for the Help command." />
      <InterfaceDeclaration export name="HelpOptions">
        <TSDoc heading="Whether to help to the latest version.">
          <TSDocRemarks>{`If set to \`true\`, the command will attempt to help to the latest version. This option takes precedence over the \`version\` option.`}</TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.boolean}
            defaultValue={false}
          />
        </TSDoc>
        <InterfaceMember name="latest" optional type="boolean" />
        <Spacing />
        <TSDoc heading="A specific application version to help to.">
          <TSDocRemarks>{`The command will attempt to help to the specified version. The version should be a valid semantic version string, or \`latest\` to help to the latest version.`}</TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="latest"
          />
        </TSDoc>
        <InterfaceMember name="version" optional type="string" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Handler logic for the \`help\` command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[{ name: "options", type: "HelpOptions" }]}>
        {code` return;`}
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
