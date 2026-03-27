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
import type { CommandConfig } from "@shell-shock/core/types/command";
import console from "@shell-shock/plugin-console";
import theme from "@shell-shock/plugin-theme";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
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
      enforce: "post",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `help` plugin."
        );

        return {
          help: defu(
            {
              command:
                options.command === false
                  ? false
                  : isSetString(options.command)
                    ? { name: options.command }
                    : { name: "help" }
            },
            options,
            {
              builtins: true
            }
          )
        };
      },
      async configResolved() {
        this.debug("Adding the Help command to the application context.");

        if (this.config.help.command !== false) {
          this.inputs ??= [];
          if (
            this.inputs.some(
              input =>
                input.name === (this.config.help.command as CommandConfig).name
            )
          ) {
            this.info(
              "The `help` command already exists in the commands list. If you would like the help command to be managed by the `@shell-shock/plugin-help` package, please remove or rename the command."
            );
          } else {
            this.inputs.push({
              id: this.config.help.command.name,
              name: this.config.help.command.name,
              path: this.config.help.command.name,
              segments: [this.config.help.command.name],
              title: "Help",
              icon: "？",
              description: `A command for displaying help information to assist in using the ${getAppTitle(
                this,
                true
              )} command-line interface application.`,
              entry: {
                file: joinPaths(this.entryPath, "help", "index.ts"),
                input: {
                  file: joinPaths(this.entryPath, "help", "command.ts")
                }
              },
              isVirtual: false,
              ...this.config.help.command
            });
          }

          await render(this, <HelpCommand />);
        }
      },
      prepare: {
        order: "post",
        async handler() {
          const commands = await getCommandList(this);
          this.debug(
            `Rendering \`help\` built-ins for each of the ${
              commands.length
            } command modules.`
          );

          const bin = computed(() => ({
            id: "",
            name: getAppName(this),
            title: getAppTitle(this),
            description: getAppDescription(this),
            isVirtual: true,
            path: null,
            segments: [],
            alias: [],
            options: Object.fromEntries(
              this.options.map(option => [option.name, option])
            ),
            entry: {
              file: joinPaths(this.entryPath, "bin.ts")
            },
            args: [],
            parent: null,
            children: this.commands
          }));

          return render(
            this,
            <>
              <Show when={this.config.help.builtins !== false}>
                <HelpBuiltin command={bin.value} />
                <Spacing />
                <For
                  each={commands.sort((a, b) => a.name.localeCompare(b.name))}
                  doubleHardline>
                  {command => <HelpBuiltin command={command} />}
                </For>
              </Show>
            </>
          );
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
