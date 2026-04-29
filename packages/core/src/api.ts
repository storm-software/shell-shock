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

import type { PartialKeys } from "@stryke/types";
import type {
  BuildInlineConfig,
  CleanInlineConfig,
  DocsInlineConfig,
  EngineOptions,
  LintInlineConfig,
  PowerlinesAPI,
  PrepareInlineConfig
} from "powerlines";
import { createAPI } from "powerlines";
import { plugin } from "./plugin";

/**
 * The Shell Shock API class.
 *
 * @remarks
 * This class provides methods to interact with the Shell Shock build system, including cleaning, preparing, linting, building, generating documentation, and finalizing projects.
 */
export class ShellShockAPI {
  #powerlines: PowerlinesAPI;

  /**
   * Creates a new instance of the {@link ShellShockAPI} class using the provided configuration options. This method initializes the underlying Powerlines API with the appropriate plugins and settings for Shell Shock.
   *
   * @param options - The user configuration options.
   * @returns A promise that resolves to a {@link ShellShockAPI} instance.
   */
  public static async fromOptions(
    options: EngineOptions
  ): Promise<ShellShockAPI> {
    const powerlines = await createAPI(
      { ...options, framework: "shell-shock" },
      {
        plugins: [plugin()]
      }
    );

    return new ShellShockAPI(powerlines);
  }

  /**
   * Gets the current build context, which includes information about the project, environment, and configuration. This context is used internally by the Shell Shock API to manage the build process and provide relevant data to plugins and other components.
   *
   * @returns The current build context.
   */
  public get context() {
    return this.#powerlines.context;
  }

  private constructor(powerlines: PowerlinesAPI) {
    this.#powerlines = powerlines;
  }

  /**
   * Executes the clean phase of the build process, which typically involves removing generated files and resetting the build environment. The `inlineConfig` parameter allows users to specify additional options or overrides for the clean operation.
   *
   * @param inlineConfig - The inline configuration options for the clean operation.
   * @returns A promise that resolves when the clean operation is complete.
   */
  public async clean(inlineConfig: CleanInlineConfig): Promise<void> {
    return this.#powerlines.clean(inlineConfig);
  }

  /**
   * Executes the prepare phase of the build process, which typically involves setting up the build environment and installing dependencies. The `inlineConfig` parameter allows users to specify additional options or overrides for the prepare operation.
   *
   * @param inlineConfig - The inline configuration options for the prepare operation.
   * @returns A promise that resolves when the prepare operation is complete.
   */
  public async prepare(inlineConfig: PrepareInlineConfig): Promise<void> {
    return this.#powerlines.prepare(inlineConfig);
  }

  /**
   * Executes the lint phase of the build process, which typically involves analyzing code for quality and style issues. The `inlineConfig` parameter allows users to specify additional options or overrides for the lint operation.
   *
   * @param inlineConfig - The inline configuration options for the lint operation.
   * @returns A promise that resolves when the lint operation is complete.
   */
  public async lint(inlineConfig: LintInlineConfig): Promise<void> {
    return this.#powerlines.lint(inlineConfig);
  }

  /**
   * Executes the build phase of the build process, which typically involves compiling source code and generating output artifacts. The `inlineConfig` parameter allows users to specify additional options or overrides for the build operation.
   *
   * @param inlineConfig - The inline configuration options for the build operation.
   * @returns A promise that resolves when the build operation is complete.
   */
  public async build(inlineConfig: BuildInlineConfig): Promise<void> {
    return this.#powerlines.build(inlineConfig);
  }

  /**
   * Executes the documentation generation phase of the build process, which typically involves creating API documentation and other project documentation. The `inlineConfig` parameter allows users to specify additional options or overrides for the documentation operation.
   *
   * @param inlineConfig - The inline configuration options for the documentation operation.
   * @returns A promise that resolves when the documentation generation is complete.
   */
  public async docs(inlineConfig: DocsInlineConfig): Promise<void> {
    return this.#powerlines.docs(inlineConfig);
  }

  /**
   * Executes the finalize phase of the build process, which typically involves cleanup tasks and final reporting. This method should be called after all other build phases have completed.
   *
   * @returns A promise that resolves when the finalize operation is complete.
   */
  public async finalize(): Promise<void> {
    return this.#powerlines.finalize();
  }
}

/**
 * Creates a new {@link ShellShockAPI} instance.
 *
 * @param options - The user configuration options.
 * @returns A promise that resolves to a {@link ShellShockAPI} instance.
 */
export async function createShellShock(
  options: PartialKeys<EngineOptions, "cwd" | "framework">
): Promise<ShellShockAPI> {
  return ShellShockAPI.fromOptions({
    framework: "shell-shock",
    cwd: process.cwd(),
    ...options
  });
}
