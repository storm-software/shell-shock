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

import type { UserConfig as PowerlinesUserConfig } from "powerlines/types/config";
import type { ResolvedConfig as PowerlinesResolvedConfig } from "powerlines/types/resolved";

export interface Options {
  /**
   * The default interactive mode to apply to commands.
   *
   * @remarks
   * The following modes are available:
   * - `true`: Enable interactivity when a TTY is detected and no explicit interactive flag is set (default).
   * - `false`: Disable interactivity unless an explicit interactive flag is set.
   * - `"never"`: Always disable interactivity, regardless of TTY presence or flags.
   *
   * @defaultValue `true`
   */
  interactive?: boolean | "never";

  /**
   * Whether to skip adding the default arguments to commands.
   *
   * @remarks
   * By default, Shell Shock adds the following set of default arguments to each command:
   * - `--help` (`-h`, `-?`): Show help information.
   * - `--version` (`-v`): Show the version of the application.
   * - `--interactive` (`-i`, `--interact`): Enable interactive mode.
   * - `--no-interactive`: Disable interactive mode.
   * - `--no-banner`: Hide the banner displayed while running the CLI application.
   * - `--verbose`: Enable verbose output.
   *
   * @defaultValue `false`
   */
  skipDefaultArgs?: boolean;

  /**
   * The name(s) of the binary that will be generated to run the CLI
   */
  bin?: string | string[];
}

export type UserConfig = Partial<
  Omit<
    PowerlinesUserConfig,
    "type" | "framework" | "singleBuild" | "environments"
  >
> &
  Options;

export type ResolvedConfig = PowerlinesResolvedConfig &
  Required<
    Omit<Options, "bin"> & {
      bin: string[];
    }
  >;
