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
  CommandInput,
  CommandOption
} from "@shell-shock/core/types/command";
import type { Options } from "@shell-shock/core/types/config";
import type { Context } from "@shell-shock/core/types/context";
import type {
  PluginContext as PowerlinesContext,
  EnvironmentConfig as PowerlinesEnvironmentConfig,
  ResolvedConfig as PowerlinesResolvedConfig,
  UserConfig as PowerlinesUserConfig
} from "powerlines";

export interface PluginOptions extends Omit<Options, "defaultOptions"> {
  /**
   * A set of default command options to apply to each command.
   *
   * @remarks
   * By default, Shell Shock adds the following set of default arguments to each command:
   * - `--help` (`-h`, `-?`): Show help information.
   * - `--version` (`-v`): Show the version of the application.
   * - `--interactive` (`-i`, `--interact`): Enable interactive mode.
   * - `--no-interactive`: Disable interactive mode.
   * - `--no-banner`: Hide the banner displayed while running the CLI application.
   * - `--verbose`: Enable verbose output.
   *
   * To disable the addition of these default options, set this property to `false`, or provide a custom set of options/a function that returns them.
   */
  defaultOptions?:
    | CommandOption[]
    | ((context: Context, input: CommandInput) => CommandOption[])
    | false;
}

export type PluginEnvironmentConfig = PowerlinesEnvironmentConfig;

export type PluginUserConfig = PowerlinesUserConfig;

export type PluginResolvedConfig = PowerlinesResolvedConfig;

export type PluginContext<
  TResolvedConfig extends PowerlinesResolvedConfig = PowerlinesResolvedConfig
> = PowerlinesContext<TResolvedConfig>;
