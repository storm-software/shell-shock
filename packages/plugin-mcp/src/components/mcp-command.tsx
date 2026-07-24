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

import { code } from "@alloy-js/core";
import { VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@power-plant/alloy-js/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TypescriptFile } from "@power-plant/alloy-js/typescript";
import type { CommandTree } from "@shell-shock/core";
import { joinPaths } from "@stryke/path/join";
import type { McpPluginContext } from "../types/plugin";

export interface McpCommandModuleProps {
  appName: string;
  commandName: string;
  commands: CommandTree[];
}

function toFlagName(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toToolName(path: string): string {
  return path
    .replace(/[\/:\s]+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function toCliArgs(optionsMap: Record<string, unknown>): string[] {
  const args: string[] = [];

  for (const [rawName, rawValue] of Object.entries(optionsMap ?? {})) {
    if (!/^[a-zA-Z0-9_\-]+$/.test(rawName)) {
      continue;
    }

    const flag = toFlagName(rawName);
    if (!flag) {
      continue;
    }

    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    if (typeof rawValue === "boolean") {
      args.push(rawValue ? "--" + flag : "--no-" + flag);
      continue;
    }

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        if (item === undefined || item === null) {
          continue;
        }

        args.push("--" + flag, String(item));
      }
      continue;
    }

    args.push("--" + flag, String(rawValue));
  }

  return args;
}

function serializeCommand(command: CommandTree): string {
  const optionList = Object.values(command.options ?? {})
    .map(
      option =>
        "--" +
        toFlagName(option.name) +
        " (" +
        option.type +
        (option.required ? ", required" : "") +
        ")"
    )
    .join(", ");

  const argList = command.args
    .map(
      arg =>
        arg.name +
        ":" +
        arg.type +
        (arg.required ? " (required)" : "") +
        (arg.variadic ? "[]" : "")
    )
    .join(", ");

  return `{
    id: ${JSON.stringify(command.id)},
    name: ${JSON.stringify(command.name)},
    path: ${JSON.stringify(command.path)},
    segments: ${JSON.stringify(command.segments)},
    title: ${JSON.stringify(command.title)},
    description: ${JSON.stringify(
      command.description +
        (optionList ? "\nOptions: " + optionList : "") +
        (argList ? "\nArgs: " + argList : "")
    )},
    toolName: ${JSON.stringify(toToolName(command.path) || command.name)},
    options: ${JSON.stringify(
      Object.values(command.options ?? {}).map(option => ({
        name: option.name,
        title: option.title,
        description: option.description,
        type: option.type,
        required: option.required,
        variadic: option.variadic
      })),
      null,
      2
    )},
    args: ${JSON.stringify(
      command.args.map(arg => ({
        name: arg.name,
        title: arg.title,
        description: arg.description,
        type: arg.type,
        required: arg.required,
        variadic: arg.variadic
      })),
      null,
      2
    )}
  }`;
}

/**
 * Generates the MCP command module using Alloy source generation.
 */
export function McpCommandModule(props: McpCommandModuleProps) {
  const context = usePowerlines<McpPluginContext>();
  const resolvedPath = joinPaths(context.entryPath, "mcp", "command.ts");

  const commands = props.commands
    .filter(command => !command.virtual && command.path !== props.commandName)
    .map(command => serializeCommand(command))
    .join(",\n");

  return (
    <TypescriptFile
      path={resolvedPath}
      imports={{
        "@shell-shock/core": ["defineMetadata", "defineOptions"],
        "@modelcontextprotocol/server": ["McpServer"],
        "@modelcontextprotocol/server/stdio": ["StdioServerTransport"],
        "shell-shock:exec": ["spawn"],
        "zod/v4": ["* as z"]
      }}>
      {code`
const COMMAND_NAME = ${JSON.stringify(props.commandName)};
const APP_NAME = ${JSON.stringify(props.appName)};

const COMMANDS = [
${commands}
];

export const metadata = defineMetadata({
  title: "MCP Server",
  description:
    "Starts an MCP stdio server that exposes this Shell Shock application's commands as tools.",
  icon: "🔌",
  tags: ["Utility", "MCP"]
});

export const options = defineOptions({
  includeSelf: {
    type: "boolean",
    title: "Include MCP Command",
    description:
      "Whether to expose the MCP command itself as a tool in the generated server.",
    default: false,
    required: false,
    variadic: false
  }
});

function toCliArgs(optionsMap: Record<string, unknown>): string[] {
  const args: string[] = [];

  for (const [rawName, rawValue] of Object.entries(optionsMap ?? {})) {
    if (!/^[a-zA-Z0-9_\-]+$/.test(rawName)) {
      continue;
    }

    const flag = toFlagName(rawName);
    if (!flag) {
      continue;
    }

    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    if (typeof rawValue === "boolean") {
      args.push(rawValue ? "--" + flag : "--no-" + flag);
      continue;
    }

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        if (item === undefined || item === null) {
          continue;
        }

        args.push("--" + flag, String(item));
      }
      continue;
    }

    args.push("--" + flag, String(rawValue));
  }

  return args;
}

export default async function handler(options: { includeSelf?: boolean }) {
  const commandMap = new Map<string, typeof COMMANDS[number]>();
  const usedToolNames = new Set<string>();
  const includeSelf = options.includeSelf === true;

  for (const command of COMMANDS) {
    if (!includeSelf && command.path === COMMAND_NAME) {
      continue;
    }

    let toolName = command.toolName;
    if (usedToolNames.has(toolName)) {
      let index = 2;
      while (usedToolNames.has(toolName + "_" + String(index))) {
        index += 1;
      }

      toolName = toolName + "_" + String(index);
    }

    usedToolNames.add(toolName);
    commandMap.set(toolName, command);
  }

  const server = new McpServer({
    name: APP_NAME + "-shell-shock",
    version: "1.0.0"
  });

  for (const [toolName, command] of commandMap.entries()) {
    server.registerTool(
      toolName,
      {
        title: command.title,
        description: command.description,
        inputSchema: z.object({
          options: z.record(z.unknown()).optional(),
          args: z.array(z.string()).optional(),
          cwd: z.string().optional(),
          timeoutMs: z.number().int().positive().optional()
        })
      },
      async input => {
        const commandArgv = [
          ...command.segments,
          ...toCliArgs((input.options ?? {}) as Record<string, unknown>),
          ...((input.args ?? []) as string[])
        ];

        const launchArgv =
          process.argv.length >= 2
            ? [process.argv[0]!, process.argv[1]!, ...commandArgv]
            : [COMMAND_NAME, ...commandArgv];

        const result = await spawn(launchArgv, {
          cwd: input.cwd,
          timeoutMs: input.timeoutMs ?? 300_000
        });

        const output = [result.stdout, result.stderr]
          .filter(Boolean)
          .join("\n")
          .trim();

        const isError = (result.code ?? 0) !== 0;

        return {
          isError,
          content: [
            {
              type: "text" as const,
              text:
                output.length > 0
                  ? output
                  : isError
                    ? "Command failed with exit code " +
                      String(result.code ?? 1) +
                      "."
                    : "Command completed successfully."
            }
          ]
        };
      }
    );
  }

  await server.connect(new StdioServerTransport());
}
`}
    </TypescriptFile>
  );
}