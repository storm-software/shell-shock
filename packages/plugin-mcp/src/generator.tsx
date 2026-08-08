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

import {
  defineCommandGenerator,
  renderCommandTemplate
} from "@shell-shock/core/helpers/power-plant";
import { getCommandList } from "@shell-shock/core/plugin-utils";
import { McpCommandModule } from "./components/mcp-command";
import type { McpPluginContext } from "./types/plugin";

/**
 * Power Plant generator for the Shell Shock MCP server command module.
 *
 * @see https://github.com/storm-software/power-plant/tree/main/packages/generators/alloy-js
 */
export const mcpGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-mcp",
    title: "Shell Shock MCP Generator",
    description:
      "Generates an MCP stdio server command module from the Shell Shock command tree specification.",
    version: "1.0",
    tags: ["shell-shock", "mcp", "alloy-js"]
  },
  generator: async (_commands, options) => {
    if (options.template) {
      await renderCommandTemplate(options, options.template);
      return;
    }

    const context = options.context as McpPluginContext;
    const commands = (await getCommandList(context)).sort((a, b) =>
      (a.path ?? a.name).localeCompare(b.path ?? b.name)
    );

    await renderCommandTemplate(
      options,
      <McpCommandModule
        appName={context.config.name}
        commandName={context.config.mcp.command.name}
        commands={commands}
      />
    );
  }
});

export default mcpGenerator;
