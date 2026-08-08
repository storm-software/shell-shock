/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import type { Type } from "@deepkit/type";
import { ReflectionKind } from "@deepkit/type";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type {
  BaseCommandParameter,
  CommandParameterType,
  StringCommandParameter
} from "../types/command";
import { isCommandParameterType } from "./type-checks";

/**
 * Extracts a {@link ReflectionKind} from a {@link BaseCommandParameter} or {@link CommandParameterType}.
 *
 * @param command - The command parameter or kind to extract the reflection kind from.
 * @param checkVariadic - Whether to check for variadic parameters (arrays).
 * @returns The extracted {@link ReflectionKind}.
 */
export function extractReflectionKind(
  command: BaseCommandParameter | CommandParameterType,
  checkVariadic = true
): ReflectionKind {
  if (
    (isCommandParameterType(command) && command === "string") ||
    (isSetObject(command) && command.type === "string")
  ) {
    return checkVariadic && (command as StringCommandParameter).variadic
      ? ReflectionKind.array
      : ReflectionKind.string;
  } else if (
    (isCommandParameterType(command) && command === "number") ||
    (isSetObject(command) && command.type === "number")
  ) {
    return checkVariadic && (command as any).variadic
      ? ReflectionKind.array
      : ReflectionKind.number;
  } else if (
    (isCommandParameterType(command) && command === "boolean") ||
    (isSetObject(command) && command.type === "boolean")
  ) {
    return ReflectionKind.boolean;
  } else {
    return ReflectionKind.string;
  }
}

/**
 * Extracts a {@link Type} from a {@link BaseCommandParameter} or {@link CommandParameterType}.
 *
 * @param command - The command parameter or kind to extract the type from.
 * @param checkVariadic - Whether to check for variadic parameters (arrays).
 * @returns The extracted {@link Type}.
 */
export function extractType(
  command: BaseCommandParameter | CommandParameterType,
  checkVariadic = true
): Type {
  const reflectionKind = extractReflectionKind(command, checkVariadic);
  if (reflectionKind === ReflectionKind.string) {
    return { kind: ReflectionKind.string };
  } else if (reflectionKind === ReflectionKind.number) {
    return { kind: ReflectionKind.number };
  } else if (reflectionKind === ReflectionKind.boolean) {
    return { kind: ReflectionKind.boolean };
  } else if (reflectionKind === ReflectionKind.array) {
    if (isCommandParameterType(command)) {
      return {
        kind: ReflectionKind.array,
        type: extractType(
          {
            type: command
          } as BaseCommandParameter,
          false
        )
      };
    } else if (isSetObject(command)) {
      return {
        kind: ReflectionKind.array,
        type: extractType(
          {
            ...command,
            type: command.type
          },
          false
        )
      };
    } else {
      return {
        kind: ReflectionKind.array,
        type: { kind: ReflectionKind.string }
      };
    }
  } else {
    return { kind: ReflectionKind.string };
  }
}
