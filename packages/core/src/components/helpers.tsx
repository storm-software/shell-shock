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
    } !== "disable" && ${name}.toLowerCase() !== "disabled"`}</>
  );
}
