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
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type { Plugin } from "powerlines";
import { UpgradeBuiltin, UpgradeCommand } from "./components";
import type {
  UpgradePluginContext,
  UpgradePluginOptions
} from "./types/plugin";

/**
 * The Upgrade - Shell Shock plugin to add version check functionality and upgrade commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends UpgradePluginContext = UpgradePluginContext
>(
  options: UpgradePluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock:upgrade",
    config() {
      this.debug(
        "Providing default configuration for the Shell Shock `upgrade` plugin."
      );

      return {
        upgrade: defu(
          {
            command: {
              name: isSetString(options.command) ? options.command : "upgrade"
            }
          },
          options,
          {
            type: "confirm",
            staleTime: 36 * 60 * 60 * 1000 // 36 hours
          }
        ),
        env: {
          types:
            "@shell-shock/plugin-upgrade/types/env#ShellShockUpgradePluginEnv",
          validate: false
        }
      };
    },
    configResolved() {
      this.debug("Adding the CLI upgrade commands to the application context.");

      this.inputs ??= [];
      if (
        this.inputs.some(input => input.id === this.config.upgrade.command.name)
      ) {
        this.info(
          "The `upgrade` command already exists in the commands list. If you would like the upgrade command to be managed by the `@shell-shock/plugin-upgrade` package, please remove or rename the command."
        );
      } else {
        this.inputs.push({
          id: this.config.upgrade.command.name,
          alias: ["up", "update"],
          path: this.config.upgrade.command.name,
          segments: [this.config.upgrade.command.name],
          title: "Upgrade",
          icon: "★",
          description: `A command for checking and upgrading the version of the ${getAppTitle(
            this,
            true
          )} command-line interface application.`,
          entry: {
            file: joinPaths(this.entryPath, "upgrade", "index.ts"),
            input: {
              file: joinPaths(this.entryPath, "upgrade", "command.ts")
            }
          },
          isVirtual: false,
          ...this.config.upgrade.command
        });
      }
    },
    async prepare() {
      this.debug(
        "Rendering upgrade built-in and command modules for the Shell Shock `upgrade` plugin."
      );

      return render(
        this,
        <>
          <UpgradeBuiltin />
          <UpgradeCommand />
        </>
      );
    }
  };
};

export default plugin;
