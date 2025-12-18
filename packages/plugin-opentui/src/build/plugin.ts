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

import type { Plugin } from "powerlines";
import type {
  OpenTUIPluginContext,
  OpenTUIPluginOptions
} from "./types/plugin";

/**
 * The core Powerlines plugin to build Shell Shock projects.
 */
export const plugin = <
  TContext extends OpenTUIPluginContext = OpenTUIPluginContext
>(
  options: OpenTUIPluginOptions
): Plugin<TContext> => {
  return {
    name: "opentui",
    dependsOn: [],
    config() {
      this.trace(
        "Providing default configuration for the Powerlines `vite` build plugin."
      );
      return {
        build: {}
      };
    }
  };
};
