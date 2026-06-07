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
import {
  reflect,
  ReflectionClass,
  ReflectionFunction,
  ReflectionKind
} from "@powerlines/deepkit/vendor/type";
import type { JsonSchemaLike, SchemaInput } from "@powerlines/schema";
import {
  addProperty,
  extract,
  getPropertiesList,
  isJsonSchemaArray,
  resolveModule
} from "@powerlines/schema";
import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { isJsonSchemaObjectType, isJsonSchemaTupleType } from "@stryke/json";
import { replacePath } from "@stryke/path/replace";
import { constantCase } from "@stryke/string-format/constant-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { getGlobalOptions } from "../helpers/utilities";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type {
  CommandArgument,
  CommandModule,
  CommandOption,
  CommandTree,
  Context
} from "../types";
import { resolveCommandArgument, resolveCommandOption } from "./deepkit";
import {
  applyArgsDefaults,
  applyDefaults,
  applyOptionsDefaults,
  resolveVirtualCommand
} from "./helpers";
import type { ResolverContext, ResolverInput } from "./types";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return isSetObject(value) ? (value as Record<string, unknown>) : {};
}

function toAliasList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return getUnique(value.filter(isSetString));
  }

  return isSetString(value) ? [value] : [];
}

function inferParameterType(
  input: Record<string, unknown>
): CommandOption["type"] {
  const schemaType = input.type;

  if (Array.isArray(schemaType)) {
    const first = schemaType.find(type => type !== "null");
    if (first === "integer" || first === "number") {
      return "number";
    }
    if (first === "boolean") {
      return "boolean";
    }
    if (first === "array") {
      const nested = asRecord(input.items);
      const nestedType = nested.type;
      if (nestedType === "integer" || nestedType === "number") {
        return "number";
      }
      if (nestedType === "boolean") {
        return "boolean";
      }

      return "string";
    }

    return "string";
  }

  if (schemaType === "integer" || schemaType === "number") {
    return "number";
  }
  if (schemaType === "boolean") {
    return "boolean";
  }
  if (schemaType === "array") {
    const nested = asRecord(input.items);
    const nestedType = nested.type;
    if (nestedType === "integer" || nestedType === "number") {
      return "number";
    }
    if (nestedType === "boolean") {
      return "boolean";
    }

    return "string";
  }

  if (Array.isArray(input.enum) && input.enum.length > 0) {
    const first = input.enum.find(value => value !== null);
    if (isFiniteNumber(first)) {
      return "number";
    }
    if (isBoolean(first)) {
      return "boolean";
    }
  }

  if (isFiniteNumber(input.default)) {
    return "number";
  }
  if (isBoolean(input.default)) {
    return "boolean";
  }

  return "string";
}

function inferVariadic(input: Record<string, unknown>): boolean {
  if (isBoolean(input.variadic)) {
    return input.variadic;
  }

  return input.type === "array";
}

function normalizeDefault(
  input: Record<string, unknown>,
  type: CommandOption["type"],
  variadic: boolean
) {
  const defaultValue = input.default;
  if (defaultValue === undefined) {
    return undefined;
  }

  if (type === "boolean") {
    if (variadic) {
      if (Array.isArray(defaultValue)) {
        return defaultValue.filter(isBoolean);
      }

      return isBoolean(defaultValue) ? [defaultValue] : undefined;
    }

    if (Array.isArray(defaultValue)) {
      return defaultValue.find(isBoolean);
    }

    return isBoolean(defaultValue) ? defaultValue : undefined;
  }

  if (type === "number") {
    if (variadic) {
      if (Array.isArray(defaultValue)) {
        return defaultValue
          .map(item =>
            typeof item === "bigint" ? Number(item) : (item as unknown)
          )
          .filter(isFiniteNumber);
      }

      const normalized =
        typeof defaultValue === "bigint" ? Number(defaultValue) : defaultValue;

      return isFiniteNumber(normalized) ? [normalized] : undefined;
    }

    if (Array.isArray(defaultValue)) {
      const first = defaultValue
        .map(item =>
          typeof item === "bigint" ? Number(item) : (item as unknown)
        )
        .find(isFiniteNumber);

      return first;
    }

    const normalized =
      typeof defaultValue === "bigint" ? Number(defaultValue) : defaultValue;

    return isFiniteNumber(normalized) ? normalized : undefined;
  }

  if (variadic) {
    if (Array.isArray(defaultValue)) {
      return defaultValue.filter(isSetString);
    }

    return isSetString(defaultValue) ? [defaultValue] : undefined;
  }

  if (Array.isArray(defaultValue)) {
    return defaultValue.find(isSetString);
  }

  return isSetString(defaultValue) ? defaultValue : undefined;
}

function normalizeStringChoices(input: Record<string, unknown>) {
  const source = Array.isArray(input.choices) ? input.choices : input.enum;
  if (!Array.isArray(source)) {
    return undefined;
  }

  return source.filter(isSetString);
}

