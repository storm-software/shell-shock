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
  usePowerlines,
  usePowerlinesSafe
} from "@powerlines/plugin-alloy/core/contexts/context";

/**
 * Re-export Powerlines Alloy context hooks and file components from the same
 * `@powerlines/plugin-alloy` instance that {@link renderCommandTemplate} uses.
 *
 * @remarks
 * pnpm may install multiple peer-resolved copies of `@powerlines/plugin-alloy`.
 * Alloy `createNamedContext` uses a per-module Symbol, so a Provider from one
 * copy is invisible to `usePowerlines` / `BuiltinFile` from another — which
 * makes `getPrefix` fall back to `"powerlines"` instead of the framework name.
 * Always import these from `@shell-shock/core/contexts/power-plant` in
 * components rendered via `renderCommandTemplate`.
 */
export { usePowerlines, usePowerlinesSafe };

export { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
export type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";

export { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
export type { EntryFileProps } from "@powerlines/plugin-alloy/typescript/components/entry-file";
