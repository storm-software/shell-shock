/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import {
  defineCommandGenerator,
  renderCommandTemplate
} from "@shell-shock/core/helpers/power-plant";
import { AuthBuiltin, AuthCommands } from "./components/auth";

export const authGenerator = defineCommandGenerator({
  meta: {
    name: "shell-shock-auth",
    title: "Shell Shock Authentication Generator",
    description: "Generate authentication commands and secure runtime helpers.",
    version: "1.0",
    tags: ["shell-shock", "auth", "alloy-js"]
  },
  generator: async (_commands, options) => {
    await renderCommandTemplate(
      options,
      <>
        <AuthBuiltin />
        <AuthCommands />
      </>
    );
  }
});
export default authGenerator;
