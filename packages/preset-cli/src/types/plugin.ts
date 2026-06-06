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
  SkillsPluginContext,
  SkillsPluginOptions,
  SkillsPluginResolvedConfig,
  SkillsPluginUserConfig
} from "@shell-shock/plugin-skills";
import type {
  ThemePluginContext,
  ThemePluginResolvedConfig,
  ThemePluginUserConfig
} from "@shell-shock/plugin-theme/types/plugin";
import type {
  UpdatePluginContext,
  UpdatePluginOptions,
  UpdatePluginResolvedConfig,
  UpdatePluginUserConfig
} from "@shell-shock/plugin-update/types/plugin";
import type { ScriptPresetOptions } from "@shell-shock/preset-script/types/plugin";
import type { ResolvedConfig } from "powerlines";

export type UpdateType = "confirm" | "auto" | "manual";

export type CLIPresetBannerFontOption =
  | "console"
  | "block"
  | "simpleBlock"
  | "simple"
  | "3d"
  | "simple3d"
  | "chrome"
  | "huge"
  | "shade"
  | "slick"
  | "grid"
  | "pallet"
  | "tiny";

export interface CLIPresetBannerOption {
  /**
   * The text to display in the banner header. If not specified, the application name will be used.
   */
  text?: string;

  /**
   * The font to use for the banner header.
   *
   * @see https://github.com/dominikwilkowski/cfonts
   *
   * @remarks
   * This option determines the visual style of the banner displayed when running the CLI application. The available fonts include:
   * - `tiny` (default): A small, compact font that is ideal for minimalist banners or when space is limited.
   * ![tiny font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/tiny.png)
   * - `console`: A font that mimics the appearance of text in a console or terminal.
   * ![console font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/console.png)
   * - `block`: A bold, block-style font with thick lines and sharp edges.
   * ![block font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/block.png)
   * - `simpleBlock`: A simpler version of the block font with less ornamentation.
   * ![simpleBlock font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/simpleblock.png)
   * - `simple`: A clean and straightforward font with minimal styling.
   * ![simple font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/simple.png)
   * - `3d`: A three-dimensional font with shading and depth effects.
   * ![3d font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/3d.png)
   * - `simple3d`: A simpler version of the 3D font with less shading and depth.
   * ![simple3d font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/simple3d.png)
   * - `chrome`: A shiny, metallic font with a futuristic appearance.
   * ![chrome font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/chrome.png)
   * - `huge`: An extra-large font that makes a bold statement.
   * ![huge font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/huge.png)
   * - `shade`: A font with a shadow effect that adds depth and dimension.
   * ![shade font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/shade.png)
   * - `slick`: A sleek and modern font with smooth curves and a polished look.
   * ![slick font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/slick.png)
   * - `grid`: A monospaced font that resembles text on a grid or graph paper.
   * ![grid font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/grid.png)
   * - `pallet`: A font with a hand-drawn, artistic style that adds a creative touch to the banner.
   * ![pallet font style](https://raw.githubusercontent.com/dominikwilkowski/cfonts/released/img/pallet.png)
   *
   * @defaultValue "tiny"
   */
  font?: CLIPresetBannerFontOption;

  /**
   * Colors for the banner font.
   *
   * @defaultValue []
   */
  colors?: string[];

  /**
   * Color string for the banner background.
   *
   * @defaultValue "Black"
   */
  background?: string;

  /**
   * Alias for `background`.
   */
  backgroundColor?: string;

  /**
   * Space between letters.
   *
   * @defaultValue set by selected font face
   */
  letterSpacing?: number;

  /**
   * Space between lines.
   *
   * @defaultValue 1
   */
  lineHeight?: number;

  /**
   * Do not output spaces before and after the banner output.
   *
   * @defaultValue false
   */
  spaceless?: boolean;

  /**
   * Maximum number of characters per line.
   *
   * @defaultValue width of console window
   */
  maxLength?: number;

  /**
   * Gradient color pair.
   *
   * @defaultValue false
   */
  gradient?: string | string[] | boolean;

  /**
   * Calculate gradients per line when enabled.
   */
  independentGradient?: boolean;

  /**
   * Enable transition gradients.
   */
  transitionGradient?: boolean;

  /**
   * The environment cfonts is running in.
   */
  env?: string;
}

export type CLIPresetOptions = Omit<ScriptPresetOptions, "globalOptions"> &
  HelpPluginOptions &
  PromptsPluginOptions &
  UpdatePluginOptions & {
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
     * The type of update to perform. This option determines how the update process will be handled.
     *
     * @remarks
     * The update logic will behave differently based on the value of this field:
     * - `"confirm"` - the user will be prompted to confirm the update before it is performed. This is the default behavior and is recommended for most users, as it provides an extra layer of safety against unintended updates.
     * - `"auto"` - the update will be performed automatically without any user confirmation. This option is suitable for advanced users who want a seamless update experience and are confident in the stability of new versions.
     * - `"manual"` - the command will only display the latest available version without performing any update. This option is useful for users who want to check for updates without making any changes to their system.
     *
     * @defaultValue "confirm"
     */
    updateType?: UpdateType | false;

    /**
     * The title to display in the banner for the CLI application. If not specified, the application name will be used.
     */
    banner?: string | CLIPresetBannerOption;

    /**
     * Configuration options for the `completions` plugin. This field allows you to customize the behavior of the `completions` plugin, which provides commands for generating shell completion scripts for the CLI application. You can specify which shells to generate completions for, and other related settings.
     */
    completions?: Pick<CompletionsPluginOptions, "shells"> | false;

    /**
     * Configuration options for the `changelog` plugin. This field allows you to customize the behavior of the `changelog` plugin, which provides commands for displaying the application's changelog. You can specify the path to the changelog file, the command name, and other related settings.
     */
    changelog?: ChangelogPluginOptions | false;

    /**
     * Configuration options for the `skills` plugin. This field allows you to customize the behavior of the `skills` plugin, which provides commands for managing and displaying the application's skills. You can specify the command name, and other related settings.
     *
     * @remarks
     * If the `skills` plugin is enabled but the specified skills path does not exist, the plugin will be automatically disabled and a warning message will be logged. By default, the plugin looks for a `skills` directory in the current working directory.
     */
    skills?: SkillsPluginOptions | false;
  };

export type CLIPresetUserConfig = UserConfig &
  ThemePluginUserConfig &
  ConsolePluginUserConfig &
  PromptsPluginUserConfig &
  BannerPluginUserConfig &
  HelpPluginUserConfig &
  CompletionsPluginUserConfig &
  ChangelogPluginUserConfig &
  SkillsPluginUserConfig &
  UpdatePluginUserConfig &
  CLIPresetOptions;

export type CLIPresetResolvedConfig = ResolvedConfig &
  ThemePluginResolvedConfig &
  ConsolePluginResolvedConfig &
  PromptsPluginResolvedConfig &
  BannerPluginResolvedConfig &
  HelpPluginResolvedConfig &
  CompletionsPluginResolvedConfig &
  ChangelogPluginResolvedConfig &
  SkillsPluginResolvedConfig &
  UpdatePluginResolvedConfig &
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
  SkillsPluginContext<TResolvedConfig> &
  UpdatePluginContext<TResolvedConfig>;
