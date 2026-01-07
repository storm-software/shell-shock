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
  NodeJsPluginOptions,
  NodeJsPluginResolvedConfig,
  NodeJsPluginUserConfig
} from "@powerlines/plugin-nodejs/types/plugin";
import type {
  TsdownPluginResolvedConfig,
  TsdownPluginUserConfig
} from "@powerlines/plugin-tsdown";
import type { CommandBase, CommandOption } from "./command";
import type { Context } from "./context";

export interface Options extends NodeJsPluginOptions {
  /**
   * A set of default command options to apply to each command.
   *
   * @remarks
   * To disable the addition of these default options, set this property to `false`, or provide a custom set of options/a function that returns them.
   */
  defaultOptions?:
    | CommandOption[]
    | ((context: Context, input: CommandBase) => CommandOption[])
    | false;

  /**
   * The name(s) of the binary that will be generated to run the CLI
   */
  bin?: string | string[];
}

export type UserConfig = Partial<
  Omit<
    TsdownPluginUserConfig,
    "type" | "framework" | "singleBuild" | "environments"
  >
> &
  Partial<NodeJsPluginUserConfig> &
  Omit<Options, "env">;

export type ResolvedConfig = TsdownPluginResolvedConfig &
  NodeJsPluginResolvedConfig &
  Required<
    Omit<Options, "bin" | "env"> & {
      bin: string[];
    }
  >;
