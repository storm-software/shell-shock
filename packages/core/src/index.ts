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

import { ShellShockAPI } from "./api";
import type { UserConfig } from "./types/config";

export * from "./config";

export { shellShock } from "./powerlines";
export * from "./types";

/**
 * Creates a new {@link ShellShockAPI} instance.
 *
 * @param options - The user configuration options.
 * @returns A promise that resolves to a {@link ShellShockAPI} instance.
 */
export async function createShellShock(
  options: Partial<UserConfig> = {}
): Promise<ShellShockAPI> {
  options.root ??= process.cwd();

  return ShellShockAPI.from(options);
}

export { ShellShockAPI };
export default ShellShockAPI;
