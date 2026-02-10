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

import type { Linter } from "eslint";
import { plugin } from "../plugin";

const config: Linter.Config = {
  files: ["**/*.{,c,m}{j,t}s{,x}"],
  name: "shell-shock:base",
  plugins: {
    "shell-shock": plugin
  },
  ignores: [".shell-shock"],
  rules: {
    "shell-shock/duplicate-command-path": "warn",
    "shell-shock/invalid-command-export": "error",
    "shell-shock/invalid-handler-params": "error"
  }
};

export default config;
