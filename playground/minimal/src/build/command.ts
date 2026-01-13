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

export const meta = {
  name: "build",
  description: "Build the project."
};

interface BuildOptions {
  /**
   * The root directory of the project to build.
   */
  root: string;

  /**
   * Whether to enable verbose logging.
   *
   * @defaultValue false
   */
  verbose?: boolean;

  /**
   * Specific build targets to build.
   */
  targets: string[];
}

/**
 * Build the project.
 */
function build(options: BuildOptions) {
  console.log(
    `Building at ${options.root} with verbose=${
      options.verbose ?? false
    }, targets=${options.targets.join(", ")}`
  );
}

export default build;
