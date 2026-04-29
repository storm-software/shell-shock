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

import { computed } from "@alloy-js/core";
import { joinPaths } from "@stryke/path/join-paths";
import type { CommandTree, Context } from "../types";
import { getAppDescription, getAppName, getAppTitle } from "./context-helpers";

/**
 * Compute the command tree for the CLI application, starting from the root bin command. This will be used to determine which commands are available in the CLI application and their respective details.
 *
 * @param context - The plugin context containing the necessary information to compute the command tree.
 * @returns The computed command tree for the CLI application, starting from the root bin command. This will include all commands discovered in the project and their respective details, organized in a hierarchical structure based on their segments and paths.
 */
export function computeBin(context: Context): CommandTree {
  const bin = computed(() => ({
    id: "",
    name: getAppName(context),
    title: getAppTitle(context),
    description: getAppDescription(context),
    isVirtual: true,
    path: null,
    segments: [],
    alias: [],
    tags: [],
    source: "file",
    options: Object.fromEntries(
      context.globalOptions.map(option => [option.name, option])
    ),
    args: [],
    entry: {
      file: joinPaths(context.entryPath, "bin.ts")
    },
    parent: null,
    children: context.commands
  }));

  return bin.value;
}
