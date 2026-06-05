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

import { render } from "@powerlines/plugin-alloy/render";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import { SkillsCommand } from "./components";
import type { SkillsPluginContext, SkillsPluginOptions } from "./types/plugin";

export type * from "./types";

/**
 * The Skills - Shell Shock plugin to add version check functionality and skills commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends SkillsPluginContext = SkillsPluginContext
>(
  options: SkillsPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock/skills",
    config() {
      this.debug(
        "Providing default configuration for the Shell Shock `skills` plugin."
      );

      return {
        skills: defu(
          {
            command: {
              name: isSetString(options.command) ? options.command : "skills"
            }
          },
          options
        )
      };
    },
    async configResolved() {
      this.debug("Adding the CLI skills commands to the application context.");

      if (isSetString(this.config.skills.path)) {
        this.config.skills.path = replacePathTokens(
          this,
          this.config.skills.path
        );
      }

      if (
        !isSetString(this.config.skills.path) ||
        !this.fs.existsSync(this.config.skills.path)
      ) {
        this.warn(
          `The skills directory could not be found at the resolved path: ${
            this.config.skills.path
          }. The \`${
            this.config.skills.command.name
          }\` command will not be added to the application. Please ensure that the skills directory exists at the specified path or adjust the \`skills.path\` option to point to the correct location.`
        );
        return;
      }

      this.inputs ??= [];
      if (
        this.inputs.some(input => input.id === this.config.skills.command.name)
      ) {
        this.info(
          "The `skills` command already exists in the commands list. If you would like the skills command to be managed by the `@shell-shock/plugin-skills` package, please remove or rename the command."
        );
      } else {
        const skillFiles = await this.fs.list(this.config.skills.path);
        if (skillFiles.length > 0) {
          this.inputs.push({
            id: this.config.skills.command.name,
            path: this.config.skills.command.name,
            segments: [this.config.skills.command.name],
            title: "Skills",
            icon: "🕶",
            tags: ["Utility"],
            description: `Display the ${getAppTitle(this)} skills.`,
            entry: {
              file: joinPaths(this.entryPath, "skills", "index.ts"),
              input: {
                file: joinPaths(this.entryPath, "skills", "command.ts")
              }
            },
            virtual: false,
            ...this.config.skills.command
          });

          this.debug(
            "Rendering skills command module for the Shell Shock `skills` plugin."
          );

          const skills = await Promise.all(
            skillFiles.map(async skillFile => [
              skillFile,
              await this.fs.read(skillFile)
            ])
          ).then(files => {
            return files.reduce(
              (ret, [skillFile, file]) => {
                if (isSetString(skillFile) && isSetString(file)) {
                  ret[skillFile.replace(/\.[^/.]+$/, "")] = file;
                }

                return ret;
              },
              {} as Record<string, string>
            );
          });

          await render(this, <SkillsCommand skills={skills} />);
        } else {
          this.warn(
            `The skills directory at the resolved path: ${
              this.config.skills.path
            } could not be read or is empty. The \`${
              this.config.skills.command.name
            }\` command will not be added to the application. Please ensure that the skills directory exists at the specified path and contains valid content.`
          );
        }
      }
    }
  };
};

export default plugin;
