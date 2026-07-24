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

import type { Children } from "@alloy-js/core";
import type {
  GeneratorConfigObject,
  GeneratorFunctionResult,
  InferEngineOptions
} from "@power-plant/core";
import { defineGenerator, defineSchema, execute } from "@power-plant/core";
import { render } from "@powerlines/plugin-alloy/render";
import type {
  SerializedCommands,
  SerializedCommandTree
} from "@shell-shock/schema";
import { serializedCommandsSchema } from "@shell-shock/schema";
import type { CommandTree } from "../types/command";
import type {
  CommandGeneratorOptions as BaseCommandGeneratorOptions,
  Context
} from "../types/context";

/**
 * Options passed to Shell Shock Alloy-js generators.
 */
export interface CommandGeneratorOptions extends BaseCommandGeneratorOptions {
  /**
   * The Powerlines / Shell Shock plugin context used for Alloy emission.
   */
  context: Context;

  /**
   * Optional Alloy-js template override.
   */
  template?: Children;
}

function serializeCommand(command: CommandTree): SerializedCommandTree {
  return {
    ...(command as Omit<CommandTree, "parent" | "children">),
    parent: command.parent?.name ? command.parent.name : null,
    children: Object.fromEntries(
      Object.entries(command.children || {}).map(([name, child]) => [
        name,
        serializeCommand(child)
      ])
    )
  };
}

/**
 * Serializes `context.commands` into a JSON-safe Power Plant spec document.
 */
export function serializeCommands(
  commands: Record<string, CommandTree>
): SerializedCommands {
  return Object.fromEntries(
    Object.entries(commands ?? {}).map(([name, command]) => [
      name,
      serializeCommand(command)
    ])
  );
}

const serializedCommandSchema = defineSchema<SerializedCommands>({
  meta: {
    name: "command-schema-serialized",
    title: "Shell Shock Serialized Command Tree Schema",
    version: "1.0",
    description:
      "JSON-safe Shell Shock command tree specification used as Power Plant generator input.",
    tags: ["shell-shock", "command-tree", "cli"]
  },
  schema: serializedCommandsSchema
});

/**
 * Creates a Power Plant generator that renders Alloy-js templates from a
 * Shell Shock command tree specification.
 *
 * @param config - Generator metadata and the Alloy render implementation.
 * @returns A Power Plant generator configuration object.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 * @see https://github.com/storm-software/powerlines/blob/main/packages/plugins/plugin-alloy/src/render.tsx
 */
export function defineCommandGenerator<
  TOptions extends CommandGeneratorOptions = CommandGeneratorOptions
>(
  config: Omit<
    GeneratorConfigObject<SerializedCommands, TOptions, void>,
    "schema" | "generator"
  > & {
    generator: (
      commands: SerializedCommands,
      options: TOptions
    ) => Promise<void | GeneratorFunctionResult<
      SerializedCommands,
      TOptions
    >> | void;
  }
): GeneratorConfigObject<SerializedCommands, TOptions, void> {
  return defineGenerator<SerializedCommands, TOptions, void>({
    ...config,
    schema: serializedCommandSchema,
    generator: async (commands, options) => {
      const result = await config.generator(commands, options);

      return result ?? {};
    }
  });
}

/**
 * Executes a command-tree Power Plant generator with `context.commands` as input.
 *
 * @remarks
 * Calls {@link execute} from `@power-plant/core` directly (no Powerlines
 * Power Plant plugin). Alloy templates still emit via `context` / plugin-alloy.
 *
 * @param context - The Shell Shock plugin context.
 * @param generator - The generator configuration to execute.
 * @param options - Extra generator options (merged with `{ context }`).
 *
 * @see https://github.com/storm-software/power-plant/blob/main/packages/base/core/src/execute.ts
 */
export async function executeCommandGenerator<
  TOptions extends CommandGeneratorOptions = CommandGeneratorOptions
>(
  context: Context,
  generator: GeneratorConfigObject<SerializedCommands, TOptions, void>,
  options?: Omit<TOptions, "context">
): Promise<void> {
  await execute<SerializedCommands, TOptions>(
    {
      ...generator,
      input: serializeCommands(context.commands)
    },
    {
      cwd: context.config.cwd,
      logger: {
        debug: (message: string) => context.debug(message),
        info: (message: string) => context.info(message),
        warn: (message: string) => context.warn(message),
        error: (message: string) => context.error(message)
      },
      context,
      ...(options as Omit<TOptions, "context">)
    } as InferEngineOptions<
      GeneratorConfigObject<SerializedCommands, TOptions, void>
    > &
      TOptions
  );
}

/**
 * Renders Alloy-js children through the Powerlines Alloy render bridge.
 *
 * @remarks
 * Prefer this inside Power Plant generators so builtins/entries emit correctly
 * via the Powerlines plugin context (see plugin-alloy `render`).
 */
export async function renderCommandTemplate(
  options: CommandGeneratorOptions,
  template: Children
): Promise<void> {
  await render(options.context, options.template ?? template);
}
