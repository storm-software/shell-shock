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
 * The Bash Completions generation for the Shell Shock project.
 */
export function BashCompletionsShared() {
  const context = usePowerlines<CompletionsPluginContext>();

  const bin = computed(() => getAppBin(context));
  const name = computed(() => snakeCase(bin.value));

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "completions", "bash", "shared.ts")}
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
        export
        const
        name="SHELL_COMPLETIONS"
        initializer={code` \`# Define shell completion directives
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
__${name.value}_debug() {
    if [[ -n \\\${BASH_COMP_DEBUG_FILE:-} ]]; then
        echo "$*" >> "\\\${BASH_COMP_DEBUG_FILE}"
    fi
}

# Function to handle completions
__${name.value}_complete() {
    local cur prev words cword
    _get_comp_words_by_ref -n "=:" cur prev words cword

    local requestComp out directive

    # Build the command to get completions
    requestComp="${EXEC_COMMAND} complete -- \\\${words[@]:1}"

    # Add an empty parameter if the last parameter is complete
    if [[ -z "$cur" ]]; then
        requestComp="$requestComp ''"
    fi

    # Get completions from the program
    out=$(eval "$requestComp" 2>/dev/null)

    # Extract directive if present
    directive=0
    if [[ "$out" == *:* ]]; then
        directive=\\\${out##*:}
        out=\\\${out%:*}
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
            local value=\\\${comp%%$tab*}
            local desc=\\\${comp#*$tab}
            completions+=("$value")
        else
            completions+=("$comp")
        fi
    done <<< "$out"

    # Return completions
    COMPREPLY=( $(compgen -W "\\\${completions[*]}" -- "$cur") )
}

# Register completion function
complete -F __${name.value}_complete ${bin.value}
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
            .replaceAll(/while\\s+/g, cyan("$&"))
            .replaceAll(/(?<=while\\s+)\\w/g, bold(cyanBright("$&")))
            .replaceAll(/(if|fi|else|elif|then|done)\\s+/g, green("$&"))
            .replaceAll(/__\\w/g, bold(magentaBright("$&")))
            .replaceAll(/(?<=\\s)(-\\w|--\\w[\\w-]*)(?=\\s|$)/g, bold(magenta("$&")));

        }).join("\\n"); `}
      />
    </TypescriptFile>
  );
}
