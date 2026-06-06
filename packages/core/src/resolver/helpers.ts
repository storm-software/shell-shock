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
import {
  getAppTitle,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type { CommandArgument } from "../types/command";
import type { Context } from "../types/context";
import type { ResolverContext } from "./types";

/**
 * Resolves the description for a command option based on its reflection.
 *
 * @param name - The name of the command option.
 * @param type - The reflection kind of the command option.
 * @param required - Whether the command option is required.
 * @param variadic - Whether the command option is variadic (i.e., an array).
 * @param title - The title of the command option, if any.
 * @param defaultValue - The default value of the command option, if any.
 * @returns The resolved description for the command option.
 */
export function resolveCommandOptionDescription(
  name: string,
  type: "string" | "number" | "boolean",
  required = true,
  variadic = false,
  title?: string,
  defaultValue?: any
): string {
  return `A${!required && !defaultValue ? "n optional" : ""} command-line ${
    type === "boolean" ? "flag" : "option"
  } that allows the user to ${
    type === "boolean"
      ? "set the"
      : variadic
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    type === "boolean"
      ? "indicator"
      : `${type === "number" ? "numeric" : "string"} value${
          variadic ? "s" : ""
        }`
  }.`;
}

/**
 * Resolves the description for a command argument based on its reflection.
 *
 * @param name - The name of the command argument.
 * @param type - The reflection kind of the command argument.
 * @param required - Whether the command argument is required.
 * @param variadic - Whether the command argument is variadic (i.e., an array).
 * @param title - The title of the command argument, if any.
 * @param defaultValue - The default value of the command argument, if any.
 * @returns The resolved description for the command argument.
 */
export function resolveCommandArgumentDescription(
  name: string,
  type: "string" | "number" | "boolean",
  required = true,
  variadic = false,
  title?: string,
  defaultValue?: any
): string {
  return `An${
    !required && !defaultValue ? " optional" : ""
  } argument that allows the user to ${
    type === "boolean"
      ? "set the"
      : variadic
        ? "specify custom"
        : "specify a custom"
  } ${title?.trim() || titleCase(name)} ${
    type === "boolean"
      ? "indicator"
      : `${type === "number" ? "numeric" : "string"} value${
          variadic ? "s" : ""
        }`
  }.`;
}

export function applyOptionsDefaults(ctx: ResolverContext) {
  return Object.fromEntries(
    Object.entries(ctx.output.options).map(([key, option]) => {
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
              option.type,
              option.required,
              option.type !== "boolean" && option.variadic,
              title,
              option.default
            ),
          env:
            option.env || option.env === false
              ? option.env
              : ctx.input.context.config.autoAssignEnv
                ? constantCase(name)
                : false
        }
      ];
    })
  );
}

export function applyArgsDefaults(ctx: ResolverContext): CommandArgument[] {
  return ctx.output.args.map((arg, i) => {
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
          arg.type,
          arg.required,
          arg.type !== "boolean" && arg.variadic,
          title,
          arg.default
        ),
      env: arg.name
        ? arg.env || arg.env === false
          ? arg.env
          : ctx.input.context.config.autoAssignEnv
            ? constantCase(name)
            : false
        : false
    };
  });
}

export function applyDefaults(ctx: ResolverContext) {
  ctx.output.description ??= `The ${ctx.output.title.replace(/(?:c|C)ommands?$/, "").trim()} executable command-line interface.`;
  if (
    ctx.input.command.segments.length &&
    isSetString(ctx.input.context.config.docs?.commands) &&
    /\{(?:(?:C|c)ommands?|(?:C|c)mds?)\}/.test(
      ctx.input.context.config.docs.commands
    )
  ) {
    ctx.output.docs ??= ctx.input.context.config.docs.commands
      ? ctx.input.context.config.docs.commands.replace(
          /\{(?:(?:C|c)ommands?|(?:C|c)mds?)\}/,
          ctx.input.command.segments
            .filter(segment => !isDynamicPathSegment(segment))
            .join("/")
        )
      : undefined;
  } else if (
    !ctx.input.command.segments.length &&
    isSetString(ctx.input.context.config.docs?.app)
  ) {
    ctx.output.docs ??= ctx.input.context.config.docs.app;
  }
}

/**
 * Resolves a virtual command by applying default values to its title and description based on the command name and application title.
 *
 * @template TContext - The type of the context object.
 * @param ctx - The resolver context containing the input and output for the command resolution process.
 */
export function resolveVirtualCommand<TContext extends Context = Context>(
  ctx: ResolverContext<TContext>
) {
  ctx.output.title ??= titleCase(ctx.input.command.name);
  ctx.output.description ??= `A collection of available ${
    ctx.output.title.replace(/(?:c|C)ommands?$/, "").trim() ||
    titleCase(ctx.input.command.name)
  } commands that are included in the ${getAppTitle(
    ctx.input.context,
    true
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
