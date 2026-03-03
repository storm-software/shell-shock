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

import type { Type } from "@powerlines/deepkit/vendor/type";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type {
  BaseCommandParameter,
  CommandParameterKind,
  StringCommandParameter
} from "../types/command";
import { CommandParameterKinds } from "../types/command";
import { isCommandParameterKind } from "./type-checks";

/**
 * Extracts a {@link ReflectionKind} from a {@link BaseCommandParameter} or {@link CommandParameterKind}.
 *
 * @param command - The command parameter or kind to extract the reflection kind from.
 * @param checkVariadic - Whether to check for variadic parameters (arrays).
 * @returns The extracted {@link ReflectionKind}.
 */
export function extractReflectionKind(
  command: BaseCommandParameter | CommandParameterKind,
  checkVariadic = true
): ReflectionKind {
  if (
    (isCommandParameterKind(command) &&
      command === CommandParameterKinds.string) ||
    (isSetObject(command as BaseCommandParameter) &&
      (command as BaseCommandParameter).kind === CommandParameterKinds.string)
  ) {
    return checkVariadic && (command as StringCommandParameter).variadic
      ? ReflectionKind.array
      : ReflectionKind.string;
  } else if (
    (isCommandParameterKind(command) &&
      command === CommandParameterKinds.number) ||
    (isSetObject(command as BaseCommandParameter) &&
      (command as BaseCommandParameter).kind === CommandParameterKinds.number)
  ) {
    return checkVariadic && (command as any).variadic
      ? ReflectionKind.array
      : ReflectionKind.number;
  } else if (
    (isCommandParameterKind(command) &&
      command === CommandParameterKinds.boolean) ||
    (isSetObject(command) && command.kind === CommandParameterKinds.boolean)
  ) {
    return ReflectionKind.boolean;
  } else {
    return ReflectionKind.string;
  }
}

/**
 * Extracts a {@link Type} from a {@link BaseCommandParameter} or {@link CommandParameterKind}.
 *
 * @param command - The command parameter or kind to extract the type from.
 * @param checkVariadic - Whether to check for variadic parameters (arrays).
 * @returns The extracted {@link Type}.
 */
export function extractType(
  command: BaseCommandParameter | CommandParameterKind,
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
    if (isCommandParameterKind(command)) {
      return {
        kind: ReflectionKind.array,
        type: extractType(
          {
            kind: command
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
            kind: command.kind
          } as BaseCommandParameter,
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
