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
  ElseClause,
  ElseIfClause,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { computedOptions } from "../contexts/options";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type {
  BooleanCommandOption,
  CommandOption,
  CommandTree,
  NumberCommandOption,
  StringCommandOption
} from "../types/command";
import { BooleanInputParserLogic } from "./helpers";

export interface DynamicSegmentsParserLogicProps {
  /**
   * The command to generate the dynamic path segments parser logic for. This is used to access the command options and parameters when generating the parser logic for dynamic path segments.
   */
  command: CommandTree;

  /**
   * Whether the command options should be parsed in a case-sensitive manner. This will affect how the generated code compares command-line arguments to option names and aliases.
   */
  isCaseSensitive: boolean;
}

export function DynamicSegmentsParserLogic(
  props: DynamicSegmentsParserLogicProps
) {
  const { command } = props;

  return (
    <For each={command.segments ?? []}>
      {(segment, index) => (
        <Show when={isDynamicPathSegment(segment)}>
          <VarDeclaration
            let
            name={camelCase(getDynamicPathSegmentName(segment))}
            type="string | undefined"
          />
          <hbr />
          <IfStatement
            condition={code`args.length > ${2 + index} && args[${2 + index}]`}>
            {code`${camelCase(
              getDynamicPathSegmentName(segment)
            )} = args[${2 + index}];`}
          </IfStatement>
          <hbr />
          <hbr />
        </Show>
      )}
    </For>
  );
}

export interface ArgumentsParserLogicProps {
  /**
   * The command to generate the positional parameters parser logic for.
   */
  command: CommandTree;

  /**
   * The environment variable prefix to use for options that have an associated environment variable. This prefix will be used in the generated code to access the environment variables (e.g., `env.${envPrefix}_OPTION_NAME`).
   */
  envPrefix: string;

  /**
   * Whether the command options should be parsed in a case-sensitive manner. This will affect how the generated code compares command-line arguments to option names and aliases.
   */
  isCaseSensitive: boolean;
}

