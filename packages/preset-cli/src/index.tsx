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

import script from "@shell-shock/preset-script";
import type { Plugin } from "powerlines/types/plugin";
import { ConsoleBuiltin } from "./components/builtin/console";
import { getDefaultOptions } from "./helpers/get-default-options";
import type { CLIPresetContext, CLIPresetOptions } from "./types/plugin";

/**
 * The Shell Shock base plugin.
 */
export const plugin = <TContext extends CLIPresetContext = CLIPresetContext>(
  options: CLIPresetOptions = {}
) => {
  return [
    script<TContext>(options),
    {
      name: "shell-shock:cli-preset",
      config() {
        this.trace(
          "Providing default configuration for the Shell Shock `cli` preset plugin."
        );

        return {
          interactive: true,
          defaultOptions: getDefaultOptions,
          ...options
        };
      },
      async prepare() {
        this.trace("Preparing the Shell Shock `base` build plugin.");

        return this.render(
          <>
            <ConsoleBuiltin />
          </>
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
