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

import type { UserConfig } from "@shell-shock/core";
import { defineConfig } from "@shell-shock/core";
import script from "@shell-shock/preset-script";

const config: UserConfig = defineConfig({
  skipCache: true,
  name: "playground-script",
  output: {
    storage: "fs"
  },
  plugins: [
    script({
      theme: {
        labels: {
          banner: {
            header: {
              primary: "Shell Shock Playground"
            },
            footer: {
              primary: "https://stormsoftware.com"
            }
          }
        }
      }
    })
  ]
});

export default config;
