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
import { toArray } from "@stryke/convert/to-array";
import { joinPaths } from "@stryke/path/join";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { CommandContext, useCommand } from "../contexts/command";
import { getDocsOutputPath } from "../helpers/docs-helpers";
import {
  getVariableCommandPathName,
  isVariableCommandPath
} from "../plugin-utils/context-helpers";
import type { CommandTree } from "../types/command";
import type { Context } from "../types/context";

export interface CommandOptionsDocsProps {
  /**
   * The heading level offset to apply to the generated documentation.
   *
   * @remarks
   * This is useful when nesting the documentation within other markdown files.
   *
   * @defaultValue 0
   */
  levelOffset?: number;
}

/**
 * Generates the environment configuration markdown documentation for the Powerlines project.
 */
export function CommandOptionsDocs(_props: CommandOptionsDocsProps) {
  const command = useCommand();
  if (!command) {
    return null;
  }

  return <></>;
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
}

/**
 * Generates the environment configuration markdown documentation for the Powerlines project.
 */
export function CommandDocs(props: CommandDocsProps) {
  const { levelOffset = 0 } = props;

  const context = usePowerlines<Context>();
  const command = useCommand();
  if (!command) {
    return null;
  }

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
      <hbr />
      {code`$ ${toArray(context.config.bin)?.[0]} `}
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
      <hbr />
      {code`\`\`\``}
      <hbr />
      <hbr />
      <Heading level={2 + levelOffset}>Options</Heading>
      {code`The below list of options are used as configuration parameters to.`}
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
 * Generates the environment configuration markdown documentation for the Powerlines project.
 */
export function CommandDocsFile(props: CommandDocsFileProps) {
  const { levelOffset = 0, command, ...rest } = props;

  const context = usePowerlines<Context>();

  return (
    <CommandContext.Provider value={command}>
      <MarkdownFile
        path={joinPaths(getDocsOutputPath(context), `${command.path.value}.md`)}
        {...rest}>
        <CommandDocs levelOffset={levelOffset} />
      </MarkdownFile>
    </CommandContext.Provider>
  );
}
