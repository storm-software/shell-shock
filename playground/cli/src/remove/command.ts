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

import type { CommandMetadata } from "@shell-shock/core";
import * as z from "zod";

export const metadata: CommandMetadata = {
  title: "Remove Files",
  description: "A command to remove specified files from the project.",
  alias: "rm",
  icon: "🗑"
};

export const options = z.object({
  root: z.string().describe("The root directory of the removal operation.")
});

export const args = z.tuple([
  z.array(z.string()).describe("The files to remove.")
]);

/**
 * Remove specified files.
 *
 * @param opts - The removal arguments.
 * @param files - The files to remove.
 */
function removeFiles(
  opts: z.input<typeof options>,
  files: z.input<typeof args>[0]
) {
  console.log("Removing files:", files[0], "at", opts.root);
}

export default removeFiles;
