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

import { envSchema as baseEnvSchema } from "@powerlines/plugin-env/schemas/env";
import { z } from "zod";

/**
 * Zod schema for the Shell Shock environment configuration.
 *
 * @remarks
 * Extends the base Powerlines {@link envSchema} with CLI-specific runtime
 * environment variables used for executable resolution and npm script detection.
 */
export const envSchema = baseEnvSchema.extend({
  /**
   * The system PATHEXT variable, used to determine which file extensions are considered executable on Windows.
   *
   * @remarks
   * If not provided, it will default to '.EXE;.CMD;.BAT;.COM' on Windows, and will be ignored on other platforms. This variable is used to locate executable files when running commands, and is only relevant on Windows platforms. On non-Windows platforms, the system's executable file resolution will be used, and this variable will have no effect.
   */
  PATHEXT: z.string().optional().meta({
    description:
      "The system PATHEXT variable, used to determine which file extensions are considered executable on Windows. If not provided, it will default to '.EXE;.CMD;.BAT;.COM' on Windows, and will be ignored on other platforms.",
    runtime: true,
    hidden: true,
    category: "node"
  }),

  /**
   * The system PATH variable, used to locate executable files.
   */
  PATH: z.string().optional().meta({
    description: "The system PATH variable, used to locate executable files.",
    runtime: true,
    hidden: true,
    category: "node"
  }),

  /**
   * The npm user agent string, which can be used to detect if the environment is running within an npm script.
   *
   * @remarks
   * This variable is set by npm when running scripts defined in package.json. It can be used to conditionally adjust behavior when running within an npm script context, such as modifying logging output or adjusting command execution. If this variable is not set, it can be assumed that the environment is not running within an npm script.
   */
  npm_config_user_agent: z.string().optional().meta({
    description:
      "The npm user agent string, which can be used to detect if the environment is running within an npm script. This variable is set by npm when running scripts defined in package.json.",
    runtime: true,
    hidden: true,
    category: "node"
  }),

  /**
   * The npm_config_fund environment variable, which can be used to control npm's funding behavior.
   *
   * @remarks
   * This variable is set by npm when running scripts defined in package.json, and can be used to control npm's funding behavior. If set to 'false', it will disable npm's funding messages. If not set, npm will use its default funding behavior. This variable is only relevant when running within an npm script context, and has no effect on command execution or behavior outside of that context.
   */
  npm_config_fund: z.string().optional().meta({
    description:
      "The npm_config_fund environment variable, which can be used to control npm's funding behavior. If set to 'false', it will disable npm's funding messages.",
    runtime: true,
    hidden: true,
    category: "node"
  }),

  /**
   * The npm execution path, which can be used to determine the location of the npm executable.
   *
   * @remarks
   * This variable is set by npm when running scripts defined in package.json. It provides the absolute path to the npm executable being used to run the script. This can be useful for resolving the location of npm or for debugging purposes. If this variable is not set, it may indicate that the environment is not running within an npm script context, or that npm is not available in the PATH.
   */
  npm_execpath: z.string().optional().meta({
    description:
      "The npm execution path, which can be used to determine the location of the npm executable. This variable is set by npm when running scripts defined in package.json.",
    runtime: true,
    hidden: true,
    category: "node"
  }),

  /**
   * The COMSPEC environment variable, which specifies the command-line interpreter to use on Windows.
   *
   * @remarks
   * This variable is used on Windows platforms to determine which command-line interpreter to use when executing commands. It typically points to cmd.exe, but can be customized by the user. If this variable is not set on Windows, it will default to 'cmd.exe'. On non-Windows platforms, this variable is ignored and has no effect on command execution.
   */
  COMSPEC: z.string().optional().meta({
    description:
      "The COMSPEC environment variable, which specifies the command-line interpreter to use on Windows. It typically points to cmd.exe, but can be customized by the user.",
    runtime: true,
    hidden: true,
    category: "node"
  })
});

/**
 * Inferred Shell Shock environment configuration type from {@link ShellShockEnv}.
 */
export type ShellShockEnv = z.infer<typeof envSchema>;

/**
 * Input type for {@link ShellShockEnv} before defaults applied.
 */
export type ShellShockEnvInput = z.input<typeof envSchema>;
