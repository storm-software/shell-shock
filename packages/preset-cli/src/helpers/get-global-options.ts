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

import type { CommandBase, CommandOption } from "@shell-shock/core";
import { CommandParameterKinds } from "@shell-shock/core";
import { getGlobalOptions as _getGlobalOptions } from "@shell-shock/preset-script/helpers/get-global-options";
import type { CLIPresetContext } from "../types";

/**
 * Get the default command options.
 *
 * @param context - The build context.
 * @param _ - The command input.
 * @returns The default command options.
 */
export function getGlobalOptions(
  context: CLIPresetContext,
  _: CommandBase
): CommandOption[] {
  return [
    ..._getGlobalOptions(),
    context.config.interactive !== "never" &&
      context.config.interactive !== true && {
        name: "interactive",
        title: "Interactive",
        description:
          "Enable interactive mode - will be set to false if running in a CI pipeline.",
        alias: ["i", "interact"],
        kind: CommandParameterKinds.boolean,
        optional: true,
        default: context.config.interactive !== false
      },
    context.config.interactive !== "never" &&
      context.config.interactive !== false && {
        name: "non-interactive",
        title: "Non-Interactive",
        description:
          "Disable interactive mode - will be set to true if running in a CI pipeline.",
        alias: ["no-interactive"],
        kind: CommandParameterKinds.boolean,
        optional: true,
        default: false,
        isNegativeOf: "interactive"
      }
  ].filter(Boolean) as CommandOption[];
}
