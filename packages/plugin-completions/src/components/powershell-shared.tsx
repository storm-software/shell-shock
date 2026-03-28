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
import { getAppBin, getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import { camelCase } from "@stryke/string-format/camel-case";
import { CompletionDirective } from "../helpers";
import { EXEC_COMMAND } from "../helpers/complete-command";
import type { CompletionsPluginContext } from "../types/plugin";

/**
 * The PowerShell Completions generation for the Shell Shock project.
 */
export function PowerShellCompletionsShared() {
  const context = usePowerlines<CompletionsPluginContext>();

  const bin = computed(() => getAppBin(context));
  const name = computed(() => camelCase(bin.value));

  return (
    <TypescriptFile
      path={joinPaths(
        context.entryPath,
        "completions",
        "powershell",
        "shared.ts"
      )}
      builtinImports={{
        console: ["colors"]
      }}>
      <Spacing />
      <VarDeclaration
        const
        export
        name="SHELL_COMPLETIONS"
        initializer={code` \`# powershell completion for ${getAppTitle(context)}

  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    function __${name.value}_debug {
        if ($env:BASH_COMP_DEBUG_FILE) {
            "$args" | Out-File -Append -FilePath "$env:BASH_COMP_DEBUG_FILE"
        }
    }

    filter __${name.value}_escapeStringWithSpecialChars {
        $_ -replace '\\s|#|@|\\$|;|,|''|\\{|\\}|\\(|\\)|"|\\||<|>|&','\\\`$&'
    }

[scriptblock]$__${name.value}CompleterBlock = {
    param(
            $WordToComplete,
            $CommandAst,
            $CursorPosition
        )

    # Get the current command-line and convert into a string
    $Command = $CommandAst.CommandElements
    $Command = "$Command"

    __${name.value}_debug ""
    __${name.value}_debug "========= starting completion logic =========="
    __${name.value}_debug "WordToComplete: $WordToComplete Command: $Command CursorPosition: $CursorPosition"

    # The user could have moved the cursor backwards on the command-line.
    # We need to trigger completion from the $CursorPosition location, so we need
    # to truncate the command-line ($Command) up to the $CursorPosition location.
    # Make sure the $Command is longer then the $CursorPosition before we truncate.
    # This happens because the $Command does not include the last space.
    if ($Command.Length -gt $CursorPosition) {
        $Command = $Command.Substring(0, $CursorPosition)
    }
    __${name.value}_debug "Truncated command: $Command"

    $ShellCompDirectiveError=${CompletionDirective.CompletionDirectiveError}
    $ShellCompDirectiveNoSpace=${CompletionDirective.CompletionDirectiveNoSpace}
    $ShellCompDirectiveNoFileComp=${
      CompletionDirective.CompletionDirectiveNoFileComp
    }
    $ShellCompDirectiveFilterFileExt=${
      CompletionDirective.CompletionDirectiveFilterFileExt
    }
    $ShellCompDirectiveFilterDirs=${
      CompletionDirective.CompletionDirectiveFilterDirs
    }
    $ShellCompDirectiveKeepOrder=${
      CompletionDirective.CompletionDirectiveKeepOrder
    }

    # Prepare the command to request completions for the program.
    # Split the command at the first space to separate the program and arguments.
    $Program, $Arguments = $Command.Split(" ", 2)

    $QuotedArgs = ($Arguments -split ' ' | ForEach-Object { "'" + ($_ -replace "'", "''") + "'" }) -join ' '
    __${name.value}_debug "QuotedArgs: $QuotedArgs"

    $RequestComp = "& ${EXEC_COMMAND} complete '--' $QuotedArgs"
    __${name.value}_debug "RequestComp: $RequestComp"

    # we cannot use $WordToComplete because it
    # has the wrong values if the cursor was moved
    # so use the last argument
    if ($WordToComplete -ne "" ) {
        $WordToComplete = $Arguments.Split(" ")[-1]
    }
    __${name.value}_debug "New WordToComplete: $WordToComplete"


    # Check for flag with equal sign
    $IsEqualFlag = ($WordToComplete -Like "--*=*" )
    if ( $IsEqualFlag ) {
        __${name.value}_debug "Completing equal sign flag"
        # Remove the flag part
        $Flag, $WordToComplete = $WordToComplete.Split("=", 2)
    }

    if ( $WordToComplete -eq "" -And ( -Not $IsEqualFlag )) {
        # If the last parameter is complete (there is a space following it)
        # We add an extra empty parameter so we can indicate this to the go method.
        __${name.value}_debug "Adding extra empty parameter"
        # PowerShell 7.2+ changed the way how the arguments are passed to executables,
        # so for pre-7.2 or when Legacy argument passing is enabled we need to use
        if ($PSVersionTable.PsVersion -lt [version]'7.2.0' -or
            ($PSVersionTable.PsVersion -lt [version]'7.3.0' -and -not [ExperimentalFeature]::IsEnabled("PSNativeCommandArgumentPassing")) -or
            (($PSVersionTable.PsVersion -ge [version]'7.3.0' -or [ExperimentalFeature]::IsEnabled("PSNativeCommandArgumentPassing")) -and
              $PSNativeCommandArgumentPassing -eq 'Legacy')) {
             $RequestComp="$RequestComp" + ' \\\`"\\\`"'
        } else {
             $RequestComp = "$RequestComp" + ' ""'
        }
    }

    __${name.value}_debug "Calling $RequestComp"
    # First disable ActiveHelp which is not supported for Powershell
    $env:ActiveHelp = 0

    # call the command store the output in $out and redirect stderr and stdout to null
    # $Out is an array contains each line per element
    Invoke-Expression -OutVariable out "$RequestComp" 2>&1 | Out-Null

    # get directive from last line
    [int]$Directive = $Out[-1].TrimStart(':')
    if ($Directive -eq "") {
        # There is no directive specified
        $Directive = 0
    }
    __${name.value}_debug "The completion directive is: $Directive"

    # remove directive (last element) from out
    $Out = $Out | Where-Object { $_ -ne $Out[-1] }
    __${name.value}_debug "The completions are: $Out"
    if (($Directive -band $ShellCompDirectiveError) -ne 0 ) {
        # Error code.  No completion.
        __${name.value}_debug "Received error from custom completion go code"
        return
    }

    $Longest = 0
    [Array]$Values = $Out | ForEach-Object {
        # Split the output in name and description
        $Name, $Description = $_.Split("\\\`t", 2)
        __${name.value}_debug "Name: $Name Description: $Description"

        # Look for the longest completion so that we can format things nicely
        if ($Longest -lt $Name.Length) {
            $Longest = $Name.Length
        }

        # Set the description to a one space string if there is none set.
        # This is needed because the CompletionResult does not accept an empty string as argument
        if (-Not $Description) {
            $Description = " "
        }
        @{ Name = "$Name"; Description = "$Description" }
    }


    $Space = " "
    if (($Directive -band $ShellCompDirectiveNoSpace) -ne 0 ) {
        # remove the space here
        __${name.value}_debug "ShellCompDirectiveNoSpace is called"
        $Space = ""
    }

    if ((($Directive -band $ShellCompDirectiveFilterFileExt) -ne 0 ) -or
       (($Directive -band $ShellCompDirectiveFilterDirs) -ne 0 ))  {
        __${
          name.value
        }_debug "ShellCompDirectiveFilterFileExt ShellCompDirectiveFilterDirs are not supported"

        # return here to prevent the completion of the extensions
        return
    }

    $Values = $Values | Where-Object {
        # filter the result
        $_.Name -like "$WordToComplete*"

        # Join the flag back if we have an equal sign flag
        if ( $IsEqualFlag ) {
            __${
              name.value
            }_debug "Join the equal sign flag back to the completion value"
            $_.Name = $Flag + "=" + $_.Name
        }
    }

    # we sort the values in ascending order by name if keep order isn't passed
    if (($Directive -band $ShellCompDirectiveKeepOrder) -eq 0 ) {
        $Values = $Values | Sort-Object -Property Name
    }

    if (($Directive -band $ShellCompDirectiveNoFileComp) -ne 0 ) {
        __${name.value}_debug "ShellCompDirectiveNoFileComp is called"

        if ($Values.Length -eq 0) {
            # Just print an empty string here so the
            # shell does not start to complete paths.
            # We cannot use CompletionResult here because
            # it does not accept an empty string as argument.
            ""
            return
        }
    }

    # Get the current mode
    $Mode = (Get-PSReadLineKeyHandler | Where-Object { $_.Key -eq "Tab" }).Function
    __${name.value}_debug "Mode: $Mode"

    $Values | ForEach-Object {

        # store temporary because switch will overwrite $_
        $comp = $_

        # PowerShell supports three different completion modes
        # - TabCompleteNext (default windows style - on each key press the next option is displayed)
        # - Complete (works like bash)
        # - MenuComplete (works like zsh)
        # You set the mode with Set-PSReadLineKeyHandler -Key Tab -Function <mode>

        # CompletionResult Arguments:
        # 1) CompletionText text to be used as the auto completion result
        # 2) ListItemText   text to be displayed in the suggestion list
        # 3) ResultType      type of completion result
        # 4) ToolTip        text for the tooltip with details about the object

        switch ($Mode) {

            # bash like
            "Complete" {

                if ($Values.Length -eq 1) {
                    __${name.value}_debug "Only one completion left"

                    # insert space after value
                    [System.Management.Automation.CompletionResult]::new($($comp.Name | __${
                      name.value
                    }_escapeStringWithSpecialChars) + $Space, "$($comp.Name)", 'ParameterValue', "$($comp.Description)")

                } else {
                    # Add the proper number of spaces to align the descriptions
                    while($comp.Name.Length -lt $Longest) {
                        $comp.Name = $comp.Name + " "
                    }

                    # Check for empty description and only add parentheses if needed
                    if ($($comp.Description) -eq " " ) {
                        $Description = ""
                    } else {
                        $Description = "  ($($comp.Description))"
                    }

                    [System.Management.Automation.CompletionResult]::new("$($comp.Name)$Description", "$($comp.Name)$Description", 'ParameterValue', "$($comp.Description)")
                }
             }

            # zsh like
            "MenuComplete" {
                # insert space after value
                # MenuComplete will automatically show the ToolTip of
                # the highlighted value at the bottom of the suggestions.
                [System.Management.Automation.CompletionResult]::new($($comp.Name | __${
                  name.value
                }_escapeStringWithSpecialChars) + $Space, "$($comp.Name)", 'ParameterValue', "$($comp.Description)")
            }

            # TabCompleteNext and in case we get something unknown
            Default {
                # Like MenuComplete but we don't want to add a space here because
                # the user need to press space anyway to get the completion.
                # Description will not be shown because that's not possible with TabCompleteNext
                [System.Management.Automation.CompletionResult]::new($($comp.Name | __${
                  name.value
                }_escapeStringWithSpecialChars), "$($comp.Name)", 'ParameterValue', "$($comp.Description)")
            }
        }
    }
}

Register-ArgumentCompleter -CommandName '${bin.value}' -ScriptBlock $__${
          name.value
        }CompleterBlock
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
            return \`\${colors.dim(line)}\`;
          }

          return colors.white(line).replaceAll(/(?<=\\\$(\\{|\\()).*(?=(\\}\\)))/g, colors.green("$&"))
            .replaceAll(/\\".*\\"/g, colors.cyan("$&"))
            .replaceAll(/(\\[|\\]|\\(|\\)|\\||<|>|\\$\\(|\\$?\\{|\\}|\\+|=|;|::new|::OutputEncoding|::UTF8)/g, colors.bold(colors.gray("$&")))
            .replaceAll(/(switch|complete)\\s+/g, colors.green("$&"))
            .replaceAll(/(?<=(switch|complete)\\s+)\\w/g, colors.bold(colors.greenBright("$&")))
            .replaceAll(/(Get-PSReadLineKeyHandler|Where-Object|ExperimentalFeature|Console|ScriptBlock|Array|ForEach-Object|Register-ArgumentCompleter|System.Management.Automation.CompletionResult|$\\w+)\\s+/g, colors.red("$&"))
            .replaceAll(/(?<=(Get-PSReadLineKeyHandler|Where-Object|ExperimentalFeature|Console|ScriptBlock|Array|ForEach-Object|Register-ArgumentCompleter|System.Management.Automation.CompletionResult|$\\w+)\\s+)\\w/g, colors.bold(colors.redBright("$&")))
            .replaceAll(/while\\s+/g, colors.cyan("$&"))
            .replaceAll(/(?<=while\\s+)\\w/g, colors.bold(colors.cyanBright("$&")))
            .replaceAll(/(if|fi|else|elif|then|done)\\s+/g, colors.green("$&"))
            .replaceAll(/\\$?__\\w/g, colors.bold(colors.magentaBright("$&")))
            .replaceAll(/(?<=\\s)(-\\w|--\\w[\\w-]*)(?=\\s|$)/g, colors.bold(colors.magenta("$&")));

        }).join("\\n"); `}
      />
    </TypescriptFile>
  );
}
