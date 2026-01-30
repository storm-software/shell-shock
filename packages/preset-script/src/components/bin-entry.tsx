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
import { FunctionDeclaration, IfStatement } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { TypescriptFileImports } from "@powerlines/plugin-alloy/types/components";
import type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import { TSDoc } from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppTitle } from "@shell-shock/core/plugin-utils/context-helpers";
import { getUnique } from "@stryke/helpers/get-unique";
import { findFileName } from "@stryke/path/file-path-fns";
import { replaceExtension } from "@stryke/path/replace";
import { pascalCase } from "@stryke/string-format/pascal-case";
import defu from "defu";
import type { ScriptPresetContext } from "../types/plugin";

/**
 * The `exit` handler function usage code for the Shell Shock project.
 */
export function ExitFunctionUsage() {
  return (
    <>
      <hbr />
      {code`(async () => {
        try {
          process.on("exit", () => exit({
            skipExit: true,
            isSynchronous: true,
            signal: 0
          }));
          process.on("beforeExit", () => exit({
            signal: 0
          }));
          process.on("message", message => {
            if (message === 'shutdown') {
              exit({
                isSynchronous: true,
                signal: -128
              });
            }
          });

          process.once("SIGTERM", () => exit({
            signal: 15
          }));
          process.once("SIGINT", () => exit({
            signal: 2
          }));
          process.once("SIGUSR2", () => {
            verbose("The application was terminated by the user");
            return exit({
              signal: 12
            });
          });
          process.once("SIGQUIT", () => {
            verbose("The application was terminated by the user");
            return exit({
              signal: 12
            });
          });

          for (const type of ["unhandledRejection", "uncaughtException"]) {
            process.on(type, err => exit({
              exception: err || new Error(\`An \${type === "unhandledRejection" ? "unhandled promise rejection" : "uncaught exception"} occurred during processing - the application is shutting down.\`)
            }));
          }

          const result = await main();
          if (result?.error) {
            error(result.error);
          }

          exit();
        } catch (err) {
          verbose("An exception occurred during processing");
          exit({ exception: err as Error });
        }
      })();
      `}
      <hbr />
    </>
  );
}

export interface BinEntryProps extends Omit<
  EntryFileProps,
  "path" | "hashbang"
> {
  prefix?: Children;
  postfix?: Children;
  children: Children;
}

/**
 * The binary entry point for the Shell Shock project.
 */
export function BinEntry(props: BinEntryProps) {
  const { prefix, postfix, builtinImports, imports, children, ...rest } = props;

  const context = usePowerlines<ScriptPresetContext>();
  const bins = computed(() => getUnique(Object.values(context.config.bin)));

  return (
    <For each={bins.value}>
      {bin => (
        <EntryFile
          {...rest}
          path={findFileName(replaceExtension(bin))}
          typeDefinition={{
            file: bin,
            output: "bin"
          }}
          imports={defu(
            imports ?? {},
            Object.entries(context.commands)
              .filter(([, command]) => command.isVirtual)
              .reduce((ret, [name, command]) => {
                ret[`./${command.name}`] = [
                  { name: "handler", alias: `handle${pascalCase(name)}` }
                ];

                return ret;
              }, {} as TypescriptFileImports)
          )}
          builtinImports={defu(builtinImports ?? {}, {
            console: ["error", "verbose", "table"],
            utils: ["hasFlag", "exit"]
          })}>
          <Show when={Boolean(prefix)}>
            {prefix}
            <hbr />
            <hbr />
          </Show>
          <TSDoc
            heading={`Binary entry point for the ${getAppTitle(context)} CLI application.`}></TSDoc>
          <FunctionDeclaration async returnType="any" name="main">
            <IfStatement condition={code`hasFlag(["version", "v"])`}>
              {code`console.log(${context?.packageJson.version ? `"${context?.packageJson.version}"` : "0.0.1"});
          return;`}
            </IfStatement>
            <hbr />
            <hbr />
            {children}
            <hbr />
          </FunctionDeclaration>
          <hbr />
          <hbr />
          <hbr />
          <Show when={Boolean(postfix)} fallback={<ExitFunctionUsage />}>
            {postfix}
          </Show>
          <hbr />
        </EntryFile>
      )}
    </For>
  );
}
