/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import {
  executeCommandGenerator,
  renderCommandTemplate
} from "@shell-shock/core/helpers/power-plant";
import { getCommandList } from "@shell-shock/core/plugin-utils";
import type { CommandConfig } from "@shell-shock/core/types/command";
import console from "@shell-shock/plugin-console";
import theme from "@shell-shock/plugin-theme";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type { Plugin } from "powerlines";
import { TemporaryHelpCommand } from "./components";
import { helpGenerator } from "./generator";
import type { HelpPluginContext, HelpPluginOptions } from "./types/plugin";

export type * from "./types";
export { helpGenerator } from "./generator";

/**
 * The Help - Shell Shock plugin to add a help command to the application.
 */
export const plugin = <TContext extends HelpPluginContext = HelpPluginContext>(
  options: HelpPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    ...theme<TContext>(options.theme),
    ...console<TContext>(options.console),
    {
      name: "shell-shock/help",
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
              (input: CommandConfig) =>
                input.name === (this.config.help.command as CommandConfig).name
            )
          ) {
            this.info(
              "The `help` command already exists in the commands list. If you would like the help command to be managed by the `@shell-shock/plugin-help` package, please remove or rename the command."
            );
          } else {
            this.inputs.push({
              id: this.config.help.command.name,
              path: this.config.help.command.name,
              segments: [this.config.help.command.name],
              title: "Help",
              icon: "🛈",
              tags: ["Utility"],
              description: `Display command usage details and other useful information to the user.`,
              entry: {
                file: joinPaths(this.entryPath, "help", "index.ts"),
                input: {
                  file: joinPaths(this.entryPath, "help", "command.ts")
                }
              },
              virtual: false,
              ...this.config.help.command
            });
          }

          await renderCommandTemplate(
            { context: this },
            <TemporaryHelpCommand />
          );
        }
      },
      prepare: {
        order: "post",
        async handler() {
          const commands = await getCommandList(this);

          this.debug(
            `Rendering \`help\` built-ins via Power Plant for each of the ${
              commands.length
            } command modules.`
          );

          return executeCommandGenerator(this, helpGenerator);
        }
      }
    }
  ];
};

export default plugin;
