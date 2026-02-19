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

import type {
  ReflectionFunction,
  ReflectionKind,
  ReflectionParameter,
  ReflectionProperty,
  SerializedTypes
} from "@powerlines/deepkit/vendor/type";
import type { AnyFunction } from "@stryke/types/base";
import type { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";

export interface BaseCommandParameter {
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

export interface StringCommandParameter extends BaseCommandParameter {
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

export interface NumberCommandParameter extends BaseCommandParameter {
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

export interface BooleanCommandParameter extends BaseCommandParameter {
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

export interface StringCommandOption extends StringCommandParameter {
  /**
   * The property reflection.
   */
  reflection?: ReflectionProperty;
}

export interface NumberCommandOption extends NumberCommandParameter {
  /**
   * The property reflection.
   */
  reflection?: ReflectionProperty;
}

export interface BooleanCommandOption extends BooleanCommandParameter {
  /**
   * The property reflection.
   */
  reflection?: ReflectionProperty;
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

export interface StringCommandArgument extends StringCommandParameter {
  /**
   * The parameter reflection.
   */
  reflection: ReflectionParameter;
}

export interface NumberCommandArgument extends NumberCommandParameter {
  /**
   * The parameter reflection.
   */
  reflection: ReflectionParameter;
}

export interface BooleanCommandArgument extends BooleanCommandParameter {
  /**
   * The parameter reflection.
   */
  reflection: ReflectionParameter;
}

export type CommandArgument =
  | StringCommandArgument
  | NumberCommandArgument
  | BooleanCommandArgument;

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
   * The full command path value.
   */
  path: string | null;

  /**
   * The path segments.
   */
  segments: string[];

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
   * Whether the command is virtual.
   *
   * @remarks
   * Virtual commands are considered forks in the command tree and are not directly executable. They are used to group related subcommands together without having an actual command handler or entry point.
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
   * The command options.
   */
  options: Record<string, CommandOption>;
  /**
   * The positional arguments provided to the command.
   */
  arguments: CommandArgument[];
  /**
   * The parent command.
   */
  parent: null | CommandTree;
  /**
   * Child commands.
   */
  children: Record<string, CommandTree>;
  /**
   * The command handler reflection.
   */
  reflection: ReflectionFunction | null;
};

export type SerializedCommandOption = Omit<CommandOption, "reflection">;

export type SerializedCommandArgument = Omit<CommandArgument, "reflection">;

export type SerializedCommandTree = Omit<
  CommandTree,
  "options" | "arguments" | "parent" | "children" | "reflection"
> & {
  /**
   * The command options.
   */
  options: Record<string, SerializedCommandOption>;
  /**
   * The positional arguments provided to the command.
   */
  arguments: SerializedCommandArgument[];
  /**
   * The parent command id.
   */
  parent: null | string;
  /**
   * Serialized child commands.
   */
  children: Record<string, SerializedCommandTree>;
  /**
   * The command handler reflection.
   */
  reflection?: SerializedTypes;
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
