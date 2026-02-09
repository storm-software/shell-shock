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

import { code } from "@alloy-js/core";

/**
 * Write the logic to determine if the application is running in debug mode.
 *
 * @remarks
 * This is used to conditionally include debug-only logic in the generated application, such as additional logging or development tools. The logic should check for common indicators of debug mode, such as environment variables or the presence of a debugger.
 */
export function IsDebug() {
  return code`isDevelopment || isDebug || env.LOG_LEVEL === "debug"`;
}

/**
 * Write the logic to determine if the application is **not** running in debug mode.
 */
export function IsNotDebug() {
  return (
    <>
      {code`!(`}
      <IsDebug />
      {code`)`}
    </>
  );
}
