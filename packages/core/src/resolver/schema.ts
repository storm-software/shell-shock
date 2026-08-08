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

import type { JsonSchema } from "@power-plant/schema";
import {
  extractTSType,
  getPropertiesList,
  isJsonSchemaObject
} from "@power-plant/schema";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { readFileSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import type { CommandArgument, CommandOption } from "../types";
import { mergeCommandParameter } from "./helpers";
import type { CommandParameterSignature, CommandSignature } from "./signature";
import type { ResolverContext } from "./types";

async function extractFromTempType(
  typeSource: string,
  generatorOptions: { tsconfig?: string }
): Promise<JsonSchema> {
  const directory = await mkdtemp(join(tmpdir(), "shell-shock-"));
  const tempFile = join(directory, "type.ts");

  try {
    await writeFile(tempFile, typeSource, "utf8");
    const schema = await extractTSType(
      { file: tempFile, export: "__ShellShockType" },
      generatorOptions
    );

    return dereferenceSchema(schema);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/**
 * Pulls a file-local interface/type-alias declaration so schema extraction can
 * avoid evaluating the full command module (imports, side effects, etc.).
 */
function getLocalTypeDeclarationSource(
  filePath: string,
  typeName: string
): string | undefined {
  const sourceText = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  for (const statement of sourceFile.statements) {
    if (
      (ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement)) &&
      statement.name.text === typeName
    ) {
      return statement.getText(sourceFile);
    }
  }

  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return isSetObject(value) ? (value as Record<string, unknown>) : {};
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toAliasList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(isSetString);
  }

  if (!isSetString(value)) {
    return [];
  }

  return value
    .split(/[,\s]+/)
    .map(part => part.trim())
    .filter(Boolean);
}

function parseTagDefault(value: unknown): unknown {
  if (!isSetString(value)) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed === "true") {
    return true;
  }
  if (trimmed === "false") {
    return false;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return trimmed;
  }
}

/**
 * Resolves the root schema definition when `ts-json-schema-generator` returns a `$ref`.
 */
export function dereferenceSchema(schema: JsonSchema): JsonSchema {
  const record = asRecord(schema);
  const ref = record.$ref;
  const definitions = asRecord(record.definitions);
  const defs = asRecord(record.$defs);

  if (!isSetString(ref)) {
    return schema;
  }

  const key = decodeURIComponent(
    ref.replace(/^#\/(?:definitions|\$defs)\//, "")
  );
  const resolved = definitions[key] ?? defs[key];
  if (!isSetObject(resolved)) {
    return schema;
  }

  return {
    ...(resolved as JsonSchema),
    ...(Object.keys(definitions).length > 0
      ? { definitions: record.definitions }
      : {}),
    ...(Object.keys(defs).length > 0 ? { $defs: record.$defs } : {})
  } as JsonSchema;
}

function isObjectLikeSchema(schema: JsonSchema): boolean {
  const resolved = dereferenceSchema(schema);
  if (!isJsonSchemaObject(resolved)) {
    return false;
  }

  const record = asRecord(resolved);

  return (
    record.type === "object" ||
    isSetObject(record.properties) ||
    Array.isArray(record.allOf) ||
    Array.isArray(record.anyOf) ||
    Array.isArray(record.oneOf)
  );
}

/**
 * Generates a JSON Schema for a TypeScript type using `ts-json-schema-generator`
 * via `@power-plant/schema`'s {@link extractTSType}.
 *
 * @param filePath - Path to the TypeScript file containing the type.
 * @param typeName - Named type to extract when available.
 * @param typeText - Inline type text used when no named type exists.
 */
export async function extractTypeSchema(
  filePath: string,
  typeName: string | undefined,
  typeText: string
): Promise<JsonSchema> {
  // `skipTypeCheck` is forwarded to ts-json-schema-generator's config.
  const generatorOptions = { skipTypeCheck: true } as {
    tsconfig?: string;
  };

  if (typeName && /^[A-Z_][\w.]*$/i.test(typeName) && !typeName.includes(".")) {
    try {
      const schema = await extractTSType(
        { file: filePath, export: typeName },
        generatorOptions
      );

      return dereferenceSchema(schema);
    } catch {
      // File-local interfaces are not module exports. Isolate the declaration
      // so extraction does not evaluate command-file imports/side effects.
      const declaration = getLocalTypeDeclarationSource(filePath, typeName);
      if (declaration) {
        return extractFromTempType(
          `${declaration}\nexport type __ShellShockType = ${typeName};\n`,
          generatorOptions
        );
      }
    }
  }

  return extractFromTempType(
    `export type __ShellShockType = ${typeText};\n`,
    generatorOptions
  );
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
    if (typeof first === "boolean") {
      return "boolean";
    }
  }

  if (isFiniteNumber(input.default)) {
    return "number";
  }
  if (typeof input.default === "boolean") {
    return "boolean";
  }

  return "string";
}

