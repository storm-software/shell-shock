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

import { appendExtension } from "@stryke/path";
import { joinPaths } from "@stryke/path/join";
import { existsSync } from "node:fs";
import { replacePathTokens } from "powerlines/plugin-utils";
import type {
  ChangelogPluginContext,
  ChangelogPluginOptions
} from "../types/plugin";

const CHANGELOG_FILE_EXTENSIONS = ["md", "markdown", "txt"] as const;

const CHANGELOG_FILE_NAMES = [
  "CHANGELOG",
  "changelog",
  "Changelog",
  "RELEASE-NOTES",
  "release-notes",
  "Release-Notes",
  "RELEASE_NOTES",
  "release_notes",
  "Release_Notes",
  "RELEASES",
  "releases",
  "Releases",
  "HISTORY",
  "history",
  "History"
] as const;

function resolveChangelogFile(
  context: ChangelogPluginContext,
  fileName?: string
): string | undefined {
  for (const ext of CHANGELOG_FILE_EXTENSIONS) {
    if (
      fileName &&
      existsSync(
        replacePathTokens(
          context,
          joinPaths("{root}", appendExtension(fileName, ext))
        )
      )
    ) {
      return joinPaths("{root}", appendExtension(fileName, ext));
    }
  }

  return undefined;
}

/**
 * Resolves the path to the changelog file based on the provided options and context. If a specific file is provided in the options, it will attempt to resolve that file first. If not, it will look for common changelog file names in the application's root directory.
 *
 * @param context - The unresolved context of the plugin, which includes information about the application's root directory and other relevant data for resolving paths.
 * @param options - The options provided for the changelog plugin, which may include a specific file name to look for.
 * @returns The resolved path to the changelog file if found, or undefined if no valid changelog file could be resolved.
 */
export function resolveChangelog(
  context: ChangelogPluginContext,
  options: ChangelogPluginOptions
): string | undefined {
  let changelogFile = resolveChangelogFile(context, options.file);
  if (changelogFile) {
    return changelogFile;
  }

  for (const name of CHANGELOG_FILE_NAMES) {
    changelogFile = resolveChangelogFile(context, name);
    if (changelogFile) {
      return changelogFile;
    }
  }

  return changelogFile;
}
