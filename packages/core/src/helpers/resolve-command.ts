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
import type {
  CommandInput,
  CommandOption,
  CommandTree,
  NumberCommandOption,
  StringCommandOption
} from "../types/command";
import type { Context } from "../types/context";

export function resolveCommandPath(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "");
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

  while (name.startsWith("[") && name.endsWith("]")) {
    name = findFolderName(resolveParentPath(file, count++));
  }

  return name;
}

interface CommandRelationships {
  parent: string | null;
  children: string[];
}

export async function reflectRelationships(
  context: Context,
  command: CommandInput
): Promise<Record<string, CommandRelationships>> {
  const relationships = {} as Record<string, CommandRelationships>;
  for (const input of context.inputs.filter(input => input.id !== command.id)) {
    relationships[input.id] ??= {
      parent: null,
      children: []
    } as CommandRelationships;

    let path = input.path;
    while (path.length > 1) {
      path = path
        .filter(part => !part.startsWith("[") && !part.endsWith("]"))
        .slice(0, -1);

      if (context.inputs.some(inputs => inputs.id === path.join("-"))) {
        relationships[input.id] ??= {} as CommandRelationships;
        relationships[input.id]!.parent = path.join("-");

        relationships[path.join("-")] ??= {
          parent: null,
          children: []
        } as CommandRelationships;
        relationships[path.join("-")]!.children.push(input.name);
      }
    }
  }

  return relationships;
}

export async function reflectCommandTree<TContext extends Context = Context>(
  context: TContext,
  command: CommandInput,
  parent?: CommandTree
): Promise<CommandTree> {
  const title =
    command.title ||
    `${parent?.title ? `${parent.title} - ` : ""}${titleCase(command.name)}`;

  const commandTree = {
    ...command,
    title,
    description:
      command.description || `The ${title} ${parent ? "sub-" : ""}command.`,
    options: {},
    params: [],
    parent: parent ?? null,
    children: {}
  } as CommandTree;

  if (context.config.defaultOptions === false) {
    commandTree.options = {};
  } else if (Array.isArray(context.config.defaultOptions)) {
    commandTree.options = Object.fromEntries(
      getUniqueBy(
        context.config.defaultOptions,
        (item: CommandOption) => item.name
      ).map(option => [option.name, option])
    );
  } else if (isFunction(context.config.defaultOptions)) {
    commandTree.options = Object.fromEntries(
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

          commandTree.options[propertyReflection.getNameAsString()] = {
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
          commandTree.options[
            propertyReflection.getNameAsString()
          ]!.description ??= `The ${
            commandTree.options[propertyReflection.getNameAsString()]!.title
          } option.`;

          if (propertyType.kind === ReflectionKind.array) {
            if (
              propertyType.type.kind === ReflectionKind.string ||
              propertyType.type.kind === ReflectionKind.number
            ) {
              (
                commandTree.options[propertyReflection.getNameAsString()] as
                  | StringCommandOption
                  | NumberCommandOption
              ).variadic = true;
              (
                commandTree.options[propertyReflection.getNameAsString()] as
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
    }
  }

  for (const input of context.inputs.filter(
    input =>
      input.path.length === command.path.length + 1 &&
      input.path
        .slice(0, command.path.length)
        .every((value, index) => value === command.path[index])
  )) {
    commandTree.children[input.name] = await reflectCommandTree(
      context,
      input,
      commandTree
    );
  }

  return commandTree;
}

// export async function reflectCommandTree(
//   context: Context,
//   input: CommandInput,
//   tree?: CommandTree
// ): Promise<Record<string, CommandTree>> {
//   context.trace("Reflecting the CLI command tree schema");

//   const relationsReflections = await reflectRelationships(context);

//   const result = {} as Record<string, CommandTree>;

//   if (input.isVirtual) {
//     const requestBaseType = await reflectRequestBaseType(context);

//     const commandReflection = new ReflectionFunction({
//       kind: ReflectionKind.function,
//       parameters: [],
//       return: { kind: ReflectionKind.void },
//       name,
//       tags: {
//         title,
//         domain: "cli"
//       }
//     });

//     const parameter = new ReflectionParameter(
//       {
//         kind: ReflectionKind.parameter,
//         name: "options",
//         parent: commandReflection.type,
//         description: `The request data required by the ${
//           title
//         } command to execute.`
//       },
//       commandReflection
//     );

//     commandReflection.parameters.push(parameter);
//   } else {
//     // const command = await resolveType<Function>(context, entry.input, {
//     //   outputPath: context.options.workspaceRoot,
//     //   skipNodeModulesBundle: true,
//     //   noExternal: context.options.noExternal,
//     //   external: ["@storm-stack/core"],
//     //   override: {
//     //     treeShaking: false
//     //   },
//     //   compiler: {
//     //     babel: {
//     //       plugins: [ModuleResolverPlugin(context)]
//     //     }
//     //   }
//     // });

//     // eslint-disable-next-line ts/no-unsafe-function-type
//     const command = await resolveType<Function>(context, entry.input, {
//       skipNodeModulesBundle: true,
//       noExternal: context.config.noExternal,
//       external: ["@storm-stack/core"]
//     });
//     if (!command) {
//       throw new Error(`Module not found: ${entry.input.file}`);
//     }

//     if (!command) {
//       throw new Error(`Module not found: ${entry.input.file}`);
//     }

//     commandReflection = ReflectionFunction.from(command);
//     if (!commandReflection) {
//       throw new Error(`Reflection not found: ${entry.input.file}`);
//     }
//   }

//   await Promise.all(
//     context.entry
//       .filter(entry => entry.input.file !== context.config.entry)
//       .map(async entry => {
//         if (!entry.output) {
//           throw new Error(
//             `The entry "${entry.input.file}" does not have an output defined. Please ensure the entry has a valid output path.`
//           );
//         }

//         if (!relationsReflections[entry.output]) {
//           throw new Error(
//             `Unable to determine relation reflections for command "${entry.output}".`
//           );
//         }

//         commands[entry.output] = await Command.from(
//           context,
//           entry,
//           relationsReflections[entry.output]
//         );
//       })
//   );

//   const addCommand = (
//     tree: CommandTree,
//     command: Command
//   ): CommandTreeBranch => {
//     let commandTreeBranch = findCommandInTree(tree, command.path);

//     if (!commandTreeBranch) {
//       if (command.path.length === 1) {
//         commandTreeBranch = {
//           command,
//           parent: tree,
//           children: {},
//           root: tree
//         };
//         tree.children[command.name] = commandTreeBranch;
//       } else {
//         let parent: CommandTreeBranch | CommandTree = tree;
//         if (command.relations.parent) {
//           const parentReflection = commands[command.relations.parent];
//           if (!parentReflection) {
//             throw new Error(
//               `Reflection not found for "${
//                 command.relations.parent
//               }" in the ${command.id} command's parent tree.`
//             );
//           }

//           parent = addCommand(tree, parentReflection);
//         }

//         if (parent.parent !== null) {
//           command.title = `${parent.command.title} - ${command.title}`;
//         }

//         commandTreeBranch = {
//           command,
//           parent,
//           children: {},
//           root: tree
//         };
//         parent.children[commandTreeBranch.command.name] = commandTreeBranch;
//       }
//     }

//     return commandTreeBranch;
//   };

//   for (const commandId of Object.keys(commands)
//     .filter(commandId => commands[commandId])
//     .sort((a, b) => b.localeCompare(a))) {
//     addCommand(tree, commands[commandId]);
//   }

//   await writeEnvTypeReflection(
//     context,
//     context.reflections.env.types.env,
//     "env"
//   );

//   return tree;
// }
