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
import { ReflectionVisibility } from "@powerlines/deepkit/vendor/type";
import { resolveModule } from "@powerlines/plugin-esbuild/helpers/resolve";
import { constantCase } from "@stryke/string-format/constant-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { getGlobalOptions } from "../helpers/utilities";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import { extractType } from "../plugin-utils/deepkit";
import type { CommandModule, CommandTree, Context } from "../types";
import { resolveFromBytecode } from "./deepkit";
import {
  applyArgsDefaults,
  applyDefaults,
  applyOptionsDefaults,
  resolveVirtualCommand
} from "./helpers";
import { resolveFromExports } from "./module";
import type { ResolverContext, ResolverInput } from "./types";

async function initialize<TContext extends Context = Context>(
  input: ResolverInput<TContext>
): Promise<ResolverContext> {
  const { context, command, parent } = input;

  const title =
    command.title ||
    `${
      parent?.title
        ? `${
            parent.isVirtual
              ? parent.title.replace(/(?:c|C)ommands?$/, "").trim()
              : parent.title
          } - `
        : ""
    }${titleCase(command.name)}${command.isVirtual ? " Commands" : ""}`;

  const output = {
    alias: [],
    icon: parent?.icon,
    tags: parent?.tags ?? [],
    ...command,
    title,
    options: getGlobalOptions(context, command),
    args: [],
    parent: parent ?? null,
    children: {}
  } as CommandTree;

  const result: ResolverContext = {
    input,
    output
  };

  if (!command.isVirtual) {
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
      `Adding reflection for application command: ${command.id} (file: ${
        command.entry.input.file
      })`
    );

    result.module = await resolveModule<CommandModule>(
      context,
      command.entry.input,
      {
        name: `${command.title} Command Module`,
        plugins: [
          esbuildPlugin(context, {
            reflection: "default",
            reflectionLevel: "verbose"
          })
        ]
      }
    );
  }

  return result;
}

async function postprocess<TContext extends Context = Context>(
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
          ctx.input.context.env.types.env.addProperty({
            name: option.env as string,
            optional: option.optional ? true : undefined,
            description: option.description,
            visibility: ReflectionVisibility.public,
            type: extractType(option),
            default: option.default,
            tags: {
              title: option.title,
              alias: option.alias
                .filter(alias => alias.length > 1)
                .map(alias => constantCase(alias)),
              domain: "cli"
            }
          });
        });
    }

    ctx.output.args
      .filter(arg => Boolean(arg.env))
      .forEach(arg =>
        ctx.input.context.env.types.env.addProperty({
          name: arg.env as string,
          optional: arg.optional ? true : undefined,
          description: arg.description,
          visibility: ReflectionVisibility.public,
          type: extractType(arg),
          default: arg.default,
          tags: {
            alias: arg.alias
              .filter(alias => alias.length > 1)
              .map(alias => constantCase(alias)),
            domain: "cli"
          }
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
  const ctx = await initialize<TContext>(input);

  if (!ctx.output.isVirtual) {
    await resolveFromExports(ctx);
    resolveFromBytecode(ctx);
  } else {
    resolveVirtualCommand(ctx);
  }

  return postprocess(ctx);
}
