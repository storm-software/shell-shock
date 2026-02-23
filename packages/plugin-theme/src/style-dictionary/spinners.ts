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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { Config, PlatformConfig } from "style-dictionary";
import type {
  DesignToken,
  PreprocessedTokens,
  Preprocessor
} from "style-dictionary/types";
import { mergeThemes } from "../helpers/merge";
import type { SpinnerPreset } from "../helpers/spinners";
import { resolveSpinner } from "../helpers/spinners";
import type { ThemePluginContext } from "../types/plugin";
import type {
  ThemeResolvedConfig,
  ThemeSpinnerResolvedConfig,
  ThemeSpinnerUserConfig
} from "../types/theme";

/**
 * Shell Shock - Theme Spinners Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const spinners = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/spinners",
  preprocessor: (
    dictionary: PreprocessedTokens,
    _options: Config | PlatformConfig
  ): PreprocessedTokens => {
    const resolvedConfig = {} as ThemeResolvedConfig;
    resolvedConfig.name =
      (dictionary as DesignToken).$theme ?? context.config.name;

    // #region Tiered token resolution

    // #region Spinners

    const spinner = dictionary.spinner as
      | ThemeSpinnerUserConfig
      | SpinnerPreset;

    if (isSetString(spinner)) {
      resolvedConfig.spinner = resolveSpinner(
        spinner
      ) as ThemeSpinnerResolvedConfig;
    } else if (isSetObject(spinner)) {
      resolvedConfig.spinner = {
        interval: 80,
        ...spinner
      } as ThemeSpinnerResolvedConfig;
    }

    // #endregion Spinners

    // #endregion Tiered token resolution

    mergeThemes(context, resolvedConfig);

    return dictionary;
  }
});
