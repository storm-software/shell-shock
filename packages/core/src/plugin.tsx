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
import { isObject } from "@stryke/type-checks/is-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import { tsdown } from "powerlines/tsdown";
import { resolveInputs } from "powerlines/utils";
import type { BuildContext, RolldownChunk, TsdownHooks } from "tsdown";
import { CommandDocsFile } from "./components/docs";
import { UtilsBuiltin } from "./components/utils-builtin";
import { commands } from "./helpers/automd";
import {
  findCommandsRoot,
  resolveCommandId,
  resolveCommandName,
  resolveCommandPath
} from "./helpers/paths";
import {
  getCommandsPersistencePath,
  readCommandsPersistence,
  writeCommandsPersistence
} from "./helpers/persistence";
import {
  formatBinaryPath,
  updatePackageJsonBinary
} from "./helpers/update-package-json";
import { formatCommandTree, getGlobalOptions } from "./helpers/utilities";
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
import { resolve } from "./resolver/resolve";
import type { CommandOption, CommandTree } from "./types/command";
import { CommandParameterKinds } from "./types/command";
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
              path: joinPaths(this.config.root, "dist")
            }
          },
          options,
          {
            name: getAppName(this),
            title: getAppTitle(this),
            description: getAppDescription(this),
            platform: "node",
            projectType: "application",
            framework: "shell-shock",
            isCaseSensitive: false,
            output: {
              format: "esm",
              dts: false
            },
            input:
              !this.config.input ||
              (Array.isArray(this.config.input) &&
                this.config.input.length === 0) ||
              (isObject(this.config.input) &&
                Object.keys(this.config.input).length === 0)
                ? [
                    joinPaths(this.config.root, "src/**/command.ts"),
                    joinPaths(this.config.root, "src/**/command.tsx")
                  ]
                : undefined,
            resolve: {
              external: ["@powerlines/deepkit"],
              skipNodeModulesBundle: true
            },
            tsdown: {
              dts: false,
              nodeProtocol: true,
              unbundle: false
            }
          }
        );

        return result;
      },
      configResolved: {
        order: "pre",
        async handler() {
          this.debug("Shell Shock configuration has been resolved.");

          this.config.appSpecificEnvPrefix = isSetString(
            this.config.autoAssignEnv
          )
            ? this.config.autoAssignEnv
            : constantCase(getAppName(this));
          if (
            !this.config.env.prefix ||
            !Array.isArray(this.config.env.prefix)
          ) {
            this.config.env.prefix = toArray(this.config.env.prefix);
          }

          if (
            !this.config.env.prefix.includes(this.config.appSpecificEnvPrefix)
          ) {
            this.config.env.prefix.push(this.config.appSpecificEnvPrefix);
          }

          this.config.bin = (isSetString(this.packageJson.bin)
            ? { [kebabCase(this.config.name)]: this.packageJson.bin }
            : this.packageJson.bin) ?? {
            [kebabCase(this.config.name)]: formatBinaryPath(
              this.config.output.format
            )
          };

          if (isSetString(this.config.reference)) {
            if (this.config.reference.includes("{command}")) {
              this.config.reference = {
                app: this.config.reference
                  .substring(0, this.config.reference.indexOf("{command}"))
                  .replace(/\/?$/, "/"),
                commands: this.config.reference
              };
            } else if (this.config.reference.includes("{commands}")) {
              this.config.reference = {
                app: this.config.reference
                  .substring(0, this.config.reference.indexOf("{commands}"))
                  .replace(/\/?$/, "/"),
                commands: this.config.reference
              };
            } else {
              this.config.reference = {
                app: this.config.reference
              };
            }
          }

          this.inputs ??= [];
          this.options = Object.values(
            getGlobalOptions(this, {
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

        this.debug(
          `Checking for commands using input: ${JSON.stringify(this.config.input)}`
        );

        this.commandsPath = await findCommandsRoot(this);
        this.debug(`Resolved commands root path: ${this.commandsPath}`);

        const inputs = await resolveInputs(this, this.config.input);

        this.debug(
          `Found ${
            inputs.length
          } entry points specified in the configuration options.`
        );

        this.inputs = inputs.reduce((ret, entry) => {
          if (
            entry.file !== this.commandsPath &&
            !isParentPath(entry.file, this.commandsPath)
          ) {
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
              tags: [],
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
      types() {
        this.debug(
          "Generating type definitions for the Shell Shock application."
        );

        return `
/**
 * The global options available for every command in the ${getAppTitle(
   this,
   true
 )} command-line application.
 */
export interface GlobalOptions {
  ${this.options
    .map(
      option =>
        `${
          option.description
            ? `
/**
 * ${option.description}${
   option.default
     ? `
 *
 * @defaultValue ${
   option.kind === CommandParameterKinds.string
     ? `"${option.default}"`
     : option.default
 }`
     : ""
 }
 */
`
            : ""
        }${option.name}${option.optional ? "?" : ""}: ${
          option.kind === CommandParameterKinds.boolean
            ? "boolean"
            : `${option.variadic ? "(" : ""}${
                option.choices
                  ? option.choices
                      .map(choice =>
                        option.kind === CommandParameterKinds.number
                          ? `${choice}`
                          : `"${choice}"`
                      )
                      .join(" | ")
                  : option.kind === CommandParameterKinds.number
                    ? "number"
                    : "string"
              }${option.variadic ? ")[]" : ""}`
        };${
          option.alias && option.alias.length > 0
            ? option.alias
                .map(
                  alias =>
                    `${alias}${option.optional ? "?" : ""}: ${
                      option.kind === CommandParameterKinds.boolean
                        ? "boolean"
                        : `${option.variadic ? "(" : ""}${
                            option.choices
                              ? option.choices
                                  .map(choice =>
                                    option.kind === CommandParameterKinds.number
                                      ? `${choice}`
                                      : `"${choice}"`
                                  )
                                  .join(" | ")
                              : option.kind === CommandParameterKinds.number
                                ? "number"
                                : "string"
                          }${option.variadic ? ")[]" : ""}`
                    };`
                )
                .join("\n\n")
            : ""
        }`
    )
    .join("\n\n")}
}
`;
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
                          tags: [],
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
                    ` - ${command.id}: ${
                      isParentPath(command.entry.file, this.commandsPath)
                        ? replacePath(command.entry.file, this.commandsPath)
                        : replacePath(command.entry.file, this.config.root)
                    }${command.isVirtual ? " (virtual)" : ""}`
                )
                .join("\n")}`
            );
          }
        }
      }
    },
    {
      name: "shell-shock:resolve-commands",
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
              `Skipping command resolution as the meta checksum has not changed.`
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
              this.commands[input.name] = await resolve({
                context: this,
                command: input
              });
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
        this.config.tsdown.hooks ??= {} as TsdownHooks;
        (this.config.tsdown.hooks as TsdownHooks)["build:done"] = async (
          _: BuildContext & {
            chunks: RolldownChunk[];
          }
        ) => {
          await Promise.all(
            Object.values(this.config.bin).map(async bin => {
              const path = appendPath(
                bin,
                joinPaths(this.workspaceConfig.workspaceRoot, this.config.root)
              );
              if (this.fs.existsSync(path)) {
                this.debug(
                  `Adding hashbang to binary executable output file: ${path}`
                );

                const content = await this.fs.read(path);
                if (content && !content.startsWith("#!")) {
                  await this.fs.write(
                    path,
                    `#!/usr/bin/env ${
                      this.config.mode === "development"
                        ? "-S NODE_OPTIONS=--enable-source-maps"
                        : ""
                    } node\n\n${content}`
                  );
                }

                this.debug(
                  `Adding executable permissions (chmod+x) to binary executable output file: ${
                    path
                  }`
                );

                await chmodX(path);
              } else {
                this.warn(
                  `Expected binary output file not found at path: ${
                    path
                  }. Skipping adding hashbang and executable permissions (chmod+x).`
                );
              }
            })
          );
        };
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
