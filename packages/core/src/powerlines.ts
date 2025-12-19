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

import { toArray } from "@stryke/convert/to-array";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import { resolveConfig } from "./lib/resolve-config";
import type { BuildContext } from "./types/build";
import type { Options } from "./types/config";

/**
 * The core Powerlines plugin to build Shell Shock projects.
 */
export const shellShock = <TContext extends BuildContext = BuildContext>(
  options: Options = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock",
    dependsOn: [],
    async config() {
      this.trace(
        "Providing default configuration for the Powerlines `vite` build plugin."
      );

      return resolveConfig(defu(options, this.config));
    },
    configResolved() {
      this.trace("Shell Shock configuration has been resolved.");

      this.config.bin =
        !this.config.bin ||
        (Array.isArray(this.config.bin) && this.config.bin.length === 0)
          ? this.packageJson.bin
            ? Object.keys(this.packageJson.bin)
            : [kebabCase(this.config.name)]
          : toArray(this.config.bin);
    }
  };
};

export default shellShock;
