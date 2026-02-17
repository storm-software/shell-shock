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

import { render } from "@powerlines/plugin-alloy/render";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path/join";
import type { Plugin } from "powerlines";
import {
  BashCompletionsCommandEntryFile,
  ZshCompletionsCommandEntryFile
} from "./components";
import type {
  CompletionsPluginContext,
  CompletionsPluginOptions
} from "./types/plugin";

export * from "./components";
export * from "./types";

/**
 * The Completions - Shell Shock plugin to add completion commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends CompletionsPluginContext = CompletionsPluginContext
>(
  options: CompletionsPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    {
      name: "shell-shock:completions",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `completions` plugin."
        );

        return {
          completions: options
        };
      },
      configResolved() {
        this.debug("Adding the CLI completion commands to the entry points.");

        this.inputs ??= [];
        if (this.inputs.some(input => input.id === "completions")) {
          this.info(
            "The `completions` command already exists in the commands list. If you would like the completions command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
          );
        } else {
          this.inputs.push({
            id: "completions",
            name: "completions",
            alias: ["completion"],
            path: "completions",
            segments: ["completions"],
            title: "CLI Completions",
            description: `Commands for generating shell completion scripts for the ${getAppTitle(
              this
            )}.`,
            entry: {
              file: joinPaths(this.entryPath, "completions", "command.ts")
            },
            isVirtual: true
          });
        }

        if (this.inputs.some(input => input.id === "completions-bash")) {
          this.info(
            "The `completions-bash` command already exists in the commands list. If you would like the completions-bash command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
          );
        } else {
          this.inputs.push({
            id: "completions-bash",
            name: "bash",
            alias: [],
            path: "completions/bash",
            segments: ["completions", "bash"],
            title: "CLI Completions - Bash Shell",
            entry: {
              file: joinPaths(
                this.entryPath,
                "completions",
                "bash",
                "command.ts"
              )
            },
            isVirtual: false
          });
        }

        if (this.inputs.some(input => input.id === "completions-zsh")) {
          this.info(
            "The `completions-zsh` command already exists in the commands list. If you would like the completions-zsh command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
          );
        } else {
          this.inputs.push({
            id: "completions-zsh",
            name: "zsh",
            alias: [],
            path: "completions/zsh",
            segments: ["completions", "zsh"],
            title: "CLI Completions - Zsh Shell",
            entry: {
              file: joinPaths(
                this.entryPath,
                "completions",
                "zsh",
                "command.ts"
              )
            },
            isVirtual: false
          });
        }
      },
      async prepare() {
        this.debug(
          "Rendering entry point modules for the Shell Shock `completions` plugin."
        );

        return render(
          this,
          <>
            <BashCompletionsCommandEntryFile />
            <ZshCompletionsCommandEntryFile />
          </>
        );
      }
    }
  ];
};

export default plugin;
