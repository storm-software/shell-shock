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

import { z } from "zod";

/**
 * Command parameter value type.
 */
export const commandParameterTypeSchema = z.enum([
  "string",
  "number",
  "boolean"
]);

export type CommandParameterType = z.infer<typeof commandParameterTypeSchema>;

/**
 * Shared fields for options and positional arguments.
 */
export const baseCommandParameterSchema = z.object({
  name: z.string(),
  type: commandParameterTypeSchema,
  title: z.string(),
  description: z.string(),
  alias: z.array(z.string()),
  default: z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.string()),
      z.array(z.number()),
      z.array(z.boolean())
    ])
    .optional(),
  env: z.union([z.string(), z.literal(false)]),
  required: z.boolean(),
  variadic: z.boolean(),
  format: z.string().optional(),
  choices: z.union([z.array(z.string()), z.array(z.number())]).optional(),
  isNegativeOf: z.string().optional(),
  skipAddingNegative: z.boolean().optional()
});

export type BaseCommandParameter = z.infer<typeof baseCommandParameterSchema>;

/**
 * A command option definition.
 */
export const commandOptionSchema = baseCommandParameterSchema;

export type CommandOption = z.infer<typeof commandOptionSchema>;

/**
 * A positional command argument definition.
 */
export const commandArgumentSchema = baseCommandParameterSchema;

export type CommandArgument = z.infer<typeof commandArgumentSchema>;

/**
 * Resolved entry file reference attached to a command.
 */
export const resolvedEntryFileReferenceSchema = z
  .object({
    file: z.string(),
    input: z
      .object({
        file: z.string().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

export type ResolvedEntryFileReference = z.infer<
  typeof resolvedEntryFileReferenceSchema
>;

/**
 * Fields shared by every command tree node (before parent/children).
 */
export const commandTreeBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string().nullable(),
  segments: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  alias: z.array(z.string()),
  tags: z.array(z.string()),
  icon: z.string().optional(),
  docs: z.string().optional(),
  virtual: z.boolean(),
  entry: resolvedEntryFileReferenceSchema,
  options: z.record(z.string(), commandOptionSchema),
  args: z.array(commandArgumentSchema)
});

export type CommandTreeBase = z.infer<typeof commandTreeBaseSchema>;

/**
 * A Shell Shock command tree node (recursive).
 *
 * @remarks
 * Matches `CommandTree` from `@shell-shock/core` (`title`, `description`,
 * `alias`, and `tags` required; plus `options`, `args`, `parent`, and
 * `children`).
 *
 * @see https://github.com/storm-software/shell-shock/blob/main/packages/core/src/types/command.ts
 */
export type CommandTree = CommandTreeBase & {
  parent: CommandTree | null;
  children: Record<string, CommandTree>;
};

/**
 * Serialized command tree used for JSON specs / persistence.
 *
 * @remarks
 * Same fields as {@link CommandTree}, except `parent` is a command id/name
 * string (or `null`) instead of a circular object reference.
 */
export type SerializedCommandTree = CommandTreeBase & {
  parent: string | null;
  children: Record<string, SerializedCommandTree>;
};

/**
 * Zod schema for an in-memory {@link CommandTree} node.
 *
 * @remarks
 * `parent` uses `z.lazy` for the circular object graph.
 */
export const commandTreeSchema: z.ZodType<CommandTree> = z.lazy(() =>
  commandTreeBaseSchema.extend({
    parent: z.lazy(() => commandTreeSchema).nullable(),
    children: z.record(
      z.string(),
      z.lazy(() => commandTreeSchema)
    )
  })
);

/**
 * Zod schema for a JSON-safe {@link SerializedCommandTree} node.
 */
export const serializedCommandTreeSchema: z.ZodType<SerializedCommandTree> =
  z.lazy(() =>
    commandTreeBaseSchema.extend({
      parent: z.string().nullable(),
      children: z.record(
        z.string(),
        z.lazy(() => serializedCommandTreeSchema)
      )
    })
  );

/**
 * Root commands map (`context.commands`).
 */
export const commandsSchema = z.record(z.string(), commandTreeSchema);

export type Commands = z.infer<typeof commandsSchema>;

/**
 * Serialized root commands map (JSON-safe Power Plant spec document).
 */
export const serializedCommandsSchema = z.record(
  z.string(),
  serializedCommandTreeSchema
);

export type SerializedCommands = z.infer<typeof serializedCommandsSchema>;
