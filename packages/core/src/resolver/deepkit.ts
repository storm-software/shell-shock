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

import type {
  ReflectionParameter,
  ReflectionProperty,
  Type,
  TypeArray
} from "@powerlines/deepkit/vendor/type";
import {
  reflect,
  ReflectionClass,
  ReflectionFunction,
  ReflectionKind,
  stringifyType
} from "@powerlines/deepkit/vendor/type";
import { isBigInt } from "@stryke/type-checks/is-bigint";
import { isNumber } from "@stryke/type-checks/is-number";
import { isRegExp } from "@stryke/type-checks/is-regexp";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type {
  CommandArgument,
  CommandOption,
  CommandParameterKind,
  Context,
  NumberCommandParameter,
  StringCommandParameter
} from "../types";
import { CommandParameterKinds } from "../types";
import { mergeCommandParameter } from "./helpers";
import type { ResolverContext } from "./types";

function extractCommandParameterKind(
  type: Type | ReflectionKind
): CommandParameterKind {
  const isKind = !(isSetObject(type) && "kind" in type);
  const kind = !isKind ? type.kind : type;
  if (kind === ReflectionKind.string) {
    return CommandParameterKinds.string;
  } else if (
    kind === ReflectionKind.number ||
    kind === ReflectionKind.bigint ||
    (!isKind &&
      type.kind === ReflectionKind.literal &&
      (isNumber(type.literal) || isBigInt(type.literal)))
  ) {
    return CommandParameterKinds.number;
  } else if (kind === ReflectionKind.boolean) {
    return CommandParameterKinds.boolean;
  } else {
    return CommandParameterKinds.string;
  }
}

