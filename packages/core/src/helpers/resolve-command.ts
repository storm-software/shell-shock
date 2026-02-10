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
  ReflectionParameter,
  ReflectionProperty,
  TypeArray
} from "@powerlines/deepkit/vendor/type";
import {
  reflect,
  ReflectionClass,
  ReflectionFunction,
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
  getDynamicPathSegmentName,
  isDynamicPathSegment,
  isPathSegmentGroup
} from "../plugin-utils/context-helpers";
import type {
  CommandArgument,
  CommandInput,
  CommandModule,
  CommandOption,
  CommandTree,
  NumberCommandArgument,
  NumberCommandOption,
  StringCommandArgument,
  StringCommandOption
} from "../types/command";
import type { Context } from "../types/context";
import { getDefaultOptions } from "./utilities";

/**
 * Resolves the description for a command option based on its reflection.
 *
 * @param name - The name of the command option.
 * @param kind - The reflection kind of the command option.
 * @param optional - Whether the command option is optional.
 * @param variadic - Whether the command option is variadic (i.e., an array).
 * @param title - The title of the command option, if any.
 * @param defaultValue - The default value of the command option, if any.
 * @returns The resolved description for the command option.
 */
export function resolveCommandOptionDescription(
  name: string,
  kind: ReflectionKind,
  optional = false,
  variadic = false,
  title?: string,
  defaultValue?: any
): string {
  return `A${optional && !defaultValue ? "n optional" : ""} command line ${
    kind === ReflectionKind.boolean ? "flag" : "option"
  } that allows the user to ${
    kind === ReflectionKind.boolean
      ? "set the"
      : variadic
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    kind === ReflectionKind.boolean
      ? "indicator"
      : `${kind === ReflectionKind.number ? "numeric" : "string"} value${
          variadic ? "s" : ""
        }`
  }.`;
}

/**
 * Resolves the description for a command argument based on its reflection.
 *
 * @param name - The name of the command argument.
 * @param kind - The reflection kind of the command argument.
 * @param optional - Whether the command argument is optional.
 * @param variadic - Whether the command argument is variadic (i.e., an array).
 * @param title - The title of the command argument, if any.
 * @param defaultValue - The default value of the command argument, if any.
 * @returns The resolved description for the command argument.
 */
export function resolveCommandArgumentDescription(
  name: string,
  kind: ReflectionKind,
  optional = false,
  variadic = false,
  title?: string,
  defaultValue?: any
): string {
  return `An${
    optional && !defaultValue ? " optional" : ""
  } argument that allows the user to ${
    kind === ReflectionKind.boolean
      ? "set the"
      : variadic
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    kind === ReflectionKind.boolean
      ? "indicator"
      : `${kind === ReflectionKind.number ? "numeric" : "string"} value${
          variadic ? "s" : ""
        }`
  }.`;
}

