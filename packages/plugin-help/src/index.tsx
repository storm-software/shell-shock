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
import { Spacing } from "@powerlines/plugin-alloy/core/components";
import { render } from "@powerlines/plugin-alloy/render";
import {
  getAppDescription,
  getAppName,
  getAppTitle,
  getCommandList
} from "@shell-shock/core/plugin-utils";
import console from "@shell-shock/plugin-console";
import theme from "@shell-shock/plugin-theme";
import { joinPaths } from "@stryke/path/join";
import defu from "defu";
import type { Plugin } from "powerlines";
import { HelpBuiltin, HelpCommand } from "./components";
import type { HelpPluginContext, HelpPluginOptions } from "./types/plugin";

export type * from "./types";

/**
 * The Help - Shell Shock plugin to add a help command to the application.
 */
export const plugin = <TContext extends HelpPluginContext = HelpPluginContext>(
  options: HelpPluginOptions = {}
) => {
  return [
    ...theme(options.theme),
    console(options.console),
    {
      name: "shell-shock:help",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `help` plugin."
        );

        return {
          help: defu(options, {
            variant: "both"
          })
        };
      },
      configResolved() {
        this.debug("Adding the Help command to the application context.");

        this.inputs ??= [];
        if (this.inputs.some(input => input.id === "help")) {
          this.info(
            "The `help` command already exists in the commands list. If you would like the help command to be managed by the `@shell-shock/plugin-help` package, please remove or rename the command."
          );
        } else {
          this.inputs.push({
            id: "help",
            name: "help",
            path: "help",
            segments: ["help"],
            title: "Help",
            description: `A command for displaying help information in the ${getAppTitle(
              this,
              true
            )} command-line interface application.`,
            entry: {
              file: joinPaths(this.entryPath, "help", "command.ts"),
              input: {
                file: joinPaths(this.entryPath, "help", "command.ts")
              }
            },
            isVirtual: false
          });
        }
      },
      async prepare() {
        this.debug(
          "Rendering help built-in and command modules for the Shell Shock `help` plugin."
        );

        const commands = await getCommandList(this);
        const bin = computed(() => ({
          id: null,
          name: getAppName(this),
          title: getAppTitle(this),
          description: getAppDescription(this),
          isVirtual: true,
          path: null,
          segments: [],
          options: this.options,
          args: [],
          parent: null,
          children: this.commands
        }));

        return render(
          this,
          <>
            <Show when={["builtin", "both"].includes(this.config.help.variant)}>
              <HelpBuiltin command={bin.value} />
              <Spacing />
              <For each={commands} doubleHardline>
                {command => <HelpBuiltin command={command} />}
              </For>
            </Show>
            <Show when={["command", "both"].includes(this.config.help.variant)}>
              <Spacing />
              <HelpCommand />
            </Show>
          </>
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
