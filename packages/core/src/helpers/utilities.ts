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

import { kebabCase } from "@stryke/string-format/kebab-case";
import { titleCase } from "@stryke/string-format/title-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { Context } from "../types";

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
export function getAppName(context: Context): string {
  const result =
    context.config.bin &&
    (isSetString(context.config.bin) ||
      (Array.isArray(context.config.bin) &&
        context.config.bin.length > 0 &&
        context.config.bin[0]))
      ? isSetString(context.config.bin)
        ? context.config.bin
        : context.config.bin[0]
      : context.config.name || context.packageJson?.name;
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
export function getAppTitle(context: Context): string {
  return titleCase(context.config.name || getAppName(context));
}

/**
 * Retrieves the application description from the context and configuration.
 *
 * @param context - The build context containing workspace and package information.
 * @returns The application description.
 */
export function getAppDescription(context: Context): string {
  return (
    context.config.description ||
    context.packageJson?.description ||
    `The ${getAppTitle(context)} command-line interface application.`
  );
}
