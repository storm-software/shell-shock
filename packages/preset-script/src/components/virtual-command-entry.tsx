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
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { TypescriptFileImports } from "@powerlines/plugin-alloy/types/components";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import {
  TSDoc,
  TSDocParam,
  TSDocRemarks,
  TSDocTitle
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript/components/typescript-file";
import {
  getAppBin,
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import { joinPaths } from "@stryke/path/join";
import { constantCase } from "@stryke/string-format/constant-case";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { ScriptPresetContext } from "../types/plugin";
import { BannerFunctionDeclaration } from "./banner-function-declaration";
import { CommandEntry } from "./command-entry";
import { CommandRouter } from "./command-router";
import { VirtualHelp } from "./help";

export interface VirtualCommandHandlerDeclarationProps {
  command: CommandTree;
  children?: Children;
}

/**
 * A component that generates the `handler` function declaration for a command.
 */
export function VirtualCommandHandlerDeclaration(
  props: VirtualCommandHandlerDeclarationProps
) {
  const { command, children } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <TSDoc
        heading={`The ${command.title} (${getAppBin(context)} ${command.path.segments
          .map(segment =>
            isDynamicPathSegment(segment)
              ? `[${constantCase(getDynamicPathSegmentName(segment))}]`
              : segment
          )
          .join(" ")}) virtual command.`}>
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
        <hbr />
        <hbr />
        {children}
        <CommandRouter
          path={command.path.segments}
          commands={command.children}
        />
        <hbr />
        <hbr />
        {code`writeLine("");
        banner();`}
        <hbr />
        <hbr />
        <VirtualHelp
          path={command.path}
          options={Object.values(command.options)}
          commands={command.children ?? {}}
        />
      </FunctionDeclaration>
    </>
  );
}

export interface VirtualCommandEntryProps extends Omit<
  EntryFileProps,
  "path" | "typeDefinition"
> {
  command: CommandTree;
}

/**
 * The virtual command entry point for the Shell Shock project.
 */
export function VirtualCommandEntry(props: VirtualCommandEntryProps) {
  const { command, imports, builtinImports, ...rest } = props;

  const context = usePowerlines<ScriptPresetContext>();
  const filePath = computed(() =>
    joinPaths(
      context.entryPath,
      command.path.segments
        .filter(segment => !isDynamicPathSegment(segment))
        .join("/"),
      "index.ts"
    )
  );

  return (
    <>
      <TypescriptFile
        {...rest}
        path={filePath.value}
        imports={defu(
          {
            didyoumean2: [
              { name: "didYouMean", default: true },
              { name: "ReturnTypeEnums" },
              { name: "ThresholdTypeEnums" }
            ]
          },
          imports ?? {},
          Object.entries(command.children)
            .filter(([, child]) => child.isVirtual)
            .reduce((ret, [name, child]) => {
              ret[`./${child.name}`] = [
                { name: "handler", alias: `handle${pascalCase(name)}` }
              ];

              return ret;
            }, {} as TypescriptFileImports)
        )}
        builtinImports={defu(builtinImports ?? {}, {
          console: ["warn", "error", "table", "colors", "writeLine"],
          utils: ["getArgs", "hasFlag", "isMinimal"]
        })}>
        <BannerFunctionDeclaration command={command} />
        <hbr />
        <hbr />
        <VirtualCommandHandlerDeclaration command={command} />
      </TypescriptFile>
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
