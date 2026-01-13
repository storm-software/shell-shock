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

import {
  getVariableCommandPathName,
  isVariableCommandPath
} from "../plugin-utils/context-helpers";
import type { CommandTree } from "../types";

export interface ValidationFailure {
  code: string;
  details: string;
}

export function validateCommandVariablePaths(
  command: CommandTree
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!command.isVirtual && command.path.segments.length > 0) {
    const variablePathNames = new Set<string>();
    for (const segment of command.path.segments.filter(isVariableCommandPath) ??
      []) {
      if (variablePathNames.has(segment)) {
        failures.push({
          code: "DUPLICATE_VARIABLE_PATH_NAME",
          details: `Duplicate variable path name "${getVariableCommandPathName(segment)}" found in command.`
        });
      }
      variablePathNames.add(getVariableCommandPathName(segment));
    }

    if (
      command.path.segments.filter(isVariableCommandPath).length !==
      Object.keys(command.path.variables ?? {}).length
    ) {
      failures.push({
        code: "VARIABLE_PATH_MISMATCH",
        details: `Mismatch between variable path segments and defined path variables in command (found ${
          command.path.segments.filter(isVariableCommandPath).length
        } variables in the command folder path "${command.path.segments.join("/")}", but ${
          Object.keys(command.path.variables ?? {}).length
        } potential variable path(s) could be determined from the command's function signature).`
      });
    }

    const missing = command.path.segments
      .filter(isVariableCommandPath)
      .filter(
        segment =>
          Object.prototype.hasOwnProperty.call(
            command.path.variables ?? {},
            getVariableCommandPathName(segment)
          ) === false
      );
    if (missing.length > 0) {
      failures.push({
        code: "MISSING_VARIABLE_PATH",
        details: `${missing.length} variable path segment${missing.length > 1 ? "s" : ""} in the command folder path "${command.path.segments.join(
          "/"
        )}" do${missing.length > 1 ? "" : "es"} not have corresponding entr${
          missing.length > 1 ? "ies" : "y"
        } in the command's path variables: \n- ${missing
          .map(segment => `"${getVariableCommandPathName(segment)}"`)
          .join("\n- ")}`
      });
    } else {
      for (const varName of Object.keys(command.path.variables ?? {})) {
        if (
          !command.path.segments
            .filter(isVariableCommandPath)
            .find(segment => getVariableCommandPathName(segment) === varName)
        ) {
          failures.push({
            code: "UNUSED_VARIABLE_PATH",
            details: `The variable path name "${varName}" defined in the command's path variables is not used in the command folder path "${command.path.segments.join(
              "/"
            )}".`
          });
        }
      }

      command.path.segments.forEach((segment, index) => {
        if (
          isVariableCommandPath(segment) &&
          command.path.variables[getVariableCommandPathName(segment)]
            ?.variadic === true &&
          index + 1 < command.path.segments.length &&
          command.path.segments[index + 1] &&
          command.path.variables[
            getVariableCommandPathName(command.path.segments[index + 1]!)
          ]?.variadic === true
        ) {
          failures.push({
            code: "MULTIPLE_VARIADIC_VARIABLE_PATHS",
            details: `The variable path segment "${getVariableCommandPathName(
              segment
            )}" in the command at path "${command.path.segments.join(
              "/"
            )}" is marked as variadic, and it is followed by another variadic variable path segment "${getVariableCommandPathName(
              command.path.segments[index + 1]!
            )}". Only one variadic variable path segment is allowed per command, and it must be the final path segment.`
          });
        }
      });
    }
  }

  return failures;
}

export function validateCommandOptions(
  command: CommandTree
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  const optionNames = new Set<string>();
  for (const option of Object.values(command.options ?? {})) {
    if (optionNames.has(option.name)) {
      failures.push({
        code: "DUPLICATE_OPTION_NAME",
        details: `Duplicate option name "${option.name}" found in command.`
      });
    }
    optionNames.add(option.name);

    for (const alias of option.alias) {
      if (optionNames.has(alias)) {
        failures.push({
          code: "DUPLICATE_OPTION_ALIAS",
          details: `Duplicate option name "${alias}" (an alias of "${
            option.name
          }") found in command.`
        });
      }
      optionNames.add(alias);
    }
  }

  return failures;
}

export function validateCommandParams(
  command: CommandTree
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!command.isVirtual && command.params.length > 0) {
    const paramNames = new Set<string>();
    command.params.forEach((param, index) => {
      if (paramNames.has(param.name)) {
        failures.push({
          code: "DUPLICATE_PARAM_NAME",
          details: `Duplicate parameter name "${param.name}" found in command.`
        });
      }
      paramNames.add(param.name);

      if (param.optional) {
        command.params.slice(index + 1).forEach(nextParam => {
          if (nextParam.optional && !nextParam.default) {
            failures.push({
              code: "OPTIONAL_PARAM_NOT_LAST",
              details: `The parameter "${nextParam.name}" in the command at path "${command.path.segments.join(
                "/"
              )}" is required, but it follows an optional parameter "${
                param.name
              }". All required parameters must come before any optional parameters.`
            });
          }
        });
      }

      if (param.variadic && index + 1 < command.params.length) {
        if (command.params[index + 1]?.variadic) {
          failures.push({
            code: "MULTIPLE_VARIADIC_PARAMS",
            details: `The parameter "${param.name}" in the command at path "${command.path.segments.join(
              "/"
            )}" is variadic, and it is followed by another variadic parameter "${
              command.params[index + 1]?.name
            }". Only one variadic parameter is allowed per command, and it must be the final parameter.`
          });
        }
      }
    });
  }

  return failures;
}

export function validateCommand(command: CommandTree): ValidationFailure[] {
  const results: ValidationFailure[] = [];

  let failures = validateCommandVariablePaths(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  failures = validateCommandParams(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  failures = validateCommandOptions(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  return results;
}
