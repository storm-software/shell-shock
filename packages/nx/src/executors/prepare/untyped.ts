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

import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "../../base/base-executor.untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "PrepareExecutorSchema",
    title: "Prepare Executor",
    description:
      "A type definition for the Powerlines - Prepare executor schema",
    required: []
  },
  skipCache: {
    $schema: {
      title: "Skip Cache",
      type: "boolean",
      description: "Skip the cache when building"
    }
  },
  skipInstalls: {
    $schema: {
      title: "Skip Installs",
      type: "boolean",
      description: "Skip installing dependencies before building"
    }
  }
});
