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
import { renderMarkdown } from "@shell-shock/unified/markdown";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type { Plugin } from "powerlines";
import { replacePathTokens } from "powerlines/plugin-utils";
import { ChangelogCommand } from "./components";
import { resolveChangelog } from "./helpers/resolve-changelog";
import type {
  ChangelogPluginContext,
  ChangelogPluginOptions
} from "./types/plugin";

export type * from "./types";

/**
 * The Changelog - Shell Shock plugin to add version check functionality and changelog commands to a Shell Shock application.
 */
export const plugin = <
  TContext extends ChangelogPluginContext = ChangelogPluginContext
>(
  options: ChangelogPluginOptions = {}
): Plugin<TContext> => {
  return {
    name: "shell-shock:changelog",
    config() {
      this.debug(
        "Providing default configuration for the Shell Shock `changelog` plugin."
      );

      return {
        changelog: defu(
          {
            command: {
              name: isSetString(options.command) ? options.command : "changelog"
            }
          },
          options
        )
      };
    },
    async configResolved() {
      this.debug(
        "Adding the CLI changelog commands to the application context."
      );

      if (!isSetString(this.config.changelog.file)) {
        this.config.changelog.file = resolveChangelog(this, options)!;
      }

      if (isSetString(this.config.changelog.file)) {
        this.config.changelog.file = replacePathTokens(
          this,
          this.config.changelog.file
        );
      }

      if (
        !isSetString(this.config.changelog.file) ||
        !this.fs.existsSync(this.config.changelog.file)
      ) {
        this.warn(
          `The changelog file could not be found at the resolved path: ${
            this.config.changelog.file
          }. The \`${
            this.config.changelog.command.name
          }\` command will not be added to the application. Please ensure that the changelog file exists at the specified path or adjust the \`changelog.file\` option to point to the correct location.`
        );
        return;
      }

      this.inputs ??= [];
      if (
        this.inputs.some(
          input => input.id === this.config.changelog.command.name
        )
      ) {
        this.info(
          "The `changelog` command already exists in the commands list. If you would like the changelog command to be managed by the `@shell-shock/plugin-changelog` package, please remove or rename the command."
        );
      } else {
        this.inputs.push({
          id: this.config.changelog.command.name,
          path: this.config.changelog.command.name,
          segments: [this.config.changelog.command.name],
          title: "Changelog",
          icon: "🗃",
          tags: ["Utility"],
          description: `Display the ${getAppTitle(this)} changelog.`,
          entry: {
            file: joinPaths(this.entryPath, "changelog", "index.ts"),
            input: {
              file: joinPaths(this.entryPath, "changelog", "command.ts")
            }
          },
          isVirtual: false,
          source: "changelog-plugin",
          ...this.config.changelog.command
        });

        this.debug(
          "Rendering changelog command module for the Shell Shock `changelog` plugin."
        );

        const content = await this.fs.read(this.config.changelog.file);
        if (content) {
          await render(
            this,
            <ChangelogCommand changelog={renderMarkdown(content)} />
          );
        }
      }
    }
  };
};

export default plugin;
