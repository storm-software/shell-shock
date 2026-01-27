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

import prettierConfig from "@storm-software/prettier";
import prettier from "prettier";

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  postprocess: content =>
    prettier.format(content, { ...prettierConfig, parser: "markdown" }),
  configEmoji: [
    ["base", "📋"],
    ["recommended", "🌟"],
    ["strict", "🔒"]
  ],
  ruleDocSectionInclude: ["Rule Details", "Version"]
};

export default config;
