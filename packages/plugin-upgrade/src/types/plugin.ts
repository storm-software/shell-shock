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
  ResolvedConfig,
  UserConfig
} from "@shell-shock/core/types/config";
import type { Context } from "@shell-shock/core/types/context";

export interface UpgradePluginOptions {
  /**
   * Optionally specify the name of the package in npm to check for upgrades.
   *
   * @remarks
   * This option is used to determine which package's version to check for upgrades. If not specified, it will default to the value detected in the `package.json` file of the project, or the name of the package that the plugin is a part of if it is being used within a package context. This option is primarily intended for use when the plugin is being used in a non-package context, such as a global installation, where there may not be a `package.json` file to reference.
   */
  packageName?: string;
}

export type UpgradePluginUserConfig = UserConfig & {
  /**
   * Resolved upgrade configuration for the plugin.
   */
  upgrade: UpgradePluginOptions;
};

export type UpgradePluginResolvedConfig = ResolvedConfig & {
  /**
   * Resolved upgrade configuration for the plugin.
   */
  upgrade: UpgradePluginOptions;
};

export type UpgradePluginContext<
  TResolvedConfig extends UpgradePluginResolvedConfig =
    UpgradePluginResolvedConfig
> = Context<TResolvedConfig>;
