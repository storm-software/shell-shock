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

import { code, computed, For, Show } from "@alloy-js/core";
import { VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components";
import { render } from "@powerlines/plugin-alloy/render";
import {
  getAppDescription,
  getAppName,
  getCommandList
} from "@shell-shock/core/plugin-utils";
import completions from "@shell-shock/plugin-completions";
import console from "@shell-shock/plugin-console";
import help from "@shell-shock/plugin-help";
import prompts from "@shell-shock/plugin-prompts";
import upgrade from "@shell-shock/plugin-upgrade";
import { BinEntry } from "@shell-shock/preset-script/components/bin-entry";
import { joinPaths } from "@stryke/path";
import type { Plugin } from "powerlines";
import { BannerBuiltin } from "./components/banner-builtin";
import { CommandEntry } from "./components/command-entry";
import { CommandRouter } from "./components/command-router";
import { UpgradeBuiltin } from "./components/upgrade-builtin";
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
): Plugin<TContext>[] => {
  return [
    ...console<TContext>(options),
    ...help<TContext>(options),
    ...prompts<TContext>(options),
    ...(options.completions !== false
      ? completions<TContext>(options.completions)
      : []),
    upgrade<TContext>(options),
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
      prepare: {
        order: "post",
        async handler() {
          this.debug("Rendering built-in modules.");

          const commands = await getCommandList(this);
          this.debug(
            `Rendering \`banner\` built-ins for each of the ${
              commands.length
            } command modules.`
          );

          const bin = computed(() => ({
            id: "",
            name: getAppName(this),
            title: "",
            description: getAppDescription(this),
            isVirtual: true,
            path: null,
            segments: [],
            alias: [],
            tags: [],
            options: Object.fromEntries(
              this.options.map(option => [option.name, option])
            ),
            entry: {
              file: joinPaths(this.entryPath, "bin.ts")
            },
            args: [],
            parent: null,
            children: this.commands
          }));

          return render(
            this,
            <>
              <UpgradeBuiltin />
              <BannerBuiltin command={bin.value} />
              <Spacing />
              <For
                each={commands.sort((a, b) => a.name.localeCompare(b.name))}
                doubleHardline>
                {command => <BannerBuiltin command={command} />}
              </For>
            </>
          );
        }
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
                    "colors"
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
                    "isCancel"
                  ],
                  env: ["env", "paths"],
                  upgrade: ["executeUpgrade"]
                }}>
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
                {code`await showBanner(0);`}
                <Spacing />
                {code`return showHelp(); `}
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
  ];
};

export default plugin;
