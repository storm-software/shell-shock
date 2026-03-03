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

import { toArray } from "@stryke/convert/to-array";
import type {
  JsonSchema7EnumType,
  JsonSchema7ObjectType,
  JsonSchema7Type
} from "@stryke/json";
import {
  isJsonSchema7ArrayType,
  isJsonSchema7BooleanType,
  isJsonSchema7NumberType,
  isJsonSchema7ObjectType,
  isJsonSchema7StringType,
  isJsonSchema7TupleType,
  isStandardJsonSchema
} from "@stryke/json";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { extractJsonSchema7, isZod3Type } from "@stryke/zod";
import { isCommandParameterConfig } from "../plugin-utils";
import type {
  CommandArgument,
  CommandOption,
  CommandParameterConfig,
  Context,
  StringCommandParameter
} from "../types";
import { CommandParameterKinds } from "../types";
import type { ResolverContext } from "./types";

function resolveCommandOption(
  name: string,
  parent: JsonSchema7ObjectType,
  schema: JsonSchema7Type
): Partial<CommandOption> {
  const result = {
    name,
    kind:
      isJsonSchema7ArrayType(schema) && schema.items
        ? isJsonSchema7NumberType(schema.items)
          ? CommandParameterKinds.number
          : CommandParameterKinds.string
        : isJsonSchema7BooleanType(schema)
          ? CommandParameterKinds.boolean
          : isJsonSchema7NumberType(schema)
            ? CommandParameterKinds.number
            : CommandParameterKinds.string,
    title: schema.title,
    description: schema.description,
    alias: toArray((schema as { alias?: string | string[] }).alias || []),
    env: (schema as { env?: string }).env,
    optional: !parent.required?.includes(name),
    default: schema.default
  } as Partial<CommandOption>;
  if (
    result.kind === CommandParameterKinds.string ||
    result.kind === CommandParameterKinds.number
  ) {
    result.variadic = isJsonSchema7ArrayType(schema);
    if (result.kind === CommandParameterKinds.string) {
      result.format = (
        schema as { format?: StringCommandParameter["format"] }
      ).format;
    }

    if (
      (isJsonSchema7StringType(schema) || isJsonSchema7NumberType(schema)) &&
      (schema as JsonSchema7EnumType).enum
    ) {
      result.choices = (schema as JsonSchema7EnumType).enum;
    }
  } else if (result.kind === CommandParameterKinds.boolean) {
    result.skipAddingNegative = (
      schema as { skipAddingNegative?: boolean }
    ).skipAddingNegative;
    result.isNegativeOf = (schema as { isNegativeOf?: string }).isNegativeOf;
  }

  return result;
}

function resolveCommandArgument(
  schema: JsonSchema7Type
): Partial<CommandArgument> {
  const result = {
    name: (schema as { name?: string }).name,
    kind:
      isJsonSchema7ArrayType(schema) && schema.items
        ? isJsonSchema7NumberType(schema.items)
          ? CommandParameterKinds.number
          : CommandParameterKinds.string
        : isJsonSchema7BooleanType(schema)
          ? CommandParameterKinds.boolean
          : isJsonSchema7NumberType(schema)
            ? CommandParameterKinds.number
            : CommandParameterKinds.string,
    title: schema.title,
    description: schema.description,
    alias: toArray((schema as { alias?: string | string[] }).alias || []),
    env: (schema as { env?: string }).env,
    default: schema.default
  } as Partial<CommandArgument>;
  if (
    result.kind === CommandParameterKinds.string ||
    result.kind === CommandParameterKinds.number
  ) {
    result.variadic = isJsonSchema7ArrayType(schema);
    if (result.kind === CommandParameterKinds.string) {
      result.format = (
        schema as { format?: StringCommandParameter["format"] }
      ).format;
    }

    if (
      (isJsonSchema7StringType(schema) || isJsonSchema7NumberType(schema)) &&
      (schema as JsonSchema7EnumType).enum
    ) {
      result.choices = (schema as JsonSchema7EnumType).enum;
    }
  }

  return result;
}

