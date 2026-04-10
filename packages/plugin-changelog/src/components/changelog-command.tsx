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

import { code, createResource, Show } from "@alloy-js/core";
import {
  FunctionDeclaration,
  InterfaceDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import {
  InterfaceMember,
  TypescriptFile
} from "@powerlines/plugin-alloy/typescript";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { renderMarkdown } from "@shell-shock/unified/markdown";
import { joinPaths } from "@stryke/path";
import type { ChangelogPluginContext } from "../types/plugin";

/**
 * The Changelog command's handler wrapper for the Shell Shock project.
 */
export function ChangelogCommand() {
  const context = usePowerlines<ChangelogPluginContext>();

  const result = createResource(async () => {
    const content = await context.fs.read(context.config.changelog.file);
    if (!content) {
      return null;
    }

    return renderMarkdown(content);
  });

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "changelog", "command.ts")}
      imports={{
        "node:os": "os",
        "node:fs/promises": ["readFile", "writeFile"]
      }}
      builtinImports={{
        console: ["textColors", "bold", "writeLine", "error", "warn"]
      }}>
      <TSDoc heading="Options for the Changelog command." />
      <InterfaceDeclaration export name="ChangelogOptions">
        <TSDoc heading="An optional starting version for the changelog. The command will attempt to display changes starting from the specified version. The version should be a valid semantic version string. If not specified, the changelog will start from the earliest version available." />
        <InterfaceMember name="start" optional type="string" />
        <Spacing />
        <TSDoc heading="An optional ending version for the changelog. The command will attempt to display changes up to the specified version. The version should be a valid semantic version string. If not specified, the changelog will display changes up to the latest version available.">
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="latest"
          />
        </TSDoc>
        <InterfaceMember name="end" optional type="string" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading={`Display the ${getAppTitle(context)} changelog.`}>
        <TSDocParam name="options">
          {code`An object containing options for displaying the changelog.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[{ name: "options", type: "ChangelogOptions" }]}>
        <Show
          when={!result.loading && !result.error}
          fallback={
            <Show when={!!result.error}>
              {code` return error(\`Failed to load changelog: ${result.error!.message.replaceAll(
                /`/g,
                "\\\`"
              )}\`); `}
            </Show>
          }>
          <Show
            when={!!result.data}
            fallback={code` return warn("There is no changelog available for display."); `}>
            {result.data}
          </Show>
        </Show>
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
