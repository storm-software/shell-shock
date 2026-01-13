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
import { code, computed, For, Show } from "@alloy-js/core";
import {
  ElseIfClause,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { DynamicImportStatement } from "@powerlines/plugin-alloy/typescript/components/dynamic-import-statement";
import { isVariableCommandPath } from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { CommandContext, useCommand } from "../contexts/command";

export function CommandRouterRoute() {
  const command = useCommand();

  return (
    <>
      <Show when={!command.isVirtual}>
        <DynamicImportStatement
          name={`handle${pascalCase(command.name)}`}
          importPath={`./${
            command.path.segments.filter(
              segment => !isVariableCommandPath(segment)
            )[
              command.path.segments.filter(
                segment => !isVariableCommandPath(segment)
              ).length - 1
            ]
          }`}
          exportName="handler"
        />
      </Show>
      <hbr />
      {code`return handle${pascalCase(command.name)}(args);`}
    </>
  );
}

export interface CommandRouterProps {
  path: string[];
  commands?: Record<string, CommandTree>;
  route?: Children;
}

/**
 * The command router component.
 */
export function CommandRouter(props: CommandRouterProps) {
  const { path, commands, route } = props;

  const command = useCommand();
  const index = computed(() => 2 + (path.length ?? 0));

  return (
    <Show when={commands && Object.keys(commands).length > 0}>
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
      <For each={Object.values(commands ?? {})}>
        {(subcommand, idx) => (
          <CommandContext.Provider value={subcommand}>
            <Show when={subcommand.name !== command?.name}>
              <Show
                when={Boolean(idx)}
                fallback={
                  <IfStatement
                    condition={code`command.toLowerCase() === "${subcommand.name.toLowerCase()}"`}>
                    <Show
                      when={Boolean(route)}
                      fallback={<CommandRouterRoute />}>
                      {route}
                    </Show>
                  </IfStatement>
                }>
                <ElseIfClause
                  condition={code`command.toLowerCase() === "${subcommand.name.toLowerCase()}"`}>
                  <Show when={Boolean(route)} fallback={<CommandRouterRoute />}>
                    {route}
                  </Show>
                </ElseIfClause>
              </Show>
            </Show>
          </CommandContext.Provider>
        )}
      </For>
      <ElseIfClause
        condition={code`Boolean(command)`}>{code`error("Unknown command: " + command);`}</ElseIfClause>
    </Show>
  );
}
