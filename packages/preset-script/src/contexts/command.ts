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

import type { ComponentContext } from "@alloy-js/core";
import { createNamedContext, useContext } from "@alloy-js/core";
import type { CommandTree } from "@shell-shock/core/types/command";

/**
 * The reflection parameter context used in template rendering.
 */
export const CommandContext: ComponentContext<CommandTree | undefined> =
  createNamedContext<CommandTree | undefined>("command");

/**
 * Hook to access the Command context.
 *
 * @returns A reactive version of the current reflection.
 */
export function useCommand() {
  return useContext<CommandTree | undefined>(CommandContext)!;
}
