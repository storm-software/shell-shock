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

import { code, For, memo, Show } from "@alloy-js/core";
import { Heading } from "@alloy-js/markdown";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { MarkdownFileProps } from "@powerlines/plugin-alloy/markdown/components/markdown-file";
import { MarkdownFile } from "@powerlines/plugin-alloy/markdown/components/markdown-file";
import { MarkdownTable } from "@powerlines/plugin-alloy/markdown/components/markdown-table";
import { joinPaths } from "@stryke/path/join";
import { isUndefined } from "@stryke/type-checks/is-undefined";
import { defu } from "defu";
import { CommandContext } from "../contexts/command";
import { getDocsOutputPath } from "../helpers/docs-helpers";
import { getAppBin } from "../plugin-utils/context-helpers";
import { sortOptions } from "../plugin-utils/reflect";
import type { CommandTree } from "../types/command";
import type { Context } from "../types/context";
import { Usage } from "./usage";

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
    return code`This command does not have any options.`;
  }

  return (
    <MarkdownTable
      data={sortOptions(Object.values(command.options)).reduce(
        (ret, option) => {
          ret.push({
            name: option.name.trim(),
            description: option.description.trim(),
            defaultValue: isUndefined(option.default)
              ? ""
              : JSON.stringify(option.default),
            required: !option.required || option.default ? "" : "✔"
          });

          return ret;
        },
        [] as {
          name: string;
          description: string;
          defaultValue: string;
          required: string;
        }[]
      )}
    />
  );
}

export interface CommandDocsUsageExampleProps {
  /**
   * The package manager to generate the usage example for.
   *
   * @remarks
   * If not specified, examples for all supported package managers will be generated.
   *
   * @defaultValue "npm"
   */
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";

  /**
   * The command to generate the usage example for.
   */
  command: CommandTree;

  /**
   * Whether to add expand/collapse details tags around the usage example. This is useful for hiding long usage examples by default.
   *
   * @defaultValue true
   */
  expand?: boolean;
}

/**
 * Generates the markdown documentation for a command.
 */
export function CommandDocsUsageExample(props: CommandDocsUsageExampleProps) {
  const { packageManager = "npm", command, expand = true } = props;

  const context = usePowerlines<Context>();

  return (
    <>
      <Show when={expand} fallback={code`\`\`\`bash `}>
        {code`<details>
        <summary>Using ${packageManager}</summary>
        \`\`\`bash `}
      </Show>
      <hbr />
      <Usage
        command={command}
        bin={getAppBin(context)}
        packageManager={packageManager}
      />
      <hbr />
      <Show when={expand} fallback={code`\`\`\` `}>
        {code`\`\`\`
        </details> `}
      </Show>
      <hbr />
    </>
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

  /**
   * Optional usage examples to include in the documentation.
   *
   * @defaultValue `["npm"]`
   */
  usageExamples?: Required<CommandDocsUsageExampleProps>["packageManager"][];
}

/**
 * Generates the markdown documentation for a command.
 */
export function CommandDocs(props: CommandDocsProps) {
  const { levelOffset = 0, command, usageExamples } = props;

  return (
    <>
      <Heading level={1 + levelOffset}>{command.title}</Heading>
      <Spacing />
      {code`${command.description}`}
      <Spacing />
      <Heading level={2 + levelOffset}>Usage</Heading>
      <Spacing />
      {code`The ${command.name} command can be executed using the following syntax: `}
      <Spacing />
      <Show
        when={usageExamples && usageExamples.length > 0}
        fallback={
          <CommandDocsUsageExample packageManager="npm" command={command} />
        }>
        <For each={usageExamples!} hardline>
          {packageManager => (
            <CommandDocsUsageExample
              packageManager={packageManager}
              command={command}
            />
          )}
        </For>
      </Show>
      <Spacing />
      <Heading level={2 + levelOffset}>Options</Heading>
      <Spacing />
      {code`The following options are available for the ${
        command.name
      } command:`}
      <Spacing />
      <CommandOptionsDocs command={command} />
      <Spacing />
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
  const { levelOffset = 0, command, frontMatter, ...rest } = props;

  const context = usePowerlines<Context>();
  const usageExamples = memo(
    () => ["npm", "yarn", "pnpm", "bun"] as CommandDocsProps["usageExamples"]
  );

  return (
    <CommandContext.Provider value={command}>
      <MarkdownFile
        path={joinPaths(getDocsOutputPath(context), `${command.path}.md`)}
        {...rest}
        frontMatter={defu(frontMatter ?? {}, {
          id: command.id,
          name: command.name,
          path: command.path,
          reference: command.docs,
          virtual: command.virtual,
          title: command.title,
          description: command.description,
          tags: command.tags
        })}>
        <CommandDocs
          levelOffset={levelOffset}
          command={command}
          usageExamples={usageExamples()}
        />
      </MarkdownFile>
    </CommandContext.Provider>
  );
}
