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
  CommandConfig,
  Context,
  ResolvedConfig,
  UserConfig
} from "@shell-shock/core";
import type { RequiredKeys } from "@stryke/types/base";

export interface ChangelogPluginOptions {
  /**
   * The path to the changelog file to read when executing the `changelog` command. This can be an absolute path or a path relative to the application's root directory.
   *
   * @defaultValue "\{root\}/CHANGELOG.md"
   */
  file?: string;

  /**
   * Should the plugin add the `changelog` command?
   *
   * @remarks
   * This can be set to a string to specify a custom command name for the `changelog` command or an object to override the default command configuration. By default, the command name will be `"changelog"`.
   *
   * @defaultValue "changelog"
   */
  command?: Partial<CommandConfig> | string;
}

export type ChangelogPluginUserConfig = UserConfig & {
  /**
   * Resolved changelog configuration for the plugin.
   */
  changelog: ChangelogPluginOptions;
};

export type ChangelogPluginResolvedConfig = ResolvedConfig & {
  /**
   * Resolved changelog configuration for the plugin.
   */
  changelog: Required<Omit<ChangelogPluginOptions, "command">> & {
    /**
     * Resolved command configuration for the changelog command.
     */
    command: RequiredKeys<Partial<CommandConfig>, "name">;
  };
};

export type ChangelogPluginContext<
  TResolvedConfig extends ChangelogPluginResolvedConfig =
    ChangelogPluginResolvedConfig
> = Context<TResolvedConfig>;
