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
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Zsh Completions - Configuration command's handler wrapper for the Shell Shock project.
 */
export function ZshConfigCompletionsCommand() {
  const context = usePowerlines<CompletionsPluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(
        context.entryPath,
        "completions",
        "zsh",
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
        "shell-shock:console": ["colors", "writeLine", "success", "warn"]
      }}>
      <TSDoc heading="Options for the Zsh Completions - Configuration command." />
      <InterfaceDeclaration export name="ZshConfigCompletionsOptions">
        <TSDoc heading="Should the generated completion script be written to console output instead of an actual file on disk? This is useful for debugging purposes or if you want to manually handle the output.">
          <TSDocDefaultValue
            type={ReflectionKind.boolean}
            defaultValue={false}
          />
        </TSDoc>
        <InterfaceMember name="display" optional type="boolean" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Handler logic for the \`completions zsh config\` command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[
          {
            name: "options",
            type: "ZshConfigCompletionsOptions",
            default: "{}"
          },
          {
            name: "path",
            type: "string",
            default: `"~/.zshrc"`
          }
        ]}>
        <IfStatement condition={code`options.display !== true`}>
          <VarDeclaration
            let
            name="configPath"
            type="string"
            initializer={code` path.includes(".") ? path : join(path, ".zshrc");`}
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
              warn(\`Configuration file \${colors.bold(configPath)} does not exist. It will be created when the completion script is written.\`);
            } else {
              return { error };
            }
          }

          await writeFile(configPath, \`\${content}\\n\\n### Begin - ${getAppTitle(context)} Shell Completions ###\\n\\n\${SHELL_COMPLETIONS} \\n\\n### End - ${getAppTitle(
            context
          )} Zsh Completions ###\`);

          success(\`${getAppTitle(
            context
          )} shell completions have been applied to Zsh configuration file at \${colors.bold(configPath)}. Please restart your terminal or run \\\`source \${configPath}\\\` for the changes to take effect.\`); `}
        </IfStatement>
        <ElseClause>
          {code`writeLine(" ------------------------------------------------- ");
            writeLine(\`### Begin - ${getAppTitle(context)} Zsh Completions ###\`);
            writeLine("");
            SHELL_COMPLETIONS_DISPLAY.split("\\n").map(line => writeLine(line));
            writeLine("");
            writeLine(\`### End - ${getAppTitle(context)} Zsh Completions ###\`);
            writeLine(" ------------------------------------------------- ");`}
        </ElseClause>
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
