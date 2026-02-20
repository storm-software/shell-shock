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
import type { Plugin } from "powerlines";
import { PromptsBuiltin } from "./components";
import type {
  PromptsPluginContext,
  PromptsPluginOptions
} from "./types/plugin";

/**
 * The Prompts - Shell Shock plugin to add completion commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends PromptsPluginContext = PromptsPluginContext
>(
  options: PromptsPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    {
      name: "shell-shock:prompts",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `prompts` plugin."
        );

        return options;
      },
      async prepare() {
        this.debug(
          "Rendering command handling modules for the Shell Shock `prompts` plugin."
        );

        return render(this, <PromptsBuiltin />);
      }
    }
  ];
};

export default plugin;
