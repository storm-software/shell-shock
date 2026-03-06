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

export interface HelpPluginOptions {
  /**
   * Should the plugin automatically add built-in help entries for all commands in the application?
   *
   * @defaultValue true
   */
  builtins?: boolean;

  /**
   * Should the plugin add the `help` command?
   *
   * @remarks
   * This can be set to a string to specify a custom command name for the `help` command. By default, the command name will be `"help"`.
   *
   * @defaultValue true
   */
  command?: boolean | string;

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
    help: Omit<HelpPluginOptions, "theme" | "console" | "command"> & {
      /**
       * The name of the help command to add to the application, or `false` to disable adding a help command.
       *
       * @defaultValue "help"
       */
      command: string | false;
    };
  };

export type HelpPluginResolvedConfig = ThemePluginResolvedConfig &
  ConsolePluginResolvedConfig &
  ResolvedConfig & {
    /**
     * Resolved help configuration for the plugin.
     */
    help: Required<Omit<HelpPluginOptions, "theme" | "console" | "command">> & {
      /**
       * The name of the help command to add to the application, or `false` to disable adding a help command.
       *
       * @defaultValue "help"
       */
      command: string | false;
    };
  };

export type HelpPluginContext<
  TResolvedConfig extends HelpPluginResolvedConfig = HelpPluginResolvedConfig
> = ThemePluginContext<TResolvedConfig> &
  ConsolePluginContext<TResolvedConfig> &
  Context<TResolvedConfig>;
