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
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { InterfaceMember } from "@powerlines/plugin-alloy/typescript";
import { EntryFile } from "@powerlines/plugin-alloy/typescript/components/entry-file";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocRemarks
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppBin, getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Bash Completions commands' handler wrapper for the Shell Shock project.
 */
export function BashCompletionsCommandEntryFile() {
  const context = usePowerlines<CompletionsPluginContext>();

  return (
    <EntryFile
      path={joinPaths(context.entryPath, "completions", "bash", "command.ts")}
      imports={{
        "node:os": ["os"],
        "node:fs/promises": ["readFile", "writeFile"]
      }}
      builtinImports={{
        "shell-shock:console": [
          "colors",
          "writeLine",
          "success",
          "warn",
          "stripAnsi"
        ]
      }}>
      <TSDoc heading="Options for the Bash completions command." />
      <InterfaceDeclaration export name="BashCompletionsOptions">
        <TSDoc heading="The path to write the completion script to.">
          <TSDocRemarks>{`If no extension is provided, the \`.bash\` extension will be used.`}</TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue={`${getAppBin(context)}-completions.bash`}
          />
        </TSDoc>
        <InterfaceMember name="script" optional type="string | true" />
        <Spacing />
        <TSDoc heading="The Bash configuration file to append the completion script to.">
          <TSDocRemarks>{`The generated completion script will be appended to the specified configuration file. Possible values for the Bash configuration file include: \\n- \`~/.bashrc\` \\n- \`~/.bash_profile\``}</TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="~/.bashrc"
          />
        </TSDoc>
        <InterfaceMember name="config" optional type="string | true" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Entry point for the Bash completions command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[{ name: "options", type: "BashCompletionsOptions" }]}>
        <VarDeclaration
          const
          name="completions"
          type="string"
          initializer={code`colors.white(\`\${colors.gray("###-begin-${getAppBin(context)}-completions-###")}

\${colors.gray(\`
# \${colors.bold("${getAppTitle(context)} Bash CLI command completion script")}
#
# \${colors.bold("Installation:")} ${getAppBin(context)} completions bash --config ~/.bashrc or ${getAppBin(context)} completions bash --script or  ${getAppBin(context)} completions bash >> ~/.bashrc or ${getAppBin(context)} completions bash >> ~/.bash_profile on OSX. \`
)}
\${colors.cyan("_${getAppBin(context)}_completions()")}
{
    local cur_word args type_list

    cur_word="\\\${COMP_WORDS[COMP_CWORD]}"
    args=("\\\${COMP_WORDS[@]}")

    \${colors.gray("# Ask ${getAppTitle(context)} CLI to generate completions.")}
    mapfile -t type_list < <(${getAppBin(context)} --get-completions "\\\${args[@]}")
    mapfile -t COMPREPLY < <(compgen -W "$( printf '%q ' "\\\${type_list[@]}" )" -- "\\\${cur_word}" |
        awk '/ / { print "\\\\""$0"\\\\"" } /^[^ ]+$/ { print $0 }')

    \${colors.gray("# if no match was found, fall back to filename completion")}
    if [ \\\${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _${getAppBin(context)}_completions ${getAppBin(context)}

\${colors.gray("###-end-${getAppBin(context)}-completions-###")}
\`); `}
        />
        <Spacing />
        <IfStatement condition={code`options.config`}>
          <VarDeclaration
            let
            name="configFilePath"
            type="string"
            initializer={code`options.config === true ? "~/.bashrc" : options.config`}
          />
          <Spacing />
          <IfStatement condition={code`configFilePath.startsWith("~")`}>
            {code`configFilePath = join(os.homedir(), configFilePath.replace("~", "")); `}
          </IfStatement>
          <Spacing />
          <VarDeclaration
            let
            name="configFileContent"
            type="string"
            initializer={code`"";`}
          />
          <Spacing />
          {code`try {
            configFileContent = await readFile(configFilePath, "utf8");
          } catch (error) {
            if (error.code === "ENOENT") {
              // If the file doesn't exist, we can create it later when writing the completion script.
              warn(\`Configuration file \${colors.bold(configFilePath)} does not exist. It will be created when the completion script is written.\`);
            } else {
              return { error };
            }
          }

          await writeFile(configFilePath, \`\${configFileContent}\\n\\n\${stripAnsi(completions)}\`);

          success(\`${getAppTitle(context)} Bash completion script has been generated and appended to \${colors.bold(configFilePath)}. Please restart your terminal or run \`source \${configFilePath}\` to apply the changes.\`); `}
        </IfStatement>
        <Spacing />
        <IfStatement condition={code`options.script`}>
          {code`const outputPath = options.script === true ? "${getAppBin(context)}-completions.bash" : options.script;
          await writeFile(outputPath, stripAnsi(completions));

          success(\`${getAppTitle(context)} Bash completion script has been generated at \${colors.bold(outputPath)}.\`);`}
        </IfStatement>
        <Spacing />
        <IfStatement condition={code`!options.config && !options.script`}>
          {code`writeLine(" ------------------------------------------------- ");
          writeLine(completions);
          writeLine(" ------------------------------------------------- ");`}
        </IfStatement>
      </FunctionDeclaration>
    </EntryFile>
  );
}
