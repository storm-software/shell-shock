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

import type { PromiseExecutor } from "@nx/devkit";
import type {
  PowerlinesExecutorApi,
  PowerlinesExecutorContext
} from "@powerlines/nx/base/base-executor";
import { withExecutor as withPowerlinesExecutor } from "@powerlines/nx/base/base-executor";
import type { BaseExecutorResult } from "@storm-software/workspace-tools/types";
import type { BaseExecutorSchema } from "./base-executor.schema";

/**
 * A higher-order function that wraps a Powerlines executor function, providing a consistent interface for Nx executors in the Shell Shock project. This function abstracts away the integration details with Powerlines, allowing developers to focus on implementing the core logic of their executors.
 *
 * @param command - The name of the command that this executor will handle (e.g., "build", "lint").
 * @param executorFn - The actual executor function that contains the logic to be executed. It receives a PowerlinesExecutorContext and PowerlinesExecutorApi as parameters.
 * @returns A PromiseExecutor function that can be used as an Nx executor.
 */
export function withExecutor<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
>(
  command: string,
  executorFn: (
    context: PowerlinesExecutorContext<TExecutorSchema>,
    api: PowerlinesExecutorApi
  ) =>
    | Promise<BaseExecutorResult | null | undefined>
    | BaseExecutorResult
    | null
    | undefined
): PromiseExecutor<TExecutorSchema> {
  return withPowerlinesExecutor<TExecutorSchema>(command, executorFn, {
    importPath: "@shell-shock/core/api",
    framework: {
      name: "shell-shock",
      orgId: "storm-software"
    }
  });
}
