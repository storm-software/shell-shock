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
import type { PluginContext } from "./types/plugin";

export * from "./types";

/**
 * The Style Dictionary - Shell Shock plugin to use Style Dictionary tokens to select theme colors to Shell Shock projects.
 */
export const plugin = <TContext extends PluginContext = PluginContext>(
  options: any
): Plugin<TContext> => {
  return {
    name: "base",
    dependsOn: [],
    config() {
      this.trace(
        "Providing default configuration for the Shell Shock `base` build plugin."
      );
      return {
        build: {}
      };
    }
  };
};
