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

import { reflectType } from "@powerlines/deepkit/reflect-type";
import type {
  ReflectionProperty,
  TypeParameter
} from "@powerlines/deepkit/vendor/type";
import {
  ReflectionClass,
  ReflectionKind,
  ReflectionVisibility,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { appendPath } from "@stryke/path/append";
import { commonPath } from "@stryke/path/common";
import { findFilePath, findFolderName } from "@stryke/path/file-path-fns";
import { stripStars } from "@stryke/path/normalize";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { constantCase } from "@stryke/string-format/constant-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import {
  getAppTitle,
  getVariableCommandPathName,
  isVariableCommandPath
} from "../plugin-utils/context-helpers";
import type {
  CommandInput,
  CommandParam,
  CommandTree,
  NumberCommandOption,
  StringCommandOption
} from "../types/command";
import type { Context } from "../types/context";
import { getDefaultOptions } from "./utilities";

/**
 * Resolves the description for a command option based on its reflection.
 *
 * @param propertyReflection - The reflection property of the command option.
 * @returns The resolved description for the command option.
 */
export function resolveCommandDescription(
  propertyReflection: ReflectionProperty
): string {
  return (
    propertyReflection.getDescription()?.trim() ||
    `A${
      propertyReflection.isOptional() && !propertyReflection.getDefaultValue()
        ? "n optional"
        : ""
    } ${
      propertyReflection.getType().kind === ReflectionKind.boolean
        ? "flag provided via the command-line"
        : "command-line option"
    } that allows the user to ${
      propertyReflection.getType().kind === ReflectionKind.boolean
        ? "set the"
        : propertyReflection.getType().kind === ReflectionKind.array
          ? "specify custom"
          : "specify a custom"
    } ${
      propertyReflection.getTags().title?.trim() ||
      titleCase(propertyReflection.getNameAsString())
    } ${
      propertyReflection.getType().kind === ReflectionKind.boolean
        ? "indicator"
        : `${propertyReflection.getType().kind === ReflectionKind.number ? "numeric" : "string"} value${
            propertyReflection.getType().kind === ReflectionKind.array
              ? "s"
              : ""
          }`
    } that will be used in the application.`
  );
}

export function resolveCommandId(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(p => Boolean(p) && !isVariableCommandPath(p))
    .join("/")
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "")
    .replaceAll("/", "-");
}

/**
 * Finds the command name from the given file path.
 *
 * @param file - The file path to extract the command name from.
 * @returns The command name.
 */
export function resolveCommandName(file: string) {
  let path = findFilePath(file);
  let name = findFolderName(file, {
    requireExtension: true
  });

  while (isVariableCommandPath(name)) {
    path = resolveParentPath(path);
    name = findFolderName(path, {
      requireExtension: true
    });
  }

  return name;
}

export function resolveCommandPath(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "");
}

export function resolveCommandParams(context: Context, file: string): string[] {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(p => Boolean(p) && isVariableCommandPath(p))
    .map(p => p.replaceAll(/^\[+/g, "").replaceAll(/\]+$/g, ""));
}

export function findCommandsRoot(context: Context): string {
  if (isSetString(context.config.entry)) {
    return appendPath(
      appendPath(stripStars(context.config.entry), context.config.projectRoot),
      context.workspaceConfig.workspaceRoot
    );
  } else if (
    isSetObject(context.config.entry) &&
    "file" in context.config.entry
  ) {
    return appendPath(
      appendPath(
        stripStars(context.config.entry.file),
        context.config.projectRoot
      ),
      context.workspaceConfig.workspaceRoot
    );
  } else if (
    Array.isArray(context.config.entry) &&
    context.config.entry.length > 0
  ) {
    return commonPath(
      context.config.entry.map(entry =>
        appendPath(
          appendPath(
            stripStars(isSetString(entry) ? entry : entry.file),
            context.config.projectRoot
          ),
          context.workspaceConfig.workspaceRoot
        )
      )
    );
  }

  return appendPath(
    context.config.sourceRoot || context.config.projectRoot,
    context.workspaceConfig.workspaceRoot
  );
}

/**
 * Extracts command parameter information from a type parameter reflection.
 *
 * @param param - The type parameter reflection to extract information from.
 * @returns The extracted command parameter information.
 */
export function extractCommandParameters(param: TypeParameter): CommandParam {
  return {
    name: param.name,
    description: param.description,
    optional: !!param.optional,
    variadic: param.type.kind === ReflectionKind.array,
    default: param.default
  } as CommandParam;
}

/**
 * Reflects the command tree for a given command input.
 *
 * @param context - The context in which the command is being reflected.
 * @param command - The command input to reflect.
 * @param parent - The parent command tree, if any.
 * @returns The reflected command tree.
 */
