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

import type { PluginContext } from "powerlines/types/context";
import type { ResolvedEntryTypeDefinition } from "powerlines/types/resolved";
import type { ResolvedConfig } from "./config";

export type CommandArg = {
  name: string;
  title: string;
  description?: string;
  alias: string[];
  optional: boolean;
} & (
  | ({
      type: "string";
      format?:
        | "path"
        | "url"
        | "date"
        | "time"
        | "datetime"
        | "json"
        | "regex"
        | string;
    } & (
      | {
          variadic: false;
          default?: string;
        }
      | {
          variadic: true;
          default?: string[];
        }
    ))
  | ({
      type: "number";
    } & (
      | {
          variadic: false;
          default?: number;
        }
      | {
          variadic: true;
          default?: number[];
        }
    ))
  | {
      type: "boolean";
      default?: boolean;
      isNegativeOf?: string;
    }
);

export interface CommandTree {
  path: string[];
  name: string;
  title: string;
  description?: string;
  args: CommandArg[];
  parent: null | CommandTree;
  children: Record<string, CommandTree>;
  entry?: ResolvedEntryTypeDefinition;
}

export interface CommandRelations {
  parent: string | null;
  children: string[];
}

export type BuildContext<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> = PluginContext<TResolvedConfig> & {
  shellShock: {
    commands: CommandTree;
  };
};
