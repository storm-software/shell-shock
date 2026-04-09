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

import { code, For, Show } from "@alloy-js/core";
import {
  ElseIfClause,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { camelCase } from "@stryke/string-format/camel-case";
import { list } from "@stryke/string-format/list";
import type {
  CommandTree,
  NumberCommandParameter,
  StringCommandParameter
} from "../types";
import { CommandParameterKinds } from "../types";

export interface CommandValidationLogicProps {
  command: CommandTree;
}

/**
 * A component that generates command validation logic for required options and arguments.
 */
export function CommandValidationLogic(props: CommandValidationLogicProps) {
  const { command } = props;

  return (
    <>
      <VarDeclaration name="failures" type="string[]" initializer={code`[];`} />
      <hbr />
      <For each={Object.values(command.options ?? {})} doubleHardline>
        {option => (
          <>
            <Show when={!option.optional}>
              <IfStatement
                condition={code`!options${
                  option.name.includes("?")
                    ? `["${option.name}"]`
                    : `.${camelCase(option.name)}`
                }`}>
                {code`failures.push("Missing required ${option.name} option");`}
              </IfStatement>
              <Show
                when={
                  (option.kind === CommandParameterKinds.string ||
                    option.kind === CommandParameterKinds.number) &&
                  option.variadic
                }>
                <ElseIfClause
                  condition={code`options${
                    option.name.includes("?")
                      ? `["${option.name}"]`
                      : `.${camelCase(option.name)}`
                  }.length === 0`}>
                  {code`failures.push("No values were provided to the required ${
                    option.name
                  } array option");`}
                </ElseIfClause>
              </Show>
            </Show>
            <Show when={option.kind === CommandParameterKinds.number}>
              <Show
                when={(option as NumberCommandParameter).variadic}
                fallback={
                  <IfStatement
                    condition={code`options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    } && Number.isNaN(options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    })`}>
                    {code`failures.push("Invalid numeric value provided for the ${
                      option.name
                    } option");`}
                  </IfStatement>
                }>
                <IfStatement
                  condition={code`options${
                    option.name.includes("?")
                      ? `["${option.name}"]`
                      : `.${camelCase(option.name)}`
                  }.some(value => Number.isNaN(value))`}>
                  {code`failures.push("Invalid numeric value provided in the ${
                    option.name
                  } array option");`}
                </IfStatement>
              </Show>
            </Show>
            <Show
              when={
                (option.kind === CommandParameterKinds.string ||
                  option.kind === CommandParameterKinds.number) &&
                option.choices &&
                option.choices.length > 0
              }>
              <Show
                when={!option.variadic}
                fallback={
                  <ElseIfClause
                    condition={code`!options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    }.every(value => [${(
                      option as StringCommandParameter | NumberCommandParameter
                    ).choices
                      ?.map(choice =>
                        option.kind === CommandParameterKinds.string
                          ? `"${choice}"`
                          : choice
                      )
                      .join(", ")}].includes(value))`}>
                    {code`failures.push(\`Invalid value provided for the ${
                      option.name
                    } option - valid values include: ${list(
                      (
                        option as
                          | StringCommandParameter
                          | NumberCommandParameter
                      )?.choices?.map(choice => String(choice)) ?? []
                    )}; provided: \${options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    }}\`);`}
                  </ElseIfClause>
                }>
                <ElseIfClause
                  condition={code`![${(
                    option as StringCommandParameter | NumberCommandParameter
                  ).choices
                    ?.map(choice =>
                      option.kind === CommandParameterKinds.string
                        ? `"${choice}"`
                        : choice
                    )
                    .join(", ")}].includes(options${
                    option.name.includes("?")
                      ? `["${option.name}"]`
                      : `.${camelCase(option.name)}`
                  })`}>
                  {code`failures.push(\`Invalid value provided for the ${
                    option.name
                  } option - valid values include: ${list(
                    (
                      option as StringCommandParameter | NumberCommandParameter
                    )?.choices?.map(choice => String(choice)) ?? []
                  )}; provided: \${options${
                    option.name.includes("?")
                      ? `["${option.name}"]`
                      : `.${camelCase(option.name)}`
                  }}\`);`}
                </ElseIfClause>
              </Show>
            </Show>
          </>
        )}
      </For>
      <Spacing />
      <For each={command.args} doubleHardline>
        {argument => (
          <>
            <Show when={!argument.optional}>
              <IfStatement condition={code`!${camelCase(argument.name)}`}>
                {code`failures.push("Missing required \\"${
                  argument.name
                }\\" positional argument");`}
              </IfStatement>
              <Show
                when={
                  (argument.kind === CommandParameterKinds.string ||
                    argument.kind === CommandParameterKinds.number) &&
                  argument.variadic
                }>
                <ElseIfClause
                  condition={code`${camelCase(argument.name)}.length === 0`}>
                  {code`failures.push("No values were provided to the required ${
                    argument.name
                  } array positional argument");`}
                </ElseIfClause>
              </Show>
            </Show>
            <Show when={argument.kind === CommandParameterKinds.number}>
              <Show
                when={(argument as NumberCommandParameter).variadic}
                fallback={
                  <IfStatement
                    condition={code`${camelCase(
                      argument.name
                    )} && Number.isNaN(${camelCase(argument.name)})`}>
                    {code`failures.push("Invalid numeric value provided for the ${
                      argument.name
                    } positional argument");`}
                  </IfStatement>
                }>
                <IfStatement
                  condition={code`${camelCase(argument.name)}.some(value => Number.isNaN(value))`}>
                  {code`failures.push("Invalid numeric value provided in the ${
                    argument.name
                  } array positional argument");`}
                </IfStatement>
              </Show>
            </Show>
          </>
        )}
      </For>
    </>
  );
}
