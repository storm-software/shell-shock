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

export { default as build } from "./executors/build/executor";
export type { BuildExecutorSchema } from "./executors/build/schema";
export { default as clean } from "./executors/clean/executor";
export type { CleanExecutorSchema } from "./executors/clean/schema";
export { default as docs } from "./executors/docs/executor";
export type { DocsExecutorSchema } from "./executors/docs/schema";
export { default as lint } from "./executors/lint/executor";
export type { LintExecutorSchema } from "./executors/lint/schema";
export { default as prepare } from "./executors/prepare/executor";
export type { PrepareExecutorSchema } from "./executors/prepare/schema";
