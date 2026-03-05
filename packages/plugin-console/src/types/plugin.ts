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

import type { AlloyPluginContext } from "@powerlines/plugin-alloy/types";
import type { Context, ResolvedConfig, UserConfig } from "@shell-shock/core";
import type {
  ThemePluginContext,
  ThemePluginOptions,
  ThemePluginResolvedConfig,
  ThemePluginUserConfig
} from "@shell-shock/plugin-theme";

export interface ConsolePluginOptions extends ThemePluginOptions {}

export type ConsolePluginUserConfig = ThemePluginUserConfig & UserConfig & {};

export type ConsolePluginResolvedConfig = ResolvedConfig &
  ThemePluginResolvedConfig;

export type ConsolePluginContext<
  TResolvedConfig extends ConsolePluginResolvedConfig =
    ConsolePluginResolvedConfig
> = AlloyPluginContext<TResolvedConfig> &
  ThemePluginContext<TResolvedConfig> &
  Context<TResolvedConfig>;
