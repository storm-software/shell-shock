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

import type { UserConfig } from "./types/config";

/**
 * A utility function to define a Shell Shock user configuration.
 *
 * @remarks
 * This function is used to create a user configuration object for Shell Shock projects. It ensures that the configuration adheres to the expected structure.
 *
 * @param config - A partial user configuration object.
 * @returns A complete user configuration object.
 */
export function defineConfig(config: Partial<UserConfig>): UserConfig {
  return config;
}
