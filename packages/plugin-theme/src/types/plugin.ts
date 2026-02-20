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
  AlloyPluginOptions,
  AlloyPluginResolvedConfig
} from "@powerlines/plugin-alloy/types";
import type {
  StyleDictionaryPluginContext,
  StyleDictionaryPluginOptions,
  StyleDictionaryPluginResolvedConfig,
  StyleDictionaryPluginUserConfig
} from "@powerlines/plugin-style-dictionary/types";
import type { Context } from "powerlines/types/context";
import type { ThemeResolvedConfig, ThemeUserConfig } from "./theme";

export type ThemePluginOptions = StyleDictionaryPluginOptions &
  AlloyPluginOptions & {
    /**
     * Theme configuration for the plugin.
     */
    theme?: ThemeUserConfig;
  };

export type ThemePluginUserConfig = StyleDictionaryPluginUserConfig &
  AlloyPluginOptions &
  ThemePluginOptions;

export type ThemePluginResolvedConfig = StyleDictionaryPluginResolvedConfig &
  AlloyPluginResolvedConfig & {
    /**
     * Resolved theme configuration for the plugin.
     */
    theme: ThemeResolvedConfig;
  };

export type ThemePluginContext<
  TResolvedConfig extends ThemePluginResolvedConfig = ThemePluginResolvedConfig
> = AlloyPluginContext<TResolvedConfig> &
  StyleDictionaryPluginContext<TResolvedConfig> &
  Context<TResolvedConfig> & {
    /**
     * Resolved theme configuration.
     */
    theme: ThemeResolvedConfig;
  };
