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

import type { ShellShockEnv } from "@shell-shock/core/types/env";

export interface ShellShockUpgradePluginEnv extends ShellShockEnv {
  /**
   * An environment variable that can be set to skip the version check when determining if a check for updates is required. If this variable is set to any value, the `isCheckForUpdatesRequired` function will return `false`, indicating that a check for updates is not required. This can be useful in CI environments or other non-interactive contexts where you want to avoid performing a version check, which may involve file system operations or network requests. By setting this environment variable, you can ensure that the upgrade process proceeds without checking for updates, which can help speed up the process in certain scenarios.
   *
   * @defaultValue false
   */
  SKIP_VERSION_CHECK?: boolean;
}
