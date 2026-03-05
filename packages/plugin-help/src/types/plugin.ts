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

export type HelpPluginOutputVariant = "builtin" | "command" | "both";

export interface HelpPluginOptions {
  /**
   * The variant of help output to generate. This can be set to "builtin" to generate help output for built-in commands, "command" to generate help output for user-defined commands, or "both" to generate help output for both built-in and user-defined commands. If not specified, the plugin will default to generating help output for both built-in and user-defined commands.
   */
  variant?: HelpPluginOutputVariant;

  /**
   * Theme plugin options.
   */
  theme?: ThemePluginOptions;

  /**
   * Console plugin options.
   */
  console?: ConsolePluginOptions;
}

export type HelpPluginUserConfig = ThemePluginUserConfig &
  ConsolePluginUserConfig &
  UserConfig & {
    /**
     * Resolved help configuration for the plugin.
     */
    help: Omit<HelpPluginOptions, "theme" | "console">;
  };

export type HelpPluginResolvedConfig = ThemePluginResolvedConfig &
  ConsolePluginResolvedConfig &
  ResolvedConfig & {
    /**
     * Resolved help configuration for the plugin.
     */
    help: Required<Omit<HelpPluginOptions, "theme" | "console">>;
  };

export type HelpPluginContext<
  TResolvedConfig extends HelpPluginResolvedConfig = HelpPluginResolvedConfig
> = ThemePluginContext<TResolvedConfig> &
  ConsolePluginContext<TResolvedConfig> &
  Context<TResolvedConfig>;
