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

import { computed, For, Show } from "@alloy-js/core";
import { Spacing } from "@power-plant/alloy-js/core/components";
import {
  defineCommandGenerator,
  renderCommandTemplate
} from "@shell-shock/core/helpers/power-plant";
import {
  computeBin,
  getCommandList,
  isDynamicPathSegment
} from "@shell-shock/core/plugin-utils";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { HelpBuiltin, HelpCommand } from "./components";
import type { HelpPluginContext } from "./types/plugin";

/**
 * Power Plant generator for Shell Shock help builtins and commands.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const helpGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-help",
    title: "Shell Shock Help Generator",
    description:
      "Generates help built-in modules and the help command from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "help", "alloy-js"]
  },
  generator: async (_commands, options) => {
    const context = options.context as HelpPluginContext;
    const commands = await getCommandList(context);

    const segments = computed(() =>
      getUniqueBy(
        commands.map(command =>
          command.segments
            .filter(segment => !isDynamicPathSegment(segment))
            .filter(segment => segment.length > 0)
        ),
        segments => segments.join("/")
      )
        .filter(segments => segments.length > 0)
        .sort((a, b) => a.join("/").localeCompare(b.join("/")))
    );

    await renderCommandTemplate(
      options,
      <>
        <Show when={context.config.help.builtins !== false}>
          <HelpBuiltin command={computeBin(context)} />
          <Spacing />
          <For
            each={commands.sort((a, b) => a.name.localeCompare(b.name))}
            doubleHardline>
            {command => <HelpBuiltin command={command} />}
          </For>
          <HelpCommand commands={segments.value} />
        </Show>
      </>
    );
  }
});

export default helpGenerator;
