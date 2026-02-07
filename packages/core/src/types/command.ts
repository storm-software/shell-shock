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

import type { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import type { AnyFunction } from "@stryke/types/base";
import type { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";

export interface BaseCommandOption {
  /**
   * The option name.
   */
  name: string;
  /**
   * The option kind.
   */
  kind: ReflectionKind;
  /**
   * The display title.
   */
  title: string;
  /**
   * The option description.
   */
  description: string;
  /**
   * Alternative option names.
   */
  alias: string[];
  /**
   * The environment variable name or false to disable.
   */
  env: string | false;
  /**
   * Whether the option is optional.
   */
  optional: boolean;
}

export interface StringCommandOption extends BaseCommandOption {
  /**
   * The option kind.
   */
  kind: ReflectionKind.string;
  /**
   * The default value.
   */
  default?: string;
  /**
   * Whether the option accepts multiple values.
   */
  variadic: boolean;
}

export interface NumberCommandOption extends BaseCommandOption {
  /**
   * The option kind.
   */
  kind: ReflectionKind.number;
  /**
   * The default value.
   */
  default?: number;
  /**
   * Whether the option accepts multiple values.
   */
  variadic: boolean;
}

export interface BooleanCommandOption extends BaseCommandOption {
  /**
   * The option kind.
   */
  kind: ReflectionKind.boolean;
  /**
   * The default value.
   */
  default?: boolean;
  /**
   * The option this negates.
   */
  isNegativeOf?: string;
  /**
   * Whether to skip adding a negative option.
   */
  skipAddingNegative?: boolean;
}

export type CommandOption =
  | StringCommandOption
  | NumberCommandOption
  | BooleanCommandOption;

export interface CommandPath {
  /**
   * The full path value.
   */
  value: string | null;
  /**
   * The path segments.
   */
  segments: string[];
}

export interface CommandBase {
  /**
   * The command id.
   */
  id: string | null;
  /**
   * The command name.
   */
  name: string;
  /**
   * The display title.
   */
  title?: string;
  /**
   * The command description.
   */
  description?: string;
  /**
   * Alternative command names.
   */
  alias?: string[];
  /**
   * The command icon.
   */
  icon?: string;
  /**
   * The command path.
   */
  path: CommandPath;
  /**
   * Whether the command is virtual.
   */
  isVirtual: boolean;
}

export interface CommandInput extends CommandBase {
  /**
   * The command id.
   */
  id: string;
  /**
   * The resolved entry definition.
   */
  entry: ResolvedEntryTypeDefinition;
}

/**
 * Represents a dynamic command segment with metadata and matching behavior.
 */
export type CommandDynamicSegment = {
  /**
   * The segment name.
   */
  name: string;
  /**
   * The segment title.
   */
  title: string;
  /**
   * The segment description.
   */
  description: string;
  /**
   * Whether the segment is optional.
   */
  optional: boolean;
} & (
  | {
      /**
       * The default value.
       */
      default?: string;
      /**
       * Whether the segment is a catch-all.
       */
      catchAll: false;
      /**
       * Whether the segment is variadic.
       */
      variadic: false;
    }
  | {
      /**
       * The default value.
       */
      default?: string;
      /**
       * Whether the segment is a catch-all.
       */
      catchAll: true;
      /**
       * Whether the segment is variadic.
       */
      variadic: false;
    }
  | {
      /**
       * The default values.
       */
      default?: string[];
      /**
       * Whether the segment is a catch-all.
       */
      catchAll: true;
      /**
       * Whether the segment is variadic.
       */
      variadic: true;
    }
);

export interface CommandTreePath extends CommandPath {
  /**
   * Dynamic segment definitions.
   */
  dynamics: Record<string, CommandDynamicSegment>;
}

export type CommandTree = CommandInput & {
  /**
   * The display title.
   */
  title: string;
  /**
   * The command description.
   */
  description: string;
  /**
   * Alternative command names.
   */
  alias: string[];
  /**
   * The command path with dynamics.
   */
  path: CommandTreePath;
  /**
   * The command options.
   */
  options: Record<string, CommandOption>;
  /**
   * The parent command.
   */
  parent: null | CommandTree;
  /**
   * Child commands.
   */
  children: Record<string, CommandTree>;
};

export type SerializedCommandTree = Omit<CommandTree, "parent" | "children"> & {
  /**
   * The parent command id.
   */
  parent: null | string;
  /**
   * Serialized child commands.
   */
  children: Record<string, SerializedCommandTree>;
};

export interface Metadata {
  /**
   * The display name of the command.
   *
   * @remarks
   * This value will be used in various displays of the user interface and documentation. If not provided, a formatted value of the command name will be used.
   */
  title?: string;

  /**
   * A brief description of what the command does.
   *
   * @remarks
   * This value will be used in various displays of the user interface and documentation. If not provided, a default message may be shown.
   */
  description?: string;

  /**
   * One or more alternative names for the command.
   */
  alias?: string | string[];

  /**
   * An optional icon to visually represent the command in user interfaces.
   *
   * @remarks
   * This can be a string containing an emoji, a Unicode character, or any other symbol that helps to visually identify the command. If not provided, no icon will be displayed.
   */
  icon?: string;
}

export interface CommandModule {
  metadata?: Metadata;
  default?: AnyFunction;
}
