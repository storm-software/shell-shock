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

import { For, Show } from "@alloy-js/core";
import { render } from "@powerlines/plugin-alloy/render";
import automd from "@powerlines/plugin-automd";
import { extractEnv, writeEnv } from "@powerlines/plugin-env/helpers/schema";
import nodejs from "@powerlines/plugin-nodejs";
import tsdown from "@powerlines/plugin-tsdown";
import {
  addProperty,
  getCacheFilePath,
  getProperties,
  isJsonSchemaObject
} from "@powerlines/schema";
import { toArray } from "@stryke/convert/to-array";
import { chmodX } from "@stryke/fs/chmod-x";
import { appendPath } from "@stryke/path/append";
import { findFilePath } from "@stryke/path/find";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { camelCase } from "@stryke/string-format/camel-case";
import { constantCase } from "@stryke/string-format/constant-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isObject } from "@stryke/type-checks/is-object";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { defu } from "defu";
import type { Plugin } from "powerlines";
import { isFileReference } from "powerlines";
import { resolveInputs } from "powerlines/utils";
import type { BuildContext, RolldownChunk, TsdownHooks } from "tsdown";
import { CommandDocsFile } from "./components/docs";
import { ExecBuiltin } from "./components/exec-builtin";
import { StateBuiltin } from "./components/state-builtin";
import { UtilsBuiltin } from "./components/utils-builtin";
import { commands } from "./helpers/automd";
import { getFramework } from "./helpers/get-framework";
import {
  findCommandsRoot,
  resolveCommandId,
  resolveCommandName,
  resolveCommandPath
} from "./helpers/paths";
import { writeCommandsPersistence } from "./helpers/persistence";
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
import type { CommandTree } from "./types/command";
import type { Options } from "./types/config";
import type { Context } from "./types/context";

const MAX_DEPTH = 50;

/**
 * The core Powerlines plugin to build Shell Shock projects.
 */
