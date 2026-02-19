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

import { computed, For, Show } from "@alloy-js/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { TypescriptFileImports } from "@powerlines/plugin-alloy/types/components";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript/components/typescript-file";
import { isDynamicPathSegment } from "@shell-shock/core/plugin-utils/context-helpers";
import type { CommandTree } from "@shell-shock/core/types/command";
import { VirtualCommandHandlerDeclaration } from "@shell-shock/preset-script/components/virtual-command-entry";
import { joinPaths } from "@stryke/path/join";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { CLIPresetContext } from "../types/plugin";
import { BannerFunctionDeclaration } from "./banner-function-declaration";
import { CommandEntry } from "./command-entry";
import { CommandRouter } from "./command-router";

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

  const context = usePowerlines<CLIPresetContext>();
  const filePath = computed(() =>
    joinPaths(
      context.entryPath,
      command.segments
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
          console: [
            "warn",
            "error",
            "help",
            "table",
            "colors",
            "writeLine",
            "splitText",
            "stripAnsi"
          ],
          utils: [
            "useApp",
            "useArgs",
            "hasFlag",
            "isMinimal",
            "isUnicodeSupported",
            "isInteractive",
            "isHelp"
          ],
          prompts: ["text", "toggle", "select", "isCancel", "sleep"]
        })}>
        <BannerFunctionDeclaration command={command} />
        <hbr />
        <hbr />
        <VirtualCommandHandlerDeclaration command={command}>
          <CommandRouter
            segments={command.segments}
            commands={command.children}
          />
        </VirtualCommandHandlerDeclaration>
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
