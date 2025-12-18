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

import { defu } from "defu";
import type { UserConfig as PowerlinesUserConfig } from "powerlines/types/config";
import type { UserConfig } from "../types/config";

export async function resolveConfig(
  config: UserConfig
): Promise<PowerlinesUserConfig & UserConfig> {
  const resolvedConfig = defu({
    build: {
      variant: "tsdown"
    },
    interactive: true,
    skipDefaultArgs: false,
    ...config,
    type: "application",
    framework: "shell-shock",
    singleBuild: true,
    environments: {}
  }) as PowerlinesUserConfig & UserConfig;

  return resolvedConfig;
}
