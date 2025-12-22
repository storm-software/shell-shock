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

import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { isFunction } from "@stryke/type-checks/is-function";
import type { CommandBase, CommandOption } from "../types/command";
import type { Context } from "../types/context";

/**
 * Get the default command options.
 *
 * @param context - The build context.
 * @param command - The command input.
 * @returns The default command options.
 */
export function getDefaultOptions(
  context: Context,
  command: CommandBase
): CommandOption[] {
  if (context.config.defaultOptions === false) {
    return [];
  }

  if (Array.isArray(context.config.defaultOptions)) {
    return context.config.defaultOptions;
  }

  if (isFunction(context.config.defaultOptions)) {
    return context.config.defaultOptions(context, command);
  }

  return [
    {
      name: "help",
      title: "Help",
      description: "Show help information.",
      alias: ["h", "?"],
      kind: ReflectionKind.boolean,
      optional: true,
      default: false,
      skipAddingNegative: true
    },
    {
      name: "version",
      title: "Version",
      description: "Show the version of the application.",
      alias: ["v"],
      kind: ReflectionKind.boolean,
      optional: true,
      default: false,
      skipAddingNegative: true
    }
  ];
}
