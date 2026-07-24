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

import { For } from "@alloy-js/core";
import { Spacing } from "@power-plant/alloy-js/core/components";
import {
  defineCommandGenerator,
  renderCommandTemplate
} from "@shell-shock/core/helpers/power-plant";
import { computeBin, getCommandList } from "@shell-shock/core/plugin-utils";
import { BannerBuiltin } from "./components";

/**
 * Power Plant generator for Shell Shock banner builtins.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const bannerGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-banner",
    title: "Shell Shock Banner Generator",
    description:
      "Generates banner built-in modules from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "banner", "alloy-js"]
  },
  generator: async (_commands, options) => {
    const commands = await getCommandList(options.context);

    await renderCommandTemplate(
      options,
      <>
        <BannerBuiltin command={computeBin(options.context)} />
        <Spacing />
        <For
          each={commands.sort((a, b) => a.name.localeCompare(b.name))}
          doubleHardline>
          {command => <BannerBuiltin command={command} />}
        </For>
      </>
    );
  }
});

export default bannerGenerator;
