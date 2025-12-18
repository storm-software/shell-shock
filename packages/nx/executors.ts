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

export { default as build } from "./src/executors/build/executor";
export type { BuildExecutorSchema } from "./src/executors/build/schema";
export { default as clean } from "./src/executors/clean/executor";
export type { CleanExecutorSchema } from "./src/executors/clean/schema";
export { default as docs } from "./src/executors/docs/executor";
export type { DocsExecutorSchema } from "./src/executors/docs/schema";
export { default as lint } from "./src/executors/lint/executor";
export type { LintExecutorSchema } from "./src/executors/lint/schema";
export { default as prepare } from "./src/executors/prepare/executor";
export type { PrepareExecutorSchema } from "./src/executors/prepare/schema";
