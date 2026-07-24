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

import { defineSchema } from "@power-plant/core";
import type { Commands } from "./schema";
import { commandsSchema } from "./schema";

export * from "./schema";

/**
 * Power Plant schema for the Shell Shock command tree.
 *
 * @remarks
 * Validates a `Record<string, CommandTree>` document — the same shape as
 * `context.commands` in `@shell-shock/core`. Individual nodes match the
 * `CommandTree` type (`options`, `args`, `parent`, `children`, plus required
 * metadata fields).
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/schemas
 */
export default defineSchema<Commands>({
  meta: {
    name: "command-schema",
    title: "Shell Shock Command Tree Schema",
    version: "1.0",
    description:
      "A Shell Shock command tree specification used to describe CLI commands, options, arguments, and nested subcommands.",
    spec: "A Shell Shock command tree specification document.",
    tags: ["shell-shock", "command-tree", "cli"],
    links: [
      {
        name: "Shell Shock",
        url: "https://github.com/storm-software/shell-shock"
      },
      {
        name: "Power Plant Schemas",
        url: "https://github.com/storm-software/power-plant/tree/main/packages/schemas"
      }
    ]
  },
  schema: commandsSchema
});
