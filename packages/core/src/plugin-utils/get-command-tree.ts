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

import type { CommandTree } from "../types/command";
import type { Context } from "../types/context";
import { isVariableCommandPath } from "./context-helpers";

/**
 * Retrieves a specific command tree based on the provided path.
 *
 * @param context - The build context containing the command definitions.
 * @param path - An array of strings representing the command path.
 * @returns The command tree at the specified path, or null if not found.
 */
export function getCommandTree(
  context: Context,
  path = [] as string[]
): CommandTree | null {
  if (path.length === 0) {
    return null;
  }

  let currentTree: CommandTree | null = context.commands[path[0]!] ?? null;
  if (path.length > 1) {
    const segments = path
      .slice(1)
      .filter(segment => !isVariableCommandPath(segment));
    for (const segment of segments) {
      if (
        currentTree?.children &&
        Object.prototype.hasOwnProperty.call(currentTree.children, segment)
      ) {
        currentTree = currentTree.children[segment] ?? null;
      } else {
        return null;
      }
    }
  }

  return currentTree;
}
