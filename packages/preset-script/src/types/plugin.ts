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

import type { AlloyPluginContext } from "@powerlines/plugin-alloy/types/plugin";
import type {
  CommandBase,
  CommandOption,
  Context,
  Options,
  ResolvedConfig,
  UserConfig
} from "@shell-shock/core";
import type {
  BannerPluginContext,
  BannerPluginOptions,
  BannerPluginResolvedConfig,
  BannerPluginUserConfig
} from "@shell-shock/plugin-banner";
import type {
  ConsolePluginContext,
  ConsolePluginOptions,
  ConsolePluginResolvedConfig,
  ConsolePluginUserConfig
} from "@shell-shock/plugin-console";
import type {
  HelpPluginContext,
  HelpPluginOptions,
  HelpPluginResolvedConfig,
  HelpPluginUserConfig
} from "@shell-shock/plugin-help";
import type {
  ThemePluginContext,
  ThemePluginOptions,
  ThemePluginResolvedConfig,
  ThemePluginUserConfig
} from "@shell-shock/plugin-theme";

export type ScriptPresetOptions = Omit<Options, "defaultOptions"> &
  ThemePluginOptions &
  ConsolePluginOptions &
  HelpPluginOptions &
  BannerPluginOptions & {
    /**
     * A set of default command options to apply to each command.
     *
     * @remarks
     * By default, Shell Shock adds the following set of default arguments to each command:
     * - `--help` (`-h`, `-?`): Show help information.
     * - `--version` (`-v`): Show the version of the application.
     * - `--verbose`: Enable verbose output.
     *
     * To disable the addition of these default options, set this property to `false`, or provide a custom set of options/a function that returns them.
     */
    defaultOptions?:
      | CommandOption[]
      | ((context: Context, input: CommandBase) => CommandOption[])
      | false;
  };

export type ScriptPresetUserConfig = UserConfig &
  ScriptPresetOptions &
  ThemePluginUserConfig &
  ConsolePluginUserConfig &
  HelpPluginUserConfig &
  BannerPluginUserConfig;

export type ScriptPresetResolvedConfig = ResolvedConfig &
  ScriptPresetOptions &
  ThemePluginResolvedConfig &
  ConsolePluginResolvedConfig &
  HelpPluginResolvedConfig &
  BannerPluginResolvedConfig;

export type ScriptPresetContext<
  TResolvedConfig extends ScriptPresetResolvedConfig =
    ScriptPresetResolvedConfig
> = AlloyPluginContext<TResolvedConfig> &
  Context<TResolvedConfig> &
  ThemePluginContext<TResolvedConfig> &
  ConsolePluginContext<TResolvedConfig> &
  HelpPluginContext<TResolvedConfig> &
  BannerPluginContext<TResolvedConfig>;
