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

import { writeEnvTypeReflection } from "@powerlines/plugin-env/helpers";
import { joinPaths } from "@stryke/path/join-paths";
import type { CommandTree, SerializedCommandTree } from "../types";
import type { Context } from "../types/context";

function serialize(command: CommandTree): SerializedCommandTree {
  return {
    ...command,
    parent: command.parent?.name ? command.parent.name : null,
    children: Object.fromEntries(
      Object.entries(command.children || {}).map(([name, child]) => [
        name,
        serialize(child)
      ])
    )
  };
}

function deserialize(
  command: SerializedCommandTree,
  parent: CommandTree | null = null
): CommandTree {
  const result: CommandTree = {
    ...command,
    parent: parent ?? null,
    children: {}
  };

  result.children = Object.fromEntries(
    Object.entries(command.children || {}).map(([name, child]) => [
      name,
      deserialize(child, result)
    ])
  );

  return result;
}

/**
 * Gets the file path for persisting CLI command reflections.
 *
 * @param context - The Shell Shock context.
 * @returns The file path for persisting CLI command reflections.
 */
export function getCommandsPersistencePath(context: Context): string {
  return joinPaths(context.dataPath, "reflections", "commands.json");
}

/**
 * Reads the persisted CLI command reflections from the file system and populates the context's commands.
 *
 * @param context - The Shell Shock context.
 * @throws Will throw an error if the reflections file is empty or cannot be read.
 */
export async function readCommandsPersistence(context: Context) {
  const reflections = await context.fs.read(
    getCommandsPersistencePath(context)
  );
  if (!reflections || !reflections.length) {
    throw new Error(
      `CLI Command reflection file ${getCommandsPersistencePath(context)} is empty`
    );
  }

  context.commands = Object.fromEntries(
    Object.entries(
      (JSON.parse(reflections) ?? {}) as Record<string, SerializedCommandTree>
    ).map(([name, command]) => [name, deserialize(command)])
  );
}

/**
 * Writes the current CLI command reflections from the context to the file system for persistence.
 *
 * @param context - The Shell Shock context.
 * @returns A promise that resolves when the reflections have been successfully written to the file system.
 * @throws Will throw an error if there is an issue writing the reflections to the file system.
 */
export async function writeCommandsPersistence(context: Context) {
  const filePath = getCommandsPersistencePath(context);

  // Also update the environment type reflections whenever we write the command reflections, to ensure they stay in sync.
  await writeEnvTypeReflection(context, context.env.types.env, "env");

  await context.fs.write(
    filePath,
    JSON.stringify(
      Object.fromEntries(
        Object.entries(context.commands).map(([name, command]) => [
          name,
          serialize(command)
        ])
      ),
      null,
      context.config.mode === "production" ? 0 : 2
    )
  );
}
