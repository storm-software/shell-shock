import type { CommandTree } from "@shell-shock/core";
import type { McpToolFilterOptions } from "../types/plugin";

export function selectCommands(
  commands: CommandTree[],
  options: McpToolFilterOptions = {}
): CommandTree[] {
  const includedIds = new Set(options.include ?? []);
  const excludedIds = new Set(options.exclude ?? []);
  const includedTags = new Set(options.includeTags ?? []);
  const excludedTags = new Set(options.excludeTags ?? []);
  const hasIncludes = includedIds.size > 0 || includedTags.size > 0;

  return commands.filter(command => {
    if (command.virtual || excludedIds.has(command.id)) {
      return false;
    }

    if (command.tags?.some(tag => excludedTags.has(tag))) {
      return false;
    }

    return (
      !hasIncludes ||
      includedIds.has(command.id) ||
      Boolean(command.tags?.some(tag => includedTags.has(tag)))
    );
  });
}
