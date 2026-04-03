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

import { code, computed } from "@alloy-js/core";
import {
  ElseClause,
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  VarDeclaration
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
  TSDocDefaultValue
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppBin, getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The PowerShell Completions - Script command's handler wrapper for the Shell Shock project.
 */
export function PowerShellScriptCompletionsCommand() {
  const context = usePowerlines<CompletionsPluginContext>();

  const bin = computed(() => getAppBin(context));

  return (
    <TypescriptFile
      path={joinPaths(
        context.entryPath,
        "completions",
        "powershell",
        "script",
        "command.ts"
      )}
      imports={{
        "node:os": "os",
        "node:path": ["join"],
        "node:fs/promises": ["readFile", "writeFile"],
        "../shared": ["SHELL_COMPLETIONS", "SHELL_COMPLETIONS_DISPLAY"]
      }}
      builtinImports={{
        console: ["bold", "writeLine", "success", "warn", "help"]
      }}>
      <TSDoc heading="Options for the PowerShell Completions - Script command." />
      <InterfaceDeclaration export name="PowerShellScriptCompletionsOptions">
        <TSDoc heading="Should the generated completion script be written to console output instead of an actual file on disk? This is useful for debugging purposes or if you want to manually handle the output.">
          <TSDocDefaultValue
            type={ReflectionKind.boolean}
            defaultValue={false}
          />
        </TSDoc>
        <InterfaceMember name="display" optional type="boolean" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Handler logic for the \`completions powershell script\` command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[
          {
            name: "options",
            type: "PowerShellScriptCompletionsOptions",
            default: "{}"
          },
          {
            name: "path",
            type: "string",
            default: `"${bin.value}-completions.ps1"`
          }
        ]}>
        <IfStatement condition={code`options.display !== true`}>
          <VarDeclaration
            const
            name="scriptPath"
            type="string"
            initializer={code` path.includes(".") ? \`\${path}.ps1\` : path;`}
          />
          {code`await writeFile(scriptPath, \`# PowerShell script to add completions for ${getAppTitle(context)}\\n\\n\${SHELL_COMPLETIONS}\`);

            success(\`${getAppTitle(
              context
            )} PowerShell completion script has been generated at \${bold(scriptPath)}.\`);`}
        </IfStatement>
        <ElseClause>
          {code`writeLine(" ------------------------------------------------- ");
            writeLine("");
            writeLine(\`# PowerShell completions for ${getAppTitle(context)}\`);
            writeLine("");
            SHELL_COMPLETIONS_DISPLAY.split("\\n").map(line => writeLine(line));
            writeLine("");
            writeLine(" ------------------------------------------------- ");

            writeLine("");
            help(\`To enable these completions, perform one of the following actions:

            1) Copy and paste the above script into your shell configuration file (e.g., ~/.config/powershell/Microsoft.PowerShell_profile.ps1)
            2) Save the above script to a file and source it from your shell configuration file \`); `}
        </ElseClause>
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
