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

import tsdown from "@powerlines/plugin-tsdown";
import { chmodX } from "@stryke/fs/chmod-x";
import { getUniqueBy } from "@stryke/helpers/get-unique";
import { appendPath } from "@stryke/path/append";
import { findFileName, findFilePath } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { titleCase } from "@stryke/string-format/title-case";
import { isFunction } from "@stryke/type-checks/is-function";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import {
  getCommandsPersistencePath,
  readCommandsPersistence,
  writeCommandsPersistence
} from "./helpers/persistence";
import {
  findCommandName,
  findCommandsRoot,
  reflectCommandTree,
  resolveCommandPath
} from "./helpers/resolve-command";
import { updatePackageJsonBinary } from "./helpers/update-package-json";
import {
  getAppDescription,
  getAppName,
  getAppTitle
} from "./helpers/utilities";
import type { CommandOption } from "./types/command";
import type { Options } from "./types/config";
import type { Context } from "./types/context";

const MAX_DEPTH = 50;

/**
 * The core Powerlines plugin to build Shell Shock projects.
 */
export const shellShock = <TContext extends Context = Context>(
  options: Options = {}
) => {
  return [
    tsdown(),
    {
      name: "shell-shock:config",
      async config() {
        this.trace("Resolving the Shell Shock configuration.");

        return defu(options, {
          entry:
            !this.config.entry ||
            (Array.isArray(this.config.entry) && this.config.entry.length === 0)
              ? [joinPaths(this.config.sourceRoot, "**/*")]
              : undefined,
          build: {
            target: "node22",
            platform: "node"
          },
          type: "application",
          framework: "shell-shock"
        });
      },
      configResolved: {
        order: "pre",
        async handler() {
          this.trace("Shell Shock configuration has been resolved.");

          await updatePackageJsonBinary(this);

          this.config.name = getAppName(this);
          this.config.title = getAppTitle(this);
          this.config.description = getAppDescription(this);

          if (this.config.defaultOptions === false) {
            this.options = [];
          } else if (Array.isArray(this.config.defaultOptions)) {
            this.options = getUniqueBy(
              this.config.defaultOptions,
              (item: CommandOption) => item.name
            );
          } else if (isFunction(this.config.defaultOptions)) {
            this.options = getUniqueBy(
              this.config.defaultOptions(this, {
                id: null,
                name: this.config.name,
                title: this.config.title,
                description: this.config.description,
                path: [],
                isVirtual: false
              }),
              (item: CommandOption) => item.name
            );
          }

          this.inputs ??= [];
        }
      }
    },
    {
      name: "shell-shock:inputs",
      async configResolved() {
        this.trace("Finding command entry points.");

        this.commandsPath = findCommandsRoot(this);
        this.inputs = this.entry
          .filter(
            entry =>
              findFileName(entry.file, { withExtension: false }) === "command"
          )
          .reduce((ret, entry) => {
            const file = appendPath(
              appendPath(entry.file, this.config.projectRoot),
              this.workspaceConfig.workspaceRoot
            );
            if (!isParentPath(file, this.commandsPath)) {
              throw new Error(
                `Command entry point "${file}" is not located within the commands root "${this.commandsPath}". Please ensure that all command entry points are located within the current project.`
              );
            }

            const path = resolveCommandPath(this, file);
            const id = path.replaceAll("/", "-");

            if (!ret.some(existing => existing.id === id)) {
              const name = findCommandName(file);

              ret.push({
                id,
                path: path.split("/").filter(Boolean),
                name,
                title: titleCase(name),
                isVirtual: false,
                entry: {
                  ...entry,
                  file,
                  input: {
                    file: entry.file,
                    name: entry.name
                  },
                  output: name
                }
              });
            }

            return ret;
          }, this.inputs);
      }
    },
    {
      name: "shell-shock:virtual-inputs",
      configResolved: {
        order: "post",
        async handler() {
          if (this.inputs.length === 0) {
            this.warn(
              "No commands were found in the project. Please ensure at least one command exists."
            );
          } else {
            this.info(
              `Shell Shock will create an application with the following commands: \n${this.inputs
                .filter(cmd => !cmd.isVirtual)
                .map(
                  command =>
                    ` - ${command.id}: ${replacePath(
                      command.entry.file,
                      this.commandsPath
                    )}${command.isVirtual ? " (virtual)" : ""}`
                )
                .join("\n")}`
            );

            this.trace(
              "Finding and adding virtual command inputs for each command previously found."
            );

            this.inputs = this.inputs
              .reduce((ret, command) => {
                let depth = 0;

                let parentPath = resolveParentPath(
                  findFilePath(command.entry.file)
                );
                while (parentPath !== this.commandsPath) {
                  if (depth++ > MAX_DEPTH) {
                    throw new Error(
                      `Maximum command virtual parent depth of ${MAX_DEPTH} exceeded while processing command: ${command.name}`
                    );
                  }

                  if (
                    !ret.some(
                      existing =>
                        findFilePath(existing.entry.file) === parentPath
                    )
                  ) {
                    const file = joinPaths(parentPath, "command.ts");
                    const path = resolveCommandPath(this, file);
                    const id = path.replaceAll("/", "-");
                    if (!ret.some(existing => existing.id === id)) {
                      const name = findCommandName(file);

                      ret.push({
                        id,
                        path: path.split("/").filter(Boolean),
                        name,
                        title: titleCase(name),
                        isVirtual: true,
                        entry: {
                          file,
                          input: {
                            file
                          }
                        }
                      });
                    }
                  }

                  parentPath = resolveParentPath(parentPath);
                }

                return ret;
              }, this.inputs)
              .sort((a, b) => a.path.length - b.path.length);

            this.trace(
              `Final command input list: \n${this.inputs
                .map(
                  command =>
                    ` - ${command.id}: ${replacePath(
                      command.entry.file,
                      this.commandsPath
                    )}${command.isVirtual ? " (virtual)" : ""}`
                )
                .join("\n")}`
            );
          }
        }
      }
    },
    {
      name: "shell-shock:reflect-commands",
      async prepare() {
        this.entry = [];
        this.commands = {};

        if (
          this.config.command !== "prepare" &&
          this.config.skipCache !== true &&
          this.persistedMeta?.checksum === this.meta.checksum &&
          this.fs.existsSync(getCommandsPersistencePath(this))
        ) {
          this.debug(
            `Skipping reflection initialization as the meta checksum has not changed.`
          );

          await readCommandsPersistence(this);
        } else {
          for (const input of this.inputs.filter(
            input => input.path.length === 1
          )) {
            this.commands[input.name] = await reflectCommandTree(this, input);
          }

          await writeCommandsPersistence(this);
        }
      }
    },
    {
      name: "shell-shock:chmod+x",
      async buildEnd() {
        if (!isSetObject(this.packageJson.bin)) {
          this.warn(
            "No binaries were found in package.json. Please ensure the binaries are correctly configured."
          );
          return;
        }

        this.debug("Adding executable permissions to binaries.");

        for (const executablePath of Object.values(this.packageJson.bin)) {
          if (
            this.fs.existsSync(
              appendPath(executablePath, this.config.output.buildPath)
            )
          ) {
            await chmodX(
              appendPath(executablePath, this.config.output.buildPath)
            );
          }
        }
      }
    }
  ] as Plugin<TContext>[];
};

export default shellShock;
