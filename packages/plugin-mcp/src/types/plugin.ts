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

export interface McpToolFilterOptions {
  /** Command IDs to include. Combined with includeTags using OR. */
  include?: string[];
  /** Command IDs to exclude. Exclusions take precedence. */
  exclude?: string[];
  /** Include commands with any of these tags. */
  includeTags?: string[];
  /** Exclude commands with any of these tags. Exclusions take precedence. */
  excludeTags?: string[];
}

export interface McpPluginOptions extends McpToolFilterOptions {
  /**
   * The command name used to expose the MCP server.
   */
  command?: Partial<CommandConfig> | string;
}

export type McpPluginUserConfig = UserConfig & {
  mcp: McpPluginOptions;
};

export type McpPluginResolvedConfig = ResolvedConfig & {
  mcp: McpToolFilterOptions & {
    command: RequiredKeys<Partial<CommandConfig>, "name">;
  };
};

export type McpPluginContext<
  TResolvedConfig extends McpPluginResolvedConfig = McpPluginResolvedConfig
> = Context<TResolvedConfig>;