export async function reflectCommandTree<TContext extends Context = Context>(
  context: TContext,
  command: CommandInput,
  parent?: CommandTree
): Promise<CommandTree> {
  const title =
    command.title ||
    `${parent?.title ? `${parent.isVirtual ? parent.title.replace(/ Commands$/, "") : parent.title} - ` : ""}${titleCase(command.name)}${
      command.isVirtual ? " Commands" : ""
    }`;

  const tree = {
    ...command,
    title,
    description:
      command.description ||
      (command.isVirtual
        ? `A collection of available ${command.title || titleCase(command.name)} commands that are included in the ${getAppTitle(
            context
          )} command-line application.`
        : `The ${title} executable command-line interface.`),
    path: {
      ...command.path,
      variables: {}
    },
    options: getDefaultOptions(context, command),
    params: [],
    parent: parent ?? null,
    children: {}
  } as CommandTree;

  if (!command.isVirtual) {
    if (
      !command.entry.input?.file ||
      !context.fs.existsSync(command.entry.input.file)
    ) {
      throw new Error(
        `${
          !command.entry.input?.file ? "Missing" : "Non-existent"
        } command entry file for "${command.name}"`
      );
    }

    context.debug(
      `Adding reflection for user-defined command: ${command.id} (file: ${
        command.entry.input.file
      })`
    );

    const type = await reflectType<TContext>(context, command.entry.input);
    if (type.kind !== ReflectionKind.function) {
      throw new Error(
        `The command entry file "${command.entry.input.file}" does not export a valid function.`
      );
    }

    if (type.parameters.length > 0 && type.parameters[0]) {
      const firstParam = type.parameters[0];
      if (
        firstParam.type.kind === ReflectionKind.objectLiteral ||
        firstParam.type.kind === ReflectionKind.class
      ) {
        const optionsReflection = ReflectionClass.from(firstParam.type);
        for (const propertyReflection of optionsReflection.getProperties()) {
          const propertyType = propertyReflection.getType();

          tree.options[propertyReflection.getNameAsString()] = {
            name: propertyReflection.getNameAsString(),
            alias: propertyReflection.getTags().alias ?? [],
            title:
              propertyReflection.getTags().title?.trim() ||
              titleCase(propertyReflection.getNameAsString()),
            description: resolveCommandDescription(propertyReflection),
            env: constantCase(propertyReflection.getNameAsString()),
            kind: propertyType.kind as
              | ReflectionKind.string
              | ReflectionKind.number
              | ReflectionKind.boolean,
            optional: propertyReflection.isOptional(),
            default: propertyReflection.getDefaultValue(),
            variadic: false
          };
          if (propertyType.kind === ReflectionKind.array) {
            if (
              propertyType.type.kind === ReflectionKind.string ||
              propertyType.type.kind === ReflectionKind.number
            ) {
              (
                tree.options[propertyReflection.getNameAsString()] as
                  | StringCommandOption
                  | NumberCommandOption
              ).variadic = true;
              (
                tree.options[propertyReflection.getNameAsString()] as
                  | StringCommandOption
                  | NumberCommandOption
              ).kind = propertyType.type.kind;
            } else {
              throw new Error(
                `Unsupported array type for option "${propertyReflection.getNameAsString()}" in command "${
                  command.name
                }". Only string[] and number[] are supported.`
              );
            }
          } else if (
            propertyType.kind !== ReflectionKind.boolean &&
            propertyType.kind !== ReflectionKind.string &&
            propertyType.kind !== ReflectionKind.number
          ) {
            throw new Error(
              `Unsupported type for option "${propertyReflection.getNameAsString()}" in command "${
                command.name
              }". Only string, number, boolean, string[] and number[] are supported, received ${stringifyType(
                propertyType
              )
                .trim()
                .replaceAll(" | ", ", or ")}.`
            );
          }
        }
      }

      tree.path.variables = tree.path.segments
        .filter(segment => isVariableCommandPath(segment))
        .reduce(
          (obj, segment, index) => {
            if (
              type.parameters.length < index + 2 ||
              !type.parameters[index + 1]
            ) {
              return obj;
            }

            const paramName = getVariableCommandPathName(segment);
            obj[paramName] = extractCommandParameters(
              type.parameters[index + 1]!
            );
            obj[paramName].description =
              obj[paramName].description ||
              `The ${paramName} variable for the ${command.name} command.`;

            return obj;
          },
          {} as Record<string, CommandParam>
        );

      if (type.parameters.length > 1) {
        type.parameters
          .slice(
            tree.path.segments.filter(segment => isVariableCommandPath(segment))
              .length + 1
          )
          .forEach(param => {
            tree.params.push(extractCommandParameters(param));
          });
      }
    }
  }

  if (context.env) {
    if (isSetObject(tree.options)) {
      Object.values(tree.options)
        .filter(option => option.env !== false)
        .forEach(option => {
          context.env.types.env.addProperty({
            name: option.env as string,
            optional: option.optional ? true : undefined,
            description: option.description,
            visibility: ReflectionVisibility.public,
            type:
              option.kind === ReflectionKind.string ||
              option.kind === ReflectionKind.number
                ? option.variadic
                  ? { kind: ReflectionKind.array, type: { kind: option.kind } }
                  : { kind: option.kind }
                : { kind: ReflectionKind.boolean },
            default: option.default,
            tags: {
              title: option.title,
              alias: option.alias
                .filter(alias => alias.length > 0)
                .map(alias => constantCase(alias)),
              domain: "cli"
            }
          });
        });
    }

    if (tree.params) {
      tree.params.forEach(param => {
        context.env.types.env.addProperty({
          name: constantCase(param.name),
          optional: param.optional ? true : undefined,
          description: param.description,
          visibility: ReflectionVisibility.public,
          type: param.variadic
            ? {
                kind: ReflectionKind.array,
                type: { kind: ReflectionKind.string }
              }
            : { kind: ReflectionKind.string },
          default: param.default,
          tags: {
            domain: "cli"
          }
        });
      });
    }
  }

  for (const input of context.inputs.filter(
    input =>
      input.path.segments.filter(segment => !isVariableCommandPath(segment))
        .length ===
        command.path.segments.filter(segment => !isVariableCommandPath(segment))
          .length +
          1 &&
      input.path.segments
        .slice(0, command.path.segments.length)
        .every((value, index) => value === command.path.segments[index])
  )) {
    tree.children[input.name] = await reflectCommandTree(context, input, tree);
  }

  return tree;
}
