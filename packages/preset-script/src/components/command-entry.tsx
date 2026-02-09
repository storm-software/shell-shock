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
  ElseClause,
  FunctionDeclaration,
  IfStatement,
  VarDeclaration
} from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import {
  TSDoc,
  TSDocParam,
  TSDocRemarks,
  TSDocTitle
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import {
  CommandParserLogic,
  OptionsInterfaceDeclaration
} from "@shell-shock/core/components/options-parser-logic";
import {
  getAppBin,
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import { findFilePath, relativePath } from "@stryke/path/find";
import { joinPaths } from "@stryke/path/join";
import { replaceExtension } from "@stryke/path/replace";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { ScriptPresetContext } from "../types/plugin";
import { BannerFunctionDeclaration } from "./banner-function-declaration";
import { CommandHelp } from "./help";
import { IsDebug } from "./helpers";
import { VirtualCommandEntry } from "./virtual-command-entry";

export function CommandInvocation(props: { command: CommandTree }) {
  const { command } = props;

  return (
    <>
      <VarDeclaration
        name="__context"
        initializer={code`{ path: \`${command.path.segments
          .map(segment =>
            isDynamicPathSegment(segment)
              ? `\${${camelCase(getDynamicPathSegmentName(segment))}}`
              : segment
          )
          .join("/")}\`, segments: [${command.path.segments
          .map(segment =>
            isDynamicPathSegment(segment)
              ? camelCase(getDynamicPathSegmentName(segment))
              : `"${segment}"`
          )
          .join(", ")}] }`}
      />
      <hbr />
      <hbr />
      {code`

      internal_commandContext.call(__context, () => {
        return Promise.resolve(Reflect.apply(handle${pascalCase(
          command.name
        )}, __context, [options${
          command.arguments.length > 0
            ? `, ${command.arguments
                .map(argument => camelCase(argument.name))
                .join(", ")}`
            : ""
        }]));
      });

      `}
      <hbr />
    </>
  );
}

export interface CommandHandlerDeclarationProps {
  command: CommandTree;
  children?: Children;
}

/**
 * A component that generates the `handler` function declaration for a command.
 */
export function CommandHandlerDeclaration(
  props: CommandHandlerDeclarationProps
) {
  const { command, children } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <OptionsInterfaceDeclaration command={command} />
      <hbr />
      <hbr />
      <TSDoc
        heading={`The ${command.title} (${getAppBin(
          context
        )} ${command.path.segments
          .map(segment =>
            isDynamicPathSegment(segment)
              ? `[${constantCase(getDynamicPathSegmentName(segment))}]`
              : segment
          )
          .join(" ")}) command.`}>
        <TSDocRemarks>{`${command.description.replace(/\.+$/, "")}.`}</TSDocRemarks>
        <hbr />
        <TSDocTitle>{command.title}</TSDocTitle>
        <TSDocParam name="args">{`The command-line arguments passed to the command.`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="handler"
        parameters={[{ name: "args", type: "string[]", default: "getArgs()" }]}>
        <CommandParserLogic
          command={command}
          envPrefix={context.config.envPrefix}
          isCaseSensitive={context.config.isCaseSensitive}
        />
        <hbr />
        <hbr />
        {code`writeLine("");
        banner(); `}
        <hbr />
        <hbr />
        <IfStatement condition={<IsDebug />}>
          {code`
          writeLine("");
          writeLine(colors.text.body.tertiary("Debug mode is enabled. Additional debug information may be logged to the console."));

          writeLine("");
          debug(\`Command path: ${command.path.segments
            .map(segment =>
              isDynamicPathSegment(segment)
                ? `\${${camelCase(getDynamicPathSegmentName(segment))}}`
                : segment
            )
            .join(" / ")} \\n\\nOptions: \\n${Object.values(command.options)
            .map(
              option =>
                ` - ${kebabCase(option.name)}: \${options.${camelCase(
                  option.name
                )} === undefined ? "" : JSON.stringify(options.${camelCase(
                  option.name
                )})}`
            )
            .join("\\n")}${
            command.arguments.length > 0
              ? ` \\n\\nArguments: ${command.arguments
                  .map(
                    argument =>
                      ` - ${argument.name}: \${${camelCase(
                        argument.name
                      )} ?? ""}`
                  )
                  .join("\\n")}`
              : ""
          }\`); `}
        </IfStatement>
        <hbr />
        <hbr />
        {children}
        <hbr />
        <hbr />
        <IfStatement condition={code`options.help`}>
          <CommandHelp command={command} />
        </IfStatement>
        <ElseClause>
          <hbr />
          <CommandInvocation command={command} />
        </ElseClause>
      </FunctionDeclaration>
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
        <OptionsInterfaceDeclaration command={command} />
        <hbr />
        <hbr />
        <CommandHandlerDeclaration command={command} />
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
