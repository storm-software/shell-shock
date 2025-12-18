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

import type { UserConfig } from "powerlines/types/config";
import type { PluginContext } from "powerlines/types/context";
import type { ResolvedConfig } from "powerlines/types/resolved";

export type OpenTUIPluginOptions = {};

export type OpenTUIPluginUserConfig = UserConfig;

export type OpenTUIPluginResolvedConfig = ResolvedConfig;

export type OpenTUIPluginContext<
  TResolvedConfig extends
    OpenTUIPluginResolvedConfig = OpenTUIPluginResolvedConfig
> = PluginContext<TResolvedConfig>;
