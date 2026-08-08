/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import type { AlloyPluginContext } from "@powerlines/plugin-alloy";
import type { NodeJsPluginContext } from "@powerlines/plugin-nodejs/types";
import type { TsdownPluginContext } from "@powerlines/plugin-tsdown";
import type {
  PluginContext,
  ExecutionContext as PowerlinesExecutionContext,
  UnresolvedContext as PowerlinesUnresolvedContext
} from "powerlines";
import type { CommandConfig, CommandOption, CommandTree } from "./command";
import type { ResolvedConfig } from "./config";

/**
 * Options passed to Shell Shock Power Plant generators.
 */
export interface CommandGeneratorOptions {
  context: PluginContext;
  template?: unknown;
}

export type Context<TResolvedConfig extends ResolvedConfig = ResolvedConfig> =
  TsdownPluginContext<TResolvedConfig> &
    AlloyPluginContext<TResolvedConfig> &
    NodeJsPluginContext<TResolvedConfig> & {
      /**
       * The root path where commands are located.
       */
      commandsPath: string;

      /**
       * The default command arguments to apply to all application commands.
       */
      globalOptions: CommandOption[];

      /**
       * The list of commands discovered in the project.
       */
      inputs: CommandConfig[];

      /**
       * The command-line application structure.
       */
      commands: Record<string, CommandTree>;
    };

export type ExecutionContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = PowerlinesExecutionContext<TResolvedConfig>;

export type UnresolvedContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = PowerlinesUnresolvedContext<TResolvedConfig>;
