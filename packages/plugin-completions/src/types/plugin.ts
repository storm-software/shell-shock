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

import type {
  ResolvedConfig,
  UserConfig
} from "@shell-shock/core/types/config";
import type { Context } from "@shell-shock/core/types/context";
import type { ShellType } from "./shell-type";

export interface CompletionsPluginOptions {
  /**
   * The shell types to generate completion scripts for. If not specified, completions will be generated for all supported shell types.
   *
   * @remarks
   * The currently supported shell types include:
   * - `bash`
   * - `fish`
   * - `zsh`
   * - `powershell`
   */
  shells?: ShellType[];
}

export type CompletionsPluginUserConfig = UserConfig & {
  /**
   * Resolved completions configuration for the plugin.
   */
  completions: Required<CompletionsPluginOptions>;
};

export type CompletionsPluginResolvedConfig = ResolvedConfig & {
  /**
   * Resolved completions configuration for the plugin.
   */
  completions: Required<CompletionsPluginOptions>;
};

export type CompletionsPluginContext<
  TResolvedConfig extends CompletionsPluginResolvedConfig =
    CompletionsPluginResolvedConfig
> = Context<TResolvedConfig>;
