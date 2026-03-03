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

import { appendPath } from "@stryke/path/append";
import { commonPath } from "@stryke/path/common";
import { findFilePath, findFolderName } from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join-paths";
import { stripStars } from "@stryke/path/normalize";
import { replacePath } from "@stryke/path/replace";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { existsSync } from "node:fs";
import { isTypeDefinition } from "powerlines/utils";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment,
  isPathSegmentGroup
} from "../plugin-utils/context-helpers";
import type { Context } from "../types/context";

export function resolveCommandId(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(p => Boolean(p) && !isDynamicPathSegment(p))
    .join("/")
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "")
    .replaceAll("/", "-");
}

/**
 * Finds the command name from the given file path.
 *
 * @param file - The file path to extract the command name from.
 * @returns The command name.
 */
export function resolveCommandName(file: string) {
  let path = findFilePath(file);
  let name = findFolderName(file, {
    requireExtension: true
  });

  while (isDynamicPathSegment(name)) {
    path = resolveParentPath(path);
    name = findFolderName(path, {
      requireExtension: true
    });
  }

  return name;
}

export function resolveCommandPath(context: Context, file: string): string {
  return replacePath(findFilePath(file), context.commandsPath)
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "")
    .split("/")
    .filter(path => path && !isPathSegmentGroup(path))
    .join("/");
}

export function resolveCommandDynamicPathSegments(
  context: Context,
  file: string
): string[] {
  return replacePath(findFilePath(file), context.commandsPath)
    .split("/")
    .filter(path => Boolean(path) && isDynamicPathSegment(path))
    .map(path => getDynamicPathSegmentName(path));
}

export function findCommandsRoot(context: Context): string {
  if (isSetString(context.config.input)) {
    return appendPath(
      appendPath(stripStars(context.config.input), context.config.root),
      context.workspaceConfig.workspaceRoot
    );
  } else if (isTypeDefinition(context.config.input)) {
    return appendPath(
      appendPath(stripStars(context.config.input.file), context.config.root),
      context.workspaceConfig.workspaceRoot
    );
  } else if (
    Array.isArray(context.config.input) &&
    context.config.input.length > 0
  ) {
    return commonPath(
      context.config.input.map(input =>
        appendPath(
          appendPath(
            stripStars(isSetString(input) ? input : input.file),
            context.config.root
          ),
          context.workspaceConfig.workspaceRoot
        )
      )
    );
  } else if (isSetObject(context.config.input)) {
    return commonPath(
      Object.values(context.config.input).map(input =>
        Array.isArray(input)
          ? commonPath(
              input.map(i =>
                appendPath(
                  appendPath(
                    stripStars(isSetString(i) ? i : i.file),
                    context.config.root
                  ),
                  context.workspaceConfig.workspaceRoot
                )
              )
            )
          : appendPath(
              appendPath(
                stripStars(isSetString(input) ? input : input.file),
                context.config.root
              ),
              context.workspaceConfig.workspaceRoot
            )
      )
    );
  }

  let commandsPath = joinPaths(context.config.root, "src/commands");
  if (!existsSync(commandsPath)) {
    commandsPath = joinPaths(context.config.root, "commands");
    if (!existsSync(commandsPath)) {
      commandsPath = joinPaths(context.config.root, "src");
      if (!existsSync(commandsPath)) {
        commandsPath = context.config.root;
      }
    }
  }

  return appendPath(commandsPath, context.workspaceConfig.workspaceRoot);
}
