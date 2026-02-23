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

import { mergeConfig } from "powerlines/plugin-utils/merge";
import type { ThemePluginContext } from "../types/plugin";
import type { ThemeResolvedConfig } from "../types/theme";

/**
 * Merges the provided resolved theme configuration into the existing theme configuration in the context.
 *
 * @param context - The theme plugin context containing the current theme configuration.
 * @param resolvedConfig - The resolved theme configuration to merge into the context's theme configuration.
 * @return The merged theme configuration.
 */
export function mergeThemes<TContext extends ThemePluginContext>(
  context: TContext,
  resolvedConfig: Partial<ThemeResolvedConfig>
) {
  context.theme = mergeConfig(context.theme, resolvedConfig);

  return context.theme;
}
