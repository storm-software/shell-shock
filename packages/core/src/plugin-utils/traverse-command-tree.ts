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

import type { MaybePromise } from "@stryke/types/base";
import type { CommandTree } from "../types/command";
import type { Context } from "../types/context";

/**
 * Traverses a command tree and applies a visitor function to each node.
 *
 * @param commandTree - The command tree to traverse.
 * @param visitor - The visitor function to apply to each node.
 */
export async function traverseCommandTree(
  commandTree: CommandTree,
  visitor: (node: CommandTree) => MaybePromise<void>
): Promise<void> {
  if (!commandTree.children) {
    return;
  }

  await Promise.all(
    Object.values(commandTree.children).map(async childTree => {
      await Promise.resolve(visitor(childTree));
      await traverseCommandTree(childTree, visitor);
    })
  );
}

/**
 * Traverses all commands in the context and applies a visitor function to each command tree.
 *
 * @param context - The build context containing the command definitions.
 * @param visitor - The visitor function to apply to each command tree.
 */
export async function traverseCommands<TContext extends Context>(
  context: TContext,
  visitor: (node: CommandTree) => MaybePromise<void>
): Promise<void> {
  if (!context.commands) {
    return;
  }

  await Promise.all(
    Object.values(context.commands).map(async childTree => {
      await Promise.resolve(visitor(childTree));
      await traverseCommandTree(childTree, visitor);
    })
  );
}
