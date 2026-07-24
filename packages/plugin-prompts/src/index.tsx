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
import theme from "@shell-shock/plugin-theme";
import type { Plugin } from "powerlines";
import { promptsGenerator } from "./generator";
import type {
  PromptsPluginContext,
  PromptsPluginOptions
} from "./types/plugin";

export { promptsGenerator } from "./generator";

/**
 * A Shell Shock plugin to generate the `prompts` built-in module, which provides a set of commands for interacting with the user through prompts. This plugin is designed to be used in conjunction with the `script` preset, but can also be used independently in any Shell Shock application.
 */
export const plugin = <
  TContext extends PromptsPluginContext = PromptsPluginContext
>(
  options: PromptsPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    ...theme({
      theme: options.theme
    }),
    {
      name: "shell-shock/prompts",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `prompts` plugin."
        );

        return options;
      },
      async prepare() {
        this.debug(
          "Rendering command handling modules via Power Plant for the Shell Shock `prompts` plugin."
        );

        return executeCommandGenerator(this, promptsGenerator);
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
