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

import type {
  AlloyPluginContext,
  AlloyPluginOptions
} from "@powerlines/plugin-alloy/types/plugin";
import type {
  CommandBase,
  CommandOption
} from "@shell-shock/core/types/command";
import type {
  Options,
  ResolvedConfig,
  UserConfig
} from "@shell-shock/core/types/config";
import type { Context } from "@shell-shock/core/types/context";
import type {
  ThemePluginContext,
  ThemePluginOptions,
  ThemePluginResolvedConfig
} from "@shell-shock/plugin-theme/types/plugin";

export interface ScriptPresetOptions
  extends Omit<Options, "defaultOptions">,
    Partial<ThemePluginOptions> {
  /**
   * A set of default command options to apply to each command.
   *
   * @remarks
   * By default, Shell Shock adds the following set of default arguments to each command:
   * - `--help` (`-h`, `-?`): Show help information.
   * - `--version` (`-v`): Show the version of the application.
   * - `--no-banner`: Hide the banner displayed while running the CLI application.
   * - `--verbose`: Enable verbose output.
   *
   * To disable the addition of these default options, set this property to `false`, or provide a custom set of options/a function that returns them.
   */
  defaultOptions?:
    | CommandOption[]
    | ((context: Context, input: CommandBase) => CommandOption[])
    | false;

  /**
   * Configuration options for the Alloy plugin.
   */
  alloy?: AlloyPluginOptions;
}

export type ScriptPresetUserConfig = UserConfig & ScriptPresetOptions;

export type ScriptPresetResolvedConfig = ResolvedConfig &
  Required<Omit<ScriptPresetOptions, "theme">> &
  ThemePluginResolvedConfig;

export type ScriptPresetContext<
  TResolvedConfig extends
    ScriptPresetResolvedConfig = ScriptPresetResolvedConfig
> = AlloyPluginContext<TResolvedConfig> &
  ThemePluginContext<TResolvedConfig> &
  Context<TResolvedConfig>;
