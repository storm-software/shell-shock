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

import type { JsonSchemaStringFormat, SchemaConfig } from "@power-plant/schema";
import type { AnyFunction, RequiredKeys } from "@stryke/types/base";
import type { ResolvedEntryFileReference } from "powerlines";

export type CommandParameterType = "string" | "number" | "boolean";

export interface BaseCommandParameter {
  /**
   * The option name.
   */
  name: string;

  /**
   * The option kind.
   */
  type: CommandParameterType;

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
   * The default value.
   */
  default?: string | number | boolean | string[] | number[] | boolean[];

  /**
   * The environment variable name or false to disable.
   */
  env: string | false;

  /**
   * Whether the option is required.
   */
  required: boolean;

  /**
   * Whether the option accepts multiple values.
   */
  variadic: boolean;
}

export interface BaseSingleCommandParameter {
  /**
   * The default value.
   */
  default?: string | number | boolean;

  /**
   * Whether the option accepts multiple values.
   */
  variadic: false;
}

export interface BaseVariadicCommandParameter {
  /**
   * The default value.
   */
  default?: string[] | number[] | boolean[];

  /**
   * Whether the option accepts multiple values.
   */
  variadic: true;
}

export interface BaseStringCommandParameter extends BaseCommandParameter {
  /**
   * The option kind.
   */
  type: "string";

  /**
   * The default value.
   */
  default?: string | string[];

  /**
   * A standard string format to validate the option value against.
   */
  format?: JsonSchemaStringFormat | string;

  /**
   * The allowed choices for the option value.
   */
  choices?: string[];
}

export interface SingleStringCommandParameter extends BaseStringCommandParameter {
  /**
   * The default value.
   */
  default?: string;

  /**
   * Whether the option accepts multiple values.
   */
  variadic: false;
}

export interface VariadicStringCommandParameter extends BaseStringCommandParameter {
  /**
   * The default value.
   */
  default?: string[];

  /**
   * Whether the option accepts multiple values.
   */
  variadic: true;
}

export type StringCommandParameter =
  SingleStringCommandParameter | VariadicStringCommandParameter;

export interface BaseNumberCommandParameter extends BaseCommandParameter {
  /**
   * The option kind.
   */
  type: "number";

  /**
   * The default value.
   */
  default?: number | number[];

  /**
   * The allowed choices for the option value.
   */
  choices?: number[];
}

export interface SingleNumberCommandParameter extends BaseNumberCommandParameter {
  /**
   * The default value.
   */
  default?: number;

  /**
   * Whether the option accepts multiple values.
   */
  variadic: false;
}

export interface VariadicNumberCommandParameter extends BaseNumberCommandParameter {
  /**
   * The default value.
   */
  default?: number[];

  /**
   * Whether the option accepts multiple values.
   */
  variadic: true;
}

export type NumberCommandParameter =
  SingleNumberCommandParameter | VariadicNumberCommandParameter;

export interface BaseBooleanCommandParameter extends BaseCommandParameter {
  /**
   * The option kind.
   */
  type: "boolean";

  /**
   * The default value.
   */
  default?: boolean | boolean[];
}

export interface SingleBooleanCommandParameter extends BaseBooleanCommandParameter {
  /**
   * The default value.
   */
  default?: boolean;

  /**
   * Whether the option accepts multiple values.
   */
  variadic: false;
}

export interface VariadicBooleanCommandParameter extends BaseBooleanCommandParameter {
  /**
   * The default value.
   */
  default?: boolean[];

  /**
   * Whether the option accepts multiple values.
   */
  variadic: true;
}

export type BooleanCommandParameter =
  SingleBooleanCommandParameter | VariadicBooleanCommandParameter;

export type CommandParameter =
  StringCommandParameter | NumberCommandParameter | BooleanCommandParameter;

export type AsCommandParameterConfig<T extends BaseCommandParameter> = Pick<
  T,
  "type"
> &
  Partial<Omit<T, "type" | "alias">> & {
    alias?: string | string[];
  };

export type StringCommandParameterConfig =
  AsCommandParameterConfig<StringCommandParameter>;
export type NumberCommandParameterConfig =
  AsCommandParameterConfig<NumberCommandParameter>;
export type BooleanCommandParameterConfig =
  AsCommandParameterConfig<BooleanCommandParameter>;

export type CommandParameterConfig =
  | StringCommandParameterConfig
  | NumberCommandParameterConfig
  | BooleanCommandParameterConfig;

export interface BooleanCommandOption extends SingleBooleanCommandParameter {
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
  | StringCommandParameter
  | NumberCommandParameter
  | BooleanCommandOption
  | VariadicBooleanCommandParameter;
export type CommandOptionConfig = AsCommandParameterConfig<CommandOption>;

export type CommandArgument =
  StringCommandParameter | NumberCommandParameter | BooleanCommandParameter;
export type CommandArgumentConfig = AsCommandParameterConfig<CommandArgument>;

export interface CommandMetadata {
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
   * Optional tags for the command.
   *
   * @remarks
   * Tags can be used to categorize and organize commands, and can also be utilized by plugins to provide additional functionality or filtering based on tags.
   */
  tags?: string[];

  /**
   * An optional icon to visually represent the command in user interfaces.
   *
   * @remarks
   * This can be a string containing an emoji, a Unicode character, or any other symbol that helps to visually identify the command. If not provided, no icon will be displayed.
   */
  icon?: string;

  /**
   * A URL to the command documentation or reference.
   *
   * @remarks
   * This URL can be used in various displays of the user interface and documentation to provide users with a reference for the command. It can also be used by plugins to link to the documentation in relevant contexts. If the token `{command}` is included in the URL, it will be replaced with the full command path to provide links to command specific documentation. For example, `myapp command subcommand` will be translated to `{docs}/command/subcommand`.
   */
  docs?: string;
}

export interface CommandBase extends CommandMetadata {
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
   * Alternative command names.
   */
  alias?: string[];

  /**
   * Whether the command is virtual.
   *
   * @remarks
   * Virtual commands are considered forks in the command tree and are not directly executable. They are used to group related subcommands together without having an actual command handler or entry point.
   */
  virtual: boolean;
}

export interface CommandConfig extends CommandBase {
  /**
   * The command id.
   */
  id: string;

  /**
   * The resolved entry definition.
   */
  entry: ResolvedEntryFileReference;

  tags?: CommandMetadata["tags"];
}

export type CommandTree = RequiredKeys<
  CommandConfig,
  "title" | "description" | "alias" | "tags"
> & {
  /**
   * The command options.
   */
  options: Record<string, CommandOption>;

  /**
   * The positional arguments provided to the command.
   */
  args: CommandArgument[];

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

export interface CommandModule {
  metadata?: CommandMetadata;
  options?: Record<string, CommandOptionConfig> | SchemaConfig;
  args?: (CommandArgumentConfig | SchemaConfig)[];
  default?: AnyFunction;
}
