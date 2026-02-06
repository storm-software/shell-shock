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
  getPositionalCommandOptionName,
  isPositionalCommandOption
} from "../plugin-utils/context-helpers";
import type { CommandTree } from "../types";

export interface ValidationFailure {
  code: string;
  details: string;
}

export function validateCommandPositionalOptions(
  command: CommandTree
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!command.isVirtual && command.path.segments.length > 0) {
    const positionalOptionPathNames = new Set<string>();
    for (const segment of command.path.segments.filter(
      isPositionalCommandOption
    ) ?? []) {
      if (positionalOptionPathNames.has(segment)) {
        failures.push({
          code: "DUPLICATE_POSITIONAL_OPTION_PATH_NAME",
          details: `Duplicate positional option path name "${getPositionalCommandOptionName(segment)}" found in command.`
        });
      }
      positionalOptionPathNames.add(getPositionalCommandOptionName(segment));
    }

    if (
      command.path.segments.filter(isPositionalCommandOption).length !==
      Object.keys(command.path.positional ?? {}).length
    ) {
      failures.push({
        code: "POSITIONAL_OPTION_PATH_MISMATCH",
        details: `Mismatch between positional options path segments and defined path positional options in command (found ${
          command.path.segments.filter(isPositionalCommandOption).length
        } positional options in the command folder path "${command.path.segments.join("/")}", but ${
          Object.keys(command.path.positional ?? {}).length
        } potential positional option path(s) could be determined from the command's function signature).`
      });
    }

    const missing = command.path.segments
      .filter(isPositionalCommandOption)
      .filter(
        segment =>
          Object.prototype.hasOwnProperty.call(
            command.path.positional ?? {},
            getPositionalCommandOptionName(segment)
          ) === false
      );
    if (missing.length > 0) {
      failures.push({
        code: "MISSING_POSITIONAL_OPTION_PATH",
        details: `${missing.length} positional option path segment${missing.length > 1 ? "s" : ""} in the command folder path "${command.path.segments.join(
          "/"
        )}" do${missing.length > 1 ? "" : "es"} not have corresponding entr${
          missing.length > 1 ? "ies" : "y"
        } in the command's path positional options: \n- ${missing
          .map(segment => `"${getPositionalCommandOptionName(segment)}"`)
          .join("\n- ")}`
      });
    } else {
      for (const varName of Object.keys(command.path.positional ?? {})) {
        if (
          !command.path.segments
            .filter(isPositionalCommandOption)
            .find(
              segment => getPositionalCommandOptionName(segment) === varName
            )
        ) {
          failures.push({
            code: "UNUSED_POSITIONAL_OPTION_PATH",
            details: `The positional option path name "${varName}" defined in the command's path positional options is not used in the command folder path "${command.path.segments.join(
              "/"
            )}".`
          });
        }
      }

      command.path.segments.forEach((segment, index) => {
        if (
          isPositionalCommandOption(segment) &&
          command.path.positional[getPositionalCommandOptionName(segment)]
            ?.variadic === true &&
          index + 1 < command.path.segments.length &&
          command.path.segments[index + 1] &&
          command.path.positional[
            getPositionalCommandOptionName(command.path.segments[index + 1]!)
          ]?.variadic === true
        ) {
          failures.push({
            code: "MULTIPLE_VARIADIC_POSITIONAL_OPTION_PATHS",
            details: `The positional option path segment "${getPositionalCommandOptionName(
              segment
            )}" in the command at path "${command.path.segments.join(
              "/"
            )}" is marked as variadic, and it is followed by another variadic positional option path segment "${getPositionalCommandOptionName(
              command.path.segments[index + 1]!
            )}". Only one variadic positional option path segment is allowed per command, and it must be the final path segment.`
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

export function validateCommand(command: CommandTree): ValidationFailure[] {
  const results: ValidationFailure[] = [];

  let failures = validateCommandPositionalOptions(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  failures = validateCommandOptions(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  return results;
}
