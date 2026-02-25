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
import prompts from "@shell-shock/plugin-prompts";
import upgrade from "@shell-shock/plugin-upgrade";
import { BinEntry } from "@shell-shock/preset-script/components/bin-entry";
import { VirtualHelp } from "@shell-shock/preset-script/components/help";
import type { Plugin } from "powerlines/types/plugin";
import { BannerFunctionDeclaration } from "./components/banner-function-declaration";
import { CommandEntry } from "./components/command-entry";
import { CommandRouter } from "./components/command-router";
import { VirtualCommandEntry } from "./components/virtual-command-entry";
import { getDefaultOptions } from "./helpers/get-default-options";
import type { CLIPresetContext, CLIPresetOptions } from "./types/plugin";

/**
 * The Shell Shock CLI Preset plugin.
 *
 * @remarks
 * This preset includes a set of built-in modules and commands to create a CLI application, as well as configuration options to customize the generated code. It also includes the `prompts` plugin to provide interactive prompts in the CLI application, and the `upgrade` plugin to manage upgrading the local application's version.
 */
export const plugin = <TContext extends CLIPresetContext = CLIPresetContext>(
  options: CLIPresetOptions = {}
) => {
  return [
    console(options),
    prompts(options),
    options.upgrade !== false && upgrade(options.upgrade),
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
                    "info",
                    "debug",
                    "warn",
                    "help",
                    "error",
                    "cursor",
                    "divider",
                    "stripAnsi",
                    "writeLine",
                    "splitText",
                    "colors",
                    "writeLine",
                    "splitText",
                    "stripAnsi",
                    "createSpinner"
                  ],
                  utils: [
                    "useApp",
                    "useArgs",
                    "isMinimal",
                    "isInteractive",
                    "isHelp"
                  ],
                  prompts: [
                    "text",
                    "numeric",
                    "toggle",
                    "select",
                    "confirm",
                    "waitForKeyPress",
                    "isCancel",
                    "sleep"
                  ],
                  upgrade: [
                    "checkForUpdates",
                    "isCheckForUpdatesRequired",
                    "upgrade"
                  ],
                  env: ["env", "paths"]
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
                    let
                    name="args"
                    type="string[]"
                    initializer={code`useArgs();`}
                  />
                  <hbr />
                  <CommandRouter segments={[]} commands={this.commands ?? {}} />
                  <hbr />
                </Show>
                <hbr />
                {code`await banner(0, false);`}
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
