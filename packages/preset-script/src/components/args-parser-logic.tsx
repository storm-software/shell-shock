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
  ElseClause,
  ElseIfClause,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";

import {
  getVariableCommandPathName,
  isVariableCommandPath
} from "@shell-shock/core/plugin-utils/context-helpers";
import type {
  BooleanCommandOption,
  CommandOption,
  CommandParam,
  CommandTree,
  CommandTreePath,
  NumberCommandOption,
  StringCommandOption
} from "@shell-shock/core/types/command";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { ScriptPresetContext } from "../types/plugin";

export function VariablePathsParserLogic(props: { path: CommandTreePath }) {
  const { path } = props;

  return (
    <For each={path.segments ?? []}>
      {(segment, index) => (
        <Show when={isVariableCommandPath(segment)}>
          <VarDeclaration
            let
            name={camelCase(getVariableCommandPathName(segment))}
            type="string | undefined"
            initializer={
              <Show
                when={isSetString(
                  path.variables[getVariableCommandPathName(segment)]?.default
                )}
                fallback={code`undefined;`}>
                {code` ?? "${
                  path.variables[getVariableCommandPathName(segment)]?.default
                }";`}
              </Show>
            }
          />
          <hbr />
          <IfStatement
            condition={code`args.length > ${2 + index} && args[${2 + index}]`}>
            {code`${camelCase(getVariableCommandPathName(segment))} = args[${2 + index}];`}
          </IfStatement>
          <hbr />
          <hbr />
          <Show
            when={
              !path.variables[getVariableCommandPathName(segment)]?.optional
            }>
            <IfStatement
              condition={code`!${camelCase(
                getVariableCommandPathName(segment)
              )}`}>
              {code`error(\`Missing required command path variable: "${getVariableCommandPathName(
                segment
              )}".\`);`}
              {code`return;`}
            </IfStatement>
          </Show>
          <hbr />
        </Show>
      )}
    </For>
  );
}

/**
 * The command parameter parser logic.
 */
export function ParamsParserLogic(props: { params: CommandParam[] }) {
  const { params } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <Show when={params && params.length > 0}>
      <For each={params ?? []} hardline>
        {param => (
          <VarDeclaration
            let
            name={camelCase(param.name)}
            type={param.variadic ? "string[]" : "string | undefined"}
            initializer={
              param.variadic ? (
                code`[]`
              ) : (
                <>
                  {code`env.${
                    context.config.envPrefix
                  }_${constantCase(param.name)}  ?? `}
                  <Show when={isSetString(param.default)}>
                    {code`"${param.default}"`}
                  </Show>
                  {code`undefined;`}
                </>
              )
            }
          />
        )}
      </For>
      <hbr />
      <VarDeclaration
        const
        name={"argsDiv"}
        type="number"
        initializer={code` args.findIndex(arg => arg === "--");`}
      />
      <hbr />
      <IfStatement condition={code`argsDiv !== -1`}>
        <For each={params ?? []} hardline>
          {(param, index) => (
            <>
              <IfStatement
                condition={code`args.length > argsDiv + ${index + 1} && args[argsDiv + ${index + 1}]`}>
                <Show
                  when={param.variadic}
                  fallback={code`${camelCase(param.name)} = args[argsDiv + ${index + 1}];`}>{code`${camelCase(param.name)}.push(args[argsDiv + ${index + 1}]);`}</Show>
              </IfStatement>
              <hbr />
              <Show when={!param.optional}>
                <Show
                  when={!param.default}
                  fallback={
                    <ElseClause>
                      {code`${camelCase(param.name)} = "${param.default}";`}
                    </ElseClause>
                  }>
                  <ElseClause>
                    {code`error(\`Missing required command parameter: "${param.name}".\`);`}
                    {code`return;`}
                  </ElseClause>
                </Show>
              </Show>
              <hbr />
            </>
          )}
        </For>
      </IfStatement>
    </Show>
  );
}

/**
 * The command option interface property.
 */
