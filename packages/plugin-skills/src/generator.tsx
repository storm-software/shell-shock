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

/**
 * Power Plant generator for Shell Shock skills commands.
 *
 * @remarks
 * Skills content is prepared by the plugin; invoke with a `template` override.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const skillsGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-skills",
    title: "Shell Shock Skills Generator",
    description:
      "Generates the skills command module from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "skills", "alloy-js"]
  },
  generator: async (_commands, options) => {
    if (!options.template) {
      return;
    }

    await renderCommandTemplate(options, options.template);
  }
});

export default skillsGenerator;
