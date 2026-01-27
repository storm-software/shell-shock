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

import { joinPaths } from "@stryke/path/join-paths";
import { defineGenerator } from "automd";
import type { Context } from "../types/context";

/**
 * AutoMD generator to generate CLI command documentation
 *
 * @param context - The generator context.
 * @returns The generated documentation content.
 */
export const commands = (context: Context) =>
  defineGenerator({
    name: "commands",
    async generate() {
      const basePath = joinPaths(
        context.config.projectRoot,
        "docs",
        "generated",
        "commands"
      );

      if (!context.fs.existsSync(basePath)) {
        return {
          contents: ""
        };
      }

      const contents = (
        await Promise.all(
          (await context.fs.list(basePath)).sort().map(async filePath => {
            const content = await context.fs.read(filePath);

            // const commandFile = replacePath(filePath, basePath);
            // getCommandTree(
            //   context,
            //   commandFile.replace(/\.mdx?$/, "").split("/")
            // );

            return content;
          })
        )
      ).filter(Boolean);

      return {
        contents: contents.join("\n\n") || ""
      };
    }
  });
