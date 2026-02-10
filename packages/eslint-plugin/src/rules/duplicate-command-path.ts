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

import { isDirectory } from "@stryke/fs/is-file";
import { listSync } from "@stryke/fs/list-files";
import {
  findFileName,
  findFilePath,
  findFolderName
} from "@stryke/path/file-path-fns";
import { joinPaths } from "@stryke/path/join";
import { resolveParentPath } from "@stryke/path/resolve-parent-path";
import { existsSync } from "node:fs";
import { createRule } from "../helpers/create-rule";

export const RULE_NAME = "duplicate-command-path";
export type MessageIds = "duplicateCommandPath";
export type Options = [];

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Multiple command files found in the same directory. This can lead to unexpected behavior. Please ensure that there is only one command file per directory."
    },
    schema: [],
    messages: {
      duplicateCommandPath:
        "Multiple command files found in the same directory. This can lead to unexpected behavior. Please ensure that there is only one command file per directory: {{#duplicates}}\n- {{.}}{{/duplicates}}"
    }
  },
  defaultOptions: [],
  create: context => {
    return {
      Program(node) {
        const fileName = context.filename ?? context.getFilename();
        if (
          findFileName(fileName, {
            withExtension: false
          }) !== "command"
        ) {
          return;
        }

        const filePath = findFilePath(fileName);
        if (!filePath) {
          return;
        }

        const duplicates = listSync(filePath).filter(
          contentItem =>
            isDirectory(contentItem) &&
            ((findFileName(contentItem).startsWith("(") &&
              findFileName(contentItem).startsWith("(")) ||
              findFileName(contentItem).startsWith("_")) &&
            existsSync(joinPaths(contentItem, "command.ts"))
        );
        if (duplicates.length > 1) {
          context.report({
            node,
            messageId: "duplicateCommandPath",
            data: {
              duplicates
            }
          });
        }

        const parentPath = resolveParentPath(fileName);
        if (
          ((findFolderName(parentPath).startsWith("(") &&
            findFolderName(parentPath).startsWith("(")) ||
            findFolderName(parentPath).startsWith("_")) &&
          existsSync(joinPaths(parentPath, "command.ts"))
        ) {
          context.report({
            node,
            messageId: "duplicateCommandPath",
            data: {
              duplicates: [parentPath]
            }
          });
        }
      }
    };
  }
});
