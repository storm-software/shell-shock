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

import { code, Show } from "@alloy-js/core";
import type { ParameterDescriptor } from "@alloy-js/typescript";
import { FunctionDeclaration } from "@alloy-js/typescript";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocParam,
  TSDocRemarks
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";

export interface WriteMessageFunctionProps {
  type?: "success" | "help" | "info" | "warning" | "error" | "fatal";
}

/**
 * A built-in console utilities module for Shell Shock.
 */
export function WriteMessageFunction(props: WriteMessageFunctionProps) {
  const { type } = props;

  return (
    <>
      <TSDoc
        heading={`Write ${
          type === "error" || type === "info" ? "an" : "a"
        } ${type ? (type === "info" ? "informational" : type) : ""} message to the console.`}>
        <TSDocRemarks>
          {`This function initializes the Powerlines environment configuration object.`}
        </TSDocRemarks>

        <Show when={!type}>
          <TSDocParam name="type">
            {`The type of message to write to the console.`}
          </TSDocParam>
        </Show>
        <TSDocParam name="message">
          {`The message(s) to write to the console.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name={`write${
          type ? type.charAt(0).toUpperCase() + type.slice(1) : "Message"
        }`}
        parameters={
          [
            !type && {
              name: "type",
              type: `"success" | "help" | "info" | "warning" | "error" | "fatal"`,
              optional: false
            },
            {
              name: "message",
              type: "string",
              optional: false,
              rest: true
            }
          ].filter(Boolean) as ParameterDescriptor[]
        }>
        {code`console.${type === "warning" ? "warn" : type === "error" || type === "fatal" ? "error" : "log"}(...message);`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A built-in console utilities module for Shell Shock.
 */
export function ConsoleBuiltin() {
  return (
    <BuiltinFile
      id="console"
      description="A collection of helper utilities to assist in terminal display">
      <WriteMessageFunction type="success" />
      <WriteMessageFunction type="help" />
      <WriteMessageFunction type="info" />
      <WriteMessageFunction type="warning" />
      <WriteMessageFunction type="error" />
      <WriteMessageFunction type="fatal" />
      <WriteMessageFunction />
    </BuiltinFile>
  );
}