export async function resolveFromExports<TContext extends Context = Context>(
  ctx: ResolverContext<TContext>
) {
  validateExports(ctx);

  const metadata = ctx.module?.metadata ?? {};
  if (isSetString(metadata.title)) {
    ctx.output.title = metadata.title;
  }
  if (isSetString(metadata.description)) {
    ctx.output.description = metadata.description;
  }
  if (
    isSetString(metadata.alias) ||
    (Array.isArray(metadata.alias) && metadata.alias.length > 0)
  ) {
    ctx.output.alias = toArray(metadata.alias);
  }
  if (isSetString(metadata.icon)) {
    ctx.output.icon = metadata.icon;
  }

  if (isSetObject(ctx.module?.options)) {
    if (
      isZod3Type(ctx.module.options) ||
      isStandardJsonSchema(ctx.module.options) ||
      isJsonSchema7ObjectType(ctx.module.options)
    ) {
      let jsonSchema: JsonSchema7Type;
      if (isZod3Type(ctx.module.options)) {
        jsonSchema = extractJsonSchema7(ctx.module.options);
      } else if (isStandardJsonSchema(ctx.module.options)) {
        jsonSchema = ctx.module.options["~standard"].jsonSchema.input({
          target: "draft-07"
        });
      } else {
        jsonSchema = ctx.module.options as JsonSchema7ObjectType;
      }

      if (!isJsonSchema7ObjectType(jsonSchema)) {
        throw new TypeError(
          `Command options for command at path "${
            ctx.input.command.path
          }" must be defined as a Zod object schema, a standard JSON Schema object, or a JSON Schema object.`
        );
      }

      ctx.output.options = Object.fromEntries(
        Object.entries((jsonSchema as JsonSchema7ObjectType).properties).map(
          ([name, property]) => [
            name,
            resolveCommandOption(name, jsonSchema, property)
          ]
        )
      ) as Record<string, CommandOption>;
    } else if (
      Object.values(ctx.module.options).every(isCommandParameterConfig)
    ) {
      ctx.output.options = Object.fromEntries(
        Object.entries(
          ctx.module.options as Record<string, CommandParameterConfig>
        ).map(([name, option]) => [
          name,
          { name, ...option, alias: toArray(option.alias) }
        ])
      ) as Record<string, CommandOption>;
    } else {
      throw new TypeError(
        `Command options for command at path "${
          ctx.input.command.path
        }" must be defined as a record of valid CommandOption objects, a Zod object schema, or a standard JSON Schema object.`
      );
    }
  }

  if (isSetObject(ctx.module?.args)) {
    if (
      isZod3Type(ctx.module.args) ||
      isStandardJsonSchema(ctx.module.args) ||
      isJsonSchema7TupleType(ctx.module.args)
    ) {
      let jsonSchema: JsonSchema7Type;
      if (isZod3Type(ctx.module.args)) {
        jsonSchema = extractJsonSchema7(ctx.module.args);
      } else if (isStandardJsonSchema(ctx.module.args)) {
        jsonSchema = ctx.module.args["~standard"].jsonSchema.input({
          target: "draft-07"
        });
      } else {
        jsonSchema = ctx.module.args;
      }

      if (!isJsonSchema7TupleType(jsonSchema)) {
        throw new TypeError(
          `Command arguments for command at path "${
            ctx.input.command.path
          }" must be defined as a Zod tuple schema, a standard JSON Schema tuple object, or a JSON Schema tuple object.`
        );
      }

      ctx.output.args = jsonSchema.items.map(item =>
        resolveCommandArgument(item)
      ) as CommandArgument[];
    } else if (Object.values(ctx.module.args).every(isCommandParameterConfig)) {
      ctx.output.args = ctx.module.args.map(arg => ({
        ...arg,
        alias: toArray(arg.alias)
      })) as CommandArgument[];
    } else {
      throw new TypeError(
        `Command arguments for command at path "${
          ctx.input.command.path
        }" must be defined as a record of valid CommandArgument objects, a Zod tuple schema, or a standard JSON Schema tuple object.`
      );
    }
  }
}

function validateExports<TContext extends Context = Context>(
  ctx: ResolverContext<TContext>
) {
  if (!ctx.module) {
    throw new Error(
      `Command module at path "${
        ctx.input.command.path
      }" is undefined or null. Please ensure the module exports a valid command.`
    );
  } else if (!isSetObject(ctx.module)) {
    throw new TypeError(
      `Command module at path "${
        ctx.input.command.path
      }" is not an object. Please ensure the module exports a valid command.`
    );
  } else if (!("default" in ctx.module)) {
    throw new Error(
      `Command module at path "${
        ctx.input.command.path
      }" does not appear to be valid. Please ensure the module's default export is a valid command handler function.`
    );
  }
}
