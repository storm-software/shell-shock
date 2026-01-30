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

import { code, For } from "@alloy-js/core";
import { Heading } from "@alloy-js/markdown";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { MarkdownFileProps } from "@powerlines/plugin-alloy/markdown/components/markdown-file";
import { MarkdownFile } from "@powerlines/plugin-alloy/markdown/components/markdown-file";
import { MarkdownTable } from "@powerlines/plugin-alloy/markdown/components/markdown-table";
import { joinPaths } from "@stryke/path/join";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { CommandContext } from "../contexts/command";
import { getDocsOutputPath } from "../helpers/docs-helpers";
import {
  getAppBin,
  getVariableCommandPathName,
  isVariableCommandPath
} from "../plugin-utils/context-helpers";
import { sortOptions } from "../plugin-utils/reflect";
import type { CommandTree } from "../types/command";
import type { Context } from "../types/context";

export interface CommandOptionsDocsProps {
  /**
   * The command to generate options documentation for.
   */
  command: CommandTree;
}

/**
 * Generates the options markdown documentation for a command.
 */
export function CommandOptionsDocs(props: CommandOptionsDocsProps) {
  const { command } = props;
  if (Object.keys(command.options).length === 0) {
    return <>This command does not have any options.</>;
  }

  return (
    <MarkdownTable
      data={sortOptions(Object.values(command.options)).map(option => {
        return {
          name: option.name.trim(),
          description: option.description.trim(),
          defaultValue: option.default
            ? String(option.default)?.includes('"')
              ? option.default
              : `\`${option.default}\``
            : "",
          required: option.optional || option.default ? "" : "✔"
        };
      })}
    />
  );
}

export interface CommandDocsProps {
  /**
   * The heading level offset to apply to the generated documentation.
   *
   * @remarks
   * This is useful when nesting the documentation within other markdown files.
   *
   * @defaultValue 0
   */
  levelOffset?: number;

  /**
   * The command to generate options documentation for.
   */
  command: CommandTree;
}

/**
 * Generates the markdown documentation for a command.
 */
export function CommandDocs(props: CommandDocsProps) {
  const { levelOffset = 0, command } = props;

  const context = usePowerlines<Context>();

  return (
    <>
      <Heading level={1 + levelOffset}>{command.name}</Heading>
      {command.description}
      <hbr />
      <hbr />
      <Heading level={2 + levelOffset}>Usage</Heading>
      {code`The command can be executed using the following syntax:
      \`\`\`bash `}
      <hbr />
      {code`$ ${getAppBin(context)} `}
      <For each={command.path.segments}>
        {segment =>
          isVariableCommandPath(segment)
            ? `<${command.path.variables[segment]?.variadic ? "..." : ""}${kebabCase(
                getVariableCommandPathName(segment)
              )}>`
            : segment
        }
      </For>
      {code` [options] `}
      <hbr />
      {code`\`\`\``}
      <hbr />
      <hbr />
      <Heading level={2 + levelOffset}>Options</Heading>
      {code`The following options are available for the ${
        command.title
      } command:`}
      <hbr />
      <hbr />
      <CommandOptionsDocs command={command} />
      <hbr />
      <hbr />
    </>
  );
}

export interface CommandDocsFileProps extends Partial<MarkdownFileProps> {
  /**
   * The heading level offset to apply to the generated documentation.
   *
   * @remarks
   * This is useful when nesting the documentation within other markdown files.
   *
   * @defaultValue 0
   */
  levelOffset?: number;

  /**
   * The command to generate documentation for.
   */
  command: CommandTree;
}

/**
 * Generates the markdown documentation file for a command.
 */
export function CommandDocsFile(props: CommandDocsFileProps) {
  const { levelOffset = 0, command, ...rest } = props;

  const context = usePowerlines<Context>();

  return (
    <CommandContext.Provider value={command}>
      <MarkdownFile
        path={joinPaths(getDocsOutputPath(context), `${command.path.value}.md`)}
        {...rest}>
        <CommandDocs levelOffset={levelOffset} command={command} />
      </MarkdownFile>
    </CommandContext.Provider>
  );
}
