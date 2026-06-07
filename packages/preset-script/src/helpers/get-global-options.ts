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

import type { CommandOption } from "@shell-shock/core";

/**
 * Get the default command options.
 *
 * @returns The default command options.
 */
export function getGlobalOptions(): CommandOption[] {
  return [
    {
      name: "help",
      title: "Help",
      description: "Show help information.",
      env: false,
      alias: ["h", "?"],
      type: "boolean",
      required: false,
      default: false,
      variadic: false,
      skipAddingNegative: true
    },
    {
      name: "version",
      title: "Version",
      description: "Show the version of the application.",
      env: false,
      alias: ["v"],
      type: "boolean",
      required: false,
      default: false,
      variadic: false,
      skipAddingNegative: true
    },
    {
      name: "verbose",
      title: "Verbose",
      description: "Enable verbose output.",
      env: "VERBOSE",
      alias: ["V"],
      type: "boolean",
      required: false,
      default: false,
      variadic: false,
      skipAddingNegative: true
    },
    {
      name: "color",
      title: "Color",
      description: "Force colored terminal output.",
      env: "COLOR",
      alias: ["colors"],
      type: "boolean",
      required: false,
      variadic: false,
      isNegativeOf: "no-color"
    },
    {
      name: "no-color",
      title: "No Color",
      description: "Force disable colored terminal output.",
      env: "NO_COLOR",
      alias: ["no-colors"],
      type: "boolean",
      required: false,
      variadic: false,
      isNegativeOf: "color"
    },
    {
      name: "no-banner",
      title: "Hide Banner",
      description:
        "Do not display the application banner displayed while running the CLI - will be set to true if running in a CI pipeline.",
      env: "NO_BANNER",
      alias: ["hide-banner"],
      type: "boolean",
      required: false,
      variadic: false,
      default: false
    }
  ];
}
