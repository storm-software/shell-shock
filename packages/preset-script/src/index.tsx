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
import { render } from "@powerlines/plugin-alloy/render";
import console from "@shell-shock/plugin-console";
import type { Plugin } from "powerlines/types/plugin";
import { BannerFunctionDeclaration, VirtualHelp } from "./components";
import { BinEntry } from "./components/bin-entry";
import { CommandEntry } from "./components/command-entry";
import { CommandRouter } from "./components/command-router";
import { VirtualCommandEntry } from "./components/virtual-command-entry";
import { getDefaultOptions } from "./helpers/get-default-options";
import type { ScriptPresetContext, ScriptPresetOptions } from "./types/plugin";

/**
 * The Shell Shock base plugin.
 */
export const plugin = <
  TContext extends ScriptPresetContext = ScriptPresetContext
>(
  options: ScriptPresetOptions = {}
) => {
  return [
    console(options),
    {
      name: "shell-shock:script-preset",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `script` preset."
        );

        return {
          defaultOptions: getDefaultOptions,
          isCaseSensitive: false,
          ...options
        };
      },
      configResolved() {
        this.dependencies.didyoumean2 = "^7.0.4";
      }
    },
    {
      name: "shell-shock:script-preset:generate-entrypoint",
      prepare: {
        order: "post",
        async handler() {
          this.debug(
            "Rendering entrypoint modules for the Shell Shock `script` preset."
          );

          return render(
            this,
            <>
              <BinEntry
                builtinImports={{
                  console: [
                    "divider",
                    "stripAnsi",
                    "writeLine",
                    "splitText",
                    "colors",
                    "help"
                  ],
                  utils: ["useArgs", "isMinimal"]
                }}
                prefix={
                  <>
                    <BannerFunctionDeclaration />
                    <hbr />
                    <hbr />
                  </>
                }>
                <Show when={Object.keys(this.commands).length > 0}>
                  <VarDeclaration
                    const
                    name="args"
                    type="string[]"
                    initializer={code`useArgs();`}
                  />
                  <hbr />
                  <CommandRouter segments={[]} commands={this.commands ?? {}} />
                  <hbr />
                </Show>
                <hbr />
                <hbr />
                {code`banner();`}
                <hbr />
                <hbr />
                <VirtualHelp
                  options={this.options}
                  commands={this.commands ?? {}}
                />
              </BinEntry>
              <Show when={Object.values(this.commands).length > 0}>
                <For each={Object.values(this.commands)} doubleHardline>
                  {child => (
                    <Show
                      when={child.isVirtual}
                      fallback={<CommandEntry command={child} />}>
                      <VirtualCommandEntry command={child} />
                    </Show>
                  )}
                </For>
              </Show>
            </>
          );
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
