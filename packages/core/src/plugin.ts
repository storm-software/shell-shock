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

import nodejs from "@powerlines/plugin-nodejs";
import tsdown from "@powerlines/plugin-tsdown";
import { toArray } from "@stryke/convert/to-array";
import { chmodX } from "@stryke/fs/chmod-x";
import { appendPath } from "@stryke/path/append";
import { findFilePath } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import { resolveEntries } from "powerlines/lib/entry";
import { writeHashbang } from "./helpers/hashbang";
import {
  getCommandsPersistencePath,
  readCommandsPersistence,
  writeCommandsPersistence
} from "./helpers/persistence";
import {
  findCommandsRoot,
  reflectCommandTree,
  resolveCommandId,
  resolveCommandName,
  resolveCommandPath
} from "./helpers/resolve-command";
import { updatePackageJsonBinary } from "./helpers/update-package-json";
import { formatCommandTree, getDefaultOptions } from "./helpers/utilities";
import { validateCommand } from "./helpers/validations";
import {
  getAppDescription,
  getAppName,
  getAppTitle,
  isVariableCommandPath
} from "./plugin-utils/context-helpers";
import { traverseCommands } from "./plugin-utils/traverse-command-tree";
import type { CommandOption } from "./types/command";
import type { Options } from "./types/config";
import type { Context } from "./types/context";

const MAX_DEPTH = 50;

/**
 * The core Powerlines plugin to build Shell Shock projects.
 */
