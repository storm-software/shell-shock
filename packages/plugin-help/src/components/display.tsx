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

import { code, computed, For, Show } from "@alloy-js/core";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { CommandOption, CommandTree } from "@shell-shock/core";
import { CommandParameterKinds } from "@shell-shock/core";
import {
  formatDescription,
  formatShortDescription,
  getAppBin,
  getAppTitle,
  getDynamicPathSegmentName,
  isDynamicPathSegment,
  sortOptions
} from "@shell-shock/core/plugin-utils";
import { useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import { camelCase } from "@stryke/string-format/camel-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { snakeCase } from "@stryke/string-format/snake-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { HelpPluginContext } from "../types/plugin";

export interface HelpUsageDisplayProps {
  /**
   * The command to generate help for.
   */
  command: CommandTree;

  /**
   * The padding scale to apply to the help display headings.
   *
   * @remarks
   * This value is multiplied by the theme's app padding to determine the final padding.
   *
   * @defaultValue 2
   */
  indent?: number;
}

/**
 * A component that generates the usage display for a command.
 */
export function HelpUsageDisplay(props: HelpUsageDisplayProps) {
  const { command, indent = 2 } = props;

  const context = usePowerlines<HelpPluginContext>();
  const theme = useTheme();

  return (
    <>
      {code`
      writeLine(
        textColors.body.secondary(\`\${textColors.usage.bin("$_ ${getAppBin(
          context
        )}")}${
          command.segments.length > 0
            ? ` ${command.segments
                .map(
                  segment =>
                    `\${textColors.usage.${
                      isDynamicPathSegment(segment) ? "dynamic" : "command"
                    }("${
                      isDynamicPathSegment(segment)
                        ? `[${snakeCase(getDynamicPathSegmentName(segment))}]`
                        : segment
                    }")}`
                )
                .join(" ")}`
            : ""
        }${
          Object.values(command.children).length > 0
            ? ` \${textColors.usage.dynamic("[command]")}`
            : ""
        }${
          command.args.length > 0
            ? ` ${command.args
                .map(
                  arg =>
                    `\${textColors.usage.args("<${snakeCase(
                      (arg.kind === CommandParameterKinds.string ||
                        arg.kind === CommandParameterKinds.number) &&
                        arg.choices &&
                        arg.choices.length > 0
                        ? arg.choices.join("|")
                        : arg.kind === CommandParameterKinds.string &&
                            arg.format
                          ? arg.format
                          : arg.name
                    )}${
                      (arg.kind === CommandParameterKinds.string ||
                        arg.kind === CommandParameterKinds.number) &&
                      arg.variadic
                        ? "..."
                        : ""
                    }>")}`
                )
                .join(" ")}`
            : ""
        } \${textColors.usage.options("[options]")}\`), { padding: ${
          theme.padding.app * indent
        } }
      );`}
      <hbr />
      <Show when={command.args.length > 0}>
        <hbr />
        {code`
      writeLine(
        textColors.body.secondary(\`\${textColors.usage.bin("$_ ${getAppBin(context)}")}${
          command.segments.length > 0
            ? ` ${command.segments
                .map(
                  segment =>
                    `\${textColors.usage.${
                      isDynamicPathSegment(segment) ? "dynamic" : "command"
                    }("${
                      isDynamicPathSegment(segment)
                        ? `[${snakeCase(getDynamicPathSegmentName(segment))}]`
                        : segment
                    }")}`
                )
                .join(" ")}`
            : ""
        }${
          Object.values(command.children).length > 0
            ? ` \${textColors.usage.dynamic("[command]")}`
            : ""
        } \${textColors.usage.options("[options]")}${
          command.args.length > 0
            ? ` ${command.args
                .map(
                  arg =>
                    `\${textColors.usage.args("<${snakeCase(
                      (arg.kind === CommandParameterKinds.string ||
                        arg.kind === CommandParameterKinds.number) &&
                        arg.choices &&
                        arg.choices.length > 0
                        ? arg.choices.join("|")
                        : arg.kind === CommandParameterKinds.string &&
                            arg.format
                          ? arg.format
                          : arg.name
                    )}${
                      (arg.kind === CommandParameterKinds.string ||
                        arg.kind === CommandParameterKinds.number) &&
                      arg.variadic
                        ? "..."
                        : ""
                    }>")}`
                )
                .join(" ")}`
            : ""
        }\`), { padding: ${theme.padding.app * indent} }
      );`}
        <hbr />
      </Show>
    </>
  );
}

export interface HelpOptionsDisplayProps {
  /**
   * The options to display help for.
   */
  options: CommandOption[];
}

/**
 * A component that generates the options table display for a command.
 */
export function HelpOptionsDisplay(props: HelpOptionsDisplayProps) {
  const { options } = props;

  const context = usePowerlines<HelpPluginContext>();

  return (
    <>
      {code`table([ `}
      <hbr />
      <For each={sortOptions(options)} hardline>
        {option => {
          const flags = [] as string[];
          const names = [] as string[];
          if (option.name.length === 1) {
            flags.push(`-${option.name}`);
          } else {
            names.push(`--${kebabCase(option.name)}`);
          }

          option.alias.forEach((alias: string) => {
            if (alias.length === 1) {
              flags.push(`-${alias}`);
            } else {
              names.push(`--${kebabCase(alias)}`);
            }
          });

          return code`[{ value: textColors.body.primary("${
            flags.length > 0
              ? `${flags.sort().join(", ")}${names.length > 0 ? ", " : ""}`
              : ""
          }${names.length > 0 ? names.sort().join(", ") : ""}${
            option.kind === CommandParameterKinds.string
              ? ` <${snakeCase(
                  option.choices && option.choices.length > 0
                    ? option.choices.join("|")
                    : option.format
                      ? option.format
                      : option.name
                )}${option.variadic ? "..." : ""}>`
              : option.kind === CommandParameterKinds.number
                ? ` <${snakeCase(
                    option.choices && option.choices.length > 0
                      ? option.choices.join("|")
                      : option.name
                  )}${option.variadic ? "..." : ""}>`
                : ""
          }"), align: "right", border: "none", maxWidth: "1/3" }, { value: textColors.body.tertiary(\`${formatShortDescription(
            option.description
          )
            .replace(/\.+$/, "")
            .trim()}${
            option.env || option.default !== undefined
              ? ` (${
                  option.env
                    ? `env: ${context.config.appSpecificEnvPrefix}_${
                        option.env
                      }${option.default !== undefined ? ", " : ""}`
                    : ""
                }${
                  option.default !== undefined
                    ? `default: ${JSON.stringify(option.default).replace(
                        /"/g,
                        '\\"'
                      )}`
                    : ""
                })`
              : ""
          }.\`), align: "left", border: "none" }], `;
        }}
      </For>
      <hbr />
      {code` ]); `}
    </>
  );
}

export interface HelpCommandsDisplayProps {
  /**
   * A mapping of command names to their command definitions.
   */
  commands: Record<string, CommandTree>;
}

/**
 * A component that generates the commands table display for a command.
 */
export function HelpCommandsDisplay(props: HelpCommandsDisplayProps) {
  const { commands } = props;

  return (
    <>
      {code`table([ `}
      <hbr />
      <For each={Object.values(commands)} hardline>
        {child =>
          code`[{ value: textColors.body.primary("${
            child.name
          }"), align: "right", border: "none" }, { value: textColors.body.tertiary(\`${formatShortDescription(
            child.description
          )
            .replace(/\.+$/, "")
            .trim()}.\`), align: "left", border: "none" }], `
        }
      </For>
      <hbr />
      {code` ]); `}
    </>
  );
}

export interface BaseHelpDisplayProps {
  /**
   * The command to generate help for.
   */
  command: CommandTree;

  /**
   * Whether to filter out global options from the help display.
   *
   * @remarks
   * When enabled, any options that are present in the global options context will be filtered out from the help display. This is useful for sub-commands to avoid displaying global options that are not relevant to the specific command.
   *
   * @defaultValue false
   */
  filterGlobalOptions?: boolean;

  /**
   * The padding scale to apply to the help display headings.
   *
   * @remarks
   * This value is multiplied by the theme's app padding to determine the final padding.
   *
   * @defaultValue 1
   */
  indent?: number;
}

/**
 * A component that generates the `help` function declaration for a command.
 */
export function BaseHelpDisplay(props: BaseHelpDisplayProps) {
  const { command, indent = 1, filterGlobalOptions = false } = props;

  const theme = useTheme();
  const context = usePowerlines<HelpPluginContext>();

  const options = computed(() =>
    filterGlobalOptions
      ? Object.values(command.options).filter(
          option =>
            !context.options.some(
              globalOption =>
                globalOption.name === option.name ||
                option.alias.includes(globalOption.name) ||
                globalOption.alias?.includes(option.name) ||
                globalOption.alias?.some(alias => option.alias.includes(alias))
            )
        )
      : Object.values(command.options)
  );

  return (
    <>
      {code`writeLine(bold(textColors.heading.secondary("Usage:"))${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
      <hbr />
      <HelpUsageDisplay command={command} indent={indent} />
      <Spacing />
      <Show when={options.value.length > 0}>
        {code`writeLine("");
      writeLine(bold(textColors.heading.secondary("Options:"))${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
        <hbr />
        <HelpOptionsDisplay options={options.value} />
        <Spacing />
      </Show>
      <Show when={Object.keys(command.children).length > 0}>
        {code`writeLine("");
      writeLine(bold(textColors.heading.secondary("Commands:"))${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
        <hbr />
        <HelpCommandsDisplay commands={command.children} />
        <Spacing />
      </Show>
      <Show when={isSetString(command.reference)}>
        {code`writeLine("");
      writeLine(textColors.heading.tertiary(\`More information about this command can be found in the reference documentation at \${link("${
        command.reference
      }")}\`)${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
        <hbr />
        <Spacing />
      </Show>
    </>
  );
}

export interface VirtualCommandHelpDisplayProps {
  /**
   * The options to display help for.
   */
  options: CommandOption[];

  /**
   * A mapping of command names to their command definitions.
   */
  commands: Record<string, CommandTree>;

  /**
   * The command path to generate help for, used for generating the help invocation instructions.
   *
   * @remarks
   * This is optional since the virtual command entry component can be used for both the global binary executable and virtual commands (there will be no command definition for the binary executable).
   */
  segments?: string[];
}

function sortCommands(commands: Record<string, CommandTree>) {
  return Object.values(commands).sort((a, b) => {
    if (
      a.tags.some(tag => tag.toLowerCase() === "deprecated") &&
      !b.tags.some(tag => tag.toLowerCase() === "deprecated")
    ) {
      return 1;
    } else if (
      !a.tags.some(tag => tag.toLowerCase() === "deprecated") &&
      b.tags.some(tag => tag.toLowerCase() === "deprecated")
    ) {
      return -1;
    } else if (
      a.tags.some(tag => tag.toLowerCase() === "experimental") &&
      !b.tags.some(tag => tag.toLowerCase() === "experimental")
    ) {
      return 1;
    } else if (
      !a.tags.some(tag => tag.toLowerCase() === "experimental") &&
      b.tags.some(tag => tag.toLowerCase() === "experimental")
    ) {
      return -1;
    } else if (
      a.tags.some(tag => tag.toLowerCase() === "utility") &&
      !b.tags.some(tag => tag.toLowerCase() === "utility")
    ) {
      return 1;
    } else if (
      !a.tags.some(tag => tag.toLowerCase() === "utility") &&
      b.tags.some(tag => tag.toLowerCase() === "utility")
    ) {
      return -1;
    }

    return a.name.localeCompare(b.name);
  });
}

/**
 * A component that generates the invocation of the `help` function for a command.
 */
export function VirtualCommandHelpDisplay(
  props: VirtualCommandHelpDisplayProps
) {
  const { options, segments, commands } = props;

  const context = usePowerlines<HelpPluginContext>();

  return (
    <>
      <hbr />
      {code`writeLine(bold(textColors.heading.secondary("Global Options:")));`}
      <hbr />
      <HelpOptionsDisplay options={options} />
      {code`writeLine(""); `}
      <Spacing />
      <Show when={Object.keys(commands).length > 0}>
        {code`writeLine(textColors.body.tertiary("The following commands are available through the ${getAppTitle(
          context,
          true
        )} command-line interface:"));
        writeLine(""); `}
        <Spacing />
        <For
          each={sortCommands(commands)}
          doubleHardline
          joiner={code`writeLine(""); `}
          ender={code`writeLine(""); `}>
          {child => (
            <>
              <hbr />
              {code`
                writeLine(textColors.heading.primary(${
                  child.icon
                    ? `(isUnicodeSupported ? " ${child.icon}  " : "") + `
                    : ""
                }\`${child.title} ${child.isVirtual ? "" : "Command"}${
                  child.tags?.length > 0
                    ? ` - ${child.tags
                        .map(
                          tag =>
                            `\${textColors.tags.${camelCase(tag)} ? textColors.tags.${camelCase(tag)}(inverse(" ${tag} ")) : textColors.tags.$default(inverse(" ${tag} "))}`
                        )
                        .join(" ")}`
                    : ""
                }\`));
                writeLine("");
                writeLine(textColors.body.tertiary(splitText(\`${formatDescription(
                  child.description
                )
                  .replace(/\.+$/, "")
                  .trim()}.\`)));
                writeLine(""); `}
              <hbr />
              <BaseHelpDisplay command={child} indent={2} filterGlobalOptions />
              <hbr />
            </>
          )}
        </For>
        {code`help(\`Running a specific command with the help flag (via: \${inlineCode("${getAppBin(
          context
        )} ${
          segments && segments.length > 0 ? ` ${segments.join(" ")}` : ""
        } <specific command> --help")}) will provide additional information that is specific to that command.\`);
        writeLine("");`}
      </Show>
    </>
  );
}

export interface CommandHelpDisplayProps {
  /**
   * A mapping of command names to their command definitions.
   */
  command: CommandTree;
}

/**
 * A component that generates the invocation of the `help` function for a command.
 */
export function CommandHelpDisplay(props: CommandHelpDisplayProps) {
  const { command } = props;

  const context = usePowerlines<HelpPluginContext>();

  return (
    <>
      {code`writeLine(""); `}
      <Spacing />
      <BaseHelpDisplay command={command} filterGlobalOptions={false} />
      {code`writeLine(""); `}
      <Spacing />
      <Show when={Object.keys(command.children).length > 0}>
        {code`writeLine(textColors.body.tertiary("The following sub-commands are available:"));
        writeLine(""); `}
        <Spacing />
        <For
          each={sortCommands(command.children)}
          doubleHardline
          joiner={code`writeLine(""); `}
          ender={code`writeLine(""); `}>
          {child => (
            <>
              <hbr />
              {code`
                writeLine(textColors.heading.primary(${
                  child.icon
                    ? `(isUnicodeSupported ? " ${child.icon}  " : "") + `
                    : ""
                }\`${child.title} ${child.isVirtual ? "" : "Command"}${
                  child.tags?.length > 0
                    ? ` - ${child.tags
                        .map(
                          tag =>
                            `\${textColors.tags.${camelCase(tag)} ? textColors.tags.${camelCase(tag)}(inverse(" ${tag} ")) : textColors.tags.$default(inverse(" ${tag} "))}`
                        )
                        .join(" ")}`
                    : ""
                }\`));
                writeLine("");
                writeLine(textColors.body.tertiary(splitText(\`${formatDescription(
                  child.description
                )
                  .replace(/\.+$/, "")
                  .trim()}.\`)));
                writeLine(""); `}
              <hbr />
              <BaseHelpDisplay command={child} indent={2} filterGlobalOptions />
              <hbr />
            </>
          )}
        </For>
        {code`help(\`Running a specific command with the help flag (via: \${inlineCode("${getAppBin(
          context
        )} ${command.segments.join(
          " "
        )} <specific command> --help")}) will provide additional information that is specific to that command.\`);
        writeLine("");`}
      </Show>
    </>
  );
}
