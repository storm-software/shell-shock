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

interface NewLibraryOptions {
  /**
   * The root directory of the library to create.
   */
  root: string;
}

/**
 * Create a new library.
 *
 * @param options - The library arguments.
 * @param name - The name of the library.
 */
function newLibrary(options: NewLibraryOptions, name: string) {
  console.log("Creating new library:", name, "at", options.root);
}

export default newLibrary;
