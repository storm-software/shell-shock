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

export interface ShellShockEnv {
  /**
   * The system PATHEXT variable, used to determine which file extensions are considered executable on Windows.
   *
   * @remarks
   * If not provided, it will default to '.EXE;.CMD;.BAT;.COM' on Windows, and will be ignored on other platforms. This variable is used to locate executable files when running commands, and is only relevant on Windows platforms. On non-Windows platforms, the system's executable file resolution will be used, and this variable will have no effect.
   *
   * @internal
   */
  PATHEXT?: string;

  /**
   * The system PATH variable, used to locate executable files.
   *
   * @internal
   */
  PATH?: string;

  /**
   * The npm user agent string, which can be used to detect if the environment is running within an npm script.
   *
   * @remarks
   * This variable is set by npm when running scripts defined in package.json. It can be used to conditionally adjust behavior when running within an npm script context, such as modifying logging output or adjusting command execution. If this variable is not set, it can be assumed that the environment is not running within an npm script.
   *
   * @internal
   */
  npm_config_user_agent?: string;

  /**
   * The npm execution path, which can be used to determine the location of the npm executable.
   *
   * @remarks
   * This variable is set by npm when running scripts defined in package.json. It provides the absolute path to the npm executable being used to run the script. This can be useful for resolving the location of npm or for debugging purposes. If this variable is not set, it may indicate that the environment is not running within an npm script context, or that npm is not available in the PATH.
   *
   * @internal
   */
  npm_execpath?: string;

  /**
   * The COMSPEC environment variable, which specifies the command-line interpreter to use on Windows.
   *
   * @remarks
   * This variable is used on Windows platforms to determine which command-line interpreter to use when executing commands. It typically points to cmd.exe, but can be customized by the user. If this variable is not set on Windows, it will default to 'cmd.exe'. On non-Windows platforms, this variable is ignored and has no effect on command execution.
   *
   * @internal
   */
  comspec?: string;
}
