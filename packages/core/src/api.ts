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

import { build } from "powerlines/api/build";
import { clean } from "powerlines/api/clean";
import { create } from "powerlines/api/create";
import { deploy } from "powerlines/api/deploy";
import { docs } from "powerlines/api/docs";
import { lint } from "powerlines/api/lint";
import { prepare } from "powerlines/api/prepare";
import { test } from "powerlines/api/test";
import { types } from "powerlines/api/types";
import { createApi } from "powerlines/helpers";
import packageJson from "../package.json" with { type: "json" };
import { plugin } from "./plugin";

export default createApi(
  {
    types,
    prepare,
    create,
    clean,
    lint,
    test,
    build,
    docs,
    deploy
  },
  {
    plugins: [plugin()],
    framework: {
      name: "shell-shock",
      version: packageJson.version,
      orgId: "storm-software"
    }
  }
);
