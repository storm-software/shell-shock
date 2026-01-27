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

import type { TreeItem } from "@stryke/cli/utils/tree";
import { formatTree } from "@stryke/cli/utils/tree";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { constantCase } from "@stryke/string-format/constant-case";
import { isFunction } from "@stryke/type-checks/is-function";
import type { CommandBase, CommandOption, CommandTree } from "../types/command";
import type { Context } from "../types/context";

function innerFormatCommandTree(command: CommandTree): TreeItem {
  return {
    name: `${command.name}${command.isVirtual ? " (virtual)" : ""}`,
    children: Object.values(command.children ?? {}).map(innerFormatCommandTree)
  };
}

export function formatCommandTree(context: Context): string {
  return formatTree({
    name: context.config.name,
    children: Object.values(context.commands ?? {}).map(innerFormatCommandTree)
  });
}

/**
 * Retrieves the default command options based on the context configuration.
 *
 * @param context - The build context.
 * @param command - The command for which to retrieve default options.
 * @returns A record of default command options.
 */
export function getDefaultOptions(
  context: Context,
  command: CommandBase
): Record<string, CommandOption> {
  let options!: Record<string, CommandOption>;
  if (Array.isArray(context.config.defaultOptions)) {
    options = Object.fromEntries(
      getUniqueBy(
        context.config.defaultOptions,
        (item: CommandOption) => item.name
      ).map(option => [option.name, option])
    );
  } else if (isFunction(context.config.defaultOptions)) {
    options = Object.fromEntries(
      getUniqueBy(
        context.config.defaultOptions(context, command),
        (item: CommandOption) => item.name
      ).map(option => [option.name, option])
    );
  } else {
    options = {};
  }

  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [
      key,
      { ...value, env: value.env ?? constantCase(key) }
    ])
  );
}
