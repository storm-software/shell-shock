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

import { code, For, Show } from "@alloy-js/core";
import { VarDeclaration } from "@alloy-js/typescript";
import core from "@shell-shock/core/plugin";
import { getCommandTree } from "@shell-shock/core/plugin-utils";
import type { CommandTree } from "@shell-shock/core/types/command";
import theme from "@shell-shock/plugin-theme";
import { BinEntry } from "@shell-shock/preset-script/components/bin-entry";
import { CommandEntry } from "@shell-shock/preset-script/components/command-entry";
import { CommandRouter } from "@shell-shock/preset-script/components/command-router";
import { ConsoleBuiltin } from "@shell-shock/preset-script/components/console-builtin";
import { UtilsBuiltin } from "@shell-shock/preset-script/components/utils-builtin";
import { VirtualCommandEntry } from "@shell-shock/preset-script/components/virtual-command-entry";
import type { Plugin } from "powerlines/types/plugin";
import { getDefaultOptions } from "./helpers/get-default-options";
import type { CLIPresetContext, CLIPresetOptions } from "./types/plugin";

/**
 * The Shell Shock base plugin.
 */
export const plugin = <TContext extends CLIPresetContext = CLIPresetContext>(
  options: CLIPresetOptions = {}
) => {
  return [
    ...core<TContext>(options),
    theme({
      theme: options.theme
    }),
    {
      name: "shell-shock:cli-preset",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `cli` preset plugin."
        );

        return {
          interactive: true,
          defaultOptions: getDefaultOptions,
          ...options
        };
      },
      async prepare() {
        this.debug("Rendering source code with the Shell Shock `cli` preset.");

        const commands = this.inputs
          .map(input => getCommandTree(this, input.path.segments))
          .filter(Boolean) as CommandTree[];

        return this.render(
          <>
            <BinEntry>
              <Show
                when={this.commands && Object.keys(this.commands).length > 0}>
                <VarDeclaration
                  const
                  name="args"
                  type="string[]"
                  initializer={code`getArgs();`}
                />
                <hbr />
                <CommandRouter path={[]} commands={this.commands ?? {}} />
              </Show>
            </BinEntry>
            <For each={Object.values(commands)}>
              {child => (
                <Show
                  when={child.isVirtual}
                  fallback={<CommandEntry command={child} />}>
                  <VirtualCommandEntry command={child} />
                </Show>
              )}
            </For>
            <UtilsBuiltin />
            <ConsoleBuiltin />
          </>
        );
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
