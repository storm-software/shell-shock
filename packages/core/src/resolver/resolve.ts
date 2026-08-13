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
  JsonSchemaLike,
  SchemaConfig,
  SchemaEnvelope
} from "@power-plant/schema";
import {
  addProperty,
  extract,
  getPropertiesList,
  isJsonSchemaArray
} from "@power-plant/schema";
import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { isJsonSchemaObjectType, isJsonSchemaTupleType } from "@stryke/json";
import { replacePath } from "@stryke/path/replace";
import { constantCase } from "@stryke/string-format/constant-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { AnyFunction } from "@stryke/types/base";
import { createJiti } from "jiti";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { z } from "zod";
import { getGlobalOptions } from "../helpers/utilities";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type {
  CommandModule,
  CommandOption,
  CommandTree,
  Context
} from "../types";
import {
  applyArgsDefaults,
  applyDefaults,
  applyOptionsDefaults,
  resolveVirtualCommand
} from "./helpers";
import { applySignatureParameters, resolveCommandParameter } from "./schema";
import { parseCommandSignature } from "./signature";
import type { ResolverContext, ResolverInput } from "./types";

function toExtractableSchema(input: unknown) {
  if (isSetObject(input) && "_zod" in input) {
    return z.toJSONSchema(input as Parameters<typeof z.toJSONSchema>[0]);
  }

  return input;
}

const CONSOLE_STUB_EXPORTS = [
  "banner",
  "blockquote",
  "bold",
  "code",
  "cyan",
  "debug",
  "dim",
  "divider",
  "error",
  "fatal",
  "gray",
  "green",
  "help",
  "info",
  "inlineCode",
  "italic",
  "link",
  "log",
  "red",
  "reset",
  "shine",
  "spinner",
  "stripAnsi",
  "success",
  "table",
  "trace",
  "underline",
  "warn",
  "wrapAnsi",
  "write",
  "writeLine",
  "yellow"
] as const;

function stubExport(...args: unknown[]) {
  return args[0] == null ? "" : args[0];
}

function createColorGroup() {
  return {
    primary: stubExport,
    secondary: stubExport,
    tertiary: stubExport
  };
}

function createVirtualModuleStub(
  exportNames: Iterable<string> = CONSOLE_STUB_EXPORTS
): Record<string, unknown> {
  const stub: Record<string, unknown> = {
    textColors: {
      heading: createColorGroup(),
      body: createColorGroup(),
      message: createColorGroup()
    }
  };
  for (const name of exportNames) {
    stub[name] = stubExport;
  }
  stub.default = stub;

  return stub;
}

function resolveBuiltinAliases(context: Context): Record<string, string> {
  const builtinsDir = context.entryPath
    ? join(dirname(context.entryPath), "builtins")
    : join(context.config.cwd, ".shell-shock", "builtins");

  if (!existsSync(builtinsDir)) {
    return {};
  }

  const aliases: Record<string, string> = {};
  for (const file of readdirSync(builtinsDir)) {
    if (!/\.(c|m)?tsx?$/.test(file)) {
      continue;
    }

    const name = file.replace(/\.(c|m)?tsx?$/, "");
    const absolutePath = join(builtinsDir, file);
    aliases[name] = absolutePath;
    aliases[`shell-shock:${name}`] = absolutePath;
  }

  return aliases;
}

function collectVirtualModules(
  source: string
): Record<string, Record<string, unknown>> {
  const consoleStub = createVirtualModuleStub();
  const modules = new Map<string, Record<string, unknown>>([
    ["console", consoleStub],
    ["shell-shock:console", consoleStub],
    ["shell-shock:utils", createVirtualModuleStub()],
    [
      "shell-shock:env",
      createVirtualModuleStub(["env", "isDevelopment", "isDebug"])
    ],
    ["shell-shock:state", createVirtualModuleStub(["hasFlag"])]
  ]);

  for (const match of source.matchAll(/["'](shell-shock:[^"']+)["']/g)) {
    const id = match[1];
    if (id && !modules.has(id)) {
      modules.set(id, createVirtualModuleStub());
    }
  }

  for (const match of source.matchAll(
    /import\s+\{([^}]+)\}\s+from\s+["']((?:shell-shock:)?[^"']+)["']/g
  )) {
    const id = match[2];
    if (!id || (!id.startsWith("shell-shock:") && id !== "console")) {
      continue;
    }

    const stub = modules.get(id) ?? createVirtualModuleStub();
    for (const specifier of match[1]?.split(",") ?? []) {
      const exportName = specifier.trim().split(/\s+as\s+/)[0]?.trim();
      if (exportName && !(exportName in stub)) {
        stub[exportName] = stubExport;
      }
    }
    modules.set(id, stub);
  }

  return Object.fromEntries(modules);
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
      `Resolving CLI command schema: ${command.id} (file: ${replacePath(
        command.entry.input.file,
        context.config.cwd
      )})`
    );

    const rawSource = await context.fs.read(command.entry.input.file);
    const sourceText =
      typeof rawSource === "string"
        ? rawSource
        : Buffer.from(rawSource as Uint8Array).toString("utf8");
    result.sourceText = sourceText;

    let loaded: unknown;
    try {
      const jiti = createJiti(import.meta.url, {
        jsx: true,
        interopDefault: false,
        alias: resolveBuiltinAliases(context),
        virtualModules: collectVirtualModules(sourceText)
      });
      loaded = await jiti.evalModule(sourceText, {
        filename: command.entry.input.file
      });
    } catch (error) {
      context.debug(
        `Command module evaluation failed for "${command.id}", falling back to signature extraction: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      loaded = { default: () => undefined };
    }
    result.module = isFunction(loaded)
      ? { default: loaded as AnyFunction }
      : (loaded as CommandModule);
    if (!result.module) {
      throw new Error(
        `Failed to resolve command module at path "${
          command.entry.input.file
        }". Please ensure the file exists and is a valid module.`
      );
    }

    if (isFunction(result.module)) {
      result.module = {
        default: result.module as AnyFunction
      };
    }

    result.signature = await parseCommandSignature(
      command.entry.input.file,
      sourceText
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

    if (!isFunction(result.module.default)) {
      throw new Error(
        `The command entry file "${
          input.command.entry.input?.file || input.command.path
        }" does not have a valid function as its default export - this is required for command resolution and execution.`
      );
    }
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

    ctx.output.description ??= (ctx.input.command.description ||
      ctx.signature?.description) as string;

    if (ctx.module.options) {
      const options = await extract(toExtractableSchema(ctx.module.options), {
        cwd: ctx.input.context.config.cwd
      });
      if (!isSetObject(options) || !isJsonSchemaObjectType(options.schema)) {
        throw new TypeError(
          `Command options for command at path "${
            ctx.input.command.path
          }" must resolve to an object.`
        );
      }

      ctx.output.options = getPropertiesList(
        options as SchemaEnvelope<object>
      ).reduce(
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
        toExtractableSchema(ctx.module.args) as SchemaConfig,
        {
          cwd: ctx.input.context.config.cwd
        }
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

    if (
      ctx.signature &&
      ctx.input.command.entry.input?.file &&
      (!ctx.module.options || !ctx.module.args)
    ) {
      await applySignatureParameters(
        ctx,
        ctx.input.command.entry.input.file,
        ctx.signature
      );
    }
  } else {
    resolveVirtualCommand(ctx);
  }

  return postprocess(ctx);
}
