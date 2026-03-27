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

import { computed, For } from "@alloy-js/core";
import { Spacing } from "@powerlines/plugin-alloy/core/components";
import { render } from "@powerlines/plugin-alloy/render";
import {
  getAppDescription,
  getAppName,
  getAppTitle,
  getCommandList
} from "@shell-shock/core/plugin-utils";
import console from "@shell-shock/plugin-console";
import theme from "@shell-shock/plugin-theme";
import { joinPaths } from "@stryke/path/join";
import type { Plugin } from "powerlines";
import { BannerBuiltin } from "./components";
import type { BannerPluginContext, BannerPluginOptions } from "./types/plugin";

export type * from "./types";

/**
 * The Banner - Shell Shock plugin to add a banner command to the application.
 */
export const plugin = <
  TContext extends BannerPluginContext = BannerPluginContext
>(
  options: BannerPluginOptions = {}
) => {
  return [
    ...theme(options.theme),
    console(options.console),
    {
      name: "shell-shock:banner",
      enforce: "post",
      config() {
        return {
          banner: {
            title: options.title
          }
        };
      },
      prepare: {
        order: "post",
        async handler() {
          const commands = await getCommandList(this);
          this.debug(
            `Rendering \`banner\` built-ins for each of the ${
              commands.length
            } command modules.`
          );

          const bin = computed(() => ({
            id: "",
            name: getAppName(this),
            title: getAppTitle(this),
            description: getAppDescription(this),
            isVirtual: true,
            path: null,
            segments: [],
            alias: [],
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
    }
  ] as Plugin<TContext>[];
};

export default plugin;
