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

import { code, computed, For, Match, Show, Switch } from "@alloy-js/core";
import { ElseIfClause, IfStatement } from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { isDynamicPathSegment } from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import {
  CommandHandlerDeclaration,
  CommandValidationLogic
} from "@shell-shock/preset-script/components/command-entry";
import { findFilePath, relativePath } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
import { replaceExtension } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { lowerCaseFirst } from "@stryke/string-format/lower-case-first";
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
          [commandSourcePath.value]: `handle${pascalCase(command.name)}`,
          prompts: "prompts"
        })}
        builtinImports={defu(builtinImports ?? {}, {
          env: ["env", "isDevelopment", "isDebug"],
          console: [
            "debug",
            "warn",
            "error",
            "table",
            "colors",
            "stripAnsi",
            "writeLine",
            "splitText",
            "text",
            "confirm",
            "isCancel",
            "intro",
            "outro"
          ],
          utils: [
            "useApp",
            "useArgs",
            "hasFlag",
            "isMinimal",
            "isInteractive",
            "isHelp",
            "isUnicodeSupported",
            "internal_commandContext"
          ]
        })}>
        <BannerFunctionDeclaration command={command} />
        <hbr />
        <hbr />
        <CommandHandlerDeclaration command={command}>
          <IfStatement condition={code`!isInteractive`}>
            <CommandValidationLogic command={command} />
          </IfStatement>
          <ElseIfClause
            condition={code`!isHelp && (${Object.values(command.options ?? {})
              .filter(option => !option.optional)
              .map(option =>
                (option.kind === ReflectionKind.string ||
                  option.kind === ReflectionKind.number) &&
                option.variadic
                  ? `(!options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    } || options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    }.length === 0)`
                  : `options${
                      option.name.includes("?")
                        ? `["${option.name}"]`
                        : `.${camelCase(option.name)}`
                    } === undefined`
              )
              .join(" || ")}${
              Object.values(command.options ?? {}).filter(
                option => !option.optional
              ).length > 0 &&
              Object.values(command.arguments ?? {}).filter(
                argument => !argument.optional
              ).length > 0
                ? " || "
                : ""
            }${Object.values(command.arguments ?? {})
              .filter(argument => !argument.optional)
              .map(argument =>
                (argument.kind === ReflectionKind.string ||
                  argument.kind === ReflectionKind.number) &&
                argument.variadic
                  ? `(!${camelCase(
                      argument.name
                    )} || ${camelCase(argument.name)}.length === 0)`
                  : `${camelCase(argument.name)} === undefined`
              )
              .join(" || ")}) `}>
            {code`writeLine("");

            intro("Select required input parameters"); `}
            <hbr />
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
                      <Switch>
                        <Match
                          when={
                            option.kind === ReflectionKind.string ||
                            option.kind === ReflectionKind.number
                          }>{code`
                            const value = await text({
                              message: 'Please provide a${
                                option.kind === ReflectionKind.number
                                  ? " numeric"
                                  : ""
                              } value for the "${option.name}" option${
                                option.description
                                  ? ` (${lowerCaseFirst(
                                      option.description
                                    ).replace(/\.+$/, "")})`
                                  : ""
                              }:',
                              validate(val) {
                                if (isCancel(val)) {
                                  return true;
                                }
                                if (!val || val.trim() === "") {
                                  return "A value must be provided for this option";
                                }
                                ${
                                  option.kind === ReflectionKind.number
                                    ? `if (Number.isNaN(Number(val))) {
                                  return "The value provided must be a valid number";
                                }`
                                    : ""
                                }
                                return undefined;
                              }
                            });
                            if (isCancel(value)) {
                              return;
                            }

                            options${
                              option.name.includes("?")
                                ? `["${option.name}"]`
                                : `.${camelCase(option.name)}`
                            } = ${
                              option.kind === ReflectionKind.number
                                ? `Number(value)`
                                : "value"
                            };
                          `}</Match>
                        <Match
                          when={option.kind === ReflectionKind.boolean}>{code`
                            options${
                              option.name.includes("?")
                                ? `["${option.name}"]`
                                : `.${camelCase(option.name)}`
                            } = await confirm({
                              message: 'Please select a value for the "${
                                option.name
                              }" option${
                                option.description
                                  ? ` (${lowerCaseFirst(
                                      option.description
                                    ).replace(/\.+$/, "")})`
                                  : ""
                              }:'
                            });
                          `}</Match>
                      </Switch>
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
                        {code`
                            const value = await text({
                              message: 'Please provide one or more${
                                option.kind === ReflectionKind.number
                                  ? " numeric"
                                  : ""
                              } values for the "${option.name}" option${
                                option.description
                                  ? ` (${lowerCaseFirst(
                                      option.description
                                    ).replace(/\.+$/, "")})`
                                  : ""
                              } - values are separated by a "," character:',
                              validate(val) {
                                if (isCancel(val)) {
                                  return true;
                                }
                                if (!val || val.trim() === "") {
                                  return "A value must be provided for this option";
                                }
                                if (val.split(",").map(v => v.trim()).filter(Boolean).length === 0) {
                                  return "At least one value must be provided for this option";
                                }
                                ${
                                  option.kind === ReflectionKind.number
                                    ? `const invalidIndex = val.split(",").map(v => v.trim()).filter(Boolean).findIndex(v => Number.isNaN(Number(v));
                                    if (invalidIndex !== -1) {
                                      return \`Invalid numeric value provided for item #\${invalidIndex + 1} - all provided items must be a valid number\`;
                                    } `
                                    : ""
                                }
                                return undefined;
                              }
                            });
                            if (isCancel(value)) {
                              return;
                            }

                            options${
                              option.name.includes("?")
                                ? `["${option.name}"]`
                                : `.${camelCase(option.name)}`
                            } = value.split(",").map(value => value.trim()).filter(Boolean)${
                              option.kind === ReflectionKind.number
                                ? `.map(Number)`
                                : ""
                            } ;
                          `}
                      </ElseIfClause>
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
                      <Switch>
                        <Match
                          when={
                            argument.kind === ReflectionKind.string ||
                            argument.kind === ReflectionKind.number
                          }>{code`
                            const value = await text({
                              message: 'Please provide a${
                                argument.kind === ReflectionKind.number
                                  ? " numeric"
                                  : ""
                              } value for the "${argument.name}" argument${
                                argument.description
                                  ? ` (${lowerCaseFirst(argument.description).replace(/\.+$/, "")})`
                                  : ""
                              }:',
                              validate(val) {
                                if (isCancel(val)) {
                                  return true;
                                }
                                if (!val || val.trim() === "") {
                                  return "A value must be provided for this argument";
                                }
                                ${
                                  argument.kind === ReflectionKind.number
                                    ? `if (Number.isNaN(Number(val))) {
                                  return "The provided value must be a valid number";
                                }`
                                    : ""
                                }
                                return undefined;
                              }
                            });
                            if (isCancel(value)) {
                              return;
                            }

                            ${camelCase(argument.name)} = ${
                              argument.kind === ReflectionKind.number
                                ? `Number(value)`
                                : "value"
                            };
                          `}</Match>
                        <Match
                          when={argument.kind === ReflectionKind.boolean}>{code`
                            ${camelCase(argument.name)} = await confirm({
                              message: 'Please select a value for the "${argument.name}" argument${
                                argument.description
                                  ? ` (${lowerCaseFirst(argument.description).replace(/\.+$/, "")})`
                                  : ""
                              }:'
                            });
                          `}</Match>
                      </Switch>
                    </IfStatement>
                    <Show
                      when={
                        (argument.kind === ReflectionKind.string ||
                          argument.kind === ReflectionKind.number) &&
                        argument.variadic
                      }>
                      <ElseIfClause
                        condition={code`${camelCase(argument.name)}.length === 0`}>
                        {code`
                            const value = await text({
                              message: 'Please provide one or more${
                                argument.kind === ReflectionKind.number
                                  ? " numeric"
                                  : ""
                              } values for the "${argument.name}" argument${
                                argument.description
                                  ? ` (${lowerCaseFirst(argument.description).replace(/\.+$/, "")})`
                                  : ""
                              } - values are separated by a "," character:',
                              validate(val) {
                                if (isCancel(val)) {
                                  return true;
                                }
                                if (!val || val.trim() === "") {
                                  return "A value must be provided for this argument";
                                }
                                if (val.split(",").map(v => v.trim()).filter(Boolean).length === 0) {
                                  return "At least one value must be provided for this argument";
                                }
                                ${
                                  argument.kind === ReflectionKind.number
                                    ? `const invalidIndex = val.split(",").map(v => v.trim()).filter(Boolean).findIndex(v => Number.isNaN(Number(v));
                                    if (invalidIndex !== -1) {
                                      return \`Invalid numeric value provided for item #\${invalidIndex + 1} - all provided items must be a valid number\`;
                                    } `
                                    : ""
                                }

                                return undefined;
                              }
                            });
                            if (isCancel(value)) {
                              return;
                            }

                            ${camelCase(argument.name)} = value.split(",").map(value => value.trim()).filter(Boolean)${
                              argument.kind === ReflectionKind.number
                                ? `.map(Number)`
                                : ""
                            } ;
                          `}
                      </ElseIfClause>
                    </Show>
                  </Show>
                </>
              )}
            </For>
            {code`outro("Completed providing all required input parameters");

            writeLine(""); `}
            <hbr />
            <hbr />
          </ElseIfClause>
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
