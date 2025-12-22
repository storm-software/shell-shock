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

import { joinPaths } from "@stryke/path/join-paths";
import type { CommandTree, SerializedCommandTree } from "../types";
import type { Context } from "../types/context";

export function getCommandsPersistencePath(context: Context): string {
  return joinPaths(context.dataPath, `commands.json`);
}

function serializedCommandTree(
  commands: Record<string, CommandTree>
): Record<string, SerializedCommandTree> {
  const serialize = (
    node: CommandTree,
    parent: string | null = null
  ): SerializedCommandTree => {
    const serializedNode: SerializedCommandTree = {
      ...node,
      parent,
      children: {}
    };

    for (const [key, child] of Object.entries(node.children || {})) {
      serializedNode.children[key] = serialize(child, node.id);
    }

    return serializedNode;
  };

  const result: Record<string, SerializedCommandTree> = {};
  for (const [key, child] of Object.entries(commands)) {
    result[key] = serialize(child, null);
  }

  return result;
}

function deserializeCommandTree(
  serializedCommands: Record<string, SerializedCommandTree>
): Record<string, CommandTree> {
  const deserialize = (
    node: SerializedCommandTree,
    parent: CommandTree | null = null
  ): CommandTree => {
    const deserializedNode: CommandTree = {
      ...node,
      parent,
      children: {}
    };

    for (const [key, child] of Object.entries(node.children || {})) {
      deserializedNode.children[key] = deserialize(child, deserializedNode);
    }

    return deserializedNode;
  };

  const result: Record<string, CommandTree> = {};
  for (const [key, child] of Object.entries(serializedCommands)) {
    result[key] = deserialize(child, null);
  }

  return result;
}

export async function readCommandsPersistence(context: Context) {
  const reflections = await context.fs.read(
    getCommandsPersistencePath(context)
  );
  if (!reflections || !reflections.length) {
    throw new Error(
      `CLI Command reflection file ${getCommandsPersistencePath(context)} is empty`
    );
  }

  context.commands = deserializeCommandTree(JSON.parse(reflections));
}

export async function writeCommandsPersistence(context: Context) {
  const filePath = getCommandsPersistencePath(context);

  await context.fs.write(
    filePath,
    JSON.stringify(
      serializedCommandTree(context.commands),
      null,
      context.config.mode === "development" ? 2 : 0
    )
  );
}
