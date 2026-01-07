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
  ElseIfClause,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { DynamicImportStatement } from "@powerlines/plugin-alloy/typescript/components/dynamic-import-statement";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { CommandContext, useCommand } from "../contexts/command";
import type { ScriptPresetContext } from "../types/plugin";

export function CommandRouterRoute() {
  const command = useCommand();

  return (
    <Show
      when={!command.isVirtual}
      fallback={code`return handle${pascalCase(command.name)}(args);`}>
      <DynamicImportStatement
        name={`handle${pascalCase(command.name)}`}
        importPath={`./${command.entry.output}`}
        exportName="handler"
      />
      <hbr />
      {code`return handle${pascalCase(command.name)}(args);`}
    </Show>
  );
}

export function CommandRouter() {
  const context = usePowerlines<ScriptPresetContext>();

  const command = useCommand();
  const index = computed(() => 2 + (command?.path.length ?? 0));

  return (
    <>
      <VarDeclaration
        let
        name="command"
        type="string"
        initializer={code`"";`}
      />
      <hbr />
      <IfStatement
        condition={code`args.length > ${
          index.value
        } && args[${index.value}]`}>{code`command = args[${
        index.value
      }];`}</IfStatement>
      <hbr />
      <For each={Object.values(command?.children ?? context?.commands ?? {})}>
        {(subcommand, idx) => (
          <CommandContext.Provider value={subcommand}>
            <Show
              when={Boolean(idx)}
              fallback={
                <IfStatement
                  condition={code`command.toLowerCase() === "${subcommand.name.toLowerCase()}"`}>
                  <CommandRouterRoute />
                </IfStatement>
              }>
              <ElseIfClause
                condition={code`command.toLowerCase() === "${subcommand.name.toLowerCase()}"`}>
                <CommandRouterRoute />
              </ElseIfClause>
            </Show>
          </CommandContext.Provider>
        )}
      </For>
      <ElseIfClause
        condition={code`Boolean(command)`}>{code`error("Unknown command: " + command);`}</ElseIfClause>
    </>
  );
}
