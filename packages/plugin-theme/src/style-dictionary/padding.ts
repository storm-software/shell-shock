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

import { isNumber } from "@stryke/type-checks/is-number";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type { Config, PlatformConfig } from "style-dictionary";
import type {
  DesignToken,
  PreprocessedTokens,
  Preprocessor
} from "style-dictionary/types";
import { mergeThemes } from "../helpers/merge";
import type { ThemePluginContext } from "../types/plugin";
import type {
  ThemePaddingResolvedConfig,
  ThemeResolvedConfig
} from "../types/theme";

/**
 * Shell Shock - Theme Padding Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const padding = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/padding",
  preprocessor: (
    dictionary: PreprocessedTokens,
    _options: Config | PlatformConfig
  ): PreprocessedTokens => {
    const resolvedConfig = {} as ThemeResolvedConfig;
    resolvedConfig.name =
      (dictionary as DesignToken).$theme ?? context.config.name;

    // #region Tiered token resolution

    // #region Padding

    resolvedConfig.padding ??= {} as ThemePaddingResolvedConfig;
    const padding = dictionary.padding;

    if (isNumber(padding)) {
      resolvedConfig.padding = {
        banner: padding,
        message: padding,
        app: padding,
        table: padding
      };
    } else if (isSetObject(padding)) {
      if (isNumber(padding.banner)) {
        resolvedConfig.padding.banner = padding.banner;
      }
      if (isNumber(padding.message)) {
        resolvedConfig.padding.message = padding.message;
      }
      if (isNumber(padding.app)) {
        resolvedConfig.padding.app = padding.app;
      }
      if (isNumber(padding.table)) {
        resolvedConfig.padding.table = padding.table;
      }
    }

    // #endregion Padding

    // #endregion Tiered token resolution

    mergeThemes(context, resolvedConfig);

    return dictionary;
  }
});
