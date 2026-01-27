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

/* eslint-disable ts/naming-convention */

import type { ResolvedConfig } from "./config";
import type { Context } from "./context";

/**
 * An internal representation of the plugin context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_ContextInternal {
  id: string;
}

/**
 * An internal representation of the plugin context, used for managing hooks and environment data.
 *
 * @internal
 */
export interface UNSAFE_Context<
  TResolvedConfig extends ResolvedConfig = ResolvedConfig
> extends Context<TResolvedConfig> {
  $$internal: UNSAFE_ContextInternal;
}
