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

import { executeCommandGenerator } from "@shell-shock/core/helpers/power-plant";
import type { Plugin } from "powerlines";
import { AuthCommands } from "./components/auth";
import { authGenerator } from "./generator";
import {
  assertAuthCommands,
  authConfiguration,
  registerAuthCommands
} from "./helpers";
import type { AuthPluginContext, AuthPluginOptions } from "./types/plugin";

export type * from "./types";
export { authGenerator } from "./generator";

/** Browser sign-in, secure credentials, and guards for protected Shell Shock commands. */
export const plugin = <TContext extends AuthPluginContext = AuthPluginContext>(
  options: AuthPluginOptions
): Plugin<TContext> => {
  const configuration = authConfiguration(options);
  return {
    name: "shell-shock/auth",
    config() {
      return { auth: configuration };
    },
    async configResolved() {
      // Validate the resolved configuration too: other config sources can merge into it.
      this.config.auth = authConfiguration(this.config.auth);
      registerAuthCommands(this);
      await executeCommandGenerator(this, authGenerator, {
        template: <AuthCommands />
      });
    },
    prepare: {
      order: "post",
      async handler() {
        assertAuthCommands(this.commands);
        await executeCommandGenerator(this, authGenerator);
      }
    }
  };
};
export default plugin;
