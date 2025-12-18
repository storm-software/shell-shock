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

import tsup from "@powerlines/plugin-tsup";
import untyped from "@powerlines/plugin-untyped";
import { defineConfig } from "powerlines";

export default defineConfig({
  name: "nx",
  entry: [
    "./index.ts",
    "./executors.ts",
    "./generators.ts",
    "./src/plugin/index.ts",
    "./src/executors/*/executor.ts",
    "./src/executors/*/untyped.ts",
    "./src/generators/*/generator.ts",
    "./src/generators/*/untyped.ts"
  ],
  plugins: [untyped(), tsup()],
  clean: false,
  skipNodeModulesBundle: true
});