function normalizeNumberChoices(input: Record<string, unknown>) {
  const source = Array.isArray(input.choices) ? input.choices : input.enum;
  if (!Array.isArray(source)) {
    return undefined;
  }

  return source
    .map(item => (typeof item === "bigint" ? Number(item) : (item as unknown)))
    .filter(isFiniteNumber);
}

function resolveCommandParameter(
  schema: unknown,
  defaults: {
    fallbackRequired: boolean;
    includeBooleanOptionFields: boolean;
  }
): CommandOption | CommandArgument {
  const input = asRecord(schema);
  const type = inferParameterType(input);
  const variadic = inferVariadic(input);
  const defaultValue = normalizeDefault(input, type, variadic);

  const required = isBoolean(input.required)
    ? input.required
    : defaultValue === undefined
      ? defaults.fallbackRequired
      : false;

  const env = isSetString(input.env) ? input.env : false;

  const result = {
    name: isSetString(input.name) ? input.name : "",
    type,
    title: isSetString(input.title) ? input.title : "",
    description: isSetString(input.description) ? input.description : "",
    alias: toAliasList(input.alias),
    default: defaultValue,
    env,
    required,
    variadic
  } as unknown as CommandOption | CommandArgument;

  if (type === "string") {
    const stringChoices = normalizeStringChoices(input);
    if (Array.isArray(stringChoices)) {
      (result as Extract<CommandOption, { type: "string" }>).choices =
        stringChoices;
    }

    if (isSetString(input.format)) {
      (result as Extract<CommandOption, { type: "string" }>).format =
        input.format;
    }
  }

  if (type === "number") {
    const numberChoices = normalizeNumberChoices(input);
    if (Array.isArray(numberChoices)) {
      (result as Extract<CommandOption, { type: "number" }>).choices =
        numberChoices;
    }
  }

  if (defaults.includeBooleanOptionFields && type === "boolean" && !variadic) {
    const optionResult = result as Extract<
      CommandOption,
      { type: "boolean"; variadic: false }
    >;

    if (isSetString(input.isNegativeOf)) {
      optionResult.isNegativeOf = input.isNegativeOf;
    }
    if (isBoolean(input.skipAddingNegative)) {
      optionResult.skipAddingNegative = input.skipAddingNegative;
    }
  }

  return result;
}

async function preprocess<TContext extends Context>(
  input: ResolverInput<TContext>
): Promise<ResolverContext> {
  const { context, command, parent } = input;

  const title =
    command.title ||
    `${
      parent?.title
        ? `${
            parent.virtual
              ? parent.title.replace(/(?:c|C)ommands?$/, "").trim()
              : parent.title
          } - `
        : ""
    }${titleCase(command.name)}${command.virtual ? " Commands" : ""}`;

  const output = {
    alias: [],
    icon: parent?.icon,
    tags: parent?.tags ?? [],
    ...command,
    title,
    options: parent === null ? getGlobalOptions(context, command) : {},
    args: [],
    parent: parent ?? null,
    children: {}
  } as CommandTree;

  const result = {
    input,
    output
  } as ResolverContext<TContext>;

  if (!command.virtual) {
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
      `Adding reflection for CLI command: ${command.id} (file: ${replacePath(
        command.entry.input.file,
        context.config.cwd
      )})`
    );

    result.module = await resolveModule<CommandModule>(
      context,
      command.entry.input,
      {
        name: `${command.title || titleCase(command.name)} Command Bundler`,
        plugins: [
          esbuildPlugin(context, {
            reflection: "default",
            level: "all"
          })
        ],
        resolve: {
          skipNodeModulesBundle: true
        }
      }
    );
  }

  if (!command.virtual) {
    if (!result.module?.default) {
      throw new Error(
        `The command entry file "${
          input.command.entry.input?.file || input.command.path
        }" does not include a handler function as its default export - this is required for command resolution and execution.`
      );
    }

    const type = reflect(result.module.default);
    if (type.kind !== ReflectionKind.function) {
      throw new Error(
        `The command entry file "${
          input.command.entry.input?.file || input.command.path
        }" does not have a valid function as its default export - this is required for command resolution and execution.`
      );
    }

    result.reflection = new ReflectionFunction(type);
  }

  return result;
}

