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
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { isDynamicPathSegment } from "@shell-shock/core/plugin-utils/context-helpers";
import type {
  CommandTree,
  NumberCommandArgument,
  NumberCommandOption
} from "@shell-shock/core/types/command";
import { CommandHandlerDeclaration } from "@shell-shock/preset-script/components/command-entry";
import { findFilePath, relativePath } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
import { replaceExtension } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { CLIPresetContext } from "../types/plugin";
import { BannerFunctionDeclaration } from "./banner-function-declaration";
import { VirtualCommandEntry } from "./virtual-command-entry";

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

  const context = usePowerlines<CLIPresetContext>();
  const filePath = computed(() =>
    joinPaths(
      command.segments
        .filter(segment => !isDynamicPathSegment(segment))
        .join("/"),
      "index.ts"
    )
  );
  const commandSourcePath = computed(() =>
    replaceExtension(
      relativePath(
        joinPaths(context.entryPath, findFilePath(filePath.value)),
        command.entry.input?.file || command.entry.file
      )
    )
  );
  const typeDefinition = computed(() => ({
    ...command.entry,
    output: command.id
  }));

  return (
    <>
      <EntryFile
        {...rest}
        path={filePath.value}
        typeDefinition={typeDefinition.value}
        imports={defu(imports ?? {}, {
          [commandSourcePath.value]: `handle${pascalCase(command.name)}`
        })}
        builtinImports={defu(builtinImports ?? {}, {
          env: ["env", "isCI", "isDevelopment", "isDebug"],
          console: [
            "debug",
            "warn",
            "error",
            "table",
            "colors",
            "stripAnsi",
            "writeLine",
            "splitText"
          ],
          utils: [
            "getArgs",
            "hasFlag",
            "isMinimal",
            "isUnicodeSupported",
            "internal_commandContext"
          ]
        })}>
        <BannerFunctionDeclaration command={command} />
        <hbr />
        <hbr />
        <CommandHandlerDeclaration command={command}>
          <VarDeclaration
            name="failures"
            type="string[]"
            initializer={code`[];`}
          />
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
                    {code`failures.push("Missing required \\"${option.name}\\" option");`}
                  </IfStatement>
                  <Show
                    when={
                      (option.kind === ReflectionKind.string ||
                        option.kind === ReflectionKind.number) &&
                      option.variadic
                    }>
                    <ElseIfClause
                      condition={code`options${
                        option.name.includes("?")
                          ? `["${option.name}"]`
                          : `.${camelCase(option.name)}`
                      }.length === 0`}>
                      {code`failures.push("No values were provided to the required \\"${
                        option.name
                      }\\" array option");`}
                    </ElseIfClause>
                  </Show>
                </Show>
                <Show when={option.kind === ReflectionKind.number}>
                  <Show
                    when={(option as NumberCommandOption).variadic}
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
                        {code`failures.push("Invalid numeric value provided for the \\"${
                          option.name
                        }\\" option");`}
                      </IfStatement>
                    }>
                    <IfStatement
                      condition={code`options${
                        option.name.includes("?")
                          ? `["${option.name}"]`
                          : `.${camelCase(option.name)}`
                      }.some(value => Number.isNaN(value))`}>
                      {code`failures.push("Invalid numeric value provided in the \\"${
                        option.name
                      }\\" array option");`}
                    </IfStatement>
                  </Show>
                </Show>
              </>
            )}
          </For>
          <hbr />
          <hbr />
          <For each={command.arguments} doubleHardline>
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
                      (argument.kind === ReflectionKind.string ||
                        argument.kind === ReflectionKind.number) &&
                      argument.variadic
                    }>
                    <ElseIfClause
                      condition={code`${camelCase(argument.name)}.length === 0`}>
                      {code`failures.push("No values were provided to the required \\"${
                        argument.name
                      }\\" array positional argument");`}
                    </ElseIfClause>
                  </Show>
                </Show>
                <Show when={argument.kind === ReflectionKind.number}>
                  <Show
                    when={(argument as NumberCommandArgument).variadic}
                    fallback={
                      <IfStatement
                        condition={code`${camelCase(
                          argument.name
                        )} && Number.isNaN(${camelCase(argument.name)})`}>
                        {code`failures.push("Invalid numeric value provided for the \\"${
                          argument.name
                        }\\" positional argument");`}
                      </IfStatement>
                    }>
                    <IfStatement
                      condition={code`${camelCase(argument.name)}.some(value => Number.isNaN(value))`}>
                      {code`failures.push("Invalid numeric value provided in the \\"${
                        argument.name
                      }\\" array positional argument");`}
                    </IfStatement>
                  </Show>
                </Show>
              </>
            )}
          </For>
          <IfStatement condition={code`failures.length > 0`}>
            {code`error(colors.text.message.description.error("The following validation failures were found while processing the user provided input, and must be corrected before the command line process can be executed: \\n\\n") + failures.map(failure => colors.text.body.secondary(" - " + failure)).join("\\n"));
            options.help = true; `}
          </IfStatement>
        </CommandHandlerDeclaration>
      </EntryFile>
      <For each={Object.values(command.children)}>
        {child => (
          <Show
            when={child.isVirtual}
            fallback={<CommandEntry command={child} />}>
            <VirtualCommandEntry command={child} />
          </Show>
        )}
      </For>
    </>
  );
}