export function resolveCommandId(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(p => Boolean(p) && !isDynamicPathSegment(p))
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

  while (isDynamicPathSegment(name)) {
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
    .replaceAll(/\/+$/g, "")
    .split("/")
    .filter(path => path && !isPathSegmentGroup(path))
    .join("/");
}

export function resolveCommandDynamicPathSegments(
  context: Context,
  file: string
): string[] {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(path => Boolean(path) && isDynamicPathSegment(path))
    .map(path => getDynamicPathSegmentName(path));
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
  const type = reflection.getType();

  const option = {
    name: reflection.getNameAsString(),
    alias: reflection.getTags().alias ?? [],
    title:
      reflection.getTags().title?.trim() ||
      titleCase(reflection.getNameAsString()),
    description:
      reflection.getDescription() ||
      resolveCommandOptionDescription(
        reflection.getNameAsString(),
        reflection.getKind(),
        reflection.isOptional(),
        reflection.isArray(),
        reflection.getTags().title,
        reflection.getDefaultValue()
      ),
    env: constantCase(reflection.getNameAsString()),
    kind: type.kind as
      | ReflectionKind.string
      | ReflectionKind.number
      | ReflectionKind.boolean,
    optional: reflection.isOptional(),
    default: reflection.getDefaultValue(),
    variadic: reflection.isArray(),
    reflection
  } as CommandOption;

  if (reflection.isArray()) {
    if (
      (type as TypeArray).type.kind === ReflectionKind.string ||
      (type as TypeArray).type.kind === ReflectionKind.number
    ) {
      (option as StringCommandOption | NumberCommandOption).variadic = true;
      (option as StringCommandOption | NumberCommandOption).kind = (
        type as TypeArray
      ).type.kind as ReflectionKind.string | ReflectionKind.number;
    } else {
      throw new Error(
        `Unsupported array type for option "${reflection.getNameAsString()}" in command "${
          command.name
        }". Only string[] and number[] are supported, received ${stringifyType(
          type
        )
          .trim()
          .replaceAll(" | ", ", or ")}.`
      );
    }
  } else if (
    type.kind !== ReflectionKind.boolean &&
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number
  ) {
    throw new Error(
      `Unsupported type for option "${reflection.getNameAsString()}" in command "${
        command.name
      }". Only string, number, boolean, string[] and number[] are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  return option;
}

/**
 * Extracts command positional argument information from a type parameter reflection.
 *
 * @param command - The command tree to which the parameter belongs.
 * @param reflection - The type parameter reflection to extract information from.
 * @returns The extracted command positional argument information.
 */
export function extractCommandArgument(
  command: CommandInput,
  reflection: ReflectionParameter
): CommandArgument {
  const type = reflection.getType();

  if (
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number &&
    type.kind !== ReflectionKind.boolean &&
    !(
      type.kind === ReflectionKind.array &&
      (type.type.kind === ReflectionKind.string ||
        type.type.kind === ReflectionKind.number)
    )
  ) {
    throw new Error(
      `Unsupported type for argument "${reflection.getName()}" in command "${
        command.name
      }". Only string types (or an array of strings) are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  const argument = {
    name: reflection.getName(),
    alias: reflection.getAlias(),
    kind: type.kind,
    title: titleCase(reflection.getName()),
    description:
      reflection.parameter.description ||
      resolveCommandArgumentDescription(
        reflection.getName(),
        type.kind === ReflectionKind.array ? type.type.kind : type.kind,
        reflection.isOptional(),
        type.kind === ReflectionKind.array,
        titleCase(reflection.getName()),
        reflection.getDefaultValue()
      ),
    env: constantCase(reflection.getName()),
    optional: reflection.isOptional(),
    default: reflection.getDefaultValue(),
    reflection
  } as CommandArgument;

  if (type.kind === ReflectionKind.array) {
    if (
      type.type.kind === ReflectionKind.string ||
      type.type.kind === ReflectionKind.number
    ) {
      (argument as StringCommandArgument | NumberCommandArgument).variadic =
        true;
      (argument as StringCommandArgument | NumberCommandArgument).kind =
        type.type.kind;
    } else {
      throw new Error(
        `Unsupported array type for argument "${reflection.getName()}" in command "${
          command.name
        }". Only string[] and number[] are supported, received ${stringifyType(
          type
        )
          .trim()
          .replaceAll(" | ", ", or ")}.`
      );
    }
  } else if (
    type.kind !== ReflectionKind.boolean &&
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number
  ) {
    throw new Error(
      `Unsupported type for argument "${reflection.getName()}" in command "${
        command.name
      }". Only string, number, boolean, string[] and number[] are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  return argument;
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
    `${
      parent?.title
        ? `${
            parent.isVirtual
              ? parent.title.replace(/(?:c|C)ommands?$/, "").trim()
              : parent.title
          } - `
        : ""
    }${titleCase(command.name)}${command.isVirtual ? " Commands" : ""}`;

  const tree = {
    alias: [],
    icon: parent?.icon,
    ...command,
    title,
    options: getDefaultOptions(context, command),
    arguments: [],
    parent: parent ?? null,
    children: {},
    reflection: null
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
    if (isSetString(metadata.icon)) {
      tree.icon = metadata.icon;
    }

    const type = reflect(resolved);
    if (type.kind !== ReflectionKind.function) {
      throw new Error(
        `The command entry file "${command.entry.input.file}" does not export a valid function.`
      );
    }

    tree.reflection = new ReflectionFunction(type);
    tree.description ??=
      command.description ||
      type.description ||
      `The ${tree.title.replace(/(?:c|C)ommands?$/, "").trim()} executable command line interface.`;

    const parameters = tree.reflection.getParameters();
    if (parameters.length > 0 && parameters[0]) {
      if (
        parameters[0].type.kind === ReflectionKind.objectLiteral ||
        parameters[0].type.kind === ReflectionKind.class
      ) {
        const optionsReflection = ReflectionClass.from(parameters[0].type);
        for (const propertyReflection of optionsReflection.getProperties()) {
          tree.options[propertyReflection.getNameAsString()] =
            extractCommandOption(command, propertyReflection);
        }
      } else {
        throw new Error(
          `The first parameter of the command handler function in "${
            command.entry.input.file
          }" must be an object literal or class type representing the command options.`
        );
      }

      tree.arguments = parameters
        .slice(1)
        .map(arg => extractCommandArgument(command, arg));

      // Ensure unique argument names by appending an index suffix to duplicates
      tree.arguments.forEach((argument, index) => {
        const found = tree.arguments.findIndex(
          arg => arg.name === argument.name
        );
        if (
          (found !== -1 && found !== index) ||
          tree.segments.some(
            segment =>
              isDynamicPathSegment(segment) &&
              getDynamicPathSegmentName(segment) === argument.name
          )
        ) {
          argument.name += `_${
            tree.segments.filter(
              segment =>
                isDynamicPathSegment(segment) &&
                getDynamicPathSegmentName(segment).replace(/_\d+$/, "") ===
                  argument.name
            ).length +
            tree.arguments.filter(
              arg => arg.name.replace(/_\d+$/, "") === argument.name
            ).length
          }`;
          argument.env = constantCase(argument.name);
        }
      });
    }
  } else {
    tree.description ??= `A collection of available ${
      tree.title.replace(/(?:c|C)ommands?$/, "").trim() || titleCase(tree.name)
    } commands that are included in the ${getAppTitle(
      context
    )} command line application.`;
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
              option.reflection?.getType() ??
              ((option as StringCommandOption | NumberCommandOption).variadic
                ? { kind: ReflectionKind.array, type: { kind: option.kind } }
                : { kind: option.kind }),
            default: option.default,
            tags: {
              ...option.reflection?.getTags(),
              title: option.title,
              alias: option.alias
                .filter(alias => alias.length > 1)
                .map(alias => constantCase(alias)),
              domain: "cli"
            }
          });
        });
    }

    tree.arguments
      .filter(arg => arg.env !== false)
      .forEach(arg =>
        context.env.types.env.addProperty({
          name: arg.env as string,
          optional: arg.optional ? true : undefined,
          description: arg.description,
          visibility: ReflectionVisibility.public,
          type: arg.reflection.getType(),
          default: arg.default,
          tags: {
            ...arg.reflection.getTags(),
            alias: arg.alias
              .filter(alias => alias.length > 1)
              .map(alias => constantCase(alias)),
            domain: "cli"
          }
        })
      );
  }

  for (const input of context.inputs.filter(
    input =>
      input.segments.filter(segment => !isDynamicPathSegment(segment))
        .length ===
        command.segments.filter(segment => !isDynamicPathSegment(segment))
          .length +
          1 &&
      input.segments
        .slice(0, command.segments.length)
        .every((value, index) => value === command.segments[index])
  )) {
    tree.children[input.name] = await reflectCommandTree(context, input, tree);
  }

  return tree;
}
