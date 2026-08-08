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
  isJsonSchemaArray,
  mapStorageToFileSystem
} from "@power-plant/schema";
import { createStorageAdapter } from "@powerlines/plugin-power-plant/helpers";
import { resolveOptions } from "@powerlines/unplugin/esbuild";
import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { isJsonSchemaObjectType, isJsonSchemaTupleType } from "@stryke/json";
import { replacePath } from "@stryke/path/replace";
import { load } from "@stryke/resolve";
import { constantCase } from "@stryke/string-format/constant-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { AnyFunction } from "@stryke/types/base";
import { createUnplugin } from "powerlines";
import { createEsbuildPlugin } from "unplugin";
import { getGlobalOptions } from "../helpers/utilities";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type { CommandOption, CommandTree, Context } from "../types";
import {
  applyArgsDefaults,
  applyDefaults,
  applyOptionsDefaults,
  resolveVirtualCommand
} from "./helpers";
import { applySignatureParameters, resolveCommandParameter } from "./schema";
import { parseCommandSignature } from "./signature";
import type { ResolverContext, ResolverInput } from "./types";

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

    const options = resolveOptions(context);
    result.module = await load(command.entry.input, {
      fs: mapStorageToFileSystem(createStorageAdapter(context.fs)),
      cwd: context.config.cwd,
      ...options,
      plugins: [
        createEsbuildPlugin(
          createUnplugin(context, {
            silenceHookLogging: true,
            name: "esbuild"
          })
        )()
      ]
    });
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

    result.signature = await parseCommandSignature(command.entry.input.file);
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
      const options = await extract(ctx.module.options, {
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
      const args = await extract(ctx.module.args as SchemaConfig, {
        cwd: ctx.input.context.config.cwd
      });
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
