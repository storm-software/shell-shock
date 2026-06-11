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

import { render } from "@powerlines/plugin-alloy/render";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type { Plugin } from "powerlines";
import { UpdateBuiltin, UpdateCommand } from "./components";
import type { UpdatePluginContext, UpdatePluginOptions } from "./types/plugin";

/**
 * The Update - Shell Shock plugin to add version check functionality and update commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends UpdatePluginContext = UpdatePluginContext
>(
  options: UpdatePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock/update",
    config() {
      this.debug(
        "Providing default configuration for the Shell Shock `update` plugin."
      );

      return {
        update: defu(
          {
            command: {
              name: isSetString(options.command) ? options.command : "update"
            }
          },
          options,
          {
            type: "confirm",
            staleTime: 36 * 60 * 60 * 1000 // 36 hours
          }
        ),
        env: {
          config: "@shell-shock/plugin-update/types/env#ShellShockUpdateEnv",
          validate: false
        }
      };
    },
    configResolved() {
      this.debug("Adding the CLI update commands to the application context.");

      this.inputs ??= [];
      if (
        this.inputs.some(input => input.id === this.config.update.command.name)
      ) {
        this.info(
          "The `update` command already exists in the commands list. If you would like the update command to be managed by the `@shell-shock/plugin-update` package, please remove or rename the command."
        );
      } else {
        this.inputs.push({
          id: this.config.update.command.name,
          alias: ["upgrade"],
          path: this.config.update.command.name,
          segments: [this.config.update.command.name],
          title: "Update",
          icon: "🖒",
          tags: ["Utility"],
          description: `A command for checking and updating the version of the ${getAppTitle(
            this,
            true
          )} command-line interface application.`,
          entry: {
            file: joinPaths(this.entryPath, "update", "index.ts"),
            input: {
              file: joinPaths(this.entryPath, "update", "command.ts")
            }
          },
          virtual: false,
          ...this.config.update.command
        });
      }
    },
    async prepare() {
      this.debug(
        "Rendering update built-in and command modules for the Shell Shock `update` plugin."
      );

      return render(
        this,
        <>
          <UpdateBuiltin />
          <UpdateCommand />
        </>
      );
    }
  };
};

export default plugin;
