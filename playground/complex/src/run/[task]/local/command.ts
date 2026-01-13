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

interface RunTaskLocalOptions {
  /**
   * The root directory of the local operation.
   */
  root: string;
}

/**
 * Run specified task locally.
 *
 * @param options - The local arguments.
 * @param task - The task to run.
 */
function runTaskLocal(options: RunTaskLocalOptions, task: string) {
  console.log("Running task local:", task, "at", options.root);
}

export default runTaskLocal;
