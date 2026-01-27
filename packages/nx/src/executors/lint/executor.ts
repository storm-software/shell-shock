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
import type { ShellShockAPI } from "@shell-shock/core/api";
import type { BaseExecutorResult } from "@storm-software/workspace-tools/types";
import defu from "defu";
import type { LintInlineConfig } from "powerlines/types";
import type { ShellShockExecutorContext } from "../../base/base-executor";
import { withExecutor } from "../../base/base-executor";
import type { LintExecutorSchema } from "./schema";

export async function executorFn(
  context: ShellShockExecutorContext<"lint", LintExecutorSchema>,
  api: ShellShockAPI
): Promise<BaseExecutorResult> {
  await api.lint(
    defu(
      {
        command: "lint",
        entry: context.options.entry,
        skipCache: context.options.skipCache,
        autoInstall: context.options.autoInstall,
        mode: context.options.mode,
        tsconfig: context.options.tsconfig,
        configFile: context.options.configFile,
        logLevel: context.options.logLevel,
        output: {
          outputPath: context.options.outputPath
        }
      },
      context.inlineConfig
    ) as LintInlineConfig
  );

  return {
    success: true
  };
}

const executor: PromiseExecutor<LintExecutorSchema> = withExecutor<
  "lint",
  LintExecutorSchema
>("lint", executorFn);

export default executor;
