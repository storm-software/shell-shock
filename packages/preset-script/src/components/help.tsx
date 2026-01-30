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

import { code, For, Show } from "@alloy-js/core";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  getVariableCommandPathName,
  isVariableCommandPath
} from "@shell-shock/core/plugin-utils/context-helpers";
import { sortOptions } from "@shell-shock/core/plugin-utils/reflect";
import type { CommandTree } from "@shell-shock/core/types/command";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { snakeCase } from "@stryke/string-format/snake-case";
import { useTheme } from "../contexts";
import type { ScriptPresetContext } from "../types/plugin";

export interface HelpUsageProps {
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
export function HelpUsage(props: HelpUsageProps) {
  const { command, indent = 2 } = props;

  const context = usePowerlines<ScriptPresetContext>();
  const theme = useTheme();

  return (
    <For each={Object.keys(context.config.bin)} hardline>
      {bin =>
        code`
      writeLine(
        colors.text.body.primary(
          "$ ${bin} ${command.path.segments
            .map(segment =>
              isVariableCommandPath(segment)
                ? `<${command.path.variables[segment]?.variadic ? "..." : ""}${kebabCase(
                    getVariableCommandPathName(segment)
                  )}>`
                : segment
            )
            .join(" ")} [options]"
        ), { padding: ${theme.padding.app * indent} }
      );`
      }
    </For>
  );
}

/**
 * A component that generates the options table display for a command.
 */
export function HelpOptions(props: { command: CommandTree }) {
  const { command } = props;

  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      {code`table([
      [{ value: colors.text.heading.tertiary("Name"), align: "right", border: { bottom: "secondary" } }, { value: colors.text.heading.tertiary("Description"), align: "left", border: { bottom: "secondary" } }], `}
      <hbr />
      <For each={sortOptions(Object.values(command.options))} hardline>
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

          return code`[{ value: \`\${colors.text.body.primary("${
            option.title
          }")} \${colors.text.body.secondary("${
            flags.length > 0
              ? `${flags.sort().join(", ")}${names.length > 0 ? ", " : ""}`
              : ""
          }${names.length > 0 ? names.sort().join(", ") : ""}${
            option.kind === ReflectionKind.string
              ? ` <${snakeCase(option.name)}>${option.variadic ? "..." : ""}`
              : option.kind === ReflectionKind.number
                ? ` <${snakeCase(option.name)}>${option.variadic ? "..." : ""}`
                : ""
          }")}\`, align: "right" }, { value: colors.text.body.tertiary("${option.description.replace(
            /\.+$/,
            ""
          )} ${
            option.env || option.default !== undefined
              ? `(${
                  option.env
                    ? `env: ${context.config.envPrefix}_${option.env}${
                        option.default !== undefined ? ", " : ""
                      }`
                    : ""
                }${
                  option.default !== undefined
                    ? `default: ${JSON.stringify(option.default)}`
                    : ""
                })`
              : ""
          }."), align: "left" }], `;
        }}
      </For>
      <hbr />
      {code` ]); `}
    </>
  );
}

/**
 * A component that generates the commands table display for a command.
 */
export function HelpCommands(props: { command: CommandTree }) {
  const { command } = props;

  return (
    <>
      {code`table([
        [{ value: colors.text.heading.tertiary("Name"), align: "right", border: { bottom: "secondary" } }, { value: colors.text.heading.tertiary("Description"), align: "left", border: { bottom: "secondary" } }], `}
      <hbr />
      <For each={Object.values(command.children)} hardline>
        {child =>
          code`[{ value: \`\${colors.text.body.primary("${
            child.title
          }")} \${colors.text.body.secondary("(${
            child.name
          })")}\`, align: "right" }, { value: colors.text.body.tertiary("${child.description.replace(
            /\.+$/,
            ""
          )}"), align: "left" }], `
        }
      </For>
      <hbr />
      {code` ]); `}
    </>
  );
}

export interface HelpProps {
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
   * @defaultValue 1
   */
  indent?: number;
}

/**
 * A component that generates the `help` function declaration for a command.
 */
export function Help(props: HelpProps) {
  const { command, indent = 1 } = props;

  const theme = useTheme();

  return (
    <>
      {code`writeLine("");
      writeLine(colors.text.heading.secondary("USAGE:")${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
      <hbr />
      <HelpUsage command={command} indent={indent} />
      <hbr />
      <hbr />
      {code`writeLine("");
      writeLine(colors.text.heading.secondary("OPTIONS:")${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
      <hbr />
      <HelpOptions command={command} />
      <hbr />
      <hbr />
      <Show when={Object.keys(command.children).length > 0}>
        {code`writeLine("");
      writeLine(colors.text.heading.secondary("COMMANDS:")${
        indent > 1 ? `, { padding: ${theme.padding.app * indent} }` : ""
      });`}
        <hbr />
        <HelpCommands command={command} />
        <hbr />
        <hbr />
      </Show>
    </>
  );
}
