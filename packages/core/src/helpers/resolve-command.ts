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
import { findFilePath } from "@stryke/path/file-path-fns";
import { stripStars } from "@stryke/path/normalize";
import { replacePath } from "@stryke/path/replace";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { BuildContext } from "../types/build";

export function resolveCommandPath(
  context: BuildContext,
  file: string
): string {
  return replacePath(findFilePath(file), context.commandsRoot)
    .replaceAll(/^\/+/g, "")
    .replaceAll(/\/+$/g, "");
}

export function findCommandsRoot(context: BuildContext): string {
  if (isSetString(context.config.entry)) {
    return appendPath(
      appendPath(stripStars(context.config.entry), context.config.projectRoot),
      context.workspaceConfig.workspaceRoot
    );
  } else if (
    isSetObject(context.config.entry) &&
    "file" in context.config.entry
  ) {
    return appendPath(
      appendPath(
        stripStars(context.config.entry.file),
        context.config.projectRoot
      ),
      context.workspaceConfig.workspaceRoot
    );
  } else if (
    Array.isArray(context.config.entry) &&
    context.config.entry.length > 0
  ) {
    return commonPath(
      context.config.entry.map(entry =>
        appendPath(
          appendPath(
            stripStars(isSetString(entry) ? entry : entry.file),
            context.config.projectRoot
          ),
          context.workspaceConfig.workspaceRoot
        )
      )
    );
  }

  return appendPath(
    context.config.sourceRoot || context.config.projectRoot,
    context.workspaceConfig.workspaceRoot
  );
}
