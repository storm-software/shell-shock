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

import { computed } from "@alloy-js/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { AnsiStyles } from "../helpers/ansi-utils";
import { getAnsiStyles } from "../helpers/ansi-utils";
import type { ThemePluginContext } from "../types/plugin";
import type { ThemeResolvedConfig } from "../types/theme";

/**
 * Hook to access the current application's theme configuration.
 *
 * @returns The resolved theme configuration.
 */
export function useTheme(): ThemeResolvedConfig {
  const context = usePowerlines<ThemePluginContext>();
  const theme = computed(() => context.theme);

  return theme.value;
}

/**
 * Hook to access the current application's ANSI colors/styles.
 *
 * @returns The ANSI colors/styles.
 */
export function useColors(): AnsiStyles {
  const theme = useTheme();
  const colors = computed(() => getAnsiStyles(theme.colors));

  return colors.value;
}
