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

import { findFileName } from "@stryke/path/file-path-fns";
import { createRule } from "../helpers/create-rule";

export const RULE_NAME = "invalid-command-export";
export type MessageIds = "invalidExport";
export type Options = [];

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "A command module must have a handler function as it's default export."
    },
    schema: [],
    messages: {
      invalidExport:
        "A command module must have a handler function as it's default export."
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

        for (const block of node.body) {
          if (block.type === "ExportDefaultDeclaration") {
            if (block.declaration.type === "FunctionDeclaration") {
              return;
            } else if (block.declaration.type === "Identifier") {
              const name = block.declaration.name;
              if (
                node.body.some(
                  localBlock =>
                    (localBlock.type === "FunctionDeclaration" &&
                      localBlock.id.name === name) ||
                    (localBlock.type === "VariableDeclaration" &&
                      localBlock.declarations.find(
                        declaration =>
                          declaration.id?.type === "Identifier" &&
                          declaration.id.name === name
                      ))
                )
              ) {
                return;
              }
            }

            context.report({
              node: block,
              messageId: "invalidExport"
            });
          }
        }
      }
    };
  }
});