export const plugin = <TContext extends Context = Context>(
  options: Options = {}
) => {
  return [
    tsdown(),
    {
      name: "shell-shock:config",
      async config() {
        this.debug("Resolving the Shell Shock configuration.");

        await updatePackageJsonBinary(this);

        const result = defu(options, {
          name: getAppName(this),
          title: getAppTitle(this),
          description: getAppDescription(this),
          envPrefix: constantCase(getAppName(this)),
          env: {
            prefix: [] as string[]
          },
          automd: {
            generators: {}
          },
          isCaseSensitive: false,
          output: {
            dts: true,
            format: "esm"
          },
          entry:
            !this.config.entry ||
            (Array.isArray(this.config.entry) && this.config.entry.length === 0)
              ? [
                  joinPaths(this.config.sourceRoot, "**/*.ts"),
                  joinPaths(this.config.sourceRoot, "**/*.tsx")
                ]
              : undefined,
          build: {
            platform: "node",
            nodeProtocol: true,
            unbundle: false
          },
          type: "application",
          framework: "shell-shock"
        });
        if (!result.env.prefix.includes(result.envPrefix)) {
          result.env.prefix.push(result.envPrefix);
        }

        return result;
      },
      configResolved: {
        order: "pre",
        async handler() {
          this.debug("Shell Shock configuration has been resolved.");

          this.inputs ??= [];
          this.options = Object.values(
            getDefaultOptions(this, {
              id: null,
              name: this.config.name,
              title: this.config.title,
              description: this.config.description,
              path: {
                value: null,
                segments: []
              },
              isVirtual: false
            })
          );
        }
      }
    },
    ...nodejs<TContext>(),
    {
      name: "shell-shock:inputs",
      async configResolved() {
        this.debug("Finding command entry point files.");

        this.commandsPath = findCommandsRoot(this);

        const entries = await resolveEntries(
          this,
          toArray(this.config.entry || [])
        );
        this.debug(
          `Found ${
            entries.length
          } entry points specified in the configuration options.`
        );

        this.inputs = entries.reduce((ret, entry) => {
          if (!isParentPath(entry.file, this.commandsPath)) {
            throw new Error(
              `Command entry point "${
                entry.file
              }" is not located within the commands root "${
                this.commandsPath
              }". Please ensure that all command entry points are located within the current project.`
            );
          }

          const id = resolveCommandId(this, entry.file);
          if (!ret.some(existing => existing.id === id)) {
            const path = resolveCommandPath(this, entry.file);
            const name = resolveCommandName(entry.file);

            ret.push({
              id,
              path: {
                value: path,
                segments: path.split("/").filter(Boolean)
              },
              name,
              isVirtual: false,
              entry: {
                ...entry,
                file: entry.file,
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

        this.debug(
          `Shell Shock will process ${
            this.inputs.length
          } command entry files: \n${this.inputs
            .map(
              command =>
                ` - ${command.id}: ${replacePath(
                  command.entry.file,
                  this.commandsPath
                )}`
            )
            .join("\n")}`
        );
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
            this.debug(
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

            this.debug(
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
                      `Maximum command virtual parent depth of ${
                        MAX_DEPTH
                      } exceeded while processing command: ${command.name}`
                    );
                  }

                  if (
                    !ret.some(
                      existing =>
                        findFilePath(existing.entry.file) === parentPath
                    )
                  ) {
                    const file = joinPaths(parentPath, "command.ts");
                    const id = resolveCommandId(this, file);
                    if (!ret.some(existing => existing.id === id)) {
                      const name = resolveCommandName(file);
                      const path = resolveCommandPath(this, file);

                      ret.push({
                        id,
                        path: {
                          value: path,
                          segments: path.split("/").filter(Boolean)
                        },
                        name,
                        isVirtual: true,
                        entry: {
                          file
                        }
                      });
                    }
                  }

                  parentPath = resolveParentPath(parentPath);
                }

                return ret;
              }, this.inputs)
              .sort((a, b) => a.path.segments.length - b.path.segments.length);

            this.debug(
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
      prepare: {
        order: "post",
        async handler() {
          this.debug("Initializing the CLI application's command tree.");
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
              input =>
                input.path.segments.filter(
                  segment => !isVariableCommandPath(segment)
                ).length === 1
            )) {
              this.commands[input.name] = await reflectCommandTree(this, input);
            }

            this.debug("Post-processing commands to ensure proper reflection.");

            this.options = this.options.map(
              option =>
                ({
                  ...option,
                  name: camelCase(option.name),
                  alias: option.alias ?? [],
                  optional: option.optional ?? false
                }) as CommandOption
            );

            await traverseCommands(this, command => {
              command.options = Object.fromEntries(
                Object.entries(command.options).map(([name, option]) => [
                  camelCase(name),
                  {
                    ...option,
                    name: camelCase(name),
                    alias: option.alias ?? [],
                    optional: option.optional ?? false
                  } as CommandOption
                ])
              );
            });

            await writeCommandsPersistence(this);
          }

          this.debug("Validating the CLI applications command tree.");

          let isValid = true;
          await traverseCommands(this, command => {
            const failures = validateCommand(command);
            if (failures.length > 0) {
              this.error(
                `Found ${failures.length} issue${failures.length > 1 ? "s" : ""} with the ${
                  command.title
                } command: \n${failures
                  .map(failure => ` - ${failure.code}: ${failure.details}`)
                  .join("\n")}\n`
              );
              isValid = false;
            }
          });
          if (!isValid) {
            throw new Error(
              `One or more commands in the command tree are invalid. Please review the errors above and correct them before proceeding.`
            );
          }

          this.info(
            `\nCreating an application with the following command tree: \n${formatCommandTree(
              this
            )}\n`
          );
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

        await Promise.all(
          Object.values(this.packageJson.bin).map(async executablePath => {
            if (
              this.fs.existsSync(
                appendPath(executablePath, this.config.output.buildPath)
              )
            ) {
              this.debug(
                `Adding hashbang and executable permissions to binary output file: ${appendPath(
                  executablePath,
                  this.config.output.buildPath
                )}`
              );

              await writeHashbang(
                this,
                appendPath(executablePath, this.config.output.buildPath)
              );

              await chmodX(
                appendPath(executablePath, this.config.output.buildPath)
              );
            } else {
              this.warn(
                `Unable to locate the binary output file: ${appendPath(
                  executablePath,
                  this.config.output.buildPath
                )}. This may indicate either a misconfiguration in the package.json file or an issue with the build process.`
              );
            }
          })
        );
      }
    }
  ] as Plugin<TContext>[];
};

export { plugin as shellShock };
export default plugin;
