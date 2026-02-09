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

import { camelCase } from "@stryke/string-format/camel-case";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { CommandTree, Context, UnresolvedContext } from "../types";

/**
 * Sorts command argument aliases, placing single-character aliases first, followed by multi-character aliases, and then sorting them alphabetically.
 *
 * @param aliases - An array of argument aliases to sort.
 * @returns A new array of sorted aliases.
 */
export function sortArgAliases(aliases: string[]): string[] {
  if (aliases.length === 0) {
    return [];
  }

  const result = aliases.filter(alias => alias.length === 1);
  result.push(...aliases.filter(alias => alias.length > 1));

  return result.sort((a, b) => a.localeCompare(b));
}

/**
 * Retrieves the application name from the context and configuration.
 *
 * @param context - The build context containing workspace and package information.
 * @returns The application name in kebab-case format.
 * @throws An error if no valid application name is found.
 */
export function getAppName(context: UnresolvedContext | Context): string {
  const result =
    context.config.name ||
    (isSetString(context.config.bin) ||
    (Array.isArray(context.config.bin) &&
      context.config.bin.length > 0 &&
      isSetString(context.config.bin[0]))
      ? isSetString(context.config.bin)
        ? context.config.bin
        : context.config.bin[0]
      : context.packageJson?.name);
  if (!isSetString(result)) {
    throw new Error(
      "No application name found. Please provide a 'bin' option in the configuration or ensure the package.json has a valid 'name' field."
    );
  }

  return kebabCase(result);
}

/**
 * Retrieves the application title from the context and configuration.
 *
 * @param context - The build context containing workspace and package information.
 * @returns The application title in title-case format.
 */
export function getAppTitle(context: UnresolvedContext | Context): string {
  return (
    context.config.title ||
    titleCase(context.config.name || getAppName(context))
  );
}

/**
 * Retrieves the application description from the context and configuration.
 *
 * @param context - The build context containing workspace and package information.
 * @returns The application description.
 */
export function getAppDescription(
  context: UnresolvedContext | Context
): string {
  return (
    context.config.description ||
    context.packageJson?.description ||
    `The ${getAppTitle(context)} command-line interface application.`
  );
}

/**
 * Retrieves the primary binary name for the application.
 *
 * @param context - The build context containing workspace and package information.
 * @returns The primary binary name as a string.
 */
export function getAppBin(context: Context): string {
  return isSetObject(context.config.bin)
    ? Object.keys(context.config.bin)[0]!
    : kebabCase(getAppName(context));
}

/**
 * Determines if a given command path segment is variable (enclosed in square brackets).
 *
 * @example
 * ```typescript
 * isDynamicPathSegment("[user]"); // true
 * isDynamicPathSegment("user"); // false
 * ```
 *
 * @param path - The command path segment to check.
 * @returns True if the path is variable, false otherwise.
 */
export function isDynamicPathSegment(path: string): boolean {
  return path.startsWith("[") && path.endsWith("]");
}

/**
 * Extracts the variable name from a command path segment by removing enclosing square brackets.
 *
 * @example
 * ```typescript
 * getDynamicPathSegmentName("[user]"); // "user"
 * ```
 *
 * @param path - The command path segment.
 * @returns The variable name without square brackets.
 */
export function getDynamicPathSegmentName(path: string): string {
  return path.replaceAll(/^\[+/g, "").replaceAll(/\]+$/g, "");
}

/**
 * Determines if a given command path segment is a path segment group (enclosed in parentheses).
 *
 * @example
 * ```typescript
 * isPathSegmentGroup("(user)"); // true
 * isPathSegmentGroup("[user]"); // false
 * isPathSegmentGroup("user"); // false
 * ```
 *
 * @param path - The command path segment to check.
 * @returns True if the path is a path segment group, false otherwise.
 */
export function isPathSegmentGroup(path: string): boolean {
  return (path.startsWith("(") && path.endsWith(")")) || path.startsWith("_");
}

/**
 * Extracts the group name from a command path segment by removing enclosing parentheses.
 *
 * @example
 * ```typescript
 * getPathSegmentGroupName("(admin)"); // "admin"
 * getPathSegmentGroupName("((group))"); // "group"
 * ```
 *
 * @param path - The command path segment.
 * @returns The group name without parentheses.
 */
export function getPathSegmentGroupName(path: string): string {
  return path
    .replaceAll(/^\(+/g, "")
    .replaceAll(/\)+$/g, "")
    .replaceAll(/^_+/g, "");
}

/**
 * Extracts the variable name from a command path segment by removing enclosing square brackets.
 *
 * @example
 * ```typescript
 * getDynamicPathSegmentName("[user]"); // "user"
 * ```
 *
 * @param path - The command path segment.
 * @returns The variable name without square brackets.
 */
export function getPathSegmentName(path: string): string {
  return getPathSegmentGroupName(getDynamicPathSegmentName(path));
}

/**
 * Retrieves the dynamic segment definition from a command tree based on a given path segment.
 *
 * @param command - The command tree containing the path and dynamic segment definitions.
 * @param segment - The command path segment to retrieve the dynamic segment definition for.
 * @returns The dynamic segment definition associated with the given path segment, or undefined if not found.
 */
export function getDynamicPathSegment(command: CommandTree, segment: string) {
  return command.path.dynamics[camelCase(getDynamicPathSegmentName(segment))];
}
