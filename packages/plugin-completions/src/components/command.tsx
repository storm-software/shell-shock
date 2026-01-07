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
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { TSDoc } from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Completion commands' handler wrapper for the Shell Shock project.
 */

export function CommandHandlerWrapper() {
  const context = usePowerlines<CompletionsPluginContext>();

  return (
    <EntryFile
      path="bin.ts"
      hashbang
      imports={{
        "shell-shock:console": ["error"]
      }}>
      <TSDoc
        heading={`Binary entry point for the ${context?.config.title ? `${context?.config.title} ` : ""}CLI application.`}></TSDoc>
      <FunctionDeclaration async name="main">
        <VarDeclaration
          const
          name="args"
          type="string[]"
          initializer={code`process.argv`}
        />
        <hbr />
        <IfStatement
          condition={code`args.includes("--version") || args.includes("-v")`}>
          {code`console.log(${context?.packageJson.version ? `"${context?.packageJson.version}"` : "0.0.1"});`}
        </IfStatement>
      </FunctionDeclaration>
      <hbr />
      {code`
try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
      `}
    </EntryFile>
  );
}
