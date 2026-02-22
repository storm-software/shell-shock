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

export type UpgradeType = "confirm" | "auto" | "display" | "command";

export interface UpgradePluginOptions {
  /**
   * The type of upgrade to perform. This option determines how the upgrade process will be handled.
   *
   * @remarks
   * The upgrade logic will behave differently based on the value of this field:
   * - `"confirm"` - the user will be prompted to confirm the upgrade before it is performed. This is the default behavior and is recommended for most users, as it provides an extra layer of safety against unintended upgrades.
   * - `"auto"` - the upgrade will be performed automatically without any user confirmation. This option is suitable for advanced users who want a seamless upgrade experience and are confident in the stability of new versions.
   * - `"display"` - the command will only display the latest available version without performing any upgrade. This option is useful for users who want to check for updates without making any changes to their system.
   * - `"command"` - the upgrade will be triggered by a specific command. This option allows users to manually initiate the upgrade process through a dedicated command.
   *
   * @defaultValue "confirm"
   */
  type?: UpgradeType;

  /**
   * The time in milliseconds after which previously retrieved version data is considered stale.
   *
   * @remarks
   * This field will control how often the application will check for new versions. If set, the application will check for new versions at the specified interval and notify the user if an update is available. If set to `-1`, the application will only check for updates when the command is executed.
   *
   * @defaultValue 2 * 60 * 60 * 1000 (2 hours)
   */
  staleTime?: number;
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
  upgrade: Required<UpgradePluginOptions>;
};

export type UpgradePluginContext<
  TResolvedConfig extends UpgradePluginResolvedConfig =
    UpgradePluginResolvedConfig
> = Context<TResolvedConfig>;
