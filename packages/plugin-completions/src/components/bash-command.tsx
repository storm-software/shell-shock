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
import {
  InterfaceMember,
  TypescriptFile
} from "@powerlines/plugin-alloy/typescript";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocRemarks
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppBin, getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import { snakeCase } from "@stryke/string-format/snake-case";
import { CompletionDirective } from "../helpers";
import { exec } from "../helpers/complete-command";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Bash Completions commands' handler wrapper for the Shell Shock project.
 */
export function BashCompletionsCommand() {
  const context = usePowerlines<CompletionsPluginContext>();

  return (
    <TypescriptFile
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
      <TSDoc heading="Handler logic for the \`completions bash\` command."></TSDoc>
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
          initializer={code`# bash completion for ${getAppTitle(context)}

# Define shell completion directives
readonly ShellCompDirectiveError=${CompletionDirective.CompletionDirectiveError}
readonly ShellCompDirectiveNoSpace=${
            CompletionDirective.CompletionDirectiveNoSpace
          }
readonly ShellCompDirectiveNoFileComp=${
            CompletionDirective.CompletionDirectiveNoFileComp
          }
readonly ShellCompDirectiveFilterFileExt=${
            CompletionDirective.CompletionDirectiveFilterFileExt
          }
readonly ShellCompDirectiveFilterDirs=${
            CompletionDirective.CompletionDirectiveFilterDirs
          }
readonly ShellCompDirectiveKeepOrder=${
            CompletionDirective.CompletionDirectiveKeepOrder
          }

# Function to debug completion
__${snakeCase(getAppBin(context))}_debug() {
    if [[ -n \${BASH_COMP_DEBUG_FILE:-} ]]; then
        echo "$*" >> "\${BASH_COMP_DEBUG_FILE}"
    fi
}

# Function to handle completions
__${snakeCase(getAppBin(context))}_complete() {
    local cur prev words cword
    _get_comp_words_by_ref -n "=:" cur prev words cword

    local requestComp out directive

    # Build the command to get completions
    requestComp="${exec} complete -- \${words[@]:1}"

    # Add an empty parameter if the last parameter is complete
    if [[ -z "$cur" ]]; then
        requestComp="$requestComp ''"
    fi

    # Get completions from the program
    out=$(eval "$requestComp" 2>/dev/null)

    # Extract directive if present
    directive=0
    if [[ "$out" == *:* ]]; then
        directive=\${out##*:}
        out=\${out%:*}
    fi

    # Process completions based on directive
    if [[ $((directive & $ShellCompDirectiveError)) -ne 0 ]]; then
        # Error, no completion
        return
    fi

    # Apply directives
    if [[ $((directive & $ShellCompDirectiveNoSpace)) -ne 0 ]]; then
        compopt -o nospace
    fi
    if [[ $((directive & $ShellCompDirectiveKeepOrder)) -ne 0 ]]; then
        compopt -o nosort
    fi
    if [[ $((directive & $ShellCompDirectiveNoFileComp)) -ne 0 ]]; then
        compopt +o default
    fi

    # Handle file extension filtering
    if [[ $((directive & $ShellCompDirectiveFilterFileExt)) -ne 0 ]]; then
        local filter=""
        for ext in $out; do
            filter="$filter|$ext"
        done
        filter="\\.($filter)"
        compopt -o filenames
        COMPREPLY=( $(compgen -f -X "!$filter" -- "$cur") )
        return
    fi

    # Handle directory filtering
    if [[ $((directive & $ShellCompDirectiveFilterDirs)) -ne 0 ]]; then
        compopt -o dirnames
        COMPREPLY=( $(compgen -d -- "$cur") )
        return
    fi

    # Process completions
    local IFS=$'\\n'
    local tab=$(printf '\\t')

    # Parse completions with descriptions
    local completions=()
    while read -r comp; do
        if [[ "$comp" == *$tab* ]]; then
            # Split completion and description
            local value=\${comp%%$tab*}
            local desc=\${comp#*$tab}
            completions+=("$value")
        else
            completions+=("$comp")
        fi
    done <<< "$out"

    # Return completions
    COMPREPLY=( $(compgen -W "\${completions[*]}" -- "$cur") )
}

# Register completion function
complete -F __${snakeCase(getAppBin(context))}_complete ${getAppBin(context)}
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
    </TypescriptFile>
  );
}
