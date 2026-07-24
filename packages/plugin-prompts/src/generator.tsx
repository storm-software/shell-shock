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
} from "@shell-shock/core/helpers/power-plant";
import { PromptsBuiltin } from "./components";

/**
 * Power Plant generator for Shell Shock prompts builtins.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const promptsGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-prompts",
    title: "Shell Shock Prompts Generator",
    description:
      "Generates the prompts built-in module from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "prompts", "alloy-js"]
  },
  generator: async (_commands, options) => {
    await renderCommandTemplate(options, <PromptsBuiltin />);
  }
});

export default promptsGenerator;
