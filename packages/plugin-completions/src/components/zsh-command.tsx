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
import { snakeCase } from "@stryke/string-format";
import { exec } from "../helpers/complete-command";
import { CompletionDirective } from "../helpers/completion-directive-constants";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Zsh Completions commands' handler wrapper for the Shell Shock project.
 */
export function ZshCompletionsCommand() {
  const context = usePowerlines<CompletionsPluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "completions", "zsh", "command.ts")}
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
      <TSDoc heading="Options for the Zsh completions command." />
      <InterfaceDeclaration export name="ZshCompletionsOptions">
        <TSDoc heading="The path to write the completion script to.">
          <TSDocRemarks>{`If no extension is provided, the \`.zsh\` extension will be used.`}</TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue={`${getAppBin(context)}-completions.zsh`}
          />
        </TSDoc>
        <InterfaceMember name="script" optional type="string | true" />
        <Spacing />
        <TSDoc heading="The Zsh configuration file to append the completion script to.">
          <TSDocRemarks>{`The generated completion script will be appended to the specified configuration file. Possible values for the Zsh configuration file include: \\n- \`~/.zshrc\` \\n- \`~/.zprofile\``}</TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="~/.zshrc"
          />
        </TSDoc>
        <InterfaceMember name="config" optional type="string | true" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Handler logic for the \`completions zsh\` command."></TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[{ name: "options", type: "ZshCompletionsOptions" }]}>
        <VarDeclaration
          const
          name="completions"
          type="string"
          initializer={code`#compdef ${getAppBin(context)}
compdef _${snakeCase(getAppBin(context))} ${getAppBin(context)}

# zsh completion for ${getAppTitle(context)} -*- shell-script -*-

__${snakeCase(getAppBin(context))}_debug() {
    local file="$BASH_COMP_DEBUG_FILE"
    if [[ -n \${file} ]]; then
        echo "$*" >> "\${file}"
    fi
}

