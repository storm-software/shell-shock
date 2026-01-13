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
import type { TypescriptFileImports } from "@powerlines/plugin-alloy/types/components";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { TSDoc } from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { ScriptPresetContext } from "../../types/plugin";
import { CommandRouter } from "../command-router";

export interface BinEntryProps extends Omit<
  EntryFileProps,
  "path" | "hashbang"
> {
  prefix?: Children;
  postfix?: Children;
}

/**
 * The binary entry point for the Shell Shock project.
 */
export function BinEntry(props: BinEntryProps) {
  const { prefix, postfix, builtinImports, imports, ...rest } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <EntryFile
      {...rest}
      path="bin"
      imports={defu(
        imports ?? {},
        Object.entries(context.commands)
          .filter(([, command]) => command.isVirtual)
          .reduce((ret, [name, command]) => {
            ret[`./${command.name}`] = [
              { name: "handler", alias: `handle${pascalCase(name)}` }
            ];

            return ret;
          }, {} as TypescriptFileImports)
      )}
      builtinImports={defu(builtinImports ?? {}, {
        console: ["danger", "error", "verbose"],
        utils: ["hasFlag", "getArgs"]
      })}>
      <Show when={Boolean(prefix)}>
        {prefix}
        <hbr />
        <hbr />
      </Show>
      <TSDoc
        heading={`Binary entry point for the ${context?.config.title ? `${context?.config.title} ` : ""}CLI application.`}></TSDoc>
      <FunctionDeclaration async returnType="any" name="main">
        <VarDeclaration
          const
          name="args"
          type="string[]"
          initializer={code`getArgs();`}
        />
        <hbr />
        <IfStatement condition={code`hasFlag(["version", "v"])`}>
          {code`console.log(${context?.packageJson.version ? `"${context?.packageJson.version}"` : "0.0.1"});`}
        </IfStatement>
        <ElseClause>
          <CommandRouter path={[]} commands={context?.commands ?? {}} />
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