export function OptionsMember({
  name,
  option
}: {
  name: string;
  option: CommandOption;
}) {
  const doc = option.description || `The ${option.title} command option.`;

  return (
    <>
      <Show when={option.kind === ReflectionKind.string}>
        <InterfaceMember
          name={name}
          doc={doc}
          type={
            (option as StringCommandOption).variadic ? "string[]" : "string"
          }
          optional={option.optional}
        />
      </Show>
      <Show when={option.kind === ReflectionKind.number}>
        <InterfaceMember
          name={name}
          doc={doc}
          type={
            (option as NumberCommandOption).variadic ? "number[]" : "number"
          }
          optional={option.optional}
        />
      </Show>
      <Show when={option.kind === ReflectionKind.boolean}>
        <InterfaceMember
          name={name}
          doc={doc}
          type="boolean"
          optional={option.optional}
        />
        <Show when={Boolean((option as BooleanCommandOption).isNegativeOf)}>
          <hbr />
          <InterfaceMember
            name={(option as BooleanCommandOption).isNegativeOf!}
            doc={doc}
            type="boolean"
            optional={option.optional}
          />
        </Show>
      </Show>
      <Show when={option.alias && option.alias.length > 0}>
        <hbr />
        <For each={option.alias ?? []} hardline>
          {alias => (
            <OptionsMember
              name={alias}
              option={{
                ...option,
                alias: [],
                description: `${doc.replace(
                  /\.+$/,
                  ""
                )}. This property is an alias for ${name}.`
              }}
            />
          )}
        </For>
      </Show>
    </>
  );
}

/**
 * The command option property parser logic.
 */
