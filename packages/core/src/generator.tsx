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

import {
  defineCommandGenerator,
  renderCommandTemplate
} from "./helpers/power-plant";
import { ExecBuiltin } from "./components/exec-builtin";
import { StateBuiltin } from "./components/state-builtin";
import { UtilsBuiltin } from "./components/utils-builtin";

/**
 * Power Plant generator for Shell Shock core built-in modules.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const coreBuiltinsGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-core-builtins",
    title: "Shell Shock Core Builtins",
    description:
      "Generates the base Shell Shock built-in modules (state, utils, exec) from the command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "core", "alloy-js", "builtins"],
    links: [
      {
        href: "https://github.com/storm-software/shell-shock",
        description: "Shell Shock Repository"
      },
      {
        href: "https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js",
        description: "Power Plant Alloy-js Generator"
      }
    ]
  },
  generator: async (_commands, options) => {
    await renderCommandTemplate(
      options,
      <>
        <StateBuiltin />
        <UtilsBuiltin />
        <ExecBuiltin />
      </>
    );
  }
});

/**
 * Power Plant generator for Shell Shock command reference documentation.
 */
export const coreDocsGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-core-docs",
    title: "Shell Shock Command Docs",
    description:
      "Generates CLI command reference documentation from the command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "core", "alloy-js", "docs"]
  },
  generator: async (_commands, options) => {
    // Docs rendering is driven by the plugin with a filtered command list;
    // this generator is invoked with an explicit template override.
    if (!options.template) {
      return;
    }

    await renderCommandTemplate(options, options.template);
  }
});

export default coreBuiltinsGenerator;
