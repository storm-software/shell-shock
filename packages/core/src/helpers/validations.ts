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

import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import type { CommandTree } from "../types";

export interface ValidationFailure {
  code: string;
  details: string;
}

export function validateArguments(command: CommandTree): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  let sequential = false;
  for (const argument of command.arguments ?? []) {
    if (
      (argument.kind === ReflectionKind.string ||
        argument.kind === ReflectionKind.number) &&
      argument.variadic
    ) {
      if (!sequential) {
        sequential = true;
      } else {
        failures.push({
          code: "SEQUENTIAL_VARIADIC_ARGUMENTS",
          details: `Sequential variadic arguments are not allowed - since the argument preceding ${argument.name} is variadic, it must not also be variadic.`
        });
      }
    } else {
      sequential = false;
    }
  }

  return failures;
}

export function validateOptions(command: CommandTree): ValidationFailure[] {
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

  let failures = validateOptions(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  failures = validateArguments(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  return results;
}
