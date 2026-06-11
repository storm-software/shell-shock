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

import type {
  CommandArgumentConfig,
  CommandMetadata,
  CommandOptionConfig
} from "./types";

export * from "./config";
export type * from "./types";

/**
 * A utility function to define a Shell Shock command's metadata.
 *
 * @remarks
 * This function is used to create a user configuration object for Shell Shock projects. It ensures that the configuration adheres to the expected structure.
 *
 * @example
 * ```ts
 * import { defineMetadata } from '@shell-shock/core';
 *
 * export const metadata = defineMetadata({
 *  name: 'my-command',
 *  title: 'My Custom Command',
 *  icon: '🗲',
 *  description: 'This is my custom command',
 *  alias: ['mc', 'my-cmd'],
 *  tags: ['custom', 'example']
 * });
 * ```
 *
 * @param metadata - A partial user configuration object.
 * @returns A complete user configuration object.
 */
export function defineMetadata(
  metadata: Partial<CommandMetadata>
): CommandMetadata {
  return metadata;
}

/**
 * A utility function to define a Shell Shock command's options.
 *
 * @remarks
 * This function is used to create a user configuration object for Shell Shock projects. It ensures that the configuration adheres to the expected structure.
 *
 * @example
 * ```ts
 * import { defineOptions } from '@shell-shock/core';
 *
 * export const options = defineOptions({
 *  verbose: {
 *    name: 'verbose',
 *    description: 'Enable verbose output',
 *    type: 'boolean'
 *  }
 * });
 * ```
 *
 * @param options - A record of command option configurations.
 * @returns A complete record of command option configurations.
 */
export function defineOptions(
  options: Record<string, CommandOptionConfig>
): Record<string, CommandOptionConfig> {
  return options;
}

/**
 * A utility function to define a Shell Shock command's arguments.
 *
 * @remarks
 * This function is used to create a user configuration object for Shell Shock projects. It ensures that the configuration adheres to the expected structure.
 *
 * @example
 * ```ts
 * import { defineArguments } from '@shell-shock/core';
 *
 * export const args = defineArguments([
 *  {
 *    name: 'input',
 *    type: 'string',
 *    description: 'The input file',
 *    required: true
 *  }
 * ]);
 * ```
 *
 * @param args - An array of command argument configurations.
 * @returns A complete array of command argument configurations.
 */
export function defineArguments(
  args: CommandArgumentConfig[]
): CommandArgumentConfig[] {
  return args;
}
