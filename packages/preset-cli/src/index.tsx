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
import theme from "@shell-shock/plugin-theme";
import { BinEntry } from "@shell-shock/preset-script/components/bin-entry";
import { CommandRouter } from "@shell-shock/preset-script/components/command-router";
import { ConsoleBuiltin } from "@shell-shock/preset-script/components/console-builtin";
import { VirtualHelp } from "@shell-shock/preset-script/components/help";
import { UtilsBuiltin } from "@shell-shock/preset-script/components/utils-builtin";
import type { Plugin } from "powerlines/types/plugin";
import { BannerFunctionDeclaration } from "./components/banner-function-declaration";
import { CommandEntry } from "./components/command-entry";
import { VirtualCommandEntry } from "./components/virtual-command-entry";
import { getDefaultOptions } from "./helpers/get-default-options";
import type { CLIPresetContext, CLIPresetOptions } from "./types/plugin";

/**
 * The Shell Shock base plugin.
 */
export const plugin = <TContext extends CLIPresetContext = CLIPresetContext>(
  options: CLIPresetOptions = {}
) => {
  return [
    theme({
      theme: options.theme
    }),
    {
      name: "shell-shock:cli-preset",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `cli` preset."
        );

        return {
          defaultOptions: getDefaultOptions,
          isCaseSensitive: false,
          ...options
        };
      },
      configResolved() {
        this.dependencies.didyoumean2 = "^7.0.4";
      },
      async prepare() {
        this.debug(
          "Rendering built-in modules for the Shell Shock `cli` preset."
        );

        return render(
          this,
          <>
            <UtilsBuiltin />
            <ConsoleBuiltin />
          </>
        );
      }
    },
    {
      name: "shell-shock:cli-preset:generate-entrypoint",
      prepare: {
        order: "post",
        async handler() {
          this.debug(
            "Rendering entrypoint modules for the Shell Shock `cli` preset."
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
                  utils: ["getArgs", "isMinimal"],
                  env: ["isCI"]
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
                    initializer={code`getArgs();`}
                  />
                  <hbr />
                  <CommandRouter segments={[]} commands={this.commands ?? {}} />
                  <hbr />
                </Show>
                <hbr />
                {code`writeLine("");
                banner();`}
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