function inferVariadic(input: Record<string, unknown>): boolean {
  if (typeof input.variadic === "boolean") {
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
        return defaultValue.filter(value => typeof value === "boolean");
      }

      return typeof defaultValue === "boolean" ? [defaultValue] : undefined;
    }

    if (Array.isArray(defaultValue)) {
      return defaultValue.find(value => typeof value === "boolean");
    }

    return typeof defaultValue === "boolean" ? defaultValue : undefined;
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
      return defaultValue
        .map(item =>
          typeof item === "bigint" ? Number(item) : (item as unknown)
        )
        .find(isFiniteNumber);
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

/**
 * Maps a JSON Schema fragment to a command option or argument.
 */
export function resolveCommandParameter(
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

  const required =
    typeof input.required === "boolean"
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
    if (typeof input.skipAddingNegative === "boolean") {
      optionResult.skipAddingNegative = input.skipAddingNegative;
    }
  }

  return result;
}

function applyMemberTags(
  property: Record<string, unknown>,
  tags: Record<string, string | string[]> | undefined
): Record<string, unknown> {
  if (!tags) {
    return property;
  }

  const next = { ...property };

  if (tags.alias !== undefined) {
    next.alias = toAliasList(tags.alias);
  }
  if (isSetString(tags.title)) {
    next.title = tags.title.trim();
  }
  if (isSetString(tags.env)) {
    next.env = tags.env;
  }
  if (next.default === undefined) {
    const tagDefault = parseTagDefault(tags.default ?? tags.defaultValue);
    if (tagDefault !== undefined) {
      next.default = tagDefault;
    }
  }

  return next;
}

function resolveArgumentFromSchema(
  ctx: ResolverContext,
  index: number,
  parameter: CommandParameterSignature,
  schema: JsonSchema
): CommandArgument {
  const existing = (
    ctx.output.args.length > index ? ctx.output.args[index] : {}
  ) as Partial<CommandArgument>;

  const input = applyMemberTags(
    {
      ...asRecord(schema),
      name: parameter.name,
      description: parameter.description ?? asRecord(schema).description,
      required: !parameter.optional,
      variadic: parameter.rest || asRecord(schema).type === "array",
      ...(parameter.defaultValue !== undefined
        ? { default: parameter.defaultValue }
        : {}),
      ...(parameter.tags.alias !== undefined
        ? { alias: toAliasList(parameter.tags.alias) }
        : {}),
      ...(isSetString(parameter.tags.title)
        ? { title: parameter.tags.title.trim() }
        : {}),
      ...(isSetString(parameter.tags.env) ? { env: parameter.tags.env } : {})
    },
    parameter.tags
  );

  const argument = resolveCommandParameter(input, {
    fallbackRequired: !parameter.optional,
    includeBooleanOptionFields: false
  });

  return mergeCommandParameter(existing, argument, {
    name: `arg${index}`
  }) as CommandArgument;
}

/**
 * Resolves command options and arguments from a parsed TypeScript handler signature
 * using `ts-json-schema-generator` (via {@link extractTypeSchema}).
 */
export async function applySignatureParameters(
  ctx: ResolverContext,
  filePath: string,
  signature: CommandSignature
): Promise<void> {
  const parameters = signature?.parameters ?? [];
  if (parameters.length === 0) {
    return;
  }

  const first = parameters[0];
  let hasOptions = false;
  let optionsSchema: JsonSchema | undefined;

  if (first && !first.rest) {
    optionsSchema = await extractTypeSchema(
      filePath,
      first.typeName,
      first.typeText
    );
    hasOptions = isObjectLikeSchema(optionsSchema);
  }

  if (hasOptions && !ctx.module?.options && optionsSchema && first) {
    if (!isJsonSchemaObject(optionsSchema)) {
      throw new TypeError(
        `Unsupported options type for command "${
          ctx.input.command.name
        }". Expected an object type, received ${JSON.stringify(
          asRecord(optionsSchema).type ?? optionsSchema
        )}.`
      );
    }

    for (const property of getPropertiesList(optionsSchema)) {
      const tagged = applyMemberTags(
        {
          ...asRecord(property),
          name: property.name,
          required: property.required
        },
        signature.typeMemberTags[property.name]
      );

      const existing = (ctx.output.options[property.name] ??
        {}) as Partial<CommandOption>;
      const option = resolveCommandParameter(tagged, {
        fallbackRequired: false,
        includeBooleanOptionFields: true
      });

      ctx.output.options[property.name] = mergeCommandParameter(
        existing,
        option
      ) as CommandOption;
    }
  }

  if (!ctx.module?.args) {
    const argumentParameters = hasOptions ? parameters.slice(1) : parameters;

    ctx.output.args = await Promise.all(
      argumentParameters.map(async (parameter, index) => {
        const schema = await extractTypeSchema(
          filePath,
          parameter.typeName,
          parameter.typeText
        );

        if (
          isObjectLikeSchema(schema) &&
          asRecord(schema).type === "object" &&
          !parameter.rest
        ) {
          throw new Error(
            `Unsupported type for positional argument "${parameter.name}" in command "${
              ctx.input.command.name
            }". Only string, number, boolean, string[], number[], or literal unions are supported, received object.`
          );
        }

        return resolveArgumentFromSchema(ctx, index, parameter, schema);
      })
    );
  }
}
