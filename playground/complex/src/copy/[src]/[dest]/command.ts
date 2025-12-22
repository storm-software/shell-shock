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

interface CopyOptions {
  /**
   * The root directory of the copy operation.
   */
  root: string;
}

/**
 * Copy specified files from src to dest.
 *
 * @param options - The copy arguments.
 * @param src - The source path.
 * @param dest - The destination path.
 */
function copyFiles(options: CopyOptions, src: string[], dest: string) {
  console.log("Copying files from:", src, "to", dest, "at", options.root);
}

export default copyFiles;