export const plugin = <TContext extends Context = Context>(
  options: Options = {}
): Plugin<TContext>[] => {
  return [
    tsdown<TContext>(),
    automd<TContext>(),
    {
      name: "shell-shock/core:config",
      async config() {
        this.debug("Resolving the Shell Shock configuration.");

        const result = defu(options, {
          name: getAppName(this as TContext),
          title: getAppTitle(this as TContext),
          description: getAppDescription(this as TContext),
          platform: "node",
          projectType: "application",
          framework: getFramework(),
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
              ? ["src/**/command.ts", "src/**/command.tsx"]
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
        });

        return result;
      },
      configResolved: {
        order: "pre",
        async handler() {
          this.debug("Shell Shock configuration has been resolved.");

          await updatePackageJsonBinary(this);

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

          if (isSetString(this.config.docs)) {
            const docsWithoutCommandPath = this.config.docs.replace(
              /\/?\{(?:command|cmd)\}.*$/,
              ""
            );

            this.config.docs = {
              commands: this.config.docs,
              app: this.config.docs.endsWith("/")
                ? docsWithoutCommandPath.endsWith("/")
                  ? docsWithoutCommandPath
                  : `${docsWithoutCommandPath}/`
                : docsWithoutCommandPath
            };
          }

          this.inputs ??= [];
          this.globalOptions = Object.values(
            getGlobalOptions(this, {
              id: null,
              name: this.config.name,
              path: null,
              segments: [],
              title: this.config.title,
              description: this.config.description,
              alias: [],
              virtual: false
            })
          );

          this.globalOptions = this.globalOptions.map(option => ({
            ...option,
            name: camelCase(option.name),
            alias: option.alias ?? [],
            required: option.required ?? true
          }));
        }
      }
    },
    ...nodejs<TContext>(
      defu(options ?? {}, {
        env: {
          config: "@shell-shock/core/types/env#ShellShockEnv",
          validate: false
        }
      })
    ),
    {
      name: "shell-shock/core:inputs",
      async configResolved() {
        const toInputLocation = (value: unknown): string | null => {
          if (isSetString(value)) {
            return value;
          }

          if (isSetObject(value) && isFileReference(value)) {
            return String(value.file);
          }

          return null;
        };

        const configuredInputs: string[] = [];

        if (Array.isArray(this.config.input)) {
          configuredInputs.push(
            ...this.config.input
              .map(toInputLocation)
              .filter((value): value is string => isSetString(value))
          );
        } else if (isSetString(this.config.input)) {
          configuredInputs.push(this.config.input);
        } else if (
          isSetObject(this.config.input) &&
          isFileReference(this.config.input)
        ) {
          configuredInputs.push(String(this.config.input.file));
        } else if (isSetObject(this.config.input)) {
          configuredInputs.push(
            ...Object.values(this.config.input)
              .map(toInputLocation)
              .filter((value): value is string => isSetString(value))
          );
        }

        this.debug(
          configuredInputs.length <= 1
            ? `Checking for command modules in the following location: ${
                configuredInputs[0] ?? "(none configured)"
              }.`
            : `Checking for command modules in the following locations:\n${configuredInputs
                .map(input => ` - ${input}`)
                .join("\n")}`
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
              virtual: false,
              entry: {
                ...entry,
                input: {
                  file: entry.file,
                  export: entry.export
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
            <StateBuiltin />
            <UtilsBuiltin />
            <ExecBuiltin />
          </>
        );
      }
    },
    {
      name: "shell-shock/core:virtual-inputs",
      configResolved: {
        order: "post",
        async handler() {
          if (this.inputs.length === 0) {
            this.warn(
              "No commands were found in the project. Please ensure at least one command exists."
            );
          } else {
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
                        `Unable to process virtual commands for ${
                          command.name
                        } \n\nPlease ensure ${
                          command.entry.file
                        } is a valid command entry file and does not have an invalid path.`
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
                          virtual: true,
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
                    ` - ${command.id}${command.virtual ? " (virtual)" : ""}`
                )
                .join("\n")}`
            );
          }
        }
      }
    },
    {
      name: "shell-shock/core:update-env",
      configResolved: {
        order: "post",
        async handler() {
          this.debug(
            "Adding global options to the CLI application's environment variables."
          );

          if (!this.env.config) {
            this.debug(
              "Environment variable schema not found in plugin context. Extracting environment variable schema from type definitions provided in plugin options."
            );

            await extractEnv(this);
            if (!this.env.config) {
              throw new Error(
                "Failed to extract environment variable schema from type definitions provided in plugin options. Please ensure the `env.types` option is correctly specified and points to a valid TypeScript type definition file."
              );
            }
          }

          if (!isJsonSchemaObject(this.env.config.schema)) {
            throw new Error("Invalid environment variable schema extracted.");
          }

          const env = getProperties(this.env.config);
          for (const option of Object.values(this.globalOptions)
            .filter(option => Boolean(option.env))
            .filter(option => isSetString(option.env) && !env[option.env])) {
            addProperty(this.env.config, option.env as string, {
              ...option,
              name: option.env as string,
              alias: option.alias
                .filter(alias => alias.length > 1)
                .map(alias => constantCase(alias))
            });
          }

          await writeEnv(this);
        }
      }
    },
    {
      name: "shell-shock/core:resolve-commands",
      prepare: {
        order: "post",
        async handler() {
          this.debug("Initializing the CLI application's command tree.");

          this.commands = {};
          if (
            this.config.command !== "prepare" &&
            this.config.skipCache !== true &&
            this.persistedMeta?.checksum === this.meta.checksum &&
            this.fs.existsSync(getCacheFilePath(this, this.env.config))
          ) {
            this.debug(
              `Skipping command resolution as the meta checksum has not changed.`
            );

            await extractEnv(this);
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

            await traverseCommands(this, command => {
              command.options = Object.fromEntries(
                Object.entries(command.options).map(([name, option]) => [
                  camelCase(name),
                  {
                    ...option,
                    name: camelCase(name),
                    alias: option.alias ?? [],
                    required: option.required ?? true
                  }
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
      name: "shell-shock/core:chmod+x",
      configResolved() {
        this.config.tsdown.hooks ??= {};
        (this.config.tsdown.hooks as TsdownHooks)["build:done"] = async (
          _: BuildContext & {
            chunks: RolldownChunk[];
          }
        ) => {
          await Promise.all(
            Object.values(this.config.bin).map(async bin => {
              const path = appendPath(
                bin,
                joinPaths(this.config.cwd, this.config.root)
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
      name: "shell-shock/core:docs",
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
              <Show when={!child.virtual}>
                <CommandDocsFile command={child} />
              </Show>
            )}
          </For>
        );
      }
    }
  ];
};

export default plugin;
