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
import { VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript";
import { getAppBin } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import { snakeCase } from "@stryke/string-format/snake-case";
import { CompletionDirective } from "../helpers";
import { EXEC_COMMAND } from "../helpers/complete-command";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The Zsh Completions generation for the Shell Shock project.
 */
export function ZshCompletionsShared() {
  const context = usePowerlines<CompletionsPluginContext>();

  const bin = computed(() => getAppBin(context));
  const name = computed(() => snakeCase(bin.value));

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "completions", "zsh", "shared.ts")}
      builtinImports={{
        console: [
          "white",
          "green",
          "red",
          "bold",
          "cyan",
          "gray",
          "magenta",
          "magentaBright",
          "greenBright",
          "redBright",
          "cyanBright",
          "dim"
        ]
      }}>
      <Spacing />
      <VarDeclaration
        const
        export
        name="SHELL_COMPLETIONS"
        initializer={code` \`__${name.value}_debug() {
    local file="$BASH_COMP_DEBUG_FILE"
    if [[ -n \\\${file} ]]; then
        echo "$*" >> "\\\${file}"
    fi
}

_${name.value}() {
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

    __${name.value}_debug "\\n========= starting completion logic =========="
    __${name.value}_debug "CURRENT: \\\${CURRENT}, words[*]: \\\${words[*]}"

    # The user could have moved the cursor backwards on the command-line.
    # We need to trigger completion from the $CURRENT location, so we need
    # to truncate the command-line ($words) up to the $CURRENT location.
    # (We cannot use $CURSOR as its value does not work when a command is an alias.)
    words=( "\\\${=words[1,CURRENT]}" )
    __${name.value}_debug "Truncated words[*]: \\\${words[*]},"

    lastParam=\\\${words[-1]}
    lastChar=\\\${lastParam[-1]}
    __${name.value}_debug "lastParam: \\\${lastParam}, lastChar: \\\${lastChar}"
    # For zsh, when completing a flag with an = (e.g., ${bin.value} -n=<TAB>)
    # completions must be prefixed with the flag
    setopt local_options BASH_REMATCH
    if [[ "\\\${lastParam}" =~ '-.*=' ]]; then
        # We are dealing with a flag with an =
        flagPrefix="-P \\\${BASH_REMATCH}"
    fi

    # Prepare the command to obtain completions, ensuring arguments are quoted for eval
    local -a args_to_quote=("\\\${(@)words[2,-1]}")
    if [ "\\\${lastChar}" = "" ]; then
        # If the last parameter is complete (there is a space following it)
        # We add an extra empty parameter so we can indicate this to the go completion code.
        __${name.value}_debug "Adding extra empty parameter"
        args_to_quote+=("")
    fi

    # Use Zsh's (q) flag to quote each argument safely for eval
    local quoted_args=("\\\${(@q)args_to_quote}")

    # Join the main command and the quoted arguments into a single string for eval
    requestComp="${EXEC_COMMAND} complete -- \\\${quoted_args[*]}"

    __${name.value}_debug "About to call: eval \\\${requestComp}"

    # Use eval to handle any environment variables and such
    out=$(eval \\\${requestComp} 2>/dev/null)
    __${name.value}_debug "completion output: \\\${out}"

    # Extract the directive integer following a : from the last line
    local lastLine
    while IFS='\n' read -r line; do
        lastLine=\\\${line}
    done < <(printf "%s\n" "\\\${out[@]}")
    __${name.value}_debug "last line: \\\${lastLine}"

    if [ "\\\${lastLine[1]}" = : ]; then
        directive=\\\${lastLine[2,-1]}
        # Remove the directive including the : and the newline
        local suffix
        (( suffix=\\\${#lastLine}+2))
        out=\\\${out[1,-$suffix]}
    else
        # There is no directive specified.  Leave $out as is.
        __${name.value}_debug "No directive found.  Setting to default"
        directive=0
    fi

    __${name.value}_debug "directive: \\\${directive}"
    __${name.value}_debug "completions: \\\${out}"
    __${name.value}_debug "flagPrefix: \\\${flagPrefix}"

    if [ $((directive & shellCompDirectiveError)) -ne 0 ]; then
        __${name.value}_debug "Completion received error. Ignoring completions."
        return
    fi

    local activeHelpMarker="%"
    local endIndex=\\\${#activeHelpMarker}
    local startIndex=$((\\\${#activeHelpMarker}+1))
    local hasActiveHelp=0
    while IFS='\n' read -r comp; do
        # Check if this is an activeHelp statement (i.e., prefixed with $activeHelpMarker)
        if [ "\\\${comp[1,$endIndex]}" = "$activeHelpMarker" ];then
            __${name.value}_debug "ActiveHelp found: $comp"
            comp="\\\${comp[$startIndex,-1]}"
            if [ -n "$comp" ]; then
                compadd -x "\\\${comp}"
                __${name.value}_debug "ActiveHelp will need delimiter"
                hasActiveHelp=1
            fi
            continue
        fi

        if [ -n "$comp" ]; then
            # If requested, completions are returned with a description.
            # The description is preceded by a TAB character.
            # For zsh's _describe, we need to use a : instead of a TAB.
            # We first need to escape any : as part of the completion itself.
            comp=\\\${comp//:/\\:}

            local tab="$(printf '\\t')"
            comp=\\\${comp//$tab/:}

            __${name.value}_debug "Adding completion: \\\${comp}"
            completions+=\\\${comp}
            lastComp=$comp
        fi
    done < <(printf "%s\n" "\\\${out[@]}")

    # Add a delimiter after the activeHelp statements, but only if:
    # - there are completions following the activeHelp statements, or
    # - file completion will be performed (so there will be choices after the activeHelp)
    if [ $hasActiveHelp -eq 1 ]; then
        if [ \\\${#completions} -ne 0 ] || [ $((directive & shellCompDirectiveNoFileComp)) -eq 0 ]; then
            __${name.value}_debug "Adding activeHelp delimiter"
            compadd -x "--"
            hasActiveHelp=0
        fi
    fi

    if [ $((directive & shellCompDirectiveNoSpace)) -ne 0 ]; then
        __${name.value}_debug "Activating nospace."
        noSpace="-S ''"
    fi

    if [ $((directive & shellCompDirectiveKeepOrder)) -ne 0 ]; then
        __${name.value}_debug "Activating keep order."
        keepOrder="-V"
    fi

    if [ $((directive & shellCompDirectiveFilterFileExt)) -ne 0 ]; then
        # File extension filtering
        local filteringCmd
        filteringCmd='_files'
        for filter in \\\${completions[@]}; do
            if [ \\\${filter[1]} != '*' ]; then
                # zsh requires a glob pattern to do file filtering
                filter="\\*.$filter"
            fi
            filteringCmd+=" -g $filter"
        done
        filteringCmd+=" \\\${flagPrefix}"

        __${name.value}_debug "File filtering command: $filteringCmd"
        _arguments '*:filename:'"$filteringCmd"
    elif [ $((directive & shellCompDirectiveFilterDirs)) -ne 0 ]; then
        # File completion for directories only
        local subdir
        subdir="\\\${completions[1]}"
        if [ -n "$subdir" ]; then
            __${name.value}_debug "Listing directories in $subdir"
            pushd "\\\${subdir}" >/dev/null 2>&1
        else
            __${name.value}_debug "Listing directories in ."
        fi

        local result
        _arguments '*:dirname:_files -/'" \\\${flagPrefix}"
        result=$?
        if [ -n "$subdir" ]; then
            popd >/dev/null 2>&1
        fi
        return $result
    else
        __${name.value}_debug "Calling _describe"
        if eval _describe $keepOrder "completions" completions -Q \\\${flagPrefix} \\\${noSpace}; then
            __${name.value}_debug "_describe found some completions"

            # Return the success of having called _describe
            return 0
        else
            __${name.value}_debug "_describe did not find completions."
            __${name.value}_debug "Checking if we should do file completion."
            if [ $((directive & shellCompDirectiveNoFileComp)) -ne 0 ]; then
                __${name.value}_debug "deactivating file completion"

                # Return 0 to indicate completion is finished and prevent zsh from
                # trying other completion algorithms (which could cause hanging).
                # We use NoFileComp directive to explicitly disable file completion.
                return 0
            else
                # Perform file completion
                __${name.value}_debug "Activating file completion"

                # We must return the result of this command, so it must be the
                # last command, or else we must store its result to return it.
                _arguments '*:filename:_files'" \\\${flagPrefix}"
            fi
        fi
    fi
}

# don't run the completion function when being sourced or eval-ed
if [ "\\\${funcstack[1]}" = "_${name.value}" ]; then
    _${name.value}
fi
\`; `}
      />
      <Spacing />
      <VarDeclaration
        export
        const
        name="SHELL_COMPLETIONS_DISPLAY"
        initializer={code` SHELL_COMPLETIONS.split("\\n").map(line => {
          if (!line.trim()) {
            return "";
          }
          if (line.trim().startsWith("#")) {
            return \`\${dim(line)}\`;
          }

          return white(line).replaceAll(/(?<=\\\$(\\{|\\()).*(?=(\\}\\)))/g, green("$&"))
            .replaceAll(/\\".*\\"/g, cyan("$&"))
            .replaceAll(/(\\[|\\]|\\(|\\)|\\||<|>|\\$\\(|\\$?\\{|\\}|\\+|=|;|:)/g, bold(gray("$&")))
            .replaceAll(/(readonly|complete)\\s+/g, green("$&"))
            .replaceAll(/(?<=(readonly|complete)\\s+)\\w/g, bold(greenBright("$&")))
            .replaceAll(/local\\s+/g, red("$&"))
            .replaceAll(/(?<=local\\s+)\\w/g, bold(redBright("$&")))
            .replaceAll(/(for|while)\\s+/g, cyan("$&"))
            .replaceAll(/(?<=for|while\\s+)\\w/g, bold(cyanBright("$&")))
            .replaceAll(/(return|if|fi|else|elif|then|done)\\s+/g, green("$&"))
            .replaceAll(/__\\w/g, bold(magentaBright("$&")))
            .replaceAll(/(?<=\\s)(-\\w|--\\w[\\w-]*)(?=\\s|$)/g, bold(magenta("$&")));

        }).join("\\n"); `}
      />
    </TypescriptFile>
  );
}
