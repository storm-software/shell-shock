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

import type { FrameworkOptions } from "powerlines";
import packageJson from "../../package.json" with { type: "json" };

/**
 * Retrieves the framework information for Shell Shock.
 *
 * @returns An object containing the name, version, and organization ID of the Shell Shock framework.
 */
export function getFramework(): FrameworkOptions {
  return {
    name: "shell-shock",
    version: packageJson.version,
    orgId: "storm-software"
  };
}
