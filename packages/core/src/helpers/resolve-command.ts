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

import { esbuildPlugin } from "@powerlines/deepkit/esbuild-plugin";
import type {
  ReflectionProperty,
  TypeParameter
} from "@powerlines/deepkit/vendor/type";
import {
  reflect,
  ReflectionClass,
  ReflectionKind,
  ReflectionVisibility,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { toArray } from "@stryke/convert/to-array";
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
import { resolveModule } from "powerlines/lib/utilities/resolve";
import {
  getAppTitle,
  getPositionalCommandOptionName,
  isPositionalCommandOption
} from "../plugin-utils/context-helpers";
import type {
  CommandInput,
  CommandModule,
  CommandOption,
  CommandPositionalOption,
  CommandTree,
  NumberCommandOption,
  StringCommandOption
} from "../types/command";
import type { Context } from "../types/context";
import { getDefaultOptions } from "./utilities";

/**
 * Resolves the description for a command option based on its reflection.
 *
 * @param kind - The reflection kind of the command option.
 * @param optional - Whether the command option is optional.
 * @param name - The name of the command option.
 * @param title - The title of the command option, if any.
 * @param defaultValue - The default value of the command option, if any.
 * @returns The resolved description for the command option.
 */
export function resolveCommandOptionDescription(
  kind: ReflectionKind,
  optional: boolean,
  name: string,
  title?: string,
  defaultValue?: any
): string {
  return `A${optional && !defaultValue ? "n optional" : ""} ${
    kind === ReflectionKind.boolean
      ? "flag provided via the command-line"
      : "command-line option"
  } that allows the user to ${
    kind === ReflectionKind.boolean
      ? "set the"
      : kind === ReflectionKind.array
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    kind === ReflectionKind.boolean
      ? "indicator"
      : `${kind === ReflectionKind.number ? "numeric" : "string"} value${
          kind === ReflectionKind.array ? "s" : ""
        }`
  } that will be used in the application.`;
}

export function resolveCommandId(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(p => Boolean(p) && !isPositionalCommandOption(p))
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

  while (isPositionalCommandOption(name)) {
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
    .filter(p => Boolean(p) && isPositionalCommandOption(p))
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
 * @param command - The command tree to which the parameter belongs.
 * @param reflection - The type parameter reflection to extract information from.
 * @returns The extracted command option information.
 */
export function extractCommandOption(
  command: CommandInput,
  reflection: ReflectionProperty
): CommandOption {
  const propertyType = reflection.getType();

  const option = {
    name: reflection.getNameAsString(),
    alias: reflection.getTags().alias ?? [],
    title:
      reflection.getTags().title?.trim() ||
      titleCase(reflection.getNameAsString()),
    description:
      reflection.getDescription() ||
      resolveCommandOptionDescription(
        reflection.getKind(),
        reflection.isOptional(),
        reflection.getNameAsString(),
        reflection.getTags().title,
        reflection.getDefaultValue()
      ),
    env: constantCase(reflection.getNameAsString()),
    kind: propertyType.kind as
      | ReflectionKind.string
      | ReflectionKind.number
      | ReflectionKind.boolean,
    optional: reflection.isOptional(),
    default: reflection.getDefaultValue(),
    variadic: false
  } as CommandOption;
  if (propertyType.kind === ReflectionKind.array) {
    if (
      propertyType.type.kind === ReflectionKind.string ||
      propertyType.type.kind === ReflectionKind.number
    ) {
      (option as StringCommandOption | NumberCommandOption).variadic = true;
      (option as StringCommandOption | NumberCommandOption).kind =
        propertyType.type.kind;
    } else {
      throw new Error(
        `Unsupported array type for option "${reflection.getNameAsString()}" in command "${
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
      `Unsupported type for option "${reflection.getNameAsString()}" in command "${
        command.name
      }". Only string, number, boolean, string[] and number[] are supported, received ${stringifyType(
        propertyType
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  return option;
}

/**
 * Extracts command parameter information from a type parameter reflection.
 *
 * @param command - The command tree to which the parameter belongs.
 * @param segment - The command path segment corresponding to the parameter.
 * @param reflection - The type parameter reflection to extract information from.
 * @returns The extracted command option information.
 */
export function extractCommandPositionalOption(
  command: CommandInput,
  segment: string,
  reflection: TypeParameter
): CommandPositionalOption {
  if (
    reflection.type.kind !== ReflectionKind.string &&
    reflection.type.kind !== ReflectionKind.number &&
    !(
      reflection.type.kind === ReflectionKind.array &&
      (reflection.type.type.kind === ReflectionKind.string ||
        reflection.type.type.kind === ReflectionKind.number)
    )
  ) {
    throw new Error(
      `Unsupported type for positional option "${segment}" in command "${
        command.name
      }". Only string and number types (or string[] and number[]) are supported, received ${stringifyType(
        reflection.type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  const option = {
    name: segment,
    alias: [],
    title: titleCase(segment),
    description:
      reflection.description ||
      resolveCommandOptionDescription(
        reflection.type.kind,
        !!reflection.optional,
        segment,
        titleCase(segment),
        reflection.default
      ),
    env: constantCase(segment),
    kind: reflection.type.kind,
    optional: reflection.optional,
    default: reflection.default,
    variadic: false
  } as CommandPositionalOption;

  if (reflection.type.kind === ReflectionKind.array) {
    if (
      reflection.type.type.kind === ReflectionKind.string ||
      reflection.type.type.kind === ReflectionKind.number
    ) {
      (option as StringCommandOption | NumberCommandOption).variadic = true;
      (option as StringCommandOption | NumberCommandOption).kind =
        reflection.type.type.kind;
    } else {
      throw new Error(
        `Unsupported array type for option "${segment}" in command "${
          command.name
        }". Only string[] and number[] are supported.`
      );
    }
  }

  return option;
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
    alias: [],
    ...command,
    title,
    path: {
      ...command.path,
      positional: {}
    },
    options: getDefaultOptions(context, command),
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

    const resolved = await resolveModule<CommandModule>(
      context,
      command.entry.input,
      {
        plugins: [
          esbuildPlugin(context, {
            reflection: "default",
            reflectionLevel: "verbose"
          })
        ]
      }
    );

    const metadata = resolved.metadata ?? {};
    if (isSetString(metadata.title)) {
      tree.title = metadata.title;
    }
    if (isSetString(metadata.description)) {
      tree.description = metadata.description;
    }
    if (
      isSetString(metadata.alias) ||
      (Array.isArray(metadata.alias) && metadata.alias.length > 0)
    ) {
      tree.alias = toArray(metadata.alias);
    }

    const type = reflect(resolved);

    // const type = await reflectType<TContext>(context, command.entry.input);
    if (type.kind !== ReflectionKind.function) {
      throw new Error(
        `The command entry file "${command.entry.input.file}" does not export a valid function.`
      );
    }

    tree.description ??=
      command.description ||
      type.description ||
      `The ${tree.title} executable command-line interface.`;

    if (type.parameters.length > 0 && type.parameters[0]) {
      const firstParam = type.parameters[0];
      if (
        firstParam.type.kind === ReflectionKind.objectLiteral ||
        firstParam.type.kind === ReflectionKind.class
      ) {
        const optionsReflection = ReflectionClass.from(firstParam.type);
        for (const propertyReflection of optionsReflection.getProperties()) {
          tree.options[propertyReflection.getNameAsString()] =
            extractCommandOption(command, propertyReflection);
        }
      }

      tree.path.positional = tree.path.segments
        .filter(segment => isPositionalCommandOption(segment))
        .reduce(
          (obj, segment, index) => {
            if (
              type.parameters.length < index + 2 ||
              !type.parameters[index + 1]
            ) {
              return obj;
            }

            const paramName = getPositionalCommandOptionName(segment);
            obj[paramName] = extractCommandPositionalOption(
              command,
              paramName,
              type.parameters[index + 1]!
            );

            obj[paramName].description =
              obj[paramName].description ||
              `The ${paramName} positional option for the ${command.name} command.`;

            return obj;
          },
          {} as Record<string, CommandPositionalOption>
        );
    }
  } else {
    tree.description ??= `A collection of available ${
      tree.title || titleCase(tree.name)
    } commands that are included in the ${getAppTitle(
      context
    )} command-line application.`;
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

    if (
      Object.values(tree.path.positional).filter(option => option.env !== false)
        .length > 0
    ) {
      Object.values(tree.path.positional)
        .filter(option => option.env !== false)
        .forEach(option =>
          context.env.types.env.addProperty({
            name: constantCase(option.name),
            optional: option.optional ? true : undefined,
            description: option.description,
            visibility: ReflectionVisibility.public,
            type: option.variadic
              ? {
                  kind: ReflectionKind.array,
                  type: { kind: ReflectionKind.string }
                }
              : { kind: ReflectionKind.string },
            default: option.default,
            tags: {
              domain: "cli"
            }
          })
        );
    }
  }

  for (const input of context.inputs.filter(
    input =>
      input.path.segments.filter(segment => !isPositionalCommandOption(segment))
        .length ===
        command.path.segments.filter(
          segment => !isPositionalCommandOption(segment)
        ).length +
          1 &&
      input.path.segments
        .slice(0, command.path.segments.length)
        .every((value, index) => value === command.path.segments[index])
  )) {
    tree.children[input.name] = await reflectCommandTree(context, input, tree);
  }

  return tree;
}
