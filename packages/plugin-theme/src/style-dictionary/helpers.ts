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

import { defu } from "defu";
import type { ThemePluginContext } from "../types/plugin";
import type {
  ThemeResolvedConfig,
  ThemeStyleBorderIdentifiers,
  ThemeStyleBorderTypeConfig
} from "../types/theme";

/**
 * Applies the specified border style type and returns the corresponding border characters.
 *
 * @param identifier - The border style identifier.
 * @returns The border type configuration with the corresponding characters.
 */
export function resolveBorderStyle(
  identifier: ThemeStyleBorderIdentifiers
): ThemeStyleBorderTypeConfig {
  switch (identifier) {
    case "double":
      return {
        topLeft: "╔",
        topRight: "╗",
        bottomLeft: "╚",
        bottomRight: "╝",
        top: "═",
        bottom: "═",
        left: "║",
        right: "║"
      };
    case "bold":
      return {
        topLeft: "┏",
        topRight: "┓",
        bottomLeft: "┗",
        bottomRight: "┛",
        top: "━",
        bottom: "━",
        left: "┃",
        right: "┃"
      };
    case "round":
      return {
        topLeft: "╭",
        topRight: "╮",
        bottomLeft: "╰",
        bottomRight: "╯",
        top: "─",
        bottom: "─",
        left: "│",
        right: "│"
      };
    case "single-double":
      return {
        topLeft: "╓",
        topRight: "╖",
        bottomLeft: "╙",
        bottomRight: "╜",
        top: "─",
        bottom: "─",
        left: "║",
        right: "║"
      };
    case "double-single":
      return {
        topLeft: "╒",
        topRight: "╕",
        bottomLeft: "╘",
        bottomRight: "╛",
        top: "═",
        bottom: "═",
        left: "│",
        right: "│"
      };
    case "classic":
      return {
        topLeft: "+",
        topRight: "+",
        bottomLeft: "+",
        bottomRight: "+",
        top: "-",
        bottom: "-",
        left: "|",
        right: "|"
      };
    case "diagonal":
      return {
        topLeft: "╱╱",
        topRight: "╱╱",
        bottomLeft: "╱╱",
        bottomRight: "╱╱",
        top: "╱",
        bottom: "╱",
        left: "╱╱",
        right: "╱╱"
      };
    case "diagonal-thick":
      return {
        topLeft: "🙼🙼",
        topRight: "🙼🙼",
        bottomLeft: "🙼🙼",
        bottomRight: "🙼🙼",
        top: "🙼",
        bottom: "🙼",
        left: "🙼🙼",
        right: "🙼🙼"
      };
    case "pointer":
      return {
        topLeft: "▶",
        topRight: "◀",
        bottomLeft: "◀",
        bottomRight: "▶",
        top: "─",
        bottom: "─",
        left: "►",
        right: "◄"
      };
    case "outward-arrow":
      return {
        topLeft: "↗",
        topRight: "↖",
        bottomLeft: "↙",
        bottomRight: "↘",
        top: "↑",
        bottom: "↓",
        left: "←",
        right: "→"
      };
    case "arrow":
    case "inward-arrow":
      return {
        topLeft: "↘",
        topRight: "↙",
        bottomLeft: "↖",
        bottomRight: "↗",
        top: "↓",
        bottom: "↑",
        left: "→",
        right: "←"
      };
    case "outward-double-arrow":
      return {
        topLeft: "⇗",
        topRight: "⇖",
        bottomLeft: "⇙",
        bottomRight: "⇘",
        top: "⇑",
        bottom: "⇓",
        left: "⇐",
        right: "⇒"
      };
    case "double-arrow":
    case "inward-double-arrow":
      return {
        topLeft: "⇘",
        topRight: "⇙",
        bottomLeft: "⇖",
        bottomRight: "⇗",
        top: "⇓",
        bottom: "⇑",
        left: "⇒",
        right: "⇐"
      };
    case "none":
      return {
        topLeft: " ",
        topRight: " ",
        bottomLeft: " ",
        bottomRight: " ",
        top: " ",
        bottom: " ",
        left: " ",
        right: " "
      };
    case "single":
    default:
      return {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        top: "─",
        bottom: "─",
        left: "│",
        right: "│"
      };
  }
}

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
  context.theme = defu(context.theme, resolvedConfig);

  return context.theme;
}
