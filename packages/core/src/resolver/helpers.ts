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

import { getUniqueBy } from "@stryke/helpers/get-unique";
import { constantCase } from "@stryke/string-format/constant-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { isString } from "@stryke/type-checks/is-string";
import { createDefu } from "defu";
import { getAppTitle } from "../plugin-utils/context-helpers";
import type {
  CommandArgument,
  CommandOption,
  CommandParameterKind
} from "../types/command";
import { CommandParameterKinds } from "../types/command";
import type { Context } from "../types/context";
import type { ResolverContext } from "./types";

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
  kind: CommandParameterKind,
  optional = false,
  variadic = false,
  title?: string,
  defaultValue?: any
): string {
  return `A${optional && !defaultValue ? "n optional" : ""} command-line ${
    kind === CommandParameterKinds.boolean ? "flag" : "option"
  } that allows the user to ${
    kind === CommandParameterKinds.boolean
      ? "set the"
      : variadic
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    kind === CommandParameterKinds.boolean
      ? "indicator"
      : `${kind === CommandParameterKinds.number ? "numeric" : "string"} value${
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
  kind: CommandParameterKind,
  optional = false,
  variadic = false,
  title?: string,
  defaultValue?: any
): string {
  return `An${
    optional && !defaultValue ? " optional" : ""
  } argument that allows the user to ${
    kind === CommandParameterKinds.boolean
      ? "set the"
      : variadic
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    kind === CommandParameterKinds.boolean
      ? "indicator"
      : `${kind === CommandParameterKinds.number ? "numeric" : "string"} value${
          variadic ? "s" : ""
        }`
  }.`;
}

export function applyOptionsDefaults(options: Record<string, CommandOption>) {
  return Object.fromEntries(
    Object.entries(options).map(([key, option]) => {
      const name = option.name || key;
      const title = option.title || titleCase(name);

      return [
        key,
        {
          ...option,
          name,
          title,
          description:
            option.description ||
            resolveCommandOptionDescription(
              name,
              option.kind,
              option.optional,
              option.kind !== CommandParameterKinds.boolean && option.variadic,
              title,
              option.default
            ),
          env: option.env || constantCase(key)
        }
      ];
    })
  );
}

export function applyArgsDefaults(args: CommandArgument[]): CommandArgument[] {
  return args.map((arg, i) => {
    const name = arg.name || `arg${i + 1}`;
    const title = arg.title || titleCase(name);

    return {
      ...arg,
      name,
      title,
      description:
        arg.description ||
        resolveCommandArgumentDescription(
          name,
          arg.kind,
          arg.optional,
          arg.kind !== CommandParameterKinds.boolean && arg.variadic,
          title,
          arg.default
        ),
      env: arg.name
        ? arg.env || arg.env === false
          ? arg.env
          : constantCase(name)
        : false
    };
  });
}

export function applyDefaults(context: ResolverContext) {
  context.output.description ??= `The ${context.output.title.replace(/(?:c|C)ommands?$/, "").trim()} executable command-line interface.`;
}

export function resolveVirtualCommand<TContext extends Context = Context>(
  ctx: ResolverContext<TContext>
) {
  ctx.output.title ??= titleCase(ctx.input.command.name);
  ctx.output.description ??= `A collection of available ${
    ctx.output.title.replace(/(?:c|C)ommands?$/, "").trim() ||
    titleCase(ctx.input.command.name)
  } commands that are included in the ${getAppTitle(
    ctx.input.context
  )} command-line application.`;
}

/**
 * Merges two command parameters, giving precedence to string values in the second configuration.
 *
 * @param objA - The first command parameter object.
 * @param objB - The second command parameter object.
 * @returns The merged command parameter object.
 */
export const mergeCommandParameter = createDefu((obj, key, value) => {
  if (isString(obj[key]) && isString(value)) {
    if (isSetString(value)) {
      obj[key] = value;
    }

    return true;
  } else if (Array.isArray(obj[key]) && Array.isArray(value)) {
    if (value.length > 0) {
      obj[key] = getUniqueBy((obj[key] as unknown[]).concat(value), item =>
        isString(item) ? item : JSON.stringify(item)
      ) as (typeof obj)[typeof key];
    }

    return true;
  }

  return false;
});
