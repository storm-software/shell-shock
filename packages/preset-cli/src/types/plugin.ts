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
  CommandOption,
  Context,
  UserConfig
} from "@shell-shock/core";
import type {
  BannerPluginContext,
  BannerPluginOptions,
  BannerPluginResolvedConfig,
  BannerPluginUserConfig
} from "@shell-shock/plugin-banner";
import type {
  ChangelogPluginContext,
  ChangelogPluginOptions,
  ChangelogPluginResolvedConfig,
  ChangelogPluginUserConfig
} from "@shell-shock/plugin-changelog";
import type {
  CompletionsPluginContext,
  CompletionsPluginOptions,
  CompletionsPluginResolvedConfig,
  CompletionsPluginUserConfig
} from "@shell-shock/plugin-completions";
import type {
  ConsolePluginContext,
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
  PromptsPluginContext,
  PromptsPluginOptions,
  PromptsPluginResolvedConfig,
  PromptsPluginUserConfig
} from "@shell-shock/plugin-prompts/types/plugin";
import type {
  ThemePluginContext,
  ThemePluginResolvedConfig,
  ThemePluginUserConfig
} from "@shell-shock/plugin-theme/types/plugin";
import type {
  UpgradePluginContext,
  UpgradePluginOptions,
  UpgradePluginResolvedConfig,
  UpgradePluginUserConfig
} from "@shell-shock/plugin-upgrade/types/plugin";
import type { ScriptPresetOptions } from "@shell-shock/preset-script/types/plugin";
import type { ResolvedConfig } from "powerlines";

export type UpgradeType = "confirm" | "auto" | "manual";

export type CLIPresetOptions = Omit<ScriptPresetOptions, "globalOptions"> &
  HelpPluginOptions &
  PromptsPluginOptions &
  UpgradePluginOptions & {
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
    globalOptions?:
      | CommandOption[]
      | ((context: Context, input: CommandBase) => CommandOption[])
      | false;

    /**
     * The type of upgrade to perform. This option determines how the upgrade process will be handled.
     *
     * @remarks
     * The upgrade logic will behave differently based on the value of this field:
     * - `"confirm"` - the user will be prompted to confirm the upgrade before it is performed. This is the default behavior and is recommended for most users, as it provides an extra layer of safety against unintended upgrades.
     * - `"auto"` - the upgrade will be performed automatically without any user confirmation. This option is suitable for advanced users who want a seamless upgrade experience and are confident in the stability of new versions.
     * - `"manual"` - the command will only display the latest available version without performing any upgrade. This option is useful for users who want to check for updates without making any changes to their system.
     *
     * @defaultValue "confirm"
     */
    upgradeType?: UpgradeType | false;

    /**
     * The title to display in the banner for the CLI application. If not specified, the application name will be used.
     */
    banner?: Pick<BannerPluginOptions, "title">;

    /**
     * Configuration options for the `completions` plugin. This field allows you to customize the behavior of the `completions` plugin, which provides commands for generating shell completion scripts for the CLI application. You can specify which shells to generate completions for, and other related settings.
     */
    completions?: Pick<CompletionsPluginOptions, "shells"> | false;

    /**
     * Configuration options for the `changelog` plugin. This field allows you to customize the behavior of the `changelog` plugin, which provides commands for displaying the application's changelog. You can specify the path to the changelog file, the command name, and other related settings.
     */
    changelog?: ChangelogPluginOptions | false;
  };

export type CLIPresetUserConfig = UserConfig &
  ThemePluginUserConfig &
  ConsolePluginUserConfig &
  PromptsPluginUserConfig &
  BannerPluginUserConfig &
  HelpPluginUserConfig &
  CompletionsPluginUserConfig &
  ChangelogPluginUserConfig &
  UpgradePluginUserConfig &
  CLIPresetOptions;

export type CLIPresetResolvedConfig = ResolvedConfig &
  ThemePluginResolvedConfig &
  ConsolePluginResolvedConfig &
  PromptsPluginResolvedConfig &
  BannerPluginResolvedConfig &
  HelpPluginResolvedConfig &
  CompletionsPluginResolvedConfig &
  ChangelogPluginResolvedConfig &
  UpgradePluginResolvedConfig &
  Required<CLIPresetOptions>;

export type CLIPresetContext<
  TResolvedConfig extends CLIPresetResolvedConfig = CLIPresetResolvedConfig
> = Context<TResolvedConfig> &
  ThemePluginContext<TResolvedConfig> &
  ConsolePluginContext<TResolvedConfig> &
  PromptsPluginContext<TResolvedConfig> &
  BannerPluginContext<TResolvedConfig> &
  HelpPluginContext<TResolvedConfig> &
  CompletionsPluginContext<TResolvedConfig> &
  ChangelogPluginContext<TResolvedConfig> &
  UpgradePluginContext<TResolvedConfig>;
