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

import type { BuildContext, CommandArg } from "../types/build";

export type CommandArgProps = CommandArg & {
  skipNegative?: boolean;
};

export function getDefaultCommandArgs(
  context: BuildContext,
  isVirtual = false
): CommandArgProps[] {
  return [
    {
      name: "help",
      title: "Help",
      description: "Show help information.",
      alias: ["h", "?"],
      type: "boolean",
      optional: true,
      default: false,
      skipNegative: true
    },
    {
      name: "version",
      title: "Version",
      description: "Show the version of the application.",
      alias: ["v"],
      type: "boolean",
      optional: true,
      default: false,
      skipNegative: true
    },
    !isVirtual &&
      context.config.interactive !== "never" && {
        name: "interactive",
        title: "Interactive",
        description:
          "Enable interactive mode (will be set to false if running in a CI pipeline).",
        alias: ["i", "interact"],
        type: "boolean",
        optional: true,
        default: context.config.interactive
      },
    !isVirtual &&
      context.config.interactive !== "never" && {
        name: "no-interactive",
        title: "Non-Interactive",
        description:
          "Disable interactive mode (will be set to true if running in a CI pipeline).",
        alias: ["no-interact"],
        type: "boolean",
        optional: true,
        default: false,
        isNegativeOf: "interactive"
      },
    {
      name: "no-banner",
      title: "Hide Banner",
      description:
        "Hide the banner displayed while running the CLI application (will be set to true if running in a CI pipeline).",
      type: "boolean",
      optional: true,
      default: false,
      skipNegative: true
    },
    !isVirtual && {
      name: "verbose",
      title: "Verbose",
      description: "Enable verbose output.",
      type: "boolean",
      optional: true,
      default: false,
      skipNegative: true
    }
  ].filter(Boolean) as CommandArgProps[];
}
