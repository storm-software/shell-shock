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
import type { TypeParameter } from "@powerlines/deepkit/vendor/type";
import {
  ReflectionClass,
  ReflectionKind,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import { commonPath } from "@stryke/path/common";
import { findFilePath, findFolderName } from "@stryke/path/file-path-fns";
import { stripStars } from "@stryke/path/normalize";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import {
  getVariableCommandPathName,
  isVariableCommandPath
} from "../plugin-utils/context-helpers";
import type {
  CommandInput,
  CommandOption,
  CommandParam,
  CommandTree,
  NumberCommandOption,
  StringCommandOption
} from "../types/command";
import type { Context } from "../types/context";

export function resolveCommandId(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(p => Boolean(p) && !isVariableCommandPath(p))
    .join("/")
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "")
    .replaceAll("/", "-");
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

export function sortOptions(options: CommandOption[]): CommandOption[] {
  if (!options || options.length === 0) {
    return [];
  }

  return options
    .filter(arg => arg.kind !== ReflectionKind.boolean || !arg.isNegativeOf)
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((ret, arg) => {
      ret.push(arg);

      if (arg.kind === ReflectionKind.boolean) {
        // Add the negative argument if it exists
        const negativeArg = options.find(
          a => a.kind === ReflectionKind.boolean && a.isNegativeOf === arg.name
        );
        if (negativeArg) {
          ret.push(negativeArg);
        }
      }

      return ret;
    }, [] as CommandOption[]);
}

/**
 * Finds the command name from the given file path.
 *
 * @param file - The file path to extract the command name from.
 * @returns The command name.
 */
export function findCommandName(file: string) {
  let name = findFolderName(file);
  let count = 1;

  while (isVariableCommandPath(name)) {
    name = findFolderName(resolveParentPath(file, count++));
  }

  return name;
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
    `${parent?.title ? `${parent.title} - ` : ""}${titleCase(command.name)}`;

  const tree = {
    ...command,
    title,
    description:
      command.description ||
      (command.isVirtual
        ? `A collection of the available ${title} commands.`
        : `The ${title} executable command-line interface.`),
    path: {
      ...command.path,
      variables: {}
    },
    options: {},
    params: [],
    parent: parent ?? null,
    children: {}
  } as CommandTree;

  if (context.config.defaultOptions === false) {
    tree.options = {};
  } else if (Array.isArray(context.config.defaultOptions)) {
    tree.options = Object.fromEntries(
      getUniqueBy(
        context.config.defaultOptions,
        (item: CommandOption) => item.name
      ).map(option => [option.name, option])
    );
  } else if (isFunction(context.config.defaultOptions)) {
    tree.options = Object.fromEntries(
      getUniqueBy(
        context.config.defaultOptions(context, command),
        (item: CommandOption) => item.name
      ).map(option => [option.name, option])
    );
  }

  if (command.isVirtual) {
    context.trace(`Adding reflection for virtual command: ${command.id}`);
  } else {
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

    context.trace(
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
              propertyReflection.getTags().title ||
              titleCase(propertyReflection.getNameAsString()),
            description: propertyReflection.getDescription(),
            kind: propertyType.kind as
              | ReflectionKind.string
              | ReflectionKind.number
              | ReflectionKind.boolean,
            optional: propertyReflection.isOptional(),
            default: propertyReflection.getDefaultValue(),
            variadic: false
          };
          tree.options[propertyReflection.getNameAsString()]!.description ??=
            `The ${
              tree.options[propertyReflection.getNameAsString()]!.title
            } option.`;

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