async function postprocess<TContext extends Context>(
  ctx: ResolverContext<TContext>
): Promise<CommandTree> {
  ctx.output.options = applyOptionsDefaults(ctx);
  ctx.output.args = applyArgsDefaults(ctx);

  // Ensure unique argument names by appending an index suffix to duplicates
  ctx.output.args.forEach((arg, index) => {
    const found = ctx.output.args.findIndex(a => a.name === arg.name);
    if (
      (found !== -1 && found !== index) ||
      ctx.output.segments.some(
        segment =>
          isDynamicPathSegment(segment) &&
          getDynamicPathSegmentName(segment) === arg.name
      )
    ) {
      arg.name += `_${
        ctx.output.segments.filter(
          segment =>
            isDynamicPathSegment(segment) &&
            getDynamicPathSegmentName(segment).replace(/_\d+$/, "") === arg.name
        ).length +
        ctx.output.args.filter(a => a.name.replace(/_\d+$/, "") === arg.name)
          .length
      }`;
      arg.env = arg.name
        ? arg.env || arg.env === false
          ? arg.env
          : ctx.input.context.config.autoAssignEnv
            ? constantCase(arg.name)
            : false
        : false;
    }
  });

  applyDefaults(ctx);

  if (ctx.input.context.env) {
    if (isSetObject(ctx.output.options)) {
      Object.values(ctx.output.options)
        .filter(option => Boolean(option.env))
        .forEach(option => {
          addProperty(
            ctx.input.context.env.config.schema,
            option.env as string,
            {
              ...option,
              name: option.env as string,
              alias: option.alias
                .filter(alias => alias.length > 1)
                .map(alias => constantCase(alias))
            }
          );
        });
    }

    ctx.output.args
      .filter(arg => Boolean(arg.env))
      .forEach(arg =>
        addProperty(ctx.input.context.env.config.schema, arg.env as string, {
          ...arg,
          name: arg.env as string,
          alias: arg.alias
            .filter(alias => alias.length > 1)
            .map(alias => constantCase(alias))
        })
      );
  }

  await Promise.all(
    ctx.input.context.inputs
      .filter(
        input =>
          input.segments.filter(segment => !isDynamicPathSegment(segment))
            .length ===
            ctx.input.command.segments.filter(
              segment => !isDynamicPathSegment(segment)
            ).length +
              1 &&
          input.segments
            .slice(0, ctx.input.command.segments.length)
            .every(
              (value, index) => value === ctx.input.command.segments[index]
            )
      )
      .map(async input => {
        ctx.output.children[input.name] = await resolve<TContext>({
          context: ctx.input.context,
          command: input,
          parent: ctx.output
        });
      })
  );

  return ctx.output;
}

/**
 * Resolves a command tree from the given resolver input.
 *
 * @param input - The resolver input containing the context, command, and optional parent command tree.
 * @returns A promise that resolves to the resolved command tree.
 */
export async function resolve<TContext extends Context = Context>(
  input: ResolverInput<TContext>
): Promise<CommandTree> {
  const ctx = await preprocess<TContext>(input);
  if (!ctx.output.virtual) {
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

    const metadata = ctx.module.metadata ?? {};
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
    if (isSetString(metadata.tags)) {
      ctx.output.tags = getUnique(
        ctx.output.tags.concat(toArray(metadata.tags))
      );
    }

    ctx.output.description ??= (
      ctx.input.command.description ||
      // eslint-disable-next-line ts/unbound-method
      isFunction(ctx.reflection?.getDescription)
        ? ctx.reflection?.getDescription()
        : ctx.reflection?.description
    ) as string;

    if (ctx.module.options) {
      const options = await extract(ctx.input.context, ctx.module.options);
      if (!isSetObject(options) || !isJsonSchemaObjectType(options.schema)) {
        throw new TypeError(
          `Command options for command at path "${
            ctx.input.command.path
          }" must resolve to an object.`
        );
      }

      ctx.output.options = getPropertiesList(options).reduce(
        (ret, property) => {
          ret[property.name] = resolveCommandParameter(property, {
            fallbackRequired: false,
            includeBooleanOptionFields: true
          });

          return ret;
        },
        {} as Record<string, CommandOption>
      );
    }

    if (ctx.module.args) {
      const args = await extract(
        ctx.input.context,
        ctx.module.args as SchemaInput
      );
      if (isSetObject(args)) {
        if (
          !isJsonSchemaTupleType(args.schema) &&
          !isJsonSchemaArray(args.schema)
        ) {
          throw new TypeError(
            `Command arguments for command at path "${
              ctx.input.command.path
            }" must resolve to a tuple${
              (args?.schema as JsonSchemaLike)?.type
                ? `, instead received ${JSON.stringify((args.schema as JsonSchemaLike).type)}`
                : ""
            }.`
          );
        }

        if (Array.isArray(args.schema.items)) {
          ctx.output.args = args.schema.items.map(item =>
            resolveCommandParameter(item, {
              fallbackRequired: true,
              includeBooleanOptionFields: false
            })
          );
        }
      }
    }

    const parameters = ctx.reflection?.getParameters() ?? [];
    if (parameters.length > 0) {
      const hasOptions =
        parameters[0] &&
        (parameters[0].type.kind === ReflectionKind.objectLiteral ||
          parameters[0].type.kind === ReflectionKind.class);
      if (hasOptions && !ctx.module.options) {
        const optionsReflection = ReflectionClass.from(parameters[0]?.type);
        for (const property of optionsReflection.getProperties()) {
          ctx.output.options[property.getNameAsString()] = resolveCommandOption(
            ctx,
            property
          );
        }
      }

      if (!ctx.module.args) {
        ctx.output.args = (hasOptions ? parameters.slice(1) : parameters).map(
          (arg, index) => resolveCommandArgument(ctx, index, arg)
        );
      }
    }
  } else {
    resolveVirtualCommand(ctx);
  }

  return postprocess(ctx);
}
