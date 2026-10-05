import type { CommandTree } from "@shell-shock/core";
import { selectCommands } from "./select-commands";

const command = (
  id: string,
  tags: string[] = [],
  virtual = false
): CommandTree => ({ id, name: id, path: id, tags, virtual }) as CommandTree;

const commands = [
  command("search-tokens"),
  command("help", ["Utility"]),
  command("completions", ["Utility"], true),
  command("mcp", ["AI"])
];

describe("selectCommands", () => {
  it("preserves non-virtual commands by default", () => {
    expect(selectCommands(commands).map(item => item.id)).toEqual([
      "search-tokens",
      "help",
      "mcp"
    ]);
  });

  it("includes matching ids or tags and gives exclusions precedence", () => {
    expect(
      selectCommands(commands, {
        include: ["search-tokens"],
        includeTags: ["Utility"],
        exclude: ["search-tokens"],
        excludeTags: ["AI"]
      }).map(item => item.id)
    ).toEqual(["help"]);
  });
});
