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
import type { CommandOption } from "@shell-shock/core";

/**
 * Get the default command options.
 *
 * @returns The default command options.
 */
export function getDefaultOptions(): CommandOption[] {
  return [
    {
      name: "help",
      title: "Help",
      description: "Show help information.",
      env: false,
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
      env: false,
      alias: ["v"],
      kind: ReflectionKind.boolean,
      optional: true,
      default: false,
      skipAddingNegative: true
    },
    {
      name: "verbose",
      title: "Verbose",
      description: "Enable verbose output.",
      env: "VERBOSE",
      alias: ["V"],
      kind: ReflectionKind.boolean,
      optional: true,
      default: false,
      skipAddingNegative: true
    },
    {
      name: "color",
      title: "Color",
      description: "Enable colored terminal output.",
      env: "COLOR",
      alias: ["colors"],
      kind: ReflectionKind.boolean,
      optional: true,
      skipAddingNegative: false
    },
    {
      name: "no-banner",
      title: "Hide Banner",
      description:
        "Do not display the application banner displayed while running the CLI - will be set to true if running in a CI pipeline.",
      env: "NO_BANNER",
      alias: ["hide-banner"],
      kind: ReflectionKind.boolean,
      optional: true,
      default: false
    }
  ];
}
