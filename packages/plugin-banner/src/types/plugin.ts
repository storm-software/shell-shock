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

import type { ResolvedConfig, UserConfig } from "@shell-shock/core";
import type { Context } from "@shell-shock/core/types/context";
import type {
  ConsolePluginContext,
  ConsolePluginOptions,
  ConsolePluginResolvedConfig,
  ConsolePluginUserConfig
} from "@shell-shock/plugin-console";
import type {
  ThemePluginContext,
  ThemePluginOptions,
  ThemePluginResolvedConfig,
  ThemePluginUserConfig
} from "@shell-shock/plugin-theme";

export interface BannerPluginOptions {
  /**
   * Theme plugin options.
   */
  theme?: ThemePluginOptions;

  /**
   * Console plugin options.
   */
  console?: ConsolePluginOptions;

  /**
   * The title to display in the banner. If not provided, the app title from the theme plugin will be used.
   */
  title?: string;
}

export type BannerPluginUserConfig = ThemePluginUserConfig &
  ConsolePluginUserConfig &
  UserConfig & {
    banner: Pick<BannerPluginOptions, "title">;
  };

export type BannerPluginResolvedConfig = ThemePluginResolvedConfig &
  ConsolePluginResolvedConfig &
  ResolvedConfig & {
    banner: Pick<BannerPluginOptions, "title">;
  };

export type BannerPluginContext<
  TResolvedConfig extends BannerPluginResolvedConfig =
    BannerPluginResolvedConfig
> = ThemePluginContext<TResolvedConfig> &
  ConsolePluginContext<TResolvedConfig> &
  Context<TResolvedConfig>;
