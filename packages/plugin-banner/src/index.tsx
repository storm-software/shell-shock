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

import { executeCommandGenerator } from "@shell-shock/core/helpers/power-plant";
import { getCommandList } from "@shell-shock/core/plugin-utils";
import { plugin as console } from "@shell-shock/plugin-console";
import { plugin as theme } from "@shell-shock/plugin-theme";
import type { Plugin } from "powerlines";
import { bannerGenerator } from "./generator";
import type { BannerPluginContext, BannerPluginOptions } from "./types/plugin";

export { bannerGenerator } from "./generator";
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
      name: "shell-shock/banner",
      enforce: "post",
      config() {
        return {
          banner: {
            title: options.title
          }
        };
      },
      prepare: {
        async handler() {
          const commands = await getCommandList(this);
          this.debug(
            `Rendering \`banner\` built-ins via Power Plant for each of the ${
              commands.length
            } command modules.`
          );

          return executeCommandGenerator(this, bannerGenerator);
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default plugin;
