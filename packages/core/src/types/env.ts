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
   */
  PATHEXT?: string;

  /**
   * The system PATH variable, used to locate executable files.
   */
  PATH?: string;
}
