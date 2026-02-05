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
import { getAppBin } from "@shell-shock/core/plugin-utils/context-helpers";
import theme from "@shell-shock/plugin-theme";
import type { Plugin } from "powerlines/types/plugin";
import { BinEntry } from "./components/bin-entry";
import { CommandEntry } from "./components/command-entry";
import { CommandRouter } from "./components/command-router";
import { ConsoleBuiltin } from "./components/console-builtin";
import { Help, HelpOptions } from "./components/help";
import { UtilsBuiltin } from "./components/utils-builtin";
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
    theme({
      theme: options.theme
    }),
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
      },
      async prepare() {
        this.debug(
          "Rendering built-in modules for the Shell Shock `script` preset."
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
                  console: ["divider", "writeLine", "colors", "banner", "help"],
                  utils: ["getArgs"]
                }}>
                <Show when={Object.keys(this.commands).length > 0}>
                  <VarDeclaration
                    const
                    name="args"
                    type="string[]"
                    initializer={code`getArgs();`}
                  />
                  <hbr />
                  <CommandRouter path={[]} commands={this.commands ?? {}} />
                  <hbr />
                </Show>
                <hbr />
                {code`
                writeLine("");
                banner();
                writeLine(""); `}
                <hbr />
                <hbr />
                {code`writeLine(colors.text.heading.secondary("Global Options:"));`}
                <hbr />
                <HelpOptions options={this.options} />
                {code`writeLine(""); `}
                <hbr />
                <hbr />
                <Show when={Object.keys(this.commands).length > 0}>
                  {code`writeLine(colors.text.body.secondary("The following commands are available:"));
                  writeLine(""); `}
                  <hbr />
                  <hbr />
                  <For
                    each={Object.values(this.commands)}
                    doubleHardline
                    joiner={code`writeLine(""); `}
                    ender={code`writeLine(""); `}>
                    {child => (
                      <>
                        {code`
                writeLine(colors.text.heading.primary("${child.title} ${child.isVirtual ? "" : "Command"}"));
                writeLine("");
                writeLine(colors.text.body.secondary("${child.description}"));
                writeLine("");
                `}
                        <hbr />
                        <Help command={child} indent={2} />
                        <hbr />
                      </>
                    )}
                  </For>
                  {code`help("Running a specific command with the help flag (via: '${getAppBin(
                    this
                  )} <specific command> --help') will provide additional information that is specific to that command.");
                  writeLine("");`}
                </Show>
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
