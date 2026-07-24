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

import type {
  CommandConfig,
  Context,
  ResolvedConfig,
  UserConfig
} from "@shell-shock/core";
import type { RequiredKeys } from "@stryke/types/base";

export interface McpPluginOptions {
  /**
   * The command name used to expose the MCP server.
   */
  command?: Partial<CommandConfig> | string;
}

export type McpPluginUserConfig = UserConfig & {
  mcp: McpPluginOptions;
};

export type McpPluginResolvedConfig = ResolvedConfig & {
  mcp: {
    command: RequiredKeys<Partial<CommandConfig>, "name">;
  };
};

export type McpPluginContext<
  TResolvedConfig extends McpPluginResolvedConfig = McpPluginResolvedConfig
> = Context<TResolvedConfig>;
