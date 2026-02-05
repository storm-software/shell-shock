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
import type { CommandBase, CommandOption } from "@shell-shock/core";
import { getDefaultOptions as getDefaultOptionsBase } from "@shell-shock/preset-script/helpers/get-default-options";
import type { CLIPresetContext } from "../types";

/**
 * Get the default command options.
 *
 * @param context - The build context.
 * @param _ - The command input.
 * @returns The default command options.
 */
export function getDefaultOptions(
  context: CLIPresetContext,
  _: CommandBase
): CommandOption[] {
  return [
    ...getDefaultOptionsBase(),
    context.config.interactive !== "never" &&
      context.config.interactive !== true && {
        name: "interactive",
        title: "Interactive",
        description:
          "Enable interactive mode (will be set to false if running in a CI pipeline).",
        alias: ["i", "interact"],
        kind: ReflectionKind.boolean,
        optional: true,
        default: context.config.interactive !== false
      },
    context.config.interactive !== "never" &&
      context.config.interactive !== false && {
        name: "no-interactive",
        title: "Non-Interactive",
        description:
          "Disable interactive mode (will be set to true if running in a CI pipeline).",
        alias: ["no-interact"],
        kind: ReflectionKind.boolean,
        optional: true,
        default: false,
        isNegativeOf: "interactive"
      }
  ].filter(Boolean) as CommandOption[];
}
