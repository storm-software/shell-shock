/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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
import { ReflectionKind, stringifyType } from "@powerlines/deepkit/vendor/type";
import { isBigInt } from "@stryke/type-checks/is-bigint";
import { isNumber } from "@stryke/type-checks/is-number";
import { isRegExp } from "@stryke/type-checks/is-regexp";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type {
  CommandArgument,
  CommandOption,
  NumberCommandParameter,
  StringCommandParameter
} from "../types";
import { mergeCommandParameter } from "./helpers";
import type { ResolverContext } from "./types";

function resolveCommandParameterType(
  type: Type | ReflectionKind
): "string" | "number" | "boolean" {
  const isKind = !(isSetObject(type) && "kind" in type);
  const kind = !isKind ? type.kind : type;
  if (kind === ReflectionKind.string) {
    return "string";
  } else if (
    kind === ReflectionKind.number ||
    kind === ReflectionKind.bigint ||
    (!isKind &&
      type.kind === ReflectionKind.literal &&
      (isNumber(type.literal) || isBigInt(type.literal)))
  ) {
    return "number";
  } else if (kind === ReflectionKind.boolean) {
    return "boolean";
  } else {
    return "string";
  }
}

export function resolveCommandOption(
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
    type: resolveCommandParameterType(type),
    required: !reflection.isOptional(),
    default: reflection.getDefaultValue(),
    variadic: reflection.isArray()
  } as CommandOption;

  if (option.variadic) {
    option.type = resolveCommandParameterType((type as TypeArray).type.kind);
  } else if (type.kind === ReflectionKind.union) {
    option.type = type.types.every(
      t =>
        t.kind === ReflectionKind.number ||
        (t.kind === ReflectionKind.literal &&
          (isNumber(t.literal) || isBigInt(t.literal)))
    )
      ? "number"
      : "string";

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
    !existing.type &&
    type.kind !== ReflectionKind.boolean &&
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number
  ) {
    throw new Error(
      `Unsupported type for option "${reflection.getNameAsString()}" in command "${
        ctx.input.command.name
      }". Only string, number, boolean, string[], number[], or literal[] are supported, received ${stringifyType(
        type
      )
        .trim()
        .replaceAll(" | ", ", or ")}.`
    );
  }

  return mergeCommandParameter(existing, option) as CommandOption;
}

export function resolveCommandArgument(
  ctx: ResolverContext,
  index: number,
  reflection: ReflectionParameter
): CommandArgument {
  const type = reflection.getType();
  const existing = (
    ctx.output.args.length > index ? ctx.output.args[index] : {}
  ) as Partial<CommandArgument>;

  const argument = {
    name: reflection.getName() || reflection.parameter.name,
    alias: reflection.getAlias(),
    type: resolveCommandParameterType(type.kind),
    title: reflection.getTitle() || reflection.parameter.tags?.title,
    description: reflection.parameter.description,
    required: !reflection.isOptional(),
    default: reflection.getDefaultValue()
  } as CommandArgument;

  if (type.kind === ReflectionKind.array) {
    if (
      type.type.kind === ReflectionKind.string ||
      type.type.kind === ReflectionKind.number
    ) {
      (argument as StringCommandParameter | NumberCommandParameter).variadic =
        true;
      (argument as StringCommandParameter | NumberCommandParameter).type =
        resolveCommandParameterType(type.type.kind) as "string" | "number";
    } else {
      throw new Error(
        `Unsupported array type for positional argument "${argument.name}" in command "${
          ctx.input.command.name
        }". Only string[], number[], or literal[] are supported, received ${stringifyType(
          type
        )
          .trim()
          .replaceAll(" | ", ", or ")}.`
      );
    }
  } else if (type.kind === ReflectionKind.union) {
    argument.type = type.types.every(
      t =>
        t.kind === ReflectionKind.number ||
        (t.kind === ReflectionKind.literal &&
          (isNumber(t.literal) || isBigInt(t.literal)))
    )
      ? "number"
      : "string";

    (argument as StringCommandParameter | NumberCommandParameter).choices =
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
    (argument as StringCommandParameter | NumberCommandParameter).choices = [
      isNumber(type.literal)
        ? type.literal
        : isBigInt(type.literal)
          ? Number(type.literal)
          : isRegExp(type.literal)
            ? type.literal.source
            : String(type.literal)
    ].filter(Boolean) as string[] | number[];
  } else if (
    !ctx.output.args?.length &&
    type.kind !== ReflectionKind.boolean &&
    type.kind !== ReflectionKind.string &&
    type.kind !== ReflectionKind.number
  ) {
    throw new Error(
      `Unsupported type for positional argument "${argument.name}" in command "${
        ctx.input.command.name
      }". Only string, number, boolean, string[], number[], or literal[] are supported, received ${stringifyType(
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
