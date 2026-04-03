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
 * The Fish Completions generation for the Shell Shock project.
 */
export function FishCompletionsShared() {
  const context = usePowerlines<CompletionsPluginContext>();

  const bin = computed(() => getAppBin(context));
  const name = computed(() => snakeCase(bin.value));

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "completions", "fish", "shared.ts")}
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
        initializer={code` \`function __${name.value}_debug
    set -l file "$BASH_COMP_DEBUG_FILE"
    if test -n "$file"
        echo "$argv" >> $file
    end
end

function __${name.value}_perform_completion
    __${name.value}_debug "Starting __${name.value}_perform_completion"

    # Extract all args except the last one
    set -l args (commandline -opc)
    # Extract the last arg and escape it in case it is a space or wildcard
    set -l lastArg (string escape -- (commandline -ct))

    __${name.value}_debug "args: $args"
    __${name.value}_debug "last arg: $lastArg"

    # Build the completion request command
    set -l requestComp "${EXEC_COMMAND} complete -- (string join ' ' -- (string escape -- $args[2..-1])) $lastArg"

    __${name.value}_debug "Calling $requestComp"
    set -l results (eval $requestComp 2> /dev/null)

    # Some programs may output extra empty lines after the directive.
    # Let's ignore them or else it will break completion.
    # Ref: https://github.com/spf13/cobra/issues/1279
    for line in $results[-1..1]
        if test (string trim -- $line) = ""
            # Found an empty line, remove it
            set results $results[1..-2]
        else
            # Found non-empty line, we have our proper output
            break
        end
    end

    set -l comps $results[1..-2]
    set -l directiveLine $results[-1]

    # For Fish, when completing a flag with an = (e.g., <program> -n=<TAB>)
    # completions must be prefixed with the flag
    set -l flagPrefix (string match -r -- '-.*=' "$lastArg")

    __${name.value}_debug "Comps: $comps"
    __${name.value}_debug "DirectiveLine: $directiveLine"
    __${name.value}_debug "flagPrefix: $flagPrefix"

    for comp in $comps
        printf "%s%s\\n" "$flagPrefix" "$comp"
    end

    printf "%s\\n" "$directiveLine"
end

# This function limits calls to __${
          name.value
        }_perform_completion, by caching the result
function __${name.value}_perform_completion_once
    __${name.value}_debug "Starting __${name.value}_perform_completion_once"

    if test -n "$__${name.value}_perform_completion_once_result"
        __${name.value}_debug "Seems like a valid result already exists, skipping __${name.value}_perform_completion"
        return 0
    end

    set --global __${name.value}_perform_completion_once_result (__${
      name.value
    }_perform_completion)
    if test -z "$__${name.value}_perform_completion_once_result"
        __${name.value}_debug "No completions, probably due to a failure"
        return 1
    end

    __${name.value}_debug "Performed completions and set __${
      name.value
    }_perform_completion_once_result"
    return 0
end

# This function is used to clear the cached result after completions are run
function __${name.value}_clear_perform_completion_once_result
    __${name.value}_debug ""
    __${name.value}_debug "========= clearing previously set __${
      name.value
    }_perform_completion_once_result variable =========="
    set --erase __${name.value}_perform_completion_once_result
    __${name.value}_debug "Successfully erased the variable __${
      name.value
    }_perform_completion_once_result"
end

function __${name.value}_requires_order_preservation
    __${name.value}_debug ""
    __${name.value}_debug "========= checking if order preservation is required =========="

    __${name.value}_perform_completion_once
    if test -z "$__${name.value}_perform_completion_once_result"
        __${name.value}_debug "Error determining if order preservation is required"
        return 1
    end

    set -l directive (string sub --start 2 $__${
      name.value
    }_perform_completion_once_result[-1])
    __${name.value}_debug "Directive is: $directive"

    set -l shellCompDirectiveKeepOrder ${
      CompletionDirective.CompletionDirectiveKeepOrder
    }
    set -l keeporder (math (math --scale 0 $directive / $shellCompDirectiveKeepOrder) % 2)
    __${name.value}_debug "Keeporder is: $keeporder"

    if test $keeporder -ne 0
        __${name.value}_debug "This does require order preservation"
        return 0
    end

    __${name.value}_debug "This doesn't require order preservation"
    return 1
end

# This function does two things:
# - Obtain the completions and store them in the global __${
          name.value
        }_comp_results
# - Return false if file completion should be performed
function __${name.value}_prepare_completions
    __${name.value}_debug ""
    __${name.value}_debug "========= starting completion logic =========="

    # Start fresh
    set --erase __${name.value}_comp_results

    __${name.value}_perform_completion_once
    __${name.value}_debug "Completion results: $__${
      name.value
    }_perform_completion_once_result"

    if test -z "$__${name.value}_perform_completion_once_result"
        __${name.value}_debug "No completion, probably due to a failure"
        # Might as well do file completion, in case it helps
        return 1
    end

    set -l directive (string sub --start 2 $__${
      name.value
    }_perform_completion_once_result[-1])
    set --global __${name.value}_comp_results $__${
      name.value
    }_perform_completion_once_result[1..-2]

    __${name.value}_debug "Completions are: $__${name.value}_comp_results"
    __${name.value}_debug "Directive is: $directive"

    set -l shellCompDirectiveError ${
      CompletionDirective.CompletionDirectiveError
    }
    set -l shellCompDirectiveNoSpace ${
      CompletionDirective.CompletionDirectiveNoSpace
    }
    set -l shellCompDirectiveNoFileComp ${
      CompletionDirective.CompletionDirectiveNoFileComp
    }
    set -l shellCompDirectiveFilterFileExt ${
      CompletionDirective.CompletionDirectiveFilterFileExt
    }
    set -l shellCompDirectiveFilterDirs ${
      CompletionDirective.CompletionDirectiveFilterDirs
    }
    if test -z "$directive"
        set directive 0
    end

    set -l compErr (math (math --scale 0 $directive / $shellCompDirectiveError) % 2)
    if test $compErr -eq 1
        __${name.value}_debug "Received error directive: aborting."
        # Might as well do file completion, in case it helps
        return 1
    end

    set -l filefilter (math (math --scale 0 $directive / $shellCompDirectiveFilterFileExt) % 2)
    set -l dirfilter (math (math --scale 0 $directive / $shellCompDirectiveFilterDirs) % 2)
    if test $filefilter -eq 1; or test $dirfilter -eq 1
        __${name.value}_debug "File extension filtering or directory filtering not supported"
        # Do full file completion instead
        return 1
    end

    set -l nospace (math (math --scale 0 $directive / $shellCompDirectiveNoSpace) % 2)
    set -l nofiles (math (math --scale 0 $directive / $shellCompDirectiveNoFileComp) % 2)

    __${name.value}_debug "nospace: $nospace, nofiles: $nofiles"

    # If we want to prevent a space, or if file completion is NOT disabled,
    # we need to count the number of valid completions.
    # To do so, we will filter on prefix as the completions we have received
    # may not already be filtered so as to allow fish to match on different
    # criteria than the prefix.
    if test $nospace -ne 0; or test $nofiles -eq 0
        set -l prefix (commandline -t | string escape --style=regex)
        __${name.value}_debug "prefix: $prefix"

        set -l completions (string match -r -- "^$prefix.*" $__${
          name.value
        }_comp_results)
        set --global __${name.value}_comp_results $completions
        __${name.value}_debug "Filtered completions are: $__${
          name.value
        }_comp_results"

        # Important not to quote the variable for count to work
        set -l numComps (count $__${name.value}_comp_results)
        __${name.value}_debug "numComps: $numComps"

        if test $numComps -eq 1; and test $nospace -ne 0
            # We must first split on \\t to get rid of the descriptions to be
            # able to check what the actual completion will be.
            # We don't need descriptions anyway since there is only a single
            # real completion which the shell will expand immediately.
            set -l split (string split --max 1 "\\t" $__${
              name.value
            }_comp_results[1])

            # Fish won't add a space if the completion ends with any
            # of the following characters: @=/:.,
            set -l lastChar (string sub -s -1 -- $split)
            if not string match -r -q "[@=/:.,]" -- "$lastChar"
                # In other cases, to support the "nospace" directive we trick the shell
                # by outputting an extra, longer completion.
                __${name.value}_debug "Adding second completion to perform nospace directive"
                set --global __${name.value}_comp_results $split[1] $split[1].
                __${name.value}_debug "Completions are now: $__${
                  name.value
                }_comp_results"
            end
        end

        if test $numComps -eq 0; and test $nofiles -eq 0
            # To be consistent with bash and zsh, we only trigger file
            # completion when there are no other completions
            __${name.value}_debug "Requesting file completion"
            return 1
        end
    end

    return 0
end

# Since Fish completions are only loaded once the user triggers them, we trigger them ourselves
# so we can properly delete any completions provided by another script.
# Only do this if the program can be found, or else fish may print some errors; besides,
# the existing completions will only be loaded if the program can be found.
if type -q "${bin.value}"
    # The space after the program name is essential to trigger completion for the program
    # and not completion of the program name itself.
    # Also, we use '> /dev/null 2>&1' since '&>' is not supported in older versions of fish.
    complete --do-complete "${bin.value} " > /dev/null 2>&1
end

# Remove any pre-existing completions for the program since we will be handling all of them.
complete -c ${bin.value} -e
# This will get called after the two calls below and clear the cached result
complete -c ${bin.value} -n '__${name.value}_clear_perform_completion_once_result'
# The call to __${name.value}_prepare_completions will setup __${
          name.value
        }_comp_results
# which provides the program's completion choices.
# If this doesn't require order preservation, we don't use the -k flag
complete -c ${getAppBin(
          context
        )} -n 'not __${name.value}_requires_order_preservation && __${
          name.value
        }_prepare_completions' -f -a '$__${name.value}_comp_results'
# Otherwise we use the -k flag
complete -k -c ${bin.value} -n '__${name.value}_requires_order_preservation && __${
          name.value
        }_prepare_completions' -f -a '$__${name.value}_comp_results'
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
            .replaceAll(/(\\"|\\').*(\\"|\\')/g, cyan("$&"))
            .replaceAll(/(\\[|\\]|\\(|\\)|\\||<|>|\\$\\(|\\$?\\{|\\}|\\+|=|;|:)/g, bold(gray("$&")))
            .replaceAll(/(function|complete)\\s+/g, green("$&"))
            .replaceAll(/(?<=(function|complete)\\s+)\\w/g, bold(greenBright("$&")))
            .replaceAll(/set\\s+/g, red("$&"))
            .replaceAll(/(?<=set\\s+)\\w/g, bold(redBright("$&")))
            .replaceAll(/while\\s+/g, cyan("$&"))
            .replaceAll(/(?<=while\\s+)\\w/g, bold(cyanBright("$&")))
            .replaceAll(/(if|fi|else|elif|then|done)\\s+/g, green("$&"))
            .replaceAll(/\\s__\\w/g, bold(magentaBright("$&")))
            .replaceAll(/(?<=\\s)(-\\w|--\\w[\\w-]*)(?=\\s|$)/g, bold(magenta("$&")));

        }).join("\\n"); `}
      />
    </TypescriptFile>
  );
}
