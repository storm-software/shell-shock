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

import type { CommandConfig } from "@shell-shock/core";
import { executeCommandGenerator } from "@shell-shock/core/helpers/power-plant";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import { McpCommandModule } from "./components/mcp-command";
import { mcpGenerator } from "./generator";
import type { McpPluginContext, McpPluginOptions } from "./types/plugin";

export type * from "./types";
export { mcpGenerator } from "./generator";

/**
 * A Shell Shock plugin that generates an MCP server command from the resolved command tree.
 */
export const plugin = <TContext extends McpPluginContext = McpPluginContext>(
  options: McpPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock/mcp",
    config() {
      this.debug(
        "Providing default configuration for the Shell Shock `mcp` plugin."
      );

      const commandName = isSetString(options.command) ? options.command : null;
      const commandConfig =
        typeof options.command === "object" && options.command
          ? options.command
          : {};

      return {
        mcp: defu(
          {
            command: {
              name: commandName ?? commandConfig.name ?? "mcp"
            }
          },
          {
            ...options,
            command: commandConfig
          }
        )
      };
    },
    async configResolved() {
      this.debug("Adding the CLI mcp command to the application context.");

      this.inputs ??= [];
      if (
        this.inputs.some(input => input.id === this.config.mcp.command.name)
      ) {
        this.info(
          "The `mcp` command already exists in the commands list. If you would like the mcp command to be managed by the `@shell-shock/plugin-mcp` package, please remove or rename the command."
        );
        return;
      }

      const { entry: commandEntry, ...commandOverrides } =
        this.config.mcp.command;

      const mcpCommand: CommandConfig = {
        ...commandOverrides,
        id: this.config.mcp.command.name,
        name: this.config.mcp.command.name,
        path: this.config.mcp.command.name,
        segments: [this.config.mcp.command.name],
        title: "Model Context Protocol (MCP) Server",
        icon: "🔌",
        alias: [],
        tags: ["AI"],
        description:
          "Start a Model Context Protocol (MCP) stdio server for this application.",
        entry: {
          file: joinPaths(this.entryPath, "mcp", "index.ts"),
          input: {
            file: joinPaths(this.entryPath, "mcp", "command.ts")
          },
          ...(commandEntry ?? {})
        },
        virtual: false
      };

      this.inputs.push(mcpCommand);

      // Ensure the command module exists before the core plugin resolves command reflections.
      await executeCommandGenerator(this, mcpGenerator, {
        template: (
          <McpCommandModule
            appName={this.config.name}
            commandName={this.config.mcp.command.name}
            commands={Object.values(this.commands)}
          />
        )
      });
    },
    prepare: {
      order: "post",
      async handler() {
        this.debug(
          "Generating the Shell Shock MCP command module via Power Plant from resolved commands."
        );

        await executeCommandGenerator(this, mcpGenerator);
      }
    }
  };
};

export default plugin;
