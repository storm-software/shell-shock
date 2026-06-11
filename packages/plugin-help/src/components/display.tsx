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

import { code, computed, For, Show } from "@alloy-js/core";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { CommandOption, CommandTree } from "@shell-shock/core";
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
      {code`writeLine(
        textColors.body.secondary(\`\${textColors.usage.bin(">_ ${getAppBin(
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
            ? ` \${textColors.usage.dynamic("<command>")}`
            : ""
        }${
          command.args.length > 0
            ? ` ${command.args
                .map(
                  arg =>
                    `\${textColors.usage.args("<${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.choices &&
                      arg.choices.length > 0
                        ? arg.choices
                            .map(choice => snakeCase(String(choice)))
                            .join("|")
                        : arg.type === "string" && arg.format
                          ? snakeCase(arg.format)
                          : snakeCase(arg.name)
                    }${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.variadic
                        ? "..."
                        : ""
                    }>")}`
                )
                .join(" ")}`
            : ""
        } \${textColors.usage.options("[options]")}\`), { padding: ${
          (theme.padding.app ?? 1) * indent
        } }
      );`}
      <hbr />
      <Show when={command.args.length > 0}>
        <hbr />
        {code`
      writeLine(
        textColors.body.secondary(\`\${textColors.usage.bin(">_ ${getAppBin(context)}")}${
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
            ? ` \${textColors.usage.dynamic("<command>")}`
            : ""
        } \${textColors.usage.options("[options]")}${
          command.args.length > 0
            ? ` ${command.args
                .map(
                  arg =>
                    `\${textColors.usage.args("<${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.choices &&
                      arg.choices.length > 0
                        ? arg.choices
                            .map(choice => snakeCase(String(choice)))
                            .join("|")
                        : arg.type === "string" && arg.format
                          ? snakeCase(arg.format)
                          : snakeCase(arg.name)
                    }${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.variadic
                        ? "..."
                        : ""
                    }>")}`
                )
                .join(" ")}`
            : ""
        }\`), { padding: ${(theme.padding.app ?? 1) * indent} }
      );`}
        <hbr />
      </Show>
      <Show when={command.alias.length > 0}>
        <For each={command.alias} hardline>
          {alias => (
            <>
              {code`writeLine(
        textColors.body.secondary(\`\${textColors.usage.bin(">_ ${getAppBin(
          context
        )}")}${
          command.segments.length > 1
            ? ` ${command.segments
                .slice(0, -1)
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
        } \${textColors.usage.command("${alias}")}${
          Object.values(command.children).length > 0
            ? ` \${textColors.usage.dynamic("<command>")}`
            : ""
        }${
          command.args.length > 0
            ? ` ${command.args
                .map(
                  arg =>
                    `\${textColors.usage.args("<${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.choices &&
                      arg.choices.length > 0
                        ? arg.choices
                            .map(choice => snakeCase(String(choice)))
                            .join("|")
                        : arg.type === "string" && arg.format
                          ? snakeCase(arg.format)
                          : snakeCase(arg.name)
                    }${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.variadic
                        ? "..."
                        : ""
                    }>")}`
                )
                .join(" ")}`
            : ""
        } \${textColors.usage.options("[options]")}\`), { padding: ${
          (theme.padding.app ?? 1) * indent
        } }
      );`}
              <Show when={command.args.length > 0}>
                <hbr />
                {code`
      writeLine(
        textColors.body.secondary(\`\${textColors.usage.bin(">_ ${getAppBin(context)}")}${
          command.segments.length > 1
            ? ` ${command.segments
                .slice(0, -1)
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
        } \${textColors.usage.command("${alias}")}${
          Object.values(command.children).length > 0
            ? ` \${textColors.usage.dynamic("<command>")}`
            : ""
        } \${textColors.usage.options("[options]")}${
          command.args.length > 0
            ? ` ${command.args
                .map(
                  arg =>
                    `\${textColors.usage.args("<${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.choices &&
                      arg.choices.length > 0
                        ? arg.choices
                            .map(choice => snakeCase(String(choice)))
                            .join("|")
                        : arg.type === "string" && arg.format
                          ? snakeCase(arg.format)
                          : snakeCase(arg.name)
                    }${
                      (arg.type === "string" || arg.type === "number") &&
                      arg.variadic
                        ? "..."
                        : ""
                    }>")}`
                )
                .join(" ")}`
            : ""
        }\`), { padding: ${(theme.padding.app ?? 1) * indent} }
      );`}
                <hbr />
              </Show>
            </>
          )}
        </For>
      </Show>
      <hbr />
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
      <For each={sortOptions(options, false)} hardline>
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
            option.type === "string"
              ? ` <${
                  option.choices && option.choices.length > 0
                    ? option.choices
                        .map(choice => snakeCase(String(choice)))
                        .join("|")
                    : option.format
                      ? snakeCase(option.format)
                      : snakeCase(option.name)
                }${option.variadic ? "..." : ""}>`
              : option.type === "number"
                ? ` <${
                    option.choices && option.choices.length > 0
                      ? option.choices
                          .map(choice => snakeCase(String(choice)))
                          .join("|")
                      : snakeCase(option.name)
                  }${option.variadic ? "..." : ""}>`
                : ""
          }"), align: "right", border: "none", maxWidth: "1/3" }, { value: textColors.body.tertiary(\`${formatShortDescription(
            option.description,
            {
              length: 200
            }
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
      <For
        each={Object.values(commands).sort((a, b) =>
          a.name.localeCompare(b.name)
        )}
        hardline>
        {child =>
          code`[{ value: textColors.body.primary("${
            child.name
          }"), align: "right", border: "none" }, { value: textColors.body.tertiary(\`${formatShortDescription(
            child.description,
            {
              length: 200
            }
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
      ? Object.values(command.options)
      : [
          ...Object.values(command.options),
          ...context.globalOptions.filter(
            (globalOption: CommandOption) =>
              !Object.values(command.options).some(
                option =>
                  option.name.toLowerCase() === globalOption.name.toLowerCase()
              ) &&
              !globalOption.alias.some(alias =>
                Object.values(command.options).some(option =>
                  option.alias.some(
                    a => a.toLowerCase() === alias.toLowerCase()
                  )
                )
              )
          )
        ]
  );

  return (
    <>
      {code`writeLine(bold(textColors.heading.secondary("Usage:"))${
        indent > 1 ? `, { padding: ${(theme.padding.app ?? 1) * indent} }` : ""
      });`}
      <hbr />
      <HelpUsageDisplay command={command} indent={indent} />
      <Spacing />
      <Show when={options.value.length > 0}>
        {code`writeLine("");
      writeLine(bold(textColors.heading.secondary("Options:"))${
        indent > 1 ? `, { padding: ${(theme.padding.app ?? 1) * indent} }` : ""
      });`}
        <hbr />
        <HelpOptionsDisplay options={options.value} />
        <Spacing />
      </Show>
      <Show when={Object.keys(command.children).length > 0}>
        {code`writeLine("");
      writeLine(bold(textColors.heading.secondary("Commands:"))${
        indent > 1 ? `, { padding: ${(theme.padding.app ?? 1) * indent} }` : ""
      });`}
        <hbr />
        <HelpCommandsDisplay commands={command.children} />
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
  const { options, commands } = props;

  const context = usePowerlines<HelpPluginContext>();

  return (
    <>
      <hbr />
      {code`writeLine(bold(textColors.heading.secondary("Common Options:")));`}
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
                }\`\${underline("${child.title}")}${
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
                }\`\${underline("${child.title}")}${
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
      </Show>
    </>
  );
}
