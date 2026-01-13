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

import { For } from "@alloy-js/core/components";
import nodejs from "@powerlines/plugin-nodejs";
import { getCommandTree } from "@shell-shock/core/plugin-utils";
import core from "@shell-shock/core/powerlines";
import type { CommandTree } from "@shell-shock/core/types/command";
import theme from "@shell-shock/plugin-theme";
import type { Plugin } from "powerlines/types/plugin";
import { ConsoleBuiltin } from "./components/builtin/console";
import { UtilsBuiltin } from "./components/builtin/utils";
import { BinEntry } from "./components/entry/bin";
import { CommandEntry } from "./components/entry/command";
import {
  ShutdownFunctionDeclaration,
  ShutdownFunctionUsage
} from "./components/shutdown";
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
    ...core(options),
    nodejs(options),
    theme({
      theme: options.theme
    }),
    {
      name: "shell-shock:script-preset",
      config() {
        this.trace(
          "Providing default configuration for the Shell Shock `script` preset."
        );

        return {
          defaultOptions: getDefaultOptions,
          isCaseSensitive: false,
          ...options
        };
      },
      async prepare() {
        this.trace(
          "Rendering source code with the Shell Shock `script` preset."
        );

        const commands = this.inputs
          .map(input => getCommandTree(this, input.path.segments))
          .filter(Boolean) as CommandTree[];

        return this.render<TContext>(
          <>
            <BinEntry
              prefix={<ShutdownFunctionDeclaration />}
              postfix={<ShutdownFunctionUsage />}
            />
            <For each={commands}>
              {command => <CommandEntry command={command} />}
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
