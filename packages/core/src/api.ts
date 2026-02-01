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

import { createPowerlines } from "powerlines";
import type { PowerlinesAPI } from "powerlines/api";
import type {
  BuildInlineConfig,
  CleanInlineConfig,
  DocsInlineConfig,
  LintInlineConfig,
  PluginConfig,
  PrepareInlineConfig
} from "powerlines/types/config";
import { plugin } from "./plugin";
import type { UserConfig } from "./types/config";

/**
 * The Shell Shock API class.
 *
 * @remarks
 * This class provides methods to interact with the Shell Shock build system, including cleaning, preparing, linting, building, generating documentation, and finalizing projects.
 */
export class ShellShockAPI {
  #powerlines: PowerlinesAPI;

  public static async from(config: UserConfig = {}): Promise<ShellShockAPI> {
    const powerlines = await createPowerlines({
      framework: "shell-shock",
      ...config,
      plugins: [plugin(), ...(config.plugins ?? [])] as PluginConfig<any>[]
    });

    return new ShellShockAPI(powerlines);
  }

  private constructor(powerlines: PowerlinesAPI) {
    this.#powerlines = powerlines;
  }

  public async clean(inlineConfig: CleanInlineConfig): Promise<void> {
    return this.#powerlines.clean(inlineConfig);
  }

  public async prepare(inlineConfig: PrepareInlineConfig): Promise<void> {
    return this.#powerlines.prepare(inlineConfig);
  }

  public async lint(inlineConfig: LintInlineConfig): Promise<void> {
    return this.#powerlines.lint(inlineConfig);
  }

  public async build(inlineConfig: BuildInlineConfig): Promise<void> {
    return this.#powerlines.build(inlineConfig);
  }

  public async docs(inlineConfig: DocsInlineConfig): Promise<void> {
    return this.#powerlines.docs(inlineConfig);
  }

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
  options: Partial<UserConfig> = {}
): Promise<ShellShockAPI> {
  options.root ??= process.cwd();

  return ShellShockAPI.from(options);
}
