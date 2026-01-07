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

import type { Children } from "@alloy-js/core";
import { code, Show } from "@alloy-js/core";
import {
  ElseClause,
  FunctionDeclaration,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { TSDoc } from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import type { ScriptPresetContext } from "../../types/plugin";
import { CommandRouter } from "../command-router";

export interface BinEntryProps
  extends Omit<EntryFileProps, "path" | "hashbang"> {
  prefix?: Children;
  postfix?: Children;
}

/**
 * The binary entry point for the Shell Shock project.
 */
export function BinEntry(props: BinEntryProps) {
  const { prefix, postfix, builtinImports, ...rest } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <EntryFile
      {...rest}
      path="bin"
      builtinImports={{
        console: ["danger", "error", "verbose"],
        utils: ["hasFlag"],
        ...(builtinImports ?? {})
      }}>
      <Show when={Boolean(prefix)}>{prefix}</Show>
      <hbr />
      <TSDoc
        heading={`Binary entry point for the ${context?.config.title ? `${context?.config.title} ` : ""}CLI application.`}></TSDoc>
      <FunctionDeclaration async name="main">
        <VarDeclaration
          const
          name="args"
          type="string[]"
          initializer={code`process.argv;`}
        />
        <hbr />
        <IfStatement condition={code`hasFlag(["version", "v"], args)`}>
          {code`console.log(${context?.packageJson.version ? `"${context?.packageJson.version}"` : "0.0.1"});`}
        </IfStatement>
        <ElseClause>
          <CommandRouter />
        </ElseClause>
      </FunctionDeclaration>
      <hbr />
      <hbr />
      <Show
        when={Boolean(postfix)}
        fallback={
          <>{code`
      try {
        await main();
      } catch (err) {
        error(err);
        process.exit(1);
      }
      `}</>
        }>
        {postfix}
      </Show>
      <hbr />
    </EntryFile>
  );
}
