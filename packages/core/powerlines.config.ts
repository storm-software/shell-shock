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

import alloy from "@powerlines/plugin-alloy";
import deepkit from "@powerlines/plugin-deepkit";
import plugin from "@powerlines/plugin-plugin";
import type { UserConfig } from "powerlines";
import { defineConfig } from "powerlines/config";

const config: UserConfig = defineConfig({
  input: [
    "./src/*.ts",
    "./src/*.tsx",
    "./src/types/*.ts",
    "./src/components/*.{ts,tsx}",
    "./src/contexts/*.{ts,tsx}",
    "./src/plugin-utils/index.ts"
  ],
  plugins: [
    plugin(),
    deepkit({
      reflection: "default",
      level: "all"
    }),
    alloy()
  ]
});

export default config;
