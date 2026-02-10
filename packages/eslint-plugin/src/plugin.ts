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

import type { ESLint } from "eslint";
import packageJson from "../package.json" with { type: "json" };
import duplicateCommandPath from "./rules/duplicate-command-path";
import invalidCommandExport from "./rules/invalid-command-export";
import invalidHandlerParams from "./rules/invalid-handler-params";

export const plugin = {
  meta: {
    name: "shell-shock",
    version: packageJson.version
  },
  rules: {
    "duplicate-command-path": duplicateCommandPath,
    "invalid-command-export": invalidCommandExport,
    "invalid-handler-params": invalidHandlerParams
  }
} satisfies ESLint.Plugin;
