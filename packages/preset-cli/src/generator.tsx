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
import { computeBin, getCommandList } from "@shell-shock/core/plugin-utils";
import type { CommandTree } from "@shell-shock/core/types/command";
import { BinEntry } from "@shell-shock/preset-script/components/bin-entry";
import { BannerBuiltin } from "./components/banner-builtin";
import { CommandEntry } from "./components/command-entry";
import { CommandRouter } from "./components/command-router";
import { UpdateBuiltin } from "./components/update-builtin";
import { VirtualCommandEntry } from "./components/virtual-command-entry";

/**
 * Power Plant generator for Shell Shock CLI preset built-in modules.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const cliBuiltinsGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-cli-builtins",
    title: "Shell Shock CLI Builtins Generator",
    description:
      "Generates CLI preset built-in modules (update, banner) from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "cli", "alloy-js", "builtins"]
  },
  generator: async (_commands, options) => {
    const commands = await getCommandList(options.context);

    await renderCommandTemplate(
      options,
      <>
        <UpdateBuiltin />
        <BannerBuiltin command={computeBin(options.context)} />
        <For
          each={commands.sort((a, b) => a.name.localeCompare(b.name))}
          doubleHardline>
          {command => <BannerBuiltin command={command} />}
        </For>
      </>
    );
  }
});

/**
 * Power Plant generator for Shell Shock CLI preset entrypoint modules.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const cliEntrypointGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-cli-entrypoint",
    title: "Shell Shock CLI Entrypoint Generator",
    description:
      "Generates CLI preset entrypoint and command router modules from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "cli", "alloy-js", "entrypoint"]
  },
  generator: async (_commands, options) => {
    const context = options.context;

    await renderCommandTemplate(
      options,
      <>
        <BinEntry
          builtinImports={{
            console: [
              "info",
              "debug",
              "warn",
              "help",
              "error",
              "cursor",
              "divider",
              "stripAnsi",
              "writeLine",
              "splitText"
            ],
            utils: ["isMinimal", "isInteractive"],
            state: ["useArgs", "isHelp"],
            prompts: [
              "text",
              "numeric",
              "toggle",
              "select",
              "confirm",
              "isCancel"
            ],
            env: ["env", "paths"],
            update: ["executeUpdate"]
          }}>
          <Show when={Object.keys(context.commands).length > 0}>
            <VarDeclaration
              let
              name="args"
              type="string[]"
              initializer={code`useArgs();`}
            />
            <hbr />
            <CommandRouter segments={[]} commands={context.commands ?? {}} />
            <hbr />
          </Show>
          <hbr />
          {code`await showBanner(0);`}
          <Spacing />
          {code`return showHelp(); `}
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

export default cliBuiltinsGenerator;
