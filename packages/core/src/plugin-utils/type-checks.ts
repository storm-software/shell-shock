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

import { isBoolean } from "@stryke/type-checks/is-boolean";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type {
  CommandArgument,
  CommandOption,
  CommandParameter,
  CommandParameterConfig,
  CommandParameterType
} from "../types/command";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => isSetString(item));
}

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(item => typeof item === "number" && Number.isFinite(item))
  );
}

function isBooleanArray(value: unknown): value is boolean[] {
  return Array.isArray(value) && value.every(item => isBoolean(item));
}

function isAliasConfig(value: unknown): value is string | string[] {
  return isSetString(value) || isStringArray(value);
}

function isTypedDefaultValue(
  type: CommandParameterType,
  value: unknown,
  variadic?: boolean
): boolean {
  if (type === "string") {
    if (variadic === true) {
      return isStringArray(value);
    }

    if (variadic === false) {
      return isSetString(value);
    }

    return isSetString(value) || isStringArray(value);
  }

  if (type === "number") {
    if (variadic === true) {
      return isNumberArray(value);
    }

    if (variadic === false) {
      return typeof value === "number" && Number.isFinite(value);
    }

    return (
      (typeof value === "number" && Number.isFinite(value)) ||
      isNumberArray(value)
    );
  }

  if (variadic === true) {
    return isBooleanArray(value);
  }

  if (variadic === false) {
    return isBoolean(value);
  }

  return isBoolean(value) || isBooleanArray(value);
}

function hasValidOptionalCommonFields(obj: Record<string, unknown>): boolean {
  if ("alias" in obj && obj.alias !== undefined && !isAliasConfig(obj.alias)) {
    return false;
  }

  if ("name" in obj && obj.name !== undefined && !isSetString(obj.name)) {
    return false;
  }

  if ("title" in obj && obj.title !== undefined && !isSetString(obj.title)) {
    return false;
  }

  if (
    "description" in obj &&
    obj.description !== undefined &&
    !isSetString(obj.description)
  ) {
    return false;
  }

  if (
    "env" in obj &&
    obj.env !== undefined &&
    !(isSetString(obj.env) || obj.env === false)
  ) {
    return false;
  }

  if (
    "required" in obj &&
    obj.required !== undefined &&
    !isBoolean(obj.required)
  ) {
    return false;
  }

  if (
    "variadic" in obj &&
    obj.variadic !== undefined &&
    !isBoolean(obj.variadic)
  ) {
    return false;
  }

  return true;
}

function hasValidTypeSpecificFields(
  obj: Record<string, unknown>,
  type: CommandParameterType
): boolean {
  const variadic = isBoolean(obj.variadic) ? obj.variadic : undefined;

  if (
    "default" in obj &&
    obj.default !== undefined &&
    !isTypedDefaultValue(type, obj.default, variadic)
  ) {
    return false;
  }

  if (type === "string") {
    if (
      "format" in obj &&
      obj.format !== undefined &&
      !isSetString(obj.format)
    ) {
      return false;
    }

    if (
      "choices" in obj &&
      obj.choices !== undefined &&
      !isStringArray(obj.choices)
    ) {
      return false;
    }

    return true;
  }

  if (type === "number") {
    if (
      "choices" in obj &&
      obj.choices !== undefined &&
      !isNumberArray(obj.choices)
    ) {
      return false;
    }

    return true;
  }

  if ("choices" in obj && obj.choices !== undefined) {
    return false;
  }

  if ("format" in obj && obj.format !== undefined) {
    return false;
  }

  return true;
}

/**
 * Type guard to check if a value is a valid {@link CommandParameterType} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandParameterType} type, false otherwise.
 */
export function isCommandParameterType(obj: any): obj is CommandParameterType {
  return isSetString(obj) && ["string", "number", "boolean"].includes(obj);
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
  if (
    !isSetObject(obj) ||
    !("type" in obj) ||
    !isCommandParameterType(obj.type)
  ) {
    return false;
  }

  return (
    hasValidOptionalCommonFields(obj) &&
    hasValidTypeSpecificFields(obj, obj.type)
  );
}

/**
 * Type guard to check if a value is a valid {@link CommandParameter} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandParameter} type, false otherwise.
 */
export function isCommandParameter(obj: any): obj is CommandParameter {
  if (!isCommandParameterConfig(obj)) {
    return false;
  }

  if (!("name" in obj) || !isSetString(obj.name)) {
    return false;
  }

  if (!("title" in obj) || !isSetString(obj.title)) {
    return false;
  }

  if (!("description" in obj) || !isSetString(obj.description)) {
    return false;
  }

  if (!("alias" in obj) || !isStringArray(obj.alias)) {
    return false;
  }

  if (!("env" in obj) || !(isSetString(obj.env) || obj.env === false)) {
    return false;
  }

  if (!("required" in obj) || !isBoolean(obj.required)) {
    return false;
  }

  if (!("variadic" in obj) || !isBoolean(obj.variadic)) {
    return false;
  }

  return hasValidTypeSpecificFields(obj, obj.type);
}

/**
 * Type guard to check if a value is a valid {@link CommandOption} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandOption} type, false otherwise.
 */
export function isCommandOption(obj: any): obj is CommandOption {
  if (!isCommandParameter(obj)) {
    return false;
  }

  if (obj.type !== "boolean") {
    return true;
  }

  if (
    "isNegativeOf" in obj &&
    obj.isNegativeOf !== undefined &&
    !isSetString(obj.isNegativeOf)
  ) {
    return false;
  }

  if (
    "skipAddingNegative" in obj &&
    obj.skipAddingNegative !== undefined &&
    !isBoolean(obj.skipAddingNegative)
  ) {
    return false;
  }

  return true;
}

/**
 * Type guard to check if a value is a valid {@link CommandArgument} type.
 *
 * @param obj - The value to check.
 * @returns True if the value is a valid {@link CommandArgument} type, false otherwise.
 */
export function isCommandArgument(obj: any): obj is CommandArgument {
  return isCommandParameter(obj);
}
