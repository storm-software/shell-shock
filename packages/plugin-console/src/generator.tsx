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
import packageJson from "../package.json";
import { ConsoleBuiltin } from "./components";

/**
 * Power Plant generator for Shell Shock console builtins.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const consoleGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-console",
    title: "Shell Shock Console Generator",
    description:
      "Generates the console built-in module from the Shell Shock command tree specification.",
    version: packageJson.version,
    tags: ["shell-shock", "console", "alloy-js"]
  },
  generator: async (_commands, options) => {
    await renderCommandTemplate(options, <ConsoleBuiltin />);
  }
});

export default consoleGenerator;