export function ArgumentsParserLogic(props: ArgumentsParserLogicProps) {
  const { command, envPrefix, isCaseSensitive } = props;

  return (
    <Show when={command.arguments && command.arguments.length > 0}>
      <VarDeclaration
        let
        name="optionsIndex"
        type="number"
        initializer={code`Math.max(0, args.slice(${command.segments.length + 1}).findIndex(arg => arg.startsWith("-") && /^(${Object.values(
          command.options ?? {}
        )
          .map(
            option =>
              `${
                isCaseSensitive || option.name.length === 1
                  ? option.name
                  : option.name
                      .toLowerCase()
                      .replaceAll("-", "")
                      .replaceAll("_", "")
              }${option.alias && option.alias.length > 0 ? "|" : ""}${option.alias
                ?.map(a =>
                  (isCaseSensitive || option.name.length === 1
                    ? a
                    : a
                        .toLowerCase()
                        .replaceAll("-", "")
                        .replaceAll("_", "")) === "?"
                    ? "\\?"
                    : isCaseSensitive || option.name.length === 1
                      ? a
                      : a.toLowerCase().replaceAll("-", "").replaceAll("_", "")
                )
                .join("|")}`
          )
          .join("|")})=?.*$/.test(arg${
          isCaseSensitive
            ? ""
            : '.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
        }))) + ${command.segments.length + 1};`}
      />
      <hbr />
      <hbr />
      <VarDeclaration
        let
        name="argsIndex"
        type="number"
        initializer={code`optionsIndex > ${
          command.segments.length + 1
        } ? ${command.segments.length + 1} : (Math.max(0, args.slice(optionsIndex).findLastIndex(arg => arg.startsWith("-") && /^(${Object.values(
          command.options ?? {}
        )
          .map(
            option =>
              `${
                isCaseSensitive || option.name.length === 1
                  ? option.name
                  : option.name
                      .toLowerCase()
                      .replaceAll("-", "")
                      .replaceAll("_", "")
              }${option.alias && option.alias.length > 0 ? "|" : ""}${option.alias
                ?.map(a =>
                  (isCaseSensitive || option.name.length === 1
                    ? a
                    : a
                        .toLowerCase()
                        .replaceAll("-", "")
                        .replaceAll("_", "")) === "?"
                    ? "\\?"
                    : isCaseSensitive || option.name.length === 1
                      ? a
                      : a.toLowerCase().replaceAll("-", "").replaceAll("_", "")
                )
                .join("|")}`
          )
          .join("|")})=?.*$/.test(arg${
          isCaseSensitive
            ? ""
            : '.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
        }))) + ${command.segments.length + 1});`}
      />
      <hbr />
      <hbr />
      <For each={command.arguments ?? []} hardline>
        {(arg, index) => (
          <>
            <VarDeclaration
              let
              name={camelCase(arg.name)}
              type={`${
                arg.kind === ReflectionKind.boolean
                  ? "boolean"
                  : arg.kind === ReflectionKind.number
                    ? "number"
                    : "string"
              }${
                (arg.kind === ReflectionKind.string ||
                  arg.kind === ReflectionKind.number) &&
                arg.variadic
                  ? "[]"
                  : ""
              }${arg.optional ? " | undefined" : ""}`}
              initializer={
                <>
                  <Show when={isSetString(arg.env)}>
                    {code`env.${envPrefix}_${constantCase(String(arg.env))} ?? `}
                  </Show>
                  <Show
                    when={arg.default !== undefined}
                    fallback={
                      (arg.kind === ReflectionKind.string ||
                        arg.kind === ReflectionKind.number) &&
                      arg.variadic
                        ? code`[]`
                        : code`undefined;`
                    }>
                    {arg.kind === ReflectionKind.string
                      ? code`"${arg.default}"`
                      : code`${arg.default}`}
                  </Show>
                </>
              }
            />
            <hbr />
            <hbr />
            <IfStatement
              condition={code`argsIndex + ${index} < args.length && argsIndex + ${index} !== optionsIndex`}>
              {code`${camelCase(arg.name)} = `}
              <Show
                when={
                  arg.kind === ReflectionKind.string ||
                  arg.kind === ReflectionKind.number
                }
                fallback={
                  <BooleanInputParserLogic
                    name={`args[argsIndex + ${index}] `}
                  />
                }>
                <Show
                  when={
                    (arg.kind === ReflectionKind.string ||
                      arg.kind === ReflectionKind.number) &&
                    arg.variadic
                  }
                  fallback={
                    <Show
                      when={arg.kind === ReflectionKind.number}
                      fallback={code`args[argsIndex + ${index}]; `}>
                      {code`Number(args[argsIndex + ${index}]); `}
                    </Show>
                  }>
                  {code`args.slice(argsIndex + ${
                    index
                  }, (optionsIndex > argsIndex ? optionsIndex : args.length) - ${
                    command.arguments.length - index
                  }).join(" ").split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean)`}
                </Show>
              </Show>
            </IfStatement>
            <hbr />
            <hbr />
          </>
        )}
      </For>
    </Show>
  );
}

/**
 * The command option interface property.
 */
export function OptionsMember({ option }: { option: CommandOption }) {
  const doc = option.description || `The ${option.title} command option.`;

  return (
    <>
      <Show when={Boolean(option.name)}>
        <Show when={option.kind === ReflectionKind.string}>
          <InterfaceMember
            name={option.name}
            doc={doc}
            type={
              (option as StringCommandOption).variadic ? "string[]" : "string"
            }
            optional={option.optional}
          />
        </Show>
        <Show when={option.kind === ReflectionKind.number}>
          <InterfaceMember
            name={option.name}
            doc={doc}
            type={
              (option as NumberCommandOption).variadic ? "number[]" : "number"
            }
            optional={option.optional}
          />
        </Show>
        <Show when={option.kind === ReflectionKind.boolean}>
          <InterfaceMember
            name={option.name}
            doc={doc}
            type="boolean"
            optional={option.optional}
          />
        </Show>
      </Show>
    </>
  );
}

export interface OptionsMemberParserLogicProps {
  /**
   * The option name to generate the parser logic for.
   */
  name: string;

  /**
   * The command option to generate the parser logic for.
   */
  option: CommandOption;

  /**
   * Whether the command options should be parsed in a case-sensitive manner. This will affect how the generated code compares command-line arguments to option names and aliases.
   *
   * @defaultValue false
   */
  isCaseSensitive: boolean;
}

/**
 * The command option property parser logic.
 */
