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

import type { UserConfig } from "powerlines";
import { defineConfig } from "powerlines/config";
import { tsdown } from "powerlines/tsdown";

const config: UserConfig = defineConfig({
  name: "nx-plugin",
  input: "./src/plugin/index.ts",
  output: {
    buildPath: "./packages/nx/dist/src"
  },
  plugins: [tsdown()],
  platform: "node",
  resolve: {
    noExternal: ["@powerlines/nx"],
    skipNodeModulesBundle: true
  },
  tsdown: {
    minify: false,
    unbundle: false,
    exports: false,
    fixedExtension: false
  }
});

export default config;
