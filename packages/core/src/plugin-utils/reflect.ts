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

import type { CommandOption } from "../types/command";
import { CommandParameterKinds } from "../types/command";

/**
 * Sort command options alphabetically by name, placing boolean options with negatives appropriately.
 *
 * @param options - The array of command options to sort.
 * @returns A new array of sorted command options.
 */
export function sortOptions(options: CommandOption[]): CommandOption[] {
  if (!options || options.length === 0) {
    return [];
  }

  return options
    .filter(
      arg => arg.kind !== CommandParameterKinds.boolean || !arg.isNegativeOf
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((ret, arg) => {
      ret.push(arg);

      if (arg.kind === CommandParameterKinds.boolean) {
        // Add the negative argument if it exists
        const negativeArg = options.find(
          a =>
            a.kind === CommandParameterKinds.boolean &&
            a.isNegativeOf === arg.name
        );
        if (negativeArg) {
          ret.push(negativeArg);
        }
      }

      return ret;
    }, [] as CommandOption[]);
}
