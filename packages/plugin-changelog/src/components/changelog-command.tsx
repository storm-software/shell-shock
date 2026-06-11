/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import { code, Show } from "@alloy-js/core";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript";
import { TSDoc } from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path/join";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { ChangelogPluginContext } from "../types/plugin";

export interface ChangelogCommandProps {
  changelog: string;
}

/**
 * The Changelog command's handler wrapper for the Shell Shock project.
 */
export function ChangelogCommand({ changelog }: ChangelogCommandProps) {
  const context = usePowerlines<ChangelogPluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "changelog", "command.ts")}
      builtinImports={{
        console: ["textColors", "bold", "writeLine", "error", "warn"]
      }}>
      <TSDoc heading={`Display the ${getAppTitle(context)} changelog.`} />
      <FunctionDeclaration export default name="handler">
        <Show
          when={isSetString(changelog)}
          fallback={code` return warn("There is no changelog available for display."); `}>
          {code`console.log(${changelog});`}
        </Show>
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
