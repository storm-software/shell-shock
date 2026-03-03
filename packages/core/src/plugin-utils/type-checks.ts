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

import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type {
  CommandArgument,
  CommandOption,
  CommandParameter,
  CommandParameterConfig,
  CommandParameterKind
} from "../types/command";
import { CommandParameterKinds } from "../types/command";

/**
 * Type guard to check if a value is a valid {@link CommandParameterKind} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandParameterKind} type, false otherwise.
 */
export function isCommandParameterKind(obj: any): obj is CommandParameterKind {
  return (
    isSetString(obj) &&
    [
      CommandParameterKinds.string,
      CommandParameterKinds.number,
      CommandParameterKinds.boolean
    ].includes(obj as CommandParameterKind)
  );
}

/**
 * Type guard to check if a value is a valid {@link CommandParameterConfig} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandParameterConfig} type, false otherwise.
 */
export function isCommandParameterConfig(
  obj: any
): obj is CommandParameterConfig {
  return isSetObject(obj) && "kind" in obj && isCommandParameterKind(obj.kind);
}

/**
 * Type guard to check if a value is a valid {@link CommandParameter} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandParameter} type, false otherwise.
 */
export function isCommandParameter(obj: any): obj is CommandParameter {
  return (
    isCommandParameterConfig(obj) &&
    "name" in obj &&
    isSetString(obj.name) &&
    "title" in obj &&
    isSetString(obj.title) &&
    "description" in obj &&
    isSetString(obj.description) &&
    "alias" in obj &&
    Array.isArray(obj.alias) &&
    "env" in obj &&
    (isSetString(obj.env) || obj.env === false) &&
    "optional" in obj &&
    isBoolean(obj.optional) &&
    "variadic" in obj &&
    isBoolean(obj.variadic)
  );
}

/**
 * Type guard to check if a value is a valid {@link CommandOption} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandOption} type, false otherwise.
 */
export function isCommandOption(obj: any): obj is CommandOption {
  return (
    isCommandParameterConfig(obj) && isCommandParameter(obj) && "default" in obj
  );
}

/**
 * Type guard to check if a value is a valid {@link CommandArgument} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandArgument} type, false otherwise.
 */
export function isCommandArgument(obj: any): obj is CommandArgument {
  return isCommandParameterConfig(obj) && isCommandParameter(obj);
}
