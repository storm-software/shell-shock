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

export interface RuntimePath {
  /**
   * The full path as a string value.
   */
  value: string;

  /**
   * The individual segments that make up the path.
   */
  segments: (string | string[])[];
}

export interface RuntimeContext<
  TOptions extends Record<
    string,
    string | number | boolean | string[] | number[]
  > = Record<string, string | number | boolean | string[] | number[]>,
  TPath extends RuntimePath = RuntimePath
> {
  /**
   * The parsed command-line options.
   */
  options: TOptions;

  /**
   * The current command path within the runtime context.
   */
  path: TPath;
}
