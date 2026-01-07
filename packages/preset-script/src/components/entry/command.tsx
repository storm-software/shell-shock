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
import { FunctionDeclaration, VarDeclaration } from "@alloy-js/typescript";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import {
  TSDoc,
  TSDocParam,
  TSDocTitle
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import type { CommandTree } from "@shell-shock/core/types/command";

/**
 * The command entry point for the Shell Shock project.
 */
export function CommandEntry({ command }: { command: CommandTree }) {
  return (
    <EntryFile
      path={command.path.join("/")}
      builtinImports={{
        "console": ["parseArgs"]
      }}>
      <TSDoc heading={command.description}>
        <TSDocTitle>{command.title}</TSDocTitle>
        <TSDocParam name="args">{`The command-line arguments passed to the command.`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="handler"
        parameters={[{ name: "args", type: "string[]" }]}>
        <VarDeclaration
          const
          name="parsedArgs"
          type="Record<string, string | number | boolean | (string | number)[]>"
          initializer={code`parseArgs(args);`}
        />
        <hbr />
      </FunctionDeclaration>
    </EntryFile>
  );
}