_${getAppBin(context)}() {
    local shellCompDirectiveError=${
      CompletionDirective.CompletionDirectiveError
    }
    local shellCompDirectiveNoSpace=${
      CompletionDirective.CompletionDirectiveNoSpace
    }
    local shellCompDirectiveNoFileComp=${
      CompletionDirective.CompletionDirectiveNoFileComp
    }
    local shellCompDirectiveFilterFileExt=${
      CompletionDirective.CompletionDirectiveFilterFileExt
    }
    local shellCompDirectiveFilterDirs=${
      CompletionDirective.CompletionDirectiveFilterDirs
    }
    local shellCompDirectiveKeepOrder=${
      CompletionDirective.CompletionDirectiveKeepOrder
    }

    local lastParam lastChar flagPrefix requestComp out directive comp lastComp noSpace keepOrder
    local -a completions

    __${snakeCase(getAppBin(context))}_debug "\\n========= starting completion logic =========="
    __${snakeCase(getAppBin(context))}_debug "CURRENT: \${CURRENT}, words[*]: \${words[*]}"

    # The user could have moved the cursor backwards on the command-line.
    # We need to trigger completion from the $CURRENT location, so we need
    # to truncate the command-line ($words) up to the $CURRENT location.
    # (We cannot use $CURSOR as its value does not work when a command is an alias.)
    words=( "\${=words[1,CURRENT]}" )
    __${snakeCase(getAppBin(context))}_debug "Truncated words[*]: \${words[*]},"

    lastParam=\${words[-1]}
    lastChar=\${lastParam[-1]}
    __${snakeCase(getAppBin(context))}_debug "lastParam: \${lastParam}, lastChar: \${lastChar}"
    # For zsh, when completing a flag with an = (e.g., ${getAppBin(
      context
    )} -n=<TAB>)
    # completions must be prefixed with the flag
    setopt local_options BASH_REMATCH
    if [[ "\${lastParam}" =~ '-.*=' ]]; then
        # We are dealing with a flag with an =
        flagPrefix="-P \${BASH_REMATCH}"
    fi

    # Prepare the command to obtain completions, ensuring arguments are quoted for eval
    local -a args_to_quote=("\${(@)words[2,-1]}")
    if [ "\${lastChar}" = "" ]; then
        # If the last parameter is complete (there is a space following it)
        # We add an extra empty parameter so we can indicate this to the go completion code.
        __${snakeCase(getAppBin(context))}_debug "Adding extra empty parameter"
        args_to_quote+=("")
    fi

    # Use Zsh's (q) flag to quote each argument safely for eval
    local quoted_args=("\${(@q)args_to_quote}")

    # Join the main command and the quoted arguments into a single string for eval
    requestComp="${exec} complete -- \${quoted_args[*]}"

    __${snakeCase(getAppBin(context))}_debug "About to call: eval \${requestComp}"

    # Use eval to handle any environment variables and such
    out=$(eval \${requestComp} 2>/dev/null)
    __${snakeCase(getAppBin(context))}_debug "completion output: \${out}"

    # Extract the directive integer following a : from the last line
    local lastLine
    while IFS='\n' read -r line; do
        lastLine=\${line}
    done < <(printf "%s\n" "\${out[@]}")
    __${snakeCase(getAppBin(context))}_debug "last line: \${lastLine}"

    if [ "\${lastLine[1]}" = : ]; then
        directive=\${lastLine[2,-1]}
        # Remove the directive including the : and the newline
        local suffix
        (( suffix=\${#lastLine}+2))
        out=\${out[1,-$suffix]}
    else
        # There is no directive specified.  Leave $out as is.
        __${snakeCase(getAppBin(context))}_debug "No directive found.  Setting to default"
        directive=0
    fi

    __${snakeCase(getAppBin(context))}_debug "directive: \${directive}"
    __${snakeCase(getAppBin(context))}_debug "completions: \${out}"
    __${snakeCase(getAppBin(context))}_debug "flagPrefix: \${flagPrefix}"

    if [ $((directive & shellCompDirectiveError)) -ne 0 ]; then
        __${snakeCase(getAppBin(context))}_debug "Completion received error. Ignoring completions."
        return
    fi

    local activeHelpMarker="%"
    local endIndex=\${#activeHelpMarker}
    local startIndex=$((\${#activeHelpMarker}+1))
    local hasActiveHelp=0
    while IFS='\n' read -r comp; do
        # Check if this is an activeHelp statement (i.e., prefixed with $activeHelpMarker)
        if [ "\${comp[1,$endIndex]}" = "$activeHelpMarker" ];then
            __${snakeCase(getAppBin(context))}_debug "ActiveHelp found: $comp"
            comp="\${comp[$startIndex,-1]}"
            if [ -n "$comp" ]; then
                compadd -x "\${comp}"
                __${snakeCase(getAppBin(context))}_debug "ActiveHelp will need delimiter"
                hasActiveHelp=1
            fi
            continue
        fi

        if [ -n "$comp" ]; then
            # If requested, completions are returned with a description.
            # The description is preceded by a TAB character.
            # For zsh's _describe, we need to use a : instead of a TAB.
            # We first need to escape any : as part of the completion itself.
            comp=\${comp//:/\\:}

            local tab="$(printf '\\t')"
            comp=\${comp//$tab/:}

            __${snakeCase(getAppBin(context))}_debug "Adding completion: \${comp}"
            completions+=\${comp}
            lastComp=$comp
        fi
    done < <(printf "%s\n" "\${out[@]}")

    # Add a delimiter after the activeHelp statements, but only if:
    # - there are completions following the activeHelp statements, or
    # - file completion will be performed (so there will be choices after the activeHelp)
    if [ $hasActiveHelp -eq 1 ]; then
        if [ \${#completions} -ne 0 ] || [ $((directive & shellCompDirectiveNoFileComp)) -eq 0 ]; then
            __${snakeCase(getAppBin(context))}_debug "Adding activeHelp delimiter"
            compadd -x "--"
            hasActiveHelp=0
        fi
    fi

    if [ $((directive & shellCompDirectiveNoSpace)) -ne 0 ]; then
        __${snakeCase(getAppBin(context))}_debug "Activating nospace."
        noSpace="-S ''"
    fi

    if [ $((directive & shellCompDirectiveKeepOrder)) -ne 0 ]; then
        __${snakeCase(getAppBin(context))}_debug "Activating keep order."
        keepOrder="-V"
    fi

    if [ $((directive & shellCompDirectiveFilterFileExt)) -ne 0 ]; then
        # File extension filtering
        local filteringCmd
        filteringCmd='_files'
        for filter in \${completions[@]}; do
            if [ \${filter[1]} != '*' ]; then
                # zsh requires a glob pattern to do file filtering
                filter="\\*.$filter"
            fi
            filteringCmd+=" -g $filter"
        done
        filteringCmd+=" \${flagPrefix}"

        __${snakeCase(getAppBin(context))}_debug "File filtering command: $filteringCmd"
        _arguments '*:filename:'"$filteringCmd"
    elif [ $((directive & shellCompDirectiveFilterDirs)) -ne 0 ]; then
        # File completion for directories only
        local subdir
        subdir="\${completions[1]}"
        if [ -n "$subdir" ]; then
            __${snakeCase(getAppBin(context))}_debug "Listing directories in $subdir"
            pushd "\${subdir}" >/dev/null 2>&1
        else
            __${snakeCase(getAppBin(context))}_debug "Listing directories in ."
        fi

        local result
        _arguments '*:dirname:_files -/'" \${flagPrefix}"
        result=$?
        if [ -n "$subdir" ]; then
            popd >/dev/null 2>&1
        fi
        return $result
    else
        __${snakeCase(getAppBin(context))}_debug "Calling _describe"
        if eval _describe $keepOrder "completions" completions -Q \${flagPrefix} \${noSpace}; then
            __${snakeCase(getAppBin(context))}_debug "_describe found some completions"

            # Return the success of having called _describe
            return 0
        else
            __${snakeCase(getAppBin(context))}_debug "_describe did not find completions."
            __${snakeCase(getAppBin(context))}_debug "Checking if we should do file completion."
            if [ $((directive & shellCompDirectiveNoFileComp)) -ne 0 ]; then
                __${snakeCase(getAppBin(context))}_debug "deactivating file completion"

                # Return 0 to indicate completion is finished and prevent zsh from
                # trying other completion algorithms (which could cause hanging).
                # We use NoFileComp directive to explicitly disable file completion.
                return 0
            else
                # Perform file completion
                __${snakeCase(getAppBin(context))}_debug "Activating file completion"

                # We must return the result of this command, so it must be the
                # last command, or else we must store its result to return it.
                _arguments '*:filename:_files'" \${flagPrefix}"
            fi
        fi
    fi
}

# don't run the completion function when being sourced or eval-ed
if [ "\${funcstack[1]}" = "_${snakeCase(getAppBin(context))}" ]; then
    _${snakeCase(getAppBin(context))}
fi
\`);`}
        />
        <Spacing />
        <IfStatement condition={code`options.config`}>
          <VarDeclaration
            let
            name="configFilePath"
            type="string"
            initializer={code`options.config === true ? "~/.zshrc" : options.config`}
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

          success(\`${getAppTitle(context)} Zsh completion script has been generated and appended to \${colors.bold(configFilePath)}. Please restart your terminal or run \`source \${configFilePath}\` to apply the changes.\`); `}
        </IfStatement>
        <Spacing />
        <IfStatement condition={code`options.script`}>
          {code`const outputPath = options.script === true ? "${getAppBin(context)}-completions.zsh" : options.script;
          await writeFile(outputPath, stripAnsi(completions));

          success(\`${getAppTitle(context)} Zsh completion script has been generated at \${colors.bold(outputPath)}.\`);`}
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
