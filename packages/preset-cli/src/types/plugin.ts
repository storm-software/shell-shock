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
  CommandBase,
  CommandOption
} from "@shell-shock/core/types/command";
import type { Context } from "@shell-shock/core/types/context";
import type {
  ThemePluginResolvedConfig,
  ThemePluginUserConfig
} from "@shell-shock/plugin-theme/types/plugin";
import type {
  UpgradePluginContext,
  UpgradePluginOptions,
  UpgradePluginResolvedConfig,
  UpgradePluginUserConfig
} from "@shell-shock/plugin-upgrade/types/plugin";
import type {
  ScriptPresetContext,
  ScriptPresetOptions,
  ScriptPresetResolvedConfig,
  ScriptPresetUserConfig
} from "@shell-shock/preset-script/types/plugin";

export type CLIPresetOptions = Omit<ScriptPresetOptions, "defaultOptions"> & {
  /**
   * The default interactive mode to apply to commands.
   *
   * @remarks
   * The following modes are available:
   * - `true`: Enable interactivity when a TTY is detected and no explicit interactive flag is set (default).
   * - `false`: Disable interactivity unless an explicit interactive flag is set.
   * - `"never"`: Always disable interactivity, regardless of TTY presence or flags.
   *
   * @defaultValue `true`
   */
  interactive?: boolean | "never";

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
    | ((context: Context, input: CommandBase) => CommandOption[])
    | false;

  /**
   * Whether to include the upgrade process provided by the `@shell-shock/plugin-upgrade` package. If set to `true`, the upgrade command will be included with default options. If set to an object, the provided options will be used to configure the upgrade command. If set to `false`, the upgrade command will not be included.
   *
   * @remarks
   * The upgrade command allows users to check for and perform upgrades to the latest version of the application. If you would like to include the upgrade command in your CLI application, but manage its configuration separately, you can set this field to `true` and configure the upgrade plugin directly in your application's configuration.
   */
  upgrade?: UpgradePluginOptions | false;
};

export type CLIPresetUserConfig = ScriptPresetUserConfig &
  ThemePluginUserConfig &
  UpgradePluginUserConfig &
  Omit<CLIPresetOptions, "upgrade">;

export type CLIPresetResolvedConfig = ScriptPresetResolvedConfig &
  UpgradePluginResolvedConfig &
  ThemePluginResolvedConfig &
  Required<Pick<CLIPresetOptions, "interactive" | "defaultOptions">>;

export type CLIPresetContext<
  TResolvedConfig extends CLIPresetResolvedConfig = CLIPresetResolvedConfig
> = ScriptPresetContext<TResolvedConfig> &
  UpgradePluginContext<TResolvedConfig>;