export function OptionsMemberParserLogic(props: OptionsMemberParserLogicProps) {
  const { name, option, isCaseSensitive } = props;

  const equalsRegex = `/^--?(${
    isCaseSensitive || name.length === 1
      ? name
      : name.toLowerCase().replaceAll("-", "").replaceAll("_", "")
  }${option.alias && option.alias.length > 0 ? "|" : ""}${option.alias
    ?.map(a =>
      (isCaseSensitive || name.length === 1
        ? a
        : a.toLowerCase().replaceAll("-", "").replaceAll("_", "")) === "?"
        ? "\\?"
        : isCaseSensitive || name.length === 1
          ? a
          : a.toLowerCase().replaceAll("-", "").replaceAll("_", "")
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
          <IfStatement
            condition={`${equalsRegex}.test(${
              isCaseSensitive
                ? "arg"
                : '"-" + arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
            })`}>
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
          <IfStatement
            condition={`${equalsRegex}.test(${isCaseSensitive ? "arg" : '"-" + arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'})`}>
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
            </Show>
          </ElseIfClause>
          <hbr />
        </Show>
      </Show>
      <Show when={option.kind === ReflectionKind.boolean}>
        <IfStatement
          condition={`${equalsRegex}.test(${isCaseSensitive ? "arg" : '"-" + arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'})`}>
          <VarDeclaration
            const
            name="value"
            initializer={code` arg.replace(${equalsRegex}, "").trim().replace(/^("|')/, "").replace(/("|')$/, "").toLowerCase(); `}
          />
          <hbr />
          <Show
            when={name.includes("?") || name.includes("-")}
            fallback={code`options.${name} = `}>
            {code`options["${name}"] = `}
          </Show>
          <BooleanInputParserLogic name="value" />
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
    </>
  );
}

export interface OptionsMemberParserConditionProps {
  /**
   * The option name to generate the parser logic for.
   */
  name: string;

  /**
   * Aliases for the option, which will also be parsed in the generated code. This will affect how the generated code compares command line arguments to option names and aliases.
   */
  alias?: string[];

  /**
   * Whether the command options should be parsed in a case-sensitive manner. This will affect how the generated code compares command line arguments to option names and aliases.
   *
   * @defaultValue false
   */
  isCaseSensitive: boolean;
}

export function OptionsMemberParserCondition(
  props: OptionsMemberParserConditionProps
) {
  const { name, alias: aliasProp, isCaseSensitive } = props;

  return (
    <>
      {code`${
        isCaseSensitive
          ? 'arg.startsWith("--'
          : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "").startsWith("'
      }${isCaseSensitive ? name : name.toLowerCase().replaceAll("-", "").replaceAll("_", "")}=") || ${
        isCaseSensitive
          ? "arg"
          : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
      } === "${
        isCaseSensitive
          ? name
          : name.toLowerCase().replaceAll("-", "").replaceAll("_", "")
      }" || ${
        isCaseSensitive
          ? 'arg.startsWith("-'
          : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "").startsWith("'
      }${isCaseSensitive ? name : name.toLowerCase().replaceAll("-", "").replaceAll("_", "")}=") || ${
        isCaseSensitive
          ? "arg"
          : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
      } === "${
        isCaseSensitive
          ? name
          : name.toLowerCase().replaceAll("-", "").replaceAll("_", "")
      }"`}
      <Show when={aliasProp && aliasProp.length > 0}>
        <For each={aliasProp ?? []}>
          {alias =>
            code` || ${
              isCaseSensitive || alias.length === 1
                ? 'arg.startsWith("--'
                : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "").startsWith("'
            }${isCaseSensitive || alias.length === 1 ? alias : alias.toLowerCase().replaceAll("-", "").replaceAll("_", "")}=") || ${
              isCaseSensitive || alias.length === 1
                ? "arg"
                : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
            } === "${
              isCaseSensitive || alias.length === 1
                ? alias
                : alias.toLowerCase().replaceAll("-", "").replaceAll("_", "")
            }" || ${
              isCaseSensitive || alias.length === 1
                ? 'arg.startsWith("-'
                : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "").startsWith("'
            }${isCaseSensitive || alias.length === 1 ? alias : alias.toLowerCase().replaceAll("-", "").replaceAll("_", "")}=") || ${
              isCaseSensitive || alias.length === 1
                ? "arg"
                : 'arg.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
            } === "${
              isCaseSensitive || alias.length === 1
                ? alias
                : alias.toLowerCase().replaceAll("-", "").replaceAll("_", "")
            }"`
          }
        </For>
      </Show>
    </>
  );
}

export function OptionsInterfaceDeclaration(props: { command: CommandTree }) {
  const { command } = props;

  const options = computed(() => computedOptions(command));

  return (
    <InterfaceDeclaration export name={`${pascalCase(command.name)}Options`}>
      <For each={Object.values(options.value)} hardline>
        {option => <OptionsMember option={option} />}
      </For>
    </InterfaceDeclaration>
  );
}

export interface OptionsParserLogicProps {
  /**
   * The command to generate the options parser logic for.
   */
  command: CommandTree;

  /**
   * The environment variable prefix to use for options that have an associated environment variable. This prefix will be used in the generated code to access the environment variables (e.g., `env.${envPrefix}_OPTION_NAME`).
   */
  envPrefix: string;

  /**
   * Whether the command options should be parsed in a case-sensitive manner. This will affect how the generated code compares command-line arguments to option names and aliases.
   *
   * @defaultValue false
   */
  isCaseSensitive?: boolean;
}

/**
 * The command options parser logic.
 */
export function OptionsParserLogic(props: OptionsParserLogicProps) {
  const { command, envPrefix, isCaseSensitive = false } = props;

  const options = computed(() => computedOptions(command));

  return (
    <>
      <VarDeclaration
        const
        name="options"
        initializer={code` {
          ${Object.entries(options.value)
            .map(([name, option]) => {
              if (option.kind === ReflectionKind.string) {
                return ` ${name.includes("?") || name.includes("-") ? `"${name}"` : `${name}`}: ${
                  option.env ? `env.${envPrefix}_${option.env}` : ""
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
                  option.env ? `env.${envPrefix}_${option.env}` : ""
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
                  option.env ? `env.${envPrefix}_${option.env} ?? ` : ""
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
        command.segments.filter(segment => isDynamicPathSegment(segment)).length
      }).length; i++) { `}
      <hbr />
      <VarDeclaration
        const
        name="arg"
        type="string"
        initializer={code` args[i].length > 3 && args[i].startsWith("--")
          ? \`--\${args[i].slice(2).replaceAll("-", "")${
            isCaseSensitive
              ? ""
              : '.toLowerCase().replaceAll("-", "").replaceAll("_", "")'
          }}\`
          : args[i].length > 2 && args[i].startsWith("-")
            ? \`-\${args[i].slice(1).replaceAll("-", "")}\`
          : args[i]; `}
      />
      <hbr />

      <For each={Object.entries(options.value)} hardline>
        {([name, option], i) => (
          <Show
            when={i === 0}
            fallback={
              <ElseIfClause
                condition={
                  <>
                    <OptionsMemberParserCondition
                      name={name}
                      alias={option.alias}
                      isCaseSensitive={isCaseSensitive}
                    />
                  </>
                }>
                <OptionsMemberParserLogic
                  name={name}
                  option={option}
                  isCaseSensitive={isCaseSensitive}
                />
              </ElseIfClause>
            }>
            <IfStatement
              condition={
                <OptionsMemberParserCondition
                  name={name}
                  alias={option.alias}
                  isCaseSensitive={isCaseSensitive}
                />
              }>
              <OptionsMemberParserLogic
                name={name}
                option={option}
                isCaseSensitive={isCaseSensitive}
              />
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

export interface CommandParserLogicProps {
  /**
   * The command to generate the parser logic for.
   */
  command: CommandTree;

  /**
   * The environment variable prefix to use for options that have an associated environment variable. This prefix will be used in the generated code to access the environment variables (e.g., `env.${envPrefix}_OPTION_NAME`).
   */
  envPrefix: string;

  /**
   * Whether the command options should be parsed in a case-sensitive manner. This will affect how the generated code compares command-line arguments to option names and aliases.
   *
   * @defaultValue false
   */
  isCaseSensitive?: boolean;
}

/**
 * The command parser logic, which includes parsing dynamic path segments, positional parameters, and options.
 */
export function CommandParserLogic(props: CommandParserLogicProps) {
  const { command, envPrefix, isCaseSensitive = false } = props;

  return (
    <>
      <DynamicSegmentsParserLogic
        command={command}
        isCaseSensitive={isCaseSensitive}
      />
      <hbr />
      <hbr />
      <OptionsParserLogic
        command={command}
        envPrefix={envPrefix}
        isCaseSensitive={isCaseSensitive}
      />
      <hbr />
      <hbr />
      <ArgumentsParserLogic
        command={command}
        envPrefix={envPrefix}
        isCaseSensitive={isCaseSensitive}
      />
      <hbr />
      <hbr />
    </>
  );
}
