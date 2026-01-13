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

import type { Context } from "../types/context";

/**
 * Writes a hashbang to the specified file path with the provided code.
 *
 * @param context - The execution context.
 * @param path - The file path where the hashbang should be written.
 * @returns A promise that resolves when the hashbang has been written.
 */
export async function writeHashbang(context: Context, path: string) {
  const code = await context.fs.read(path);

  return context.fs.write(
    path,
    `#!/usr/bin/env ${
      context?.config.mode === "development"
        ? "-S NODE_OPTIONS=--enable-source-maps"
        : ""
    } node

${code}`
  );
}
