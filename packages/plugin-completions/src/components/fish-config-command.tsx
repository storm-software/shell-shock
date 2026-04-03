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

import { code } from "@alloy-js/core";
import {
  ElseClause,
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TSDoc, TSDocDefaultValue } from "@powerlines/plugin-alloy/typescript";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript/components/typescript-file";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Fish Completions - Configuration command's handler wrapper for the Shell Shock project.
 */
export function FishConfigCompletionsCommand() {
  const context = usePowerlines<CompletionsPluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(
        context.entryPath,
        "completions",
        "fish",
        "config",
        "command.ts"
      )}
      imports={{
        "node:os": "os",
        "node:path": ["join"],
        "node:fs/promises": ["readFile", "writeFile"],
        "../shared": ["SHELL_COMPLETIONS", "SHELL_COMPLETIONS_DISPLAY"]
      }}
      builtinImports={{
        console: ["bold", "inlineCode", "writeLine", "success", "warn", "help"]
      }}>
      <TSDoc heading="Options for the Fish Completions - Configuration command." />
      <InterfaceDeclaration export name="FishConfigCompletionsOptions">
        <TSDoc heading="Should the generated completion script be written to console output instead of an actual file on disk? This is useful for debugging purposes or if you want to manually handle the output.">
          <TSDocDefaultValue
            type={ReflectionKind.boolean}
            defaultValue={false}
          />
        </TSDoc>
        <InterfaceMember name="display" optional type="boolean" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Handler logic for the \`completions fish config\` command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[
          {
            name: "options",
            type: "FishConfigCompletionsOptions",
            default: "{}"
          },
          {
            name: "path",
            type: "string",
            default: `"~/.config/fish/config.fish"`
          }
        ]}>
        <IfStatement condition={code`options.display !== true`}>
          <VarDeclaration
            let
            name="configPath"
            type="string"
            initializer={code` path.includes(".") ? path : join(path, ".config", "fish", "config.fish");`}
          />
          <Spacing />
          <IfStatement condition={code`configPath.startsWith("~")`}>
            {code`configPath = join(os.homedir(), configPath.replace("~", "")); `}
          </IfStatement>
          <Spacing />
          <VarDeclaration
            let
            name="content"
            type="string"
            initializer={code`"";`}
          />
          <Spacing />
          {code`try {
            content = await readFile(configPath, "utf8");
          } catch (error) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
              // If the file doesn't exist, we can create it later when writing the completion script.
              warn(\`Configuration file \${bold(configPath)} does not exist. It will be created when the completion script is written.\`);
            } else {
              return { error };
            }
          }

          await writeFile(configPath, \`\${content}\\n\\n### Begin - ${getAppTitle(context)} Fish Completions ###\\n\\n\${SHELL_COMPLETIONS} \\n\\n### End - ${getAppTitle(
            context
          )} Fish Completions ###\`);

          success(\`${getAppTitle(
            context
          )} shell completions have been applied to Fish configuration file at \${bold(configPath)}. Please restart your terminal or run \${inlineCode(\`source \${configPath}\`)} for the changes to take effect.\`); `}
        </IfStatement>
        <ElseClause>
          {code`writeLine(" ------------------------------------------------- ");
            writeLine("");
            writeLine(\`### Begin - ${getAppTitle(context)} Fish Completions ###\`);
            writeLine("");
            SHELL_COMPLETIONS_DISPLAY.split("\\n").map(line => writeLine(line));
            writeLine("");
            writeLine(\`### End - ${getAppTitle(context)} Fish Completions ###\`);
            writeLine("");
            writeLine(" ------------------------------------------------- ");

            writeLine("");
            help(\`To enable these completions, perform one of the following actions:

            1) Copy and paste the above script into your shell configuration file (e.g., ~/.config/fish/config.fish)
            2) Save the above script to a file and source it from your shell configuration file \`); `}
        </ElseClause>
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
