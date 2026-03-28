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

import type { StandardJSONSchemaV1 } from "@standard-schema/spec";
import type { JsonSchema7TupleType } from "@stryke/json";
import type { AnyFunction } from "@stryke/types/base";
import type { JSONSchema7Object } from "json-schema";
import type { ResolvedEntryTypeDefinition } from "powerlines";
import type * as z3 from "zod/v3";

export type CommandParameterType =
  | string
  | number
  | boolean
  | (string | number)[];

export const CommandParameterKinds = {
  string: "string",
  number: "number",
  boolean: "boolean"
} as const;

export type CommandParameterKind =
  (typeof CommandParameterKinds)[keyof typeof CommandParameterKinds];

export interface BaseCommandParameter {
  /**
   * The option name.
   */
  name: string;

  /**
   * The option kind.
   */
  kind: CommandParameterKind;

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

  /**
   * Whether the option accepts multiple values.
   */
  variadic: boolean;
}

export interface StringCommandParameter extends BaseCommandParameter {
  /**
   * The option kind.
   */
  kind: "string";

  /**
   * The default value.
   */
  default?: string;

  /**
   * A standard string format to validate the option value against.
   */
  format?:
    | "email"
    | "uri"
    | "uuid"
    | "ipv4"
    | "ipv6"
    | "date"
    | "time"
    | "date-time"
    | "duration";

  /**
   * The allowed choices for the option value.
   */
  choices?: string[];
}

export interface NumberCommandParameter extends BaseCommandParameter {
  /**
   * The option kind.
   */
  kind: "number";

  /**
   * The default value.
   */
  default?: number;

  /**
   * The allowed choices for the option value.
   */
  choices?: number[];
}

export interface BooleanCommandParameter extends BaseCommandParameter {
  /**
   * The option kind.
   */
  kind: "boolean";

  /**
   * The default value.
   */
  default?: boolean;
}

export type CommandParameter =
  | StringCommandParameter
  | NumberCommandParameter
  | BooleanCommandParameter;

export type AsCommandParameterConfig<T extends BaseCommandParameter> = Pick<
  T,
  "kind" | "alias"
> &
  Partial<Omit<T, "kind" | "alias">> & {
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

export interface BooleanCommandOption extends BooleanCommandParameter {
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
  | BooleanCommandOption;
export type CommandOptionConfig = AsCommandParameterConfig<CommandOption>;

export type CommandArgument =
  | StringCommandParameter
  | NumberCommandParameter
  | BooleanCommandParameter;
export type CommandArgumentConfig = AsCommandParameterConfig<CommandArgument>;

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
   * A URL to the command documentation or reference.
   */
  reference?: string;

  /**
   * Whether the command is virtual.
   *
   * @remarks
   * Virtual commands are considered forks in the command tree and are not directly executable. They are used to group related subcommands together without having an actual command handler or entry point.
   */
  isVirtual: boolean;
}

export interface CommandConfig extends CommandBase {
  /**
   * The command id.
   */
  id: string;

  /**
   * The resolved entry definition.
   */
  entry: ResolvedEntryTypeDefinition;

  /**
   * Optional tags for the command.
   *
   * @remarks
   * Tags can be used to categorize and organize commands, and can also be utilized by plugins to provide additional functionality or filtering based on tags.
   */
  tags?: string[];
}

export type CommandTree = CommandConfig & {
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
   * Optional tags for the command.
   *
   * @remarks
   * Tags can be used to categorize and organize commands, and can also be utilized by plugins to provide additional functionality or filtering based on tags.
   */
  tags: string[];

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
   * This URL can be used in various displays of the user interface and documentation to provide users with a reference for the command. It can also be used by plugins to link to the documentation in relevant contexts. If the token `{command}` is included in the URL, it will be replaced with the full command path to provide links to command specific documentation. For example, `myapp command subcommand` will be translated to `{referenceLink}/command/subcommand`.
   */
  reference?: string;
}

export interface CommandModule {
  metadata?: CommandMetadata;
  options?:
    | Record<string, CommandOptionConfig>
    | JSONSchema7Object
    | StandardJSONSchemaV1<Record<string, CommandParameterType>>
    | z3.AnyZodObject;
  args?:
    | CommandArgumentConfig[]
    | JsonSchema7TupleType
    | StandardJSONSchemaV1<CommandParameterType[]>
    | z3.AnyZodTuple;
  default?: AnyFunction;
}
