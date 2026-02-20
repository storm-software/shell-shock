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
  let result!: ThemeStyleBorderTypeConfig;
  switch (identifier.replace(/-corners$/, "").toLowerCase()) {
    case "double":
      result = {
        topLeft: "╔",
        topRight: "╗",
        bottomLeft: "╚",
        bottomRight: "╝",
        top: "═",
        bottom: "═",
        left: "║",
        right: "║"
      };
      break;
    case "bold":
      result = {
        topLeft: "┏",
        topRight: "┓",
        bottomLeft: "┗",
        bottomRight: "┛",
        top: "━",
        bottom: "━",
        left: "┃",
        right: "┃"
      };
      break;
    case "round":
      result = {
        topLeft: "╭",
        topRight: "╮",
        bottomLeft: "╰",
        bottomRight: "╯",
        top: "─",
        bottom: "─",
        left: "│",
        right: "│"
      };
      break;
    case "single-double":
      result = {
        topLeft: "╓",
        topRight: "╖",
        bottomLeft: "╙",
        bottomRight: "╜",
        top: "─",
        bottom: "─",
        left: "║",
        right: "║"
      };
      break;
    case "double-single":
      result = {
        topLeft: "╒",
        topRight: "╕",
        bottomLeft: "╘",
        bottomRight: "╛",
        top: "═",
        bottom: "═",
        left: "│",
        right: "│"
      };
      break;
    case "classic":
      result = {
        topLeft: "+",
        topRight: "+",
        bottomLeft: "+",
        bottomRight: "+",
        top: "-",
        bottom: "-",
        left: "|",
        right: "|"
      };
      break;
    case "diagonal":
      result = {
        topLeft: "╱╱",
        topRight: "╱╱",
        bottomLeft: "╱╱",
        bottomRight: "╱╱",
        top: "╱",
        bottom: "╱",
        left: "╱╱",
        right: "╱╱"
      };
      break;
    case "diagonal-thick":
      result = {
        topLeft: "🙼🙼",
        topRight: "🙼🙼",
        bottomLeft: "🙼🙼",
        bottomRight: "🙼🙼",
        top: "🙼",
        bottom: "🙼",
        left: "🙼🙼",
        right: "🙼🙼"
      };
      break;
    case "pointer":
      result = {
        topLeft: "▶",
        topRight: "◀",
        bottomLeft: "◀",
        bottomRight: "▶",
        top: "─",
        bottom: "─",
        left: "►",
        right: "◄"
      };
      break;
    case "outward-arrow":
      result = {
        topLeft: "↗",
        topRight: "↖",
        bottomLeft: "↙",
        bottomRight: "↘",
        top: "↑",
        bottom: "↓",
        left: "←",
        right: "→"
      };
      break;
    case "arrow":
    case "inward-arrow":
      result = {
        topLeft: "↘",
        topRight: "↙",
        bottomLeft: "↖",
        bottomRight: "↗",
        top: "↓",
        bottom: "↑",
        left: "→",
        right: "←"
      };
      break;
    case "outward-double-arrow":
      result = {
        topLeft: "⇗",
        topRight: "⇖",
        bottomLeft: "⇙",
        bottomRight: "⇘",
        top: "⇑",
        bottom: "⇓",
        left: "⇐",
        right: "⇒"
      };
      break;
    case "double-arrow":
    case "inward-double-arrow":
      result = {
        topLeft: "⇘",
        topRight: "⇙",
        bottomLeft: "⇖",
        bottomRight: "⇗",
        top: "⇓",
        bottom: "⇑",
        left: "⇒",
        right: "⇐"
      };
      break;
    case "none":
      result = {
        topLeft: " ",
        topRight: " ",
        bottomLeft: " ",
        bottomRight: " ",
        top: " ",
        bottom: " ",
        left: " ",
        right: " "
      };
      break;
    case "single":
    default:
      result = {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        top: "─",
        bottom: "─",
        left: "│",
        right: "│"
      };
      break;
  }

  result.meta = identifier.endsWith("-corners")
    ? {
        corners: true
      }
    : {};

  return result;
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
  context.theme = mergeConfig(context.theme, resolvedConfig);

  return context.theme;
}
