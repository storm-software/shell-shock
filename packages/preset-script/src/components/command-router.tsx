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
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { DynamicImportStatement } from "@powerlines/plugin-alloy/typescript/components/dynamic-import-statement";
import { CommandContext, useCommand } from "@shell-shock/core/contexts/command";
import { isDynamicPathSegment } from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import { pascalCase } from "@stryke/string-format/pascal-case";
import type { ScriptPresetContext } from "../types/plugin";

export function CommandRouterRoute() {
  const command = useCommand();

  return (
    <>
      <Show when={!command.isVirtual}>
        <DynamicImportStatement
          name={`handle${pascalCase(command.name)}`}
          importPath={`./${
            command.segments.filter(segment => !isDynamicPathSegment(segment))[
              command.segments.filter(segment => !isDynamicPathSegment(segment))
                .length - 1
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
  segments: string[];
  commands?: Record<string, CommandTree>;
  route?: Children;
}

/**
 * The command router component.
 */
export function CommandRouter(props: CommandRouterProps) {
  const { segments, commands, route } = props;

  const index = computed(() => 2 + (segments.length ?? 0));

  return (
    <Show when={commands && Object.keys(commands).length > 0}>
      <VarDeclaration
        let
        name="command"
        type="string"
        initializer={code`"";`}
      />
      <hbr />
      <hbr />
      <Show when={commands && Object.keys(commands).length > 0}>
        <IfStatement
          condition={code`args.length > ${
            index.value
          } && args[${index.value}]`}>{code`command = args[${
          index.value
        }];`}</IfStatement>
        <hbr />
        <hbr />
      </Show>
      <CommandRouterBody
        segments={segments}
        commands={commands}
        route={route}
      />
    </Show>
  );
}

/**
 * The internal command router body logic component.
 */
export function CommandRouterBody(props: CommandRouterProps) {
  const { commands, route } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <Show when={commands && Object.keys(commands).length > 0}>
      <For each={Object.values(commands ?? {})}>
        {(subcommand, idx) => (
          <CommandContext.Provider value={subcommand}>
            <Show
              when={Boolean(idx)}
              fallback={
                <IfStatement
                  condition={code`${
                    context.config.isCaseSensitive
                      ? "command"
                      : 'command.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
                  } === "${
                    context.config.isCaseSensitive
                      ? subcommand.name
                      : subcommand.name
                          .toLowerCase()
                          .replaceAll("-", "")
                          .replaceAll("_", "")
                  }"${
                    subcommand.alias && subcommand.alias.length > 0
                      ? ` || ${subcommand.alias
                          .map(
                            alias =>
                              `${context.config.isCaseSensitive ? "command" : 'command.toLowerCase().replaceAll("-", "").replaceAll("_", "")'} === "${
                                context.config.isCaseSensitive
                                  ? alias
                                  : alias
                                      .toLowerCase()
                                      .replaceAll("-", "")
                                      .replaceAll("_", "")
                              }"`
                          )
                          .join(" || ")}`
                      : ""
                  }`}>
                  <Show when={Boolean(route)} fallback={<CommandRouterRoute />}>
                    {route}
                  </Show>
                </IfStatement>
              }>
              <ElseIfClause
                condition={code`${
                  context.config.isCaseSensitive
                    ? "command"
                    : 'command.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
                } === "${
                  context.config.isCaseSensitive
                    ? subcommand.name
                    : subcommand.name
                        .toLowerCase()
                        .replaceAll("-", "")
                        .replaceAll("_", "")
                }"${
                  subcommand.alias && subcommand.alias.length > 0
                    ? ` || ${subcommand.alias
                        .map(
                          alias =>
                            `${context.config.isCaseSensitive ? "command" : 'command.toLowerCase().replaceAll("-", "").replaceAll("_", "")'} === "${
                              context.config.isCaseSensitive
                                ? alias
                                : alias
                                    .toLowerCase()
                                    .replaceAll("-", "")
                                    .replaceAll("_", "")
                            }"`
                        )
                        .join(" || ")}`
                    : ""
                }`}>
                <Show when={Boolean(route)} fallback={<CommandRouterRoute />}>
                  {route}
                </Show>
              </ElseIfClause>
            </Show>
          </CommandContext.Provider>
        )}
      </For>
      <ElseIfClause
        condition={code`Boolean(command) && !command.startsWith("-")`}>{code`const suggestions = didYouMean(command, [${Object.values(
        commands ?? {}
      )
        .map(
          cmd =>
            `"${cmd.name}"${(cmd.alias ?? []).map((alias, i) => (i === 0 ? `, "${alias}"` : ` "${alias}"`)).join("")}`
        )
        .join(", ")}], {
          caseSensitive: ${JSON.stringify(context.config.isCaseSensitive)},
          returnType: ReturnTypeEnums.ALL_CLOSEST_MATCHES,
          thresholdType: ThresholdTypeEnums.SIMILARITY,
          threshold: 0.75
        });
        error(\`Unknown command: "\${command}"\${suggestions && suggestions.length > 0 ? \`, did you mean: \${suggestions.length === 1 ? \`"\${suggestions[0]}"\` : suggestions.map((suggestion, i) => i < suggestions.length - 1 ? \`"\${suggestion}", \` : \`or "\${suggestion}"\`)}?\` : ""} \`);`}</ElseIfClause>
    </Show>
  );
}
