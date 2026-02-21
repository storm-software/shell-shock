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

import { For, Show } from "@alloy-js/core/components";
import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import deepkit from "@powerlines/plugin-deepkit";
import nodejs from "@powerlines/plugin-nodejs";
import tsdown from "@powerlines/plugin-tsdown";
import { toArray } from "@stryke/convert/to-array";
import { chmodX } from "@stryke/fs/chmod-x";
import { appendPath } from "@stryke/path/append";
import { findFilePath, relativePath } from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import { resolveEntries } from "powerlines/lib/entry";
import type { OutputOptions, RenderedChunk } from "rolldown";
import { CommandDocsFile } from "./components/docs";
import { UtilsBuiltin } from "./components/utils-builtin";
import { commands } from "./helpers/automd";
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
import {
  formatBinaryPath,
  updatePackageJsonBinary
} from "./helpers/update-package-json";
import { formatCommandTree, getDefaultOptions } from "./helpers/utilities";
import { validateCommand } from "./helpers/validations";
import {
  getAppDescription,
  getAppName,
  getAppTitle,
  getDynamicPathSegmentName,
  isDynamicPathSegment,
  isPathSegmentGroup
} from "./plugin-utils/context-helpers";
import { getCommandTree } from "./plugin-utils/get-command-tree";
import { traverseCommands } from "./plugin-utils/traverse-command-tree";
import type { CommandOption, CommandTree } from "./types/command";
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
    deepkit(),
    automd(),
    {
      name: "shell-shock:config",
      async config() {
        this.debug("Resolving the Shell Shock configuration.");

        await updatePackageJsonBinary(this);

        const result = defu(
          {
            output: {
              buildPath: joinPaths(this.config.projectRoot, "dist")
            }
          },
          options,
          {
            name: getAppName(this),
            title: getAppTitle(this),
            description: getAppDescription(this),
            envPrefix: constantCase(getAppName(this)),
            env: {
              prefix: [] as string[]
            },
            isCaseSensitive: false,
            output: {
              format: "esm",
              dts: true
            },
            entry:
              !this.config.entry ||
              (Array.isArray(this.config.entry) &&
                this.config.entry.length === 0)
                ? [
                    joinPaths(this.config.sourceRoot, "**/*.ts"),
                    joinPaths(this.config.sourceRoot, "**/*.tsx")
                  ]
                : undefined,
            build: {
              dts: false,
              platform: "node",
              nodeProtocol: true,
              unbundle: false,
              noExternal: ["@powerlines/deepkit"]
            },
            type: "application",
            framework: "shell-shock"
          }
        );

        if (!result.env.prefix || !Array.isArray(result.env.prefix)) {
          result.env.prefix = toArray(result.env.prefix);
        }
        if (!result.env.prefix.includes(result.envPrefix)) {
          result.env.prefix.push(result.envPrefix);
        }

        return result;
      },
      configResolved: {
        order: "pre",
        async handler() {
          this.debug("Shell Shock configuration has been resolved.");

          this.config.bin = (isSetString(this.packageJson.bin)
            ? { [kebabCase(this.config.name)]: this.packageJson.bin }
            : this.packageJson.bin) ?? {
            [kebabCase(this.config.name)]: formatBinaryPath(
              this.config.output.format
            )
          };

          this.inputs ??= [];
          this.options = Object.values(
            getDefaultOptions(this, {
              id: null,
              name: this.config.name,
              path: null,
              segments: [],
              title: this.config.title,
              description: this.config.description,
              alias: [],
              isVirtual: false
            })
          );
        }
      }
    },
    ...nodejs<TContext>(
      defu(options ?? {}, {
        env: {
          types: "@shell-shock/core/types/env#ShellShockEnv",
          validate: false
        }
      })
    ),
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
            const name = resolveCommandName(entry.file);
            let segments = resolveCommandPath(this, entry.file)
              .split("/")
              .filter(Boolean);

            // Ensure unique segment names by appending an index suffix to duplicates
            segments = segments.map((segment, index) => {
              const found = segments.findIndex(
                existing => existing === segment
              );
              if (found !== -1 && found !== index) {
                segment += `_${
                  segments.filter(
                    segment =>
                      isDynamicPathSegment(segment) &&
                      getDynamicPathSegmentName(segment).replace(
                        /_\d+$/,
                        ""
                      ) === segment
                  ).length
                }`;
              }

              return segment;
            });

            ret.push({
              id,
              path: segments.join("/"),
              segments,
              name,
              alias: [],
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
      },
      async prepare() {
        this.debug(
          "Rendering base built-in modules for the Shell Shock application."
        );

        return render(
          this,
          <>
            <UtilsBuiltin />
          </>
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
                    ` - ${command.id}: ${
                      isParentPath(command.entry.file, this.commandsPath)
                        ? replacePath(command.entry.file, this.commandsPath)
                        : relativePath(command.entry.file, this.commandsPath)
                    }${command.isVirtual ? " (virtual)" : ""}`
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
                if (isParentPath(parentPath, this.commandsPath)) {
                  while (parentPath !== this.commandsPath) {
                    if (depth++ > MAX_DEPTH) {
                      throw new Error(
                        `Unable to process virtual commands for ${command.name} \n\nPlease ensure ${command.entry.file} is a valid command entry file and does not have an invalid path.`
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

                        let segments = resolveCommandPath(this, file)
                          .split("/")
                          .filter(Boolean);

                        // Ensure unique segment names by appending an index suffix to duplicates
                        segments = segments.map((segment, index) => {
                          const found = segments.findIndex(
                            existing => existing === segment
                          );
                          if (found !== -1 && found !== index) {
                            segment += `_${
                              segments.filter(
                                segment =>
                                  isDynamicPathSegment(segment) &&
                                  getDynamicPathSegmentName(segment).replace(
                                    /_\d+$/,
                                    ""
                                  ) === segment
                              ).length
                            }`;
                          }

                          return segment;
                        });

                        ret.push({
                          id,
                          path: segments.join("/"),
                          segments,
                          name,
                          alias: [],
                          isVirtual: true,
                          entry: {
                            file
                          }
                        });
                      }
                    }

                    parentPath = resolveParentPath(parentPath);
                  }
                }

                return ret;
              }, this.inputs)
              .sort((a, b) => a.segments.length - b.segments.length);

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
                input.segments.filter(
                  segment =>
                    !isDynamicPathSegment(segment) &&
                    !isPathSegmentGroup(segment)
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
      configResolved() {
        this.config.build.outputOptions ??= {} as OutputOptions;
        (this.config.build.outputOptions as OutputOptions).banner = (
          chunk: RenderedChunk
        ) => {
          if (
            chunk.isEntry &&
            joinPaths(this.entryPath, "bin.ts") === chunk.facadeModuleId
          ) {
            this.debug(
              `Adding hashbang to binary executable output file: ${chunk.fileName}`
            );

            return `#!/usr/bin/env ${
              this.config.mode === "development"
                ? "-S NODE_OPTIONS=--enable-source-maps"
                : ""
            } node\n`;
          }
          return "";
        };
      },
      async buildEnd() {
        if (!isSetObject(this.config.bin)) {
          this.warn(
            `No binaries were found for the ${
              this.config.name
            } application. Please ensure the binaries are correctly configured in your Shell Shock configuration or package.json.`
          );
        } else {
          await Promise.all(
            Object.values(this.config.bin).map(async bin => {
              const path = appendPath(
                bin,
                joinPaths(
                  this.workspaceConfig.workspaceRoot,
                  this.config.projectRoot
                )
              );

              if (this.fs.existsSync(path)) {
                this.debug(
                  `Adding executable permissions (chmod+x) to binary executable output file: ${path}`
                );

                await chmodX(path);
              } else {
                this.warn(
                  `Unable to locate the binary executable output file: ${path}. This may indicate either a misconfiguration in the package.json file or an issue with the build process.`
                );
              }
            })
          );
        }
      }
    },
    {
      name: "shell-shock:docs",
      configResolved() {
        this.config.automd ??= {};
        this.config.automd.generators = {
          ...(this.config.automd.generators ?? {}),
          commands: commands(this)
        };
      },
      async docs() {
        this.debug(
          "Rendering entrypoint modules for the Shell Shock `script` preset."
        );

        const commands = this.inputs
          .map(input => getCommandTree(this, input.segments))
          .filter(Boolean) as CommandTree[];

        return render(
          this,
          <For each={Object.values(commands)} doubleHardline>
            {child => (
              <Show when={!child.isVirtual}>
                <CommandDocsFile command={child} />
              </Show>
            )}
          </For>
        );
      }
    }
  ] as Plugin<TContext>[];
};

export { plugin as shellShock };
export default plugin;
