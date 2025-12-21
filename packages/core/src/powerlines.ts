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
import { appendPath } from "@stryke/path/append";
import {
  findFileName,
  findFilePath,
  findFolderName
} from "@stryke/path/file-path-fns";
import { isParentPath } from "@stryke/path/is-parent-path";
import { joinPaths } from "@stryke/path/join-paths";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { defu } from "defu";
import { existsSync } from "node:fs";
import type { Plugin } from "powerlines";
import {
  findCommandsRoot,
  resolveCommandPath
} from "./helpers/resolve-command";
import { updatePackageJsonBinary } from "./helpers/update-package-json";
import type { BuildContext } from "./types/build";
import type { Options } from "./types/config";

const MAX_DEPTH = 50;

/**
 * The core Powerlines plugin to build Shell Shock projects.
 */
export const shellShock = <TContext extends BuildContext = BuildContext>(
  options: Options = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock",
    dependsOn: [tsdown()],
    async config() {
      this.trace("Resolving the Shell Shock configuration.");

      return defu(options, {
        entry:
          !this.config.entry ||
          (Array.isArray(this.config.entry) && this.config.entry.length === 0)
            ? [joinPaths(this.config.sourceRoot, "**/*")]
            : undefined,
        build: {
          variant: "tsdown"
        },
        interactive: true,
        skipDefaultArgs: false,
        type: "application",
        framework: "shell-shock",
        singleBuild: true
      });
    },
    async configResolved() {
      this.trace("Shell Shock configuration has been resolved.");

      await updatePackageJsonBinary(this);

      this.commandsRoot = findCommandsRoot(this);

      this.commands ??= [];
      this.commands = this.entry
        .filter(
          entry =>
            findFileName(entry.file, { withExtension: false }) === "command"
        )
        .reduce((ret, entry) => {
          const file = appendPath(
            appendPath(entry.file, this.config.projectRoot),
            this.workspaceConfig.workspaceRoot
          );
          if (!isParentPath(file, this.commandsRoot)) {
            throw new Error(
              `Command entry point "${file}" is not located within the commands root "${this.commandsRoot}". Please ensure that all command entry points are located within the current project.`
            );
          }

          const path = resolveCommandPath(this, file);
          const name = path.replaceAll("/", "-");

          if (!ret.some(existing => existing.name === name)) {
            ret.push({
              path: path.split("/").filter(Boolean),
              name,
              title: titleCase(name),
              isVirtual: false,
              entry: {
                ...entry,
                file,
                input: entry,
                output: name
              }
            });
          }

          return ret;
        }, this.commands);
    },
    async prepare() {
      this.trace("Finding and adding virtual commands to the entry points.");

      this.commands = this.commands
        .reduce((ret, command) => {
          let depth = 0;

          let parentPath = resolveParentPath(findFilePath(command.entry.file));
          while (parentPath !== this.commandsRoot) {
            if (depth++ > MAX_DEPTH) {
              throw new Error(
                `Maximum command virtual parent depth of ${MAX_DEPTH} exceeded while processing command: ${command.name}`
              );
            }

            const parentFolderName = findFolderName(parentPath);
            if (
              !ret.some(
                existing => findFilePath(existing.entry.file) === parentPath
              ) &&
              (!parentFolderName.startsWith("[") ||
                !parentFolderName.endsWith("]"))
            ) {
              const path = resolveCommandPath(this, parentPath);
              const name = path.replaceAll("/", "-");

              ret.push({
                path: path.split("/").filter(Boolean),
                name,
                title: titleCase(name),
                isVirtual: true,
                entry: {
                  file: joinPaths(parentPath, "command.ts"),
                  input: {
                    file: joinPaths(parentPath, "command.ts")
                  },
                  output: parentFolderName
                }
              });
            }

            parentPath = resolveParentPath(parentPath);
          }

          return ret;
        }, this.commands)
        .sort((a, b) => a.name.localeCompare(b.name));
      if (this.commands.length === 0) {
        this.warn(
          "No commands were found in the project. Please ensure at least one command exists."
        );
        return;
      }

      this.info(
        `Creating an application with the following commands: \n${this.commands
          .map(
            command =>
              ` - ${command.title} (${command.name}): ${command.entry.file}${
                command.isVirtual ? " (virtual)" : ""
              }`
          )
          .join("\n")}`
      );

      this.entry = [];
    },
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
          existsSync(appendPath(executablePath, this.config.output.buildPath))
        ) {
          await chmodX(
            appendPath(executablePath, this.config.output.buildPath)
          );
        }
      }
    }
  };
};

export default shellShock;
