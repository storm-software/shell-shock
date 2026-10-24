import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { CommandConfig, CommandTree, Context } from "../types";
import { resolve } from "./resolve";

describe("resolve command options", () => {
  it("resolves an exported option config map", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "shell-shock-options-"));
    const file = join(cwd, "command.ts");

    try {
      await writeFile(
        file,
        `export const options = {
          includeSelf: {
            type: "boolean",
            title: "Include MCP Command",
            description: "Expose the MCP command itself.",
            default: false,
            required: false,
            variadic: false
          }
        };
        export default function mcp() {}`
      );

      const command = {
        id: "mcp",
        name: "mcp",
        path: "mcp",
        segments: ["mcp"],
        virtual: false,
        entry: { input: { file } }
      } as CommandConfig;
      const context = {
        config: { cwd, autoAssignEnv: false },
        fs: { existsSync, read: readFile },
        debug: () => undefined,
        inputs: []
      } as unknown as Context;
      const parent = { title: "CLI", tags: [] } as unknown as CommandTree;

      const result = await resolve({ context, command, parent });

      expect(result.options.includeSelf).toMatchObject({
        name: "includeSelf",
        type: "boolean",
        default: false,
        required: false,
        variadic: false
      });
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it("includes options inherited from local and imported interfaces", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "shell-shock-options-"));
    const file = join(cwd, "command.ts");

    try {
      await writeFile(
        join(cwd, "shared.ts"),
        `export interface SharedOptions {
          /** The working directory. */
          cwd?: string;
          tokens: string;
        }`
      );
      await writeFile(
        file,
        `import type { SharedOptions as Shared } from "./shared.js";
        interface LocalOptions extends Shared {
          json?: boolean;
        }
        export interface BuildOptions extends LocalOptions {
          /** Output path. */
          output?: string;
          tokens?: string;
        }
        export default function build(options: BuildOptions) {}`
      );

      const command = {
        id: "build",
        name: "build",
        path: "build",
        segments: ["build"],
        virtual: false,
        entry: { input: { file } }
      } as CommandConfig;
      const context = {
        config: { cwd, autoAssignEnv: false },
        fs: { existsSync, read: readFile },
        debug: () => undefined,
        inputs: []
      } as unknown as Context;
      const parent = { title: "CLI", tags: [] } as unknown as CommandTree;

      const result = await resolve({ context, command, parent });

      expect(Object.keys(result.options).sort()).toEqual(
        expect.arrayContaining(["cwd", "json", "output", "tokens"])
      );
      expect(result.options.cwd).toMatchObject({
        type: "string",
        description: "The working directory."
      });
      expect(result.options.json).toMatchObject({ type: "boolean" });
      // The derived interface redeclares `tokens` as optional.
      expect(result.options.tokens).toMatchObject({ required: false });
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
