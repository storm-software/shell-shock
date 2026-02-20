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
import theme from "@shell-shock/plugin-theme";
import type { Plugin } from "powerlines";
import { ConsoleBuiltin } from "./components";
import type {
  ConsolePluginContext,
  ConsolePluginOptions
} from "./types/plugin";

/**
 * A Shell Shock plugin to generate the `console` built-in module, which provides a set of commands for logging messages to the console and inspecting values. This plugin is designed to be used in conjunction with the `script` preset, but can also be used independently in any Shell Shock application.
 */
export const plugin = <
  TContext extends ConsolePluginContext = ConsolePluginContext
>(
  options: ConsolePluginOptions = {}
): Plugin<TContext>[] => {
  return [
    ...theme({
      theme: options.theme
    }),
    {
      name: "shell-shock:console",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `console` plugin."
        );

        return options;
      },
      async prepare() {
        this.debug(
          "Rendering command handling modules for the Shell Shock `console` plugin."
        );

        return render(this, <ConsoleBuiltin />);
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
