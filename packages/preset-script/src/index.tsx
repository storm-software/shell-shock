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

import { executeCommandGenerator } from "@shell-shock/core/helpers/power-plant";
import banner from "@shell-shock/plugin-banner";
import console from "@shell-shock/plugin-console";
import help from "@shell-shock/plugin-help";
import type { Plugin } from "powerlines";
import { scriptEntrypointGenerator } from "./generator";
import { getGlobalOptions } from "./helpers/get-global-options";
import type { ScriptPresetContext, ScriptPresetOptions } from "./types/plugin";

export { scriptEntrypointGenerator } from "./generator";

/**
 * The Shell Shock base plugin.
 */
export const plugin = <
  TContext extends ScriptPresetContext = ScriptPresetContext
>(
  options: ScriptPresetOptions = {}
): Plugin<TContext>[] => {
  return [
    ...console<TContext>(options),
    ...help<TContext>(options),
    ...banner<TContext>(options.banner),
    {
      name: "shell-shock/script-preset",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `script` preset."
        );

        return {
          globalOptions: getGlobalOptions,
          isCaseSensitive: false,
          ...options
        };
      },
      prepare: {
        order: "post",
        async handler() {
          this.debug(
            "Rendering entrypoint modules via Power Plant for the Shell Shock `script` preset."
          );

          return executeCommandGenerator(this, scriptEntrypointGenerator);
        }
      }
    }
  ];
};

export default plugin;
