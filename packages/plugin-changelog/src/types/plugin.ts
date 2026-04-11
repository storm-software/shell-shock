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
   * @remarks
   * If not provided, the plugin will attempt to resolve the changelog file by looking for common changelog file names (e.g., `CHANGELOG.md`, `RELEASE-NOTES.md`, etc.) in the application's root directory. If a specific file name is provided but cannot be found, it will fall back to looking for common changelog file names. If no valid changelog file can be resolved, the `changelog` command will not be added to the application. The following list of common changelog file names will be used for resolution:
   * - `CHANGELOG.md`
   * - `changelog.md`
   * - `Changelog.md`
   * - `CHANGELOG.markdown`
   * - `changelog.markdown`
   * - `Changelog.markdown`
   * - `CHANGELOG.txt`
   * - `changelog.txt`
   * - `Changelog.txt`
   * - `RELEASE-NOTES.md`
   * - `release-notes.md`
   * - `Release-Notes.md`
   * - `RELEASE-NOTES.markdown`
   * - `release-notes.markdown`
   * - `Release-Notes.markdown`
   * - `RELEASE-NOTES.txt`
   * - `release-notes.txt`
   * - `Release-Notes.txt`
   * - `RELEASE_NOTES.md`
   * - `release_notes.md`
   * - `Release_Notes.md`
   * - `RELEASE_NOTES.markdown`
   * - `release_notes.markdown`
   * - `Release_Notes.markdown`
   * - `RELEASE_NOTES.txt`
   * - `release_notes.txt`
   * - `Release_Notes.txt`
   * - `RELEASES.md`
   * - `releases.md`
   * - `Releases.md`
   * - `RELEASES.markdown`
   * - `releases.markdown`
   * - `Releases.markdown`
   * - `RELEASES.txt`
   * - `releases.txt`
   * - `Releases.txt`
   * - `HISTORY.md`
   * - `history.md`
   * - `History.md`
   * - `HISTORY.markdown`
   * - `history.markdown`
   * - `History.markdown`
   * - `HISTORY.txt`
   * - `history.txt`
   * - `History.txt`
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
