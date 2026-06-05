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

export interface SkillsPluginOptions {
  /**
   * The path to the skills directory relative to the project root. This is where the plugin will read the skills data files.
   *
   * @defaultValue "\{root\}/skills"
   */
  path?: string;

  /**
   * Whether to skip adding skills for commands that are missing.
   *
   * @defaultValue false
   */
  skipMissingSkills?: boolean;

  /**
   * Should the plugin add the `skills` command?
   *
   * @remarks
   * This can be set to a string to specify a custom command name for the `skills` command or an object to override the default command configuration. By default, the command name will be `"skills"`.
   *
   * @defaultValue "./skills"
   */
  command?: Partial<CommandConfig> | string;
}

export type SkillsPluginUserConfig = UserConfig & {
  /**
   * Resolved skills configuration for the plugin.
   */
  skills: SkillsPluginOptions;
};

export type SkillsPluginResolvedConfig = ResolvedConfig & {
  /**
   * Resolved skills configuration for the plugin.
   */
  skills: Required<Omit<SkillsPluginOptions, "command">> & {
    /**
     * Resolved command configuration for the skills command.
     */
    command: RequiredKeys<Partial<CommandConfig>, "name">;
  };
};

export type SkillsPluginContext<
  TResolvedConfig extends SkillsPluginResolvedConfig =
    SkillsPluginResolvedConfig
> = Context<TResolvedConfig>;
