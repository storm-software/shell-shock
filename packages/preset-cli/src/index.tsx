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
import { getCommandList } from "@shell-shock/core/plugin-utils";
import type { ChangelogPluginOptions } from "@shell-shock/plugin-changelog";
import changelog from "@shell-shock/plugin-changelog";
import type { CompletionsPluginOptions } from "@shell-shock/plugin-completions";
import completions from "@shell-shock/plugin-completions";
import console from "@shell-shock/plugin-console";
import help from "@shell-shock/plugin-help";
import prompts from "@shell-shock/plugin-prompts";
import type { SkillsPluginOptions } from "@shell-shock/plugin-skills";
import skills from "@shell-shock/plugin-skills";
import update from "@shell-shock/plugin-update";
import { joinPaths } from "@stryke/path/join";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { existsSync } from "node:fs";
import type { Plugin } from "powerlines";
import { enable } from "powerlines";
import { cliBuiltinsGenerator, cliEntrypointGenerator } from "./generator";
import { getGlobalOptions } from "./helpers/get-global-options";
import type { CLIPresetContext, CLIPresetOptions } from "./types/plugin";

export { cliBuiltinsGenerator, cliEntrypointGenerator } from "./generator";

/**
 * The Shell Shock CLI Preset plugin.
 *
 * @remarks
 * This preset includes a set of built-in modules and commands to create a CLI application, as well as configuration options to customize the generated code. It also includes the `prompts` plugin to provide interactive prompts in the CLI application, and the `update` plugin to manage upgrading the local application's version.
 */
export const plugin = <TContext extends CLIPresetContext = CLIPresetContext>(
  options: CLIPresetOptions = {}
): Plugin<TContext>[] => {
  return [
    ...console<TContext>(options),
    ...help<TContext>(options),
    ...prompts<TContext>(options),
    ...enable(
      changelog<TContext>(options.changelog as ChangelogPluginOptions),
      options.changelog !== false
    ),
    ...enable(
      completions<TContext>(options.completions as CompletionsPluginOptions),
      options.completions !== false
    ),
    ...enable(
      skills<TContext>(options.skills as SkillsPluginOptions),
      options.skills !== false &&
        existsSync(
          isSetObject(options.skills) && options.skills.path
            ? options.skills.path
            : joinPaths(process.cwd(), "skills")
        )
    ),
    update<TContext>(options),
    {
      name: "shell-shock/cli-preset:main",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `cli` preset."
        );

        return {
          globalOptions: getGlobalOptions,
          isCaseSensitive: false,
          ...options,
          env: {
            config: "@shell-shock/plugin-update/types/env#ShellShockUpdateEnv",
            validate: false
          }
        };
      },
      prepare: {
        order: "post",
        async handler() {
          this.debug("Rendering built-in modules via Power Plant.");

          const commands = await getCommandList(this);
          this.debug(
            `Rendering \`banner\` built-ins via Power Plant for each of the ${
              commands.length
            } command modules.`
          );

          return executeCommandGenerator(this, cliBuiltinsGenerator);
        }
      }
    },
    {
      name: "shell-shock/cli-preset:generate-entrypoint",
      prepare: {
        order: "post",
        async handler() {
          this.debug(
            "Rendering entrypoint modules via Power Plant for the Shell Shock `cli` preset."
          );

          return executeCommandGenerator(this, cliEntrypointGenerator);
        }
      }
    }
  ];
};

export default plugin;
