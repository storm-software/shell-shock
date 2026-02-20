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

export interface BooleanInputParserLogicProps {
  name: string;
}

/**
 * Parses a string input into a boolean value, interpreting common truthy and falsy string representations.
 */
export function BooleanInputParserLogic(props: BooleanInputParserLogicProps) {
  const { name } = props;

  return (
    <>{code` !!${name} && ${name}.toLowerCase() !== "false" && ${
      name
    }.toLowerCase() !== "f" && ${name}.toLowerCase() !== "no" && ${
      name
    } !== "n" && ${name}.toLowerCase() !== "0" && ${
      name
    }.toLowerCase() !== "off" && ${
      name
    } !== "disable" && ${name}.toLowerCase() !== "disabled" && ${
      name
    }.toLowerCase() !== "never" && (Number.isNaN(Number.parseFloat(${
      name
    })) || Number.parseFloat(${name}) > 0) `}</>
  );
}

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

/**
 * Write the logic to determine if the application is running in verbose mode.
 *
 * @remarks
 * This is used to conditionally include verbose-only logic in the generated application, such as additional logging or detailed output. The logic should check for common indicators of verbose mode, such as environment variables or command-line flags.
 */
export function IsVerbose() {
  return (
    <>
      {code`( `}
      <IsDebug />
      {code`|| hasFlag(["verbose", "verbose=true", "verbose=always"]))`}
    </>
  );
}

/**
 * Write the logic to determine if the application is **not** running in verbose mode.
 */
export function IsNotVerbose() {
  return (
    <>
      {code`!(`}
      <IsVerbose />
      {code`)`}
    </>
  );
}
