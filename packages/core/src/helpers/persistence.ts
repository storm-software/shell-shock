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

import type { ReflectionClass } from "@powerlines/deepkit/vendor/type";
import {
  deserializeType,
  ReflectionFunction,
  ReflectionKind,
  resolveClassType,
  serializeType
} from "@powerlines/deepkit/vendor/type";
import { omit } from "@stryke/helpers/omit";
import { joinPaths } from "@stryke/path/join-paths";
import type {
  CommandArgument,
  CommandDynamicSegment,
  CommandOption,
  CommandTree,
  SerializedCommandDynamicSegment,
  SerializedCommandOption,
  SerializedCommandTree
} from "../types";
import type { Context } from "../types/context";

export function getCommandsPersistencePath(context: Context): string {
  return joinPaths(context.dataPath, "reflections", "commands.json");
}

export function serializedCommandTree(
  commands: Record<string, CommandTree>
): Record<string, SerializedCommandTree> {
  const serialize = (
    node: CommandTree,
    parent: string | null = null
  ): SerializedCommandTree => {
    const serializedNode: SerializedCommandTree = {
      ...node,
      options: Object.entries(node.options).reduce(
        (ret, [key, option]) => {
          ret[key] = {
            ...omit(option, ["reflection"])
          };
          return ret;
        },
        {} as Record<string, SerializedCommandOption>
      ),
      path: {
        ...node.path,
        dynamics: Object.entries(node.path.dynamics).reduce(
          (ret, [key, dynamic]) => {
            ret[key] = {
              ...omit(dynamic, ["reflection"])
            };
            return ret;
          },
          {} as Record<string, SerializedCommandDynamicSegment>
        )
      },
      arguments: node.arguments.map(param => ({
        ...omit(param, ["reflection"])
      })),
      parent,
      children: {},
      reflection: node.reflection
        ? serializeType(node.reflection.type)
        : undefined
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

export function deserializeCommandTree(
  serializedCommands: Record<string, SerializedCommandTree>
): Record<string, CommandTree> {
  const deserialize = (
    node: SerializedCommandTree,
    parent: CommandTree | null = null
  ): CommandTree => {
    const type = deserializeType(node.reflection);
    if (type.kind !== ReflectionKind.function) {
      throw new Error(
        `Failed to deserialize persisted data - invalid command handler reflection type for command ${node.id}`
      );
    }

    const reflection = new ReflectionFunction(type);

    let optionsReflection: ReflectionClass<any> | undefined;
    if (
      reflection.getParameters().length > 0 &&
      reflection.getParameters()[0]
    ) {
      const optionsType = reflection.getParameters()[0]!.type;
      if (optionsType.kind === ReflectionKind.objectLiteral) {
        optionsReflection = resolveClassType(optionsType);
      }
    }

    const deserializedNode: CommandTree = {
      ...node,
      options: optionsReflection
        ? Object.entries(node.options).reduce(
            (ret, [key, option]) => {
              ret[key] = {
                ...option,
                reflection: optionsReflection.getProperty(option.name)
              } as CommandOption;
              return ret;
            },
            {} as Record<string, CommandOption>
          )
        : {},
      path: {
        ...node.path,
        dynamics: Object.entries(node.path.dynamics).reduce(
          (ret, [key, dynamic]) => {
            ret[key] = {
              ...dynamic,
              reflection: reflection.getParameter(dynamic.name)
            } as CommandDynamicSegment;
            return ret;
          },
          {} as Record<string, CommandDynamicSegment>
        )
      },
      arguments: node.arguments.map(param => ({
        ...param,
        reflection: reflection.getParameter(param.name)
      })) as CommandArgument[],
      parent,
      children: {},
      reflection
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
