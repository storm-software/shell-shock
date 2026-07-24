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

import { code, For, Show } from "@alloy-js/core";
import { VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@power-plant/alloy-js/core/components";
import {
  defineCommandGenerator,
  renderCommandTemplate
} from "@shell-shock/core/helpers/power-plant";
import type { CommandTree } from "@shell-shock/core/types/command";
import { BinEntry } from "./components/bin-entry";
import { CommandEntry } from "./components/command-entry";
import { CommandRouter } from "./components/command-router";
import { VirtualCommandEntry } from "./components/virtual-command-entry";

/**
 * Power Plant generator for Shell Shock script preset entrypoint modules.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const scriptEntrypointGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-script-entrypoint",
    title: "Shell Shock Script Entrypoint Generator",
    description:
      "Generates script preset entrypoint and command router modules from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "script", "alloy-js", "entrypoint"]
  },
  generator: async (_commands, options) => {
    const context = options.context;

    await renderCommandTemplate(
      options,
      <>
        <BinEntry
          builtinImports={{
            console: [
              "divider",
              "stripAnsi",
              "writeLine",
              "splitText",
              "help"
            ],
            utils: ["isMinimal"],
            state: ["useArgs", "hasFlag", "isHelp"]
          }}>
          <Show when={Object.keys(context.commands).length > 0}>
            <VarDeclaration
              const
              name="args"
              type="string[]"
              initializer={code`useArgs();`}
            />
            <hbr />
            <CommandRouter segments={[]} commands={context.commands ?? {}} />
            <hbr />
          </Show>
          <Spacing />
          {code`await showBanner();`}
          <Spacing />
          {code`return showHelp();`}
        </BinEntry>
        <Show when={Object.values(context.commands).length > 0}>
          <For
            each={Object.values(context.commands as Record<string, CommandTree>)}
            doubleHardline>
            {child => (
              <Show
                when={child.virtual}
                fallback={<CommandEntry command={child} />}>
                <VirtualCommandEntry command={child} />
              </Show>
            )}
          </For>
        </Show>
      </>
    );
  }
});

export default scriptEntrypointGenerator;