export function OptionsMemberParserLogic({
  name,
  option
}: {
  name: string;
  option: CommandOption;
}) {
  const context = usePowerlines<ScriptPresetContext>();

  const equalsRegex = `/^--?(${
    context?.config.isCaseSensitive && name.length > 1
      ? name
      : name.toLowerCase()
  }${option.alias && option.alias.length > 0 ? "|" : ""}${option.alias
    ?.map(a =>
      (context?.config.isCaseSensitive && name.length > 1
        ? a
        : a.toLowerCase()) === "?"
        ? "\\?"
        : context?.config.isCaseSensitive && name.length > 1
          ? a
          : a.toLowerCase()
    )
    .join("|")})=/`;

  return (
    <>
      <Show
        when={
          option.kind === ReflectionKind.string ||
          option.kind === ReflectionKind.number
        }>
        <Show
          when={(option as StringCommandOption | NumberCommandOption).variadic}>
          <Show
            when={name.includes("?") || name.includes("-")}
            fallback={code`options.${name} ??= []; `}>
            {code`options["${name}"] ??= []; `}
          </Show>
          <hbr />
          <IfStatement condition={`${equalsRegex}.test(arg)`}>
            <Show
              when={name.includes("?") || name.includes("-")}
              fallback={code`options.${name}.push(`}>
              {code`options["${name}"].push(`}
            </Show>
            <Show when={option.kind === ReflectionKind.string}>
              {code`...arg.replace(${equalsRegex}, "").split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean) `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              {code`...arg.replace(${equalsRegex}, "").split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean).map(Number).filter(value => !Number.isNaN(value)) `}
            </Show>
            {code`); `}
          </IfStatement>
          <ElseIfClause condition={`args.length > i + 1`}>
            <Show
              when={name.includes("?") || name.includes("-")}
              fallback={code`options.${name}.push(`}>
              {code`options["${name}"].push(`}
            </Show>
            <Show when={option.kind === ReflectionKind.string}>
              {code`...args[++i].split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean) `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              {code`...args[++i].split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean).map(Number).filter(value => !Number.isNaN(value)) `}
            </Show>
            {code`); `}
          </ElseIfClause>
        </Show>
        <Show
          when={
            !(option as StringCommandOption | NumberCommandOption).variadic
          }>
          <IfStatement condition={`${equalsRegex}.test(arg)`}>
            <Show when={option.kind === ReflectionKind.string}>
              <Show
                when={name.includes("?") || name.includes("-")}
                fallback={code`options.${name}`}>
                {code`options["${name}"]`}
              </Show>
              {code` = arg.replace(${equalsRegex}, "").trim().replace(/^("|')/, "").replace(/("|')$/, ""); `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              <VarDeclaration
                const
                name="value"
                initializer={code` Number(arg.replace(${equalsRegex}, "").trim().replace(/^("|')/, "").replace(/("|')$/, "")); `}
              />
              <hbr />
              <IfStatement condition={`!Number.isNaN(value)`}>
                <Show
                  when={name.includes("?") || name.includes("-")}
                  fallback={code`options.${name}`}>
                  {code`options["${name}"]`}
                </Show>
                {code` = value; `}
              </IfStatement>
              <ElseClause>
                {code`warn(\`Invalid value provided for the ${option.title} option: "\${value}" is not a valid number.\`); `}
              </ElseClause>
            </Show>
          </IfStatement>
          <ElseIfClause condition={`args.length > i + 1`}>
            <Show when={option.kind === ReflectionKind.string}>
              <Show
                when={name.includes("?") || name.includes("-")}
                fallback={code`options.${name}`}>
                {code`options["${name}"]`}
              </Show>
              {code` = args[++i].trim().replace(/^("|')/, "").replace(/("|')$/, ""); `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              <VarDeclaration
                const
                name="value"
                initializer={code` Number(args[++i].trim().replace(/^("|')/, "").replace(/("|')$/, "")); `}
              />
              <hbr />
              <IfStatement condition={`!Number.isNaN(value)`}>
                <Show
                  when={name.includes("?") || name.includes("-")}
                  fallback={code`options.${name}`}>
                  {code`options["${name}"]`}
                </Show>
                {code` = value; `}
              </IfStatement>
              <ElseClause>
                {code`warn(\`Invalid value provided for the ${option.title} option: "\${value}" is not a valid number.\`); `}
              </ElseClause>
            </Show>
          </ElseIfClause>
          <hbr />
        </Show>
      </Show>
      <Show when={option.kind === ReflectionKind.boolean}>
        <IfStatement condition={`${equalsRegex}.test(arg)`}>
          <VarDeclaration
            const
            name="value"
            initializer={code` arg.replace(${equalsRegex}, "").trim().replace(/^("|')/, "").replace(/("|')$/, "").toLowerCase(); `}
          />
          <hbr />
          <Show
            when={name.includes("?") || name.includes("-")}
            fallback={code`options.${name}`}>
            {code`options["${name}"]`}
          </Show>
          {code` = value !== "false" && value !== "f" && value !== "no" && value !== "n" && value !== "0"; `}
        </IfStatement>
        <ElseClause>
          <Show
            when={name.includes("?") || name.includes("-")}
            fallback={code`options.${name} = true; `}>
            {code`options["${name}"] = true; `}
          </Show>
        </ElseClause>
        <Show when={Boolean((option as BooleanCommandOption).isNegativeOf)}>
          <hbr />
          <Show
            when={
              (option as BooleanCommandOption).isNegativeOf!.includes("?") ||
              (option as BooleanCommandOption).isNegativeOf!.includes("-")
            }
            fallback={code`options.${(option as BooleanCommandOption).isNegativeOf} = false; `}>
            {code`options["${(option as BooleanCommandOption).isNegativeOf}"] = false; `}
          </Show>
        </Show>
      </Show>
      <Show when={option.alias && option.alias.length > 0}>
        <hbr />
        <For each={option.alias ?? []} hardline>
          {alias => (
            <>
              <Show
                when={alias.includes("?") || alias.includes("-")}
                fallback={code`options.${alias} `}>
                {code`options["${alias}"] `}
              </Show>
              <Show
                when={name.includes("?") || name.includes("-")}
                fallback={code` = options.${name}; `}>
                {code` = options["${name}"]; `}
              </Show>
            </>
          )}
        </For>
      </Show>
    </>
  );
}

function OptionsMemberParserCondition(props: {
  name: string;
  alias?: string[];
}) {
  const { name, alias } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      {code`arg.startsWith("--${
        context?.config.isCaseSensitive ? name : name.toLowerCase()
      }=") || arg === "--${
        context?.config.isCaseSensitive ? name : name.toLowerCase()
      }" || arg.startsWith("-${name}=") || arg === "-${name}"`}
      <Show when={alias && alias.length > 0}>
        <For each={alias ?? []}>
          {a =>
            code` || arg.startsWith("--${
              context?.config.isCaseSensitive ? a : a.toLowerCase()
            }=") || arg === "--${
              context?.config.isCaseSensitive ? a : a.toLowerCase()
            }" || arg.startsWith("-${a}=") || arg === "-${a}"`
          }
        </For>
      </Show>
    </>
  );
}

export function OptionsInterfaceDeclaration(props: { command: CommandTree }) {
  const { command } = props;

  return (
    <InterfaceDeclaration export name={`${pascalCase(command.name)}Options`}>
      <For each={Object.entries(command.options)}>
        {([name, option]) => <OptionsMember name={name} option={option} />}
      </For>
    </InterfaceDeclaration>
  );
}

/**
 * The command options parser logic.
 */
export function OptionsParserLogic(props: { command: CommandTree }) {
  const { command } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <VarDeclaration
        const
        name="options"
        initializer={code` {
          ${Object.entries(command.options)
            .map(([name, option]) => {
              if (option.kind === ReflectionKind.string) {
                return ` ${name.includes("?") || name.includes("-") ? `"${name}"` : `${name}`}: ${
                  option.env
                    ? `env.${context.config.envPrefix}_${option.env}`
                    : ""
                }${
                  option.variadic
                    ? option.default !== undefined
                      ? `${
                          option.env ? " ?? " : ""
                        }${JSON.stringify(option.default)}`
                      : option.env
                        ? " ?? []"
                        : ""
                    : option.default !== undefined
                      ? `${option.env ? " ?? " : ""}"${option.default}"`
                      : ""
                }, `;
              } else if (option.kind === ReflectionKind.number) {
                return ` ${name.includes("?") || name.includes("-") ? `"${name}"` : `${name}`}: ${
                  option.env
                    ? `env.${context.config.envPrefix}_${option.env}`
                    : ""
                }${
                  option.variadic
                    ? option.default !== undefined
                      ? `${
                          option.env ? " ?? " : ""
                        }${JSON.stringify(option.default)}`
                      : option.env
                        ? " ?? []"
                        : ""
                    : option.default !== undefined
                      ? `${option.env ? " ?? " : ""}${option.default}`
                      : ""
                }, `;
              } else if (option.kind === ReflectionKind.boolean) {
                return ` ${name.includes("?") || name.includes("-") ? `"${name}"` : `${name}`}: ${
                  option.env
                    ? `env.${context.config.envPrefix}_${option.env} ?? `
                    : ""
                }${option.default ? "true" : "false"},`;
              }

              return "";
            })
            .join("")}
          } as ${pascalCase(command.name)}Options;`}
      />
      <hbr />
      <hbr />
      {code`for (let i = 0; i < args.slice(${
        command.path.segments.filter(segment => isVariableCommandPath(segment))
          .length
      }).length; i++) { `}
      <hbr />
      <VarDeclaration
        const
        name="arg"
        type="string"
        initializer={code` args[i].length > 3 && args[i].startsWith("--")
          ? \`--\${args[i].slice(2).replaceAll("-", "")${
            context?.config.isCaseSensitive ? "" : ".toLowerCase()"
          }}\`
          : args[i].length > 2 && args[i].startsWith("-")
            ? \`-\${args[i].slice(1).replaceAll("-", "")}\`
          : args[i]; `}
      />
      <hbr />
      <For each={Object.entries(command.options)} hardline>
        {([name, option], i) => (
          <Show
            when={i === 0}
            fallback={
              <ElseIfClause
                condition={
                  <OptionsMemberParserCondition
                    name={name}
                    alias={option.alias}
                  />
                }>
                <OptionsMemberParserLogic name={name} option={option} />
              </ElseIfClause>
            }>
            <IfStatement
              condition={
                <OptionsMemberParserCondition
                  name={name}
                  alias={option.alias}
                />
              }>
              <OptionsMemberParserLogic name={name} option={option} />
            </IfStatement>
          </Show>
        )}
      </For>
      <hbr />
      {code` } `}
      <hbr />
    </>
  );
}
