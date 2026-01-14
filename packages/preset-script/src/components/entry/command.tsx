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
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { TypescriptFileImports } from "@powerlines/plugin-alloy/types/components";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import {
  TSDoc,
  TSDocExample,
  TSDocParam,
  TSDocRemarks,
  TSDocTitle
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
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
import { toArray } from "@stryke/convert/to-array";
import { appendPath } from "@stryke/path/append";
import { findFilePath, relativePath } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
import { replaceExtension } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { ScriptPresetContext } from "../../types/plugin";
import { CommandRouter } from "../command-router";

export function CommandVariablePathsParser(props: { path: CommandTreePath }) {
  const { path } = props;

  return (
    <For each={path.segments ?? []}>
      {(segment, index) => (
        <Show when={isVariableCommandPath(segment)}>
          <VarDeclaration
            let
            name={camelCase(getVariableCommandPathName(segment))}
            type="string | undefined"
          />
          <hbr />
          <IfStatement
            condition={code`args.length > ${2 + index} && args[${2 + index}]`}>
            {code`${camelCase(getVariableCommandPathName(segment))} = args[${2 + index}];`}
          </IfStatement>
          <Show
            when={
              !path.variables[getVariableCommandPathName(segment)]?.optional
            }>
            <Show
              when={
                !path.variables[getVariableCommandPathName(segment)]?.default
              }
              fallback={
                <ElseClause>
                  {code`${camelCase(getVariableCommandPathName(segment))} = "${
                    path.variables[getVariableCommandPathName(segment)]?.default
                  }";`}
                </ElseClause>
              }>
              <ElseClause>
                {code`error(\`Missing required command path variable: "${getVariableCommandPathName(
                  segment
                )}".\`);`}
                {code`return;`}
              </ElseClause>
            </Show>
          </Show>
          <hbr />
        </Show>
      )}
    </For>
  );
}

export function CommandParamsParser(props: { params: CommandParam[] }) {
  const { params } = props;

  return (
    <Show when={params && params.length > 0}>
      <VarDeclaration
        const
        name={"argsDiv"}
        type="number"
        initializer={code` args.findIndex(arg => arg === "--");`}
      />
      <hbr />
      <IfStatement condition={code`argsDiv !== -1`}>
        <For each={params ?? []}>
          {(param, index) => (
            <>
              <VarDeclaration
                let
                name={camelCase(param.name)}
                type={param.variadic ? "string[]" : "string | undefined"}
                initializer={param.variadic ? code` [];` : undefined}
              />
              <hbr />
              <IfStatement
                condition={code`args.length > argsDiv + ${index + 1} && args[argsDiv + ${index + 1}]`}>
                <Show
                  when={param.variadic}
                  fallback={code`${camelCase(param.name)} = args[argsDiv + ${index + 1}];`}>{code`${camelCase(param.name)}.push(args[argsDiv + ${index + 1}]);`}</Show>
              </IfStatement>
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
export function CommandOptionsMember({
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
            <CommandOptionsMember
              name={alias}
              option={{
                ...option,
                alias: [],
                description: `${doc}. This property is an alias for ${name}.`
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
export function CommandOptionsMemberParser({
  name,
  option
}: {
  name: string;
  option: CommandOption;
}) {
  const context = usePowerlines<ScriptPresetContext>();

  const equalsRegex = `/^--?(${
    context?.config.isCaseSensitive ? name : name.toLowerCase()
  }${option.alias && option.alias.length > 0 ? "|" : ""}${option.alias
    ?.map(a =>
      (context?.config.isCaseSensitive ? a : a.toLowerCase()) === "?"
        ? "\\?"
        : context?.config.isCaseSensitive
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
          {code`options["${name}"] ??= []; `}
          <hbr />
          <IfStatement condition={`${equalsRegex}.test(arg)`}>
            {code`options["${name}"].push(`}
            <Show when={option.kind === ReflectionKind.string}>
              {code`...arg.replace(${equalsRegex}, "").split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean) `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              {code`...arg.replace(${equalsRegex}, "").split(",").map(item => item.trim().replace(/^("|')/, "").replace(/("|')$/, "")).filter(Boolean).map(Number).filter(value => !Number.isNaN(value)) `}
            </Show>
            {code`); `}
          </IfStatement>
          <ElseIfClause condition={`args.length > i + 1`}>
            {code`options["${name}"].push(`}
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
              {code`options["${name}"] = arg.replace(${equalsRegex}, "").trim().replace(/^("|')/, "").replace(/("|')$/, ""); `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              <VarDeclaration
                const
                name="value"
                initializer={code` Number(arg.replace(${equalsRegex}, "").trim().replace(/^("|')/, "").replace(/("|')$/, "")); `}
              />
              <hbr />
              <IfStatement condition={`!Number.isNaN(value)`}>
                {code`options["${name}"] = value; `}
              </IfStatement>
              <ElseClause>
                {code`warn(\`Invalid value provided for the ${option.title} option: "\${value}" is not a valid number.\`); `}
              </ElseClause>
            </Show>
          </IfStatement>
          <ElseIfClause condition={`args.length > i + 1`}>
            <Show when={option.kind === ReflectionKind.string}>
              {code`options["${name}"] = args[++i].trim().replace(/^("|')/, "").replace(/("|')$/, ""); `}
            </Show>
            <Show when={option.kind === ReflectionKind.number}>
              <VarDeclaration
                const
                name="value"
                initializer={code` Number(args[++i].trim().replace(/^("|')/, "").replace(/("|')$/, "")); `}
              />
              <hbr />
              <IfStatement condition={`!Number.isNaN(value)`}>
                {code`options["${name}"] = value; `}
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
          {code`options["${name}"] = value !== "false" && value !== "f" && value !== "no" && value !== "n" && value !== "0"; `}
        </IfStatement>
        <ElseClause>{code`options["${name}"] = true; `}</ElseClause>
        <Show when={Boolean((option as BooleanCommandOption).isNegativeOf)}>
          <hbr />
          {code`options["${(option as BooleanCommandOption).isNegativeOf}"] = false; `}
        </Show>
      </Show>
      <Show when={option.alias && option.alias.length > 0}>
        <hbr />
        <For each={option.alias ?? []} hardline>
          {alias => code`options["${alias}"] = options["${name}"]; `}
        </For>
      </Show>
    </>
  );
}

export function CommandOptionsMemberParserCondition(props: {
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
      }" || arg.startsWith("-${
        context?.config.isCaseSensitive ? name : name.toLowerCase()
      }=") || arg === "--${
        context?.config.isCaseSensitive ? name : name.toLowerCase()
      }"`}
      <Show when={alias && alias.length > 0}>
        <For each={alias ?? []}>
          {a =>
            code` || arg.startsWith("--${
              context?.config.isCaseSensitive ? a : a.toLowerCase()
            }=") || arg === "--${
              context?.config.isCaseSensitive ? a : a.toLowerCase()
            }" || arg.startsWith("-${
              context?.config.isCaseSensitive ? a : a.toLowerCase()
            }=") || arg === "-${
              context?.config.isCaseSensitive ? a : a.toLowerCase()
            }"`
          }
        </For>
      </Show>
    </>
  );
}

export function CommandOptionsParser(props: { command: CommandTree }) {
  const { command } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <VarDeclaration
        const
        name="options"
        type={`${pascalCase(command.name)}Options`}
        initializer={code` {} as ${pascalCase(command.name)}Options;`}
      />
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
            ? \`-\${args[i].slice(1).replaceAll("-", "")${
              context?.config.isCaseSensitive ? "" : ".toLowerCase()"
            }}\`
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
                  <CommandOptionsMemberParserCondition
                    name={name}
                    alias={option.alias}
                  />
                }>
                <CommandOptionsMemberParser name={name} option={option} />
              </ElseIfClause>
            }>
            <IfStatement
              condition={
                <CommandOptionsMemberParserCondition
                  name={name}
                  alias={option.alias}
                />
              }>
              <CommandOptionsMemberParser name={name} option={option} />
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

export function CommandInvocation(props: { command: CommandTree }) {
  const { command } = props;

  return (
    <>
      <Show when={!command.isVirtual}>
        {code`return Promise.resolve(handle${pascalCase(command.name)}(options${
          command.path.segments.filter(segment =>
            isVariableCommandPath(segment)
          ).length > 0
            ? `, ${command.path.segments
                .filter(segment => isVariableCommandPath(segment))
                .map(segment => camelCase(getVariableCommandPathName(segment)))
                .join(", ")}`
            : ""
        }${
          command.params.length > 0
            ? `, ${command.params.map(param => camelCase(param.name)).join(", ")}`
            : ""
        }));`}
        <hbr />
      </Show>
    </>
  );
}

export interface CommandEntryProps extends Omit<
  EntryFileProps,
  "path" | "typeDefinition"
> {
  command: CommandTree;
}

/**
 * The command entry point for the Shell Shock project.
 */
export function CommandEntry(props: CommandEntryProps) {
  const { command, imports, builtinImports, ...rest } = props;

  const context = usePowerlines<ScriptPresetContext>();
  const filePath = computed(() =>
    joinPaths(
      command.path.segments
        .filter(segment => !isVariableCommandPath(segment))
        .join("/"),
      "index.ts"
    )
  );
  const commandSourcePath = computed(() =>
    command.isVirtual
      ? ""
      : replaceExtension(
          relativePath(
            joinPaths(context.entryPath, findFilePath(filePath.value)),
            appendPath(
              command.entry.input?.file || command.entry.file,
              context.config.projectRoot
            )
          )
        )
  );

  return (
    <>
      <EntryFile
        {...rest}
        typeDefinition={command.entry}
        path={filePath.value}
        imports={defu(
          imports ?? {},
          command.isVirtual
            ? Object.entries(command.children)
                .filter(([, command]) => command.isVirtual)
                .reduce((ret, [name, command]) => {
                  ret[`./${command.name}`] = [
                    { name: "handler", alias: `handle${pascalCase(name)}` }
                  ];

                  return ret;
                }, {} as TypescriptFileImports)
            : {
                [commandSourcePath.value]: `handle${pascalCase(command.name)}`
              }
        )}
        builtinImports={defu(builtinImports ?? {}, {
          console: ["warn", "error"],
          utils: ["getArgs"]
        })}>
        <InterfaceDeclaration
          export
          name={`${pascalCase(command.name)}Options`}>
          <For each={Object.entries(command.options)}>
            {([name, option]) => (
              <CommandOptionsMember name={name} option={option} />
            )}
          </For>
        </InterfaceDeclaration>
        <hbr />
        <hbr />
        <TSDoc
          heading={`The ${command.title} (${command.path.segments.join(" ")})${command.isVirtual ? " virtual" : ""} command.`}>
          <TSDocRemarks>{command.description}</TSDocRemarks>
          <hbr />
          <TSDocTitle>{command.title}</TSDocTitle>
          <For each={toArray(context.config.bin)} doubleHardline>
            {bin => (
              <>
                <TSDocExample language="bash">{code`npx ${
                  bin
                } ${command.path.segments
                  .map(segment =>
                    isVariableCommandPath(segment)
                      ? `example-${getVariableCommandPathName(segment)}`
                      : segment
                  )
                  .join(" ")}`}</TSDocExample>
                <hbr />
                <hbr />
                <TSDocExample language="bash">{code`yarn exec ${
                  bin
                } ${command.path.segments
                  .map(segment =>
                    isVariableCommandPath(segment)
                      ? `example-${getVariableCommandPathName(segment)}`
                      : segment
                  )
                  .join(" ")}`}</TSDocExample>
                <hbr />
                <hbr />
                <TSDocExample language="bash">{code`pnpm exec ${
                  bin
                } ${command.path.segments
                  .map(segment =>
                    isVariableCommandPath(segment)
                      ? `example-${getVariableCommandPathName(segment)}`
                      : segment
                  )
                  .join(" ")}`}</TSDocExample>
                <hbr />
                <hbr />
                <TSDocExample language="bash">{code`bun x ${
                  bin
                } ${command.path.segments
                  .map(segment =>
                    isVariableCommandPath(segment)
                      ? `example-${getVariableCommandPathName(segment)}`
                      : segment
                  )
                  .join(" ")}`}</TSDocExample>
              </>
            )}
          </For>
          <hbr />
          <TSDocParam name="args">{`The command-line arguments passed to the command.`}</TSDocParam>
        </TSDoc>
        <FunctionDeclaration
          export
          async
          name="handler"
          parameters={[
            { name: "args", type: "string[]", default: "getArgs()" }
          ]}>
          <Show
            when={!command.isVirtual}
            fallback={
              <CommandRouter
                path={command.path.segments}
                commands={command.children}
              />
            }>
            <CommandVariablePathsParser path={command.path} />
            <hbr />
            <hbr />
            <CommandOptionsParser command={command} />
            <hbr />
            <hbr />
            <CommandParamsParser params={command.params} />
            <hbr />
            <hbr />
            <CommandInvocation command={command} />
          </Show>
        </FunctionDeclaration>
      </EntryFile>
      <For each={Object.values(command.children)}>
        {child => <CommandEntry command={child} />}
      </For>
    </>
  );
}
