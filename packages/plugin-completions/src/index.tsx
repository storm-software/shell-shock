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
import type { Plugin } from "powerlines";
import {
  BashCompletionsShared,
  BashConfigCompletionsCommand,
  BashScriptCompletionsCommand,
  FishCompletionsShared,
  FishConfigCompletionsCommand,
  FishScriptCompletionsCommand,
  PowerShellCompletionsShared,
  PowerShellConfigCompletionsCommand,
  PowerShellScriptCompletionsCommand,
  ZshCompletionsShared,
  ZshConfigCompletionsCommand,
  ZshScriptCompletionsCommand
} from "./components";
import type {
  CompletionsPluginContext,
  CompletionsPluginOptions
} from "./types/plugin";
import { SHELL_TYPES } from "./types/shell-type";

export type * from "./types";

/**
 * The Completions - Shell Shock plugin to add completion commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends CompletionsPluginContext = CompletionsPluginContext
>(
  options: CompletionsPluginOptions = {}
): Plugin<TContext>[] => {
  return [
    {
      name: "shell-shock:completions",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `completions` plugin."
        );

        return {
          completions: { shells: [...SHELL_TYPES], ...options }
        };
      },
      configResolved() {
        this.debug(
          "Adding the CLI completion commands to the application context."
        );

        this.inputs ??= [];
        if (this.inputs.some(input => input.id === "completions")) {
          this.info(
            "The `completions` command already exists in the commands list. If you would like the completions command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
          );
        } else {
          this.inputs.push({
            id: "completions",
            name: "completions",
            alias: ["completion"],
            path: "completions",
            segments: ["completions"],
            title: "Completions",
            icon: "🖵",
            tags: ["Utility"],
            description: `Commands for generating shell completion scripts for ${getAppTitle(
              this
            )}.`,
            entry: {
              file: joinPaths(this.entryPath, "completions", "index.ts")
            },
            isVirtual: true
          });
        }

        if (this.config.completions.shells.includes("bash")) {
          if (this.inputs.some(input => input.id === "completions-bash")) {
            this.info(
              "The `completions-bash` command already exists in the commands list. If you would like the completions-bash command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
            );
          } else {
            this.inputs.push({
              id: "completions-bash",
              name: "bash",
              description: `Commands to setup bash completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/bash",
              segments: ["completions", "bash"],
              title: "Completions - Bash",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "bash",
                  "index.ts"
                )
              },
              isVirtual: true
            });
            this.inputs.push({
              id: "completions-bash-script",
              name: "script",
              description: `Generate a bash completion script for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/bash/script",
              segments: ["completions", "bash", "script"],
              title: "Completions - Bash Script",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "bash",
                  "script",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "bash",
                    "script",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
            this.inputs.push({
              id: "completions-bash-config",
              name: "config",
              description: `Update the current system's bash shell configuration to include completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/bash/config",
              segments: ["completions", "bash", "config"],
              title: "Completions - Bash Configuration",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "bash",
                  "config",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "bash",
                    "config",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
          }
        }

        if (this.config.completions.shells.includes("zsh")) {
          if (this.inputs.some(input => input.id === "completions-zsh")) {
            this.info(
              "The `completions-zsh` command already exists in the commands list. If you would like the completions-zsh command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
            );
          } else {
            this.inputs.push({
              id: "completions-zsh",
              name: "zsh",
              description: `Commands to setup Zsh completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/zsh",
              segments: ["completions", "zsh"],
              title: "Completions - Zsh",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "zsh",
                  "index.ts"
                )
              },
              isVirtual: true
            });
            this.inputs.push({
              id: "completions-zsh-script",
              name: "script",
              description: `Generate a Zsh completion script for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/zsh/script",
              segments: ["completions", "zsh", "script"],
              title: "Completions - Zsh Script",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "zsh",
                  "script",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "zsh",
                    "script",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
            this.inputs.push({
              id: "completions-zsh-config",
              name: "config",
              description: `Update the current system's Zsh shell configuration to include completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/zsh/config",
              segments: ["completions", "zsh", "config"],
              title: "Completions - Zsh Configuration",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "zsh",
                  "config",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "zsh",
                    "config",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
          }
        }

        if (this.config.completions.shells.includes("powershell")) {
          if (
            this.inputs.some(input => input.id === "completions-powershell")
          ) {
            this.info(
              "The `completions-powershell` command already exists in the commands list. If you would like the completions-powershell command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
            );
          } else {
            this.inputs.push({
              id: "completions-powershell",
              name: "powershell",
              description: `Commands to setup PowerShell completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/powershell",
              segments: ["completions", "powershell"],
              title: "Completions - PowerShell",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "powershell",
                  "index.ts"
                )
              },
              isVirtual: true
            });
            this.inputs.push({
              id: "completions-powershell-script",
              name: "script",
              description: `Generate a PowerShell completion script for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/powershell/script",
              segments: ["completions", "powershell", "script"],
              title: "Completions - PowerShell Script",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "powershell",
                  "script",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "powershell",
                    "script",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
            this.inputs.push({
              id: "completions-powershell-config",
              name: "config",
              description: `Update the current system's PowerShell configuration to include completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/powershell/config",
              segments: ["completions", "powershell", "config"],
              title: "Completions - PowerShell Configuration",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "powershell",
                  "config",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "powershell",
                    "config",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
          }
        }

        if (this.config.completions.shells.includes("fish")) {
          if (this.inputs.some(input => input.id === "completions-fish")) {
            this.info(
              "The `completions-fish` command already exists in the commands list. If you would like the completions-fish command to be managed by the `@shell-shock/plugin-completions` package, please remove or rename the command."
            );
          } else {
            this.inputs.push({
              id: "completions-fish",
              name: "fish",
              description: `Commands to setup Fish completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/fish",
              segments: ["completions", "fish"],
              title: "Completions - Fish",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "fish",
                  "index.ts"
                )
              },
              isVirtual: true
            });
            this.inputs.push({
              id: "completions-fish-script",
              name: "script",
              description: `Generate a Fish completion script for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/fish/script",
              segments: ["completions", "fish", "script"],
              title: "Completions - Fish Script",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "fish",
                  "script",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "fish",
                    "script",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
            this.inputs.push({
              id: "completions-fish-config",
              name: "config",
              description: `Update the current system's Fish shell configuration to include completions for the ${getAppTitle(
                this,
                true
              )} command-line interface.`,
              alias: [],
              path: "completions/fish/config",
              segments: ["completions", "fish", "config"],
              title: "Completions - Fish Configuration",
              tags: ["Utility"],
              entry: {
                file: joinPaths(
                  this.entryPath,
                  "completions",
                  "fish",
                  "config",
                  "index.ts"
                ),
                input: {
                  file: joinPaths(
                    this.entryPath,
                    "completions",
                    "fish",
                    "config",
                    "command.ts"
                  )
                }
              },
              isVirtual: false
            });
          }
        }
      },
      prepare: {
        order: "pre",
        async handler() {
          this.debug(
            "Rendering command handling modules for the Shell Shock `completions` plugin."
          );

          return render(
            this,
            <>
              <BashCompletionsShared />
              <BashScriptCompletionsCommand />
              <BashConfigCompletionsCommand />
              <ZshCompletionsShared />
              <ZshScriptCompletionsCommand />
              <ZshConfigCompletionsCommand />
              <PowerShellCompletionsShared />
              <PowerShellScriptCompletionsCommand />
              <PowerShellConfigCompletionsCommand />
              <FishCompletionsShared />
              <FishScriptCompletionsCommand />
              <FishConfigCompletionsCommand />
            </>
          );
        }
      }
    }
  ];
};

export default plugin;
