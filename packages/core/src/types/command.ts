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
import type { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";

export interface BaseCommandOption {
  name: string;
  kind: ReflectionKind;
  title: string;
  description: string;
  alias: string[];
  env: string | false;
  optional: boolean;
}

export interface StringCommandOption extends BaseCommandOption {
  kind: ReflectionKind.string;
  default?: string;
  variadic: boolean;
}

export interface NumberCommandOption extends BaseCommandOption {
  kind: ReflectionKind.number;
  default?: number;
  variadic: boolean;
}

export interface BooleanCommandOption extends BaseCommandOption {
  kind: ReflectionKind.boolean;
  default?: boolean;
  isNegativeOf?: string;
  skipAddingNegative?: boolean;
}

export type CommandOption =
  | StringCommandOption
  | NumberCommandOption
  | BooleanCommandOption;

export interface CommandParam {
  name: string;
  description?: string;
  default?: string;
  optional: boolean;
  variadic: boolean;
}

export interface CommandPath {
  value: string | null;
  segments: string[];
}

export interface CommandBase {
  id: string | null;
  name: string;
  title?: string;
  description?: string;
  path: CommandPath;
  isVirtual: boolean;
}

export interface CommandInput extends CommandBase {
  id: string;
  entry: ResolvedEntryTypeDefinition;
}

export interface CommandTreePath extends CommandPath {
  variables: Record<string, CommandParam>;
}

export type CommandTree = CommandInput & {
  title: string;
  description: string;
  path: CommandTreePath;
  options: Record<string, CommandOption>;
  params: CommandParam[];
  parent: null | CommandTree;
  children: Record<string, CommandTree>;
};

export type SerializedCommandTree = Omit<CommandTree, "parent" | "children"> & {
  parent: null | string;
  children: Record<string, SerializedCommandTree>;
};