function resolveCommandOption(
  ctx: ResolverContext,
  reflection: ReflectionProperty
): CommandOption {
  const type = reflection.getType();
  const existing = (ctx.output.options[reflection.getNameAsString()] ??
    {}) as Partial<CommandOption>;

  const option = {
    name: reflection.getNameAsString(),
    alias: reflection.getTags().alias ?? [],
    title: reflection.getTags().title?.trim(),
    description: reflection.getDescription(),
    kind: extractCommandParameterKind(type),
    optional: reflection.isOptional(),
    default: reflection.getDefaultValue(),
    variadic: reflection.isArray()
  };

  if (reflection.isArray()) {
    if (
      (type as TypeArray).type.kind === ReflectionKind.string ||
      (type as TypeArray).type.kind === ReflectionKind.number
    ) {
      (option as StringCommandParameter | NumberCommandParameter).variadic =
        true;
      (option as StringCommandParameter | NumberCommandParameter).kind =
        extractCommandParameterKind((type as TypeArray).type.kind) as
          | "string"
          | "number";
    } else {
      throw new Error(
        `Unsupported array type for option "${reflection.getNameAsString()}" in command "${
          ctx.input.command.name
        }". Only string[] and number[] are supported, received ${stringifyType(
          type
        )
          .trim()
          .replaceAll(" | ", ", or ")}.`
      );
    }
  } else if (type.kind === ReflectionKind.union) {
    option.kind = type.types.every(
      t =>
        t.kind === ReflectionKind.number ||
        (t.kind === ReflectionKind.literal &&
          (isNumber(t.literal) || isBigInt(t.literal)))
    )
      ? CommandParameterKinds.number
      : CommandParameterKinds.string;

    (option as StringCommandParameter | NumberCommandParameter).choices =
      type.types
        .map(t =>
          t.kind === ReflectionKind.literal
            ? isNumber(t.literal)
              ? t.literal
              : isBigInt(t.literal)
                ? Number(t.literal)
                : isRegExp(t.literal)
                  ? t.literal.source
                  : String(t.literal)
            : null
        )
        .filter(Boolean) as string[] | number[];
  } else if (type.kind === ReflectionKind.literal) {
    (option as StringCommandParameter | NumberCommandParameter).choices = [
      isNumber(type.literal)
        ? type.literal
        : isBigInt(type.literal)
          ? Number(type.literal)
          : isRegExp(type.literal)
            ? type.literal.source
            : String(type.literal)
    ].filter(Boolean) as string[] | number[];
  } else if (
    !existing.kind &&
    type.kind !== ReflectionKind.boolean &&
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number
  ) {
    throw new Error(
      `Unsupported type for option "${reflection.getNameAsString()}" in command "${
        ctx.input.command.name
      }". Only string, number, boolean, string[] and number[] are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  return mergeCommandParameter(existing, option) as CommandOption;
}

function resolveCommandArgument(
  ctx: ResolverContext,
  index: number,
  reflection: ReflectionParameter
): CommandArgument {
  const type = reflection.getType();
  const existing = (
    ctx.output.args.length > index ? ctx.output.args[index] : {}
  ) as Partial<CommandArgument>;

  if (
    !existing.kind &&
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
        ctx.input.command.name
      }". Only string types (or an array of strings) are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  const argument = {
    name: reflection.getName() || reflection.parameter.name,
    alias: reflection.getAlias(),
    kind: extractCommandParameterKind(type.kind),
    title: reflection.getTitle() || reflection.parameter.tags?.title,
    description: reflection.parameter.description,
    optional: reflection.isOptional(),
    default: reflection.getDefaultValue()
  };

  if (type.kind === ReflectionKind.array) {
    if (
      type.type.kind === ReflectionKind.string ||
      type.type.kind === ReflectionKind.number
    ) {
      (argument as StringCommandParameter | NumberCommandParameter).variadic =
        true;
      (argument as StringCommandParameter | NumberCommandParameter).kind =
        extractCommandParameterKind(type.type.kind) as "string" | "number";
    } else if (!existing.kind) {
      throw new Error(
        `Unsupported array type for argument "${reflection.getName()}" in command "${
          ctx.input.command.name
        }". Only string[] and number[] are supported, received ${stringifyType(
          type
        )
          .trim()
          .replaceAll(" | ", ", or ")}.`
      );
    }
  } else if (
    !existing.kind &&
    type.kind !== ReflectionKind.boolean &&
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number
  ) {
    throw new Error(
      `Unsupported type for argument "${reflection.getName()}" in command "${
        ctx.input.command.name
      }". Only string, number, boolean, string[] and number[] are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  return mergeCommandParameter(existing, argument, {
    name: `arg${index}`
  }) as CommandArgument;
}

export function resolveFromBytecode<TContext extends Context = Context>(
  ctx: ResolverContext<TContext>
) {
  const { input, module } = ctx;

  const type = reflect(module);
  if (type.kind !== ReflectionKind.function) {
    throw new Error(
      `The command entry file "${
        input.command.entry.input?.file || input.command.path
      }" does not export a valid function.`
    );
  }

  const reflection = new ReflectionFunction(type);

  ctx.output.description ??= (ctx.input.command.description ||
    reflection.getDescription() ||
    type.description)!;

  const parameters = reflection.getParameters();
  if (parameters.length > 0 && parameters[0]) {
    if (
      parameters[0].type.kind === ReflectionKind.objectLiteral ||
      parameters[0].type.kind === ReflectionKind.class
    ) {
      const optionsReflection = ReflectionClass.from(parameters[0].type);
      for (const propertyReflection of optionsReflection.getProperties()) {
        ctx.output.options[propertyReflection.getNameAsString()] =
          resolveCommandOption(ctx, propertyReflection);
      }
    } else if (!ctx.module?.options) {
      throw new Error(
        `The first parameter of the command handler function in "${
          ctx.input.command.entry.input?.file || ctx.input.command.path
        }" must be an object literal or class type representing the command options.`
      );
    }

    ctx.output.args = parameters
      .slice(1)
      .map((arg, index) => resolveCommandArgument(ctx, index, arg));
  }
}
