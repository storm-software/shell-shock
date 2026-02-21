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
import {
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { getAppTitle } from "@shell-shock/core/plugin-utils/context-helpers";
import type { ScriptPresetContext } from "../types/plugin";
import { IsVerbose } from "./helpers";

/**
 * The `exit` handler function declaration code for the Shell Shock project.
 */
export function ExitFunctionDeclaration() {
  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <InterfaceDeclaration
        export
        name="ExitOptions"
        doc="Options for the exit handler function.">
        <InterfaceMember
          name="exception"
          optional
          type="string | Error"
          doc="An optional exception that caused the exit. This can be a string message or an Error object."
        />
        <hbr />
        <InterfaceMember
          name="skipProcessExit"
          optional
          type="boolean"
          doc="Indicates whether the exit function should manually exit the process or not. If set to true, the exit function will not call process.exit() and will allow the application to continue running. If set to false or not specified, the exit function will call process.exit() to terminate the application."
        />
        <hbr />
        <InterfaceMember
          name="isSynchronous"
          optional
          type="boolean"
          doc="Indicates whether the exit function should perform synchronous operations only. If set to true, the exit function will avoid any asynchronous operations during exit. If set to false or not specified, the exit function may perform asynchronous operations as needed."
        />
        <hbr />
        <InterfaceMember
          name="signal"
          optional
          type="number"
          doc="The signal number that triggered the exit. This is typically used when the shutdown is initiated by a system signal (e.g., SIGINT, SIGTERM)."
        />
        <hbr />
        <InterfaceMember
          name="startDate"
          optional
          type="Date"
          doc="A Date object representing the timestamp when the process started. This can be used to measure the duration of the shutdown process."
        />
      </InterfaceDeclaration>
      <Spacing />
      <VarDeclaration
        let
        name="isExiting"
        type="boolean"
        initializer={code`false;`}
      />
      <VarDeclaration
        const
        name="callbackAsyncQueue"
        type="Array<[(code: number | string) => Promise<void> | void, number]>"
        initializer={code`[];`}
      />
      <VarDeclaration
        const
        name="callbackSyncQueue"
        type="Array<(code: number | string) => void>"
        initializer={code`[];`}
      />
      <Spacing />
      <FunctionDeclaration
        export
        async
        name="exit"
        parameters={[
          {
            name: "options",
            type: "ExitOptions",
            default: "{}"
          }
        ]}>
        {code`
          try {
            if (isExiting) {
              return;
            }

            isExiting = true;

            let exitCode: number | string = 0;
            if ((options.signal !== undefined && options.signal > 0) || options.exception) {
              exitCode = 128 + (options.signal ?? 1);
            } else if (typeof process.exitCode === "number" || typeof process.exitCode === "string") {
              exitCode = process.exitCode;
            }

            if (options.exception) {
              error(\`A fatal error occured while running the application - please contact the ${getAppTitle(
                context
              )} support team\${options.exception && typeof options.exception !== "symbol" ? \`: \\n\\n\${typeof options.exception === "string" ? options.exception : options.exception.message}\` : "."}\`);
            }

            const terminate = (force = false) => { `}
        <IfStatement
          condition={<IsVerbose />}>{code`writeLine("");`}</IfStatement>
        <hbr />
        {code`
              verbose(\`The ${getAppTitle(
                context
              )} application exited \${options.exception ? \`early due to an exception\` : "successfully"}\${options.startDate ? \`. Total processing time is \${Date.now() - options.startDate.getTime() > 5000 ? Math.floor((Date.now() - options.startDate.getTime()) / 1000) : Date.now() - options.startDate.getTime()} \${Date.now() - options.startDate.getTime() > 5000 ? "seconds" : "milliseconds"}\` : ""}...\`);
              if (!options.skipProcessExit) {
                process.nextTick(() => process.exit(exitCode));
              }
            };

            for (const callbackSync of callbackSyncQueue) {
              callbackSync(exitCode);
            }

            if (!options.isSynchronous) {
              const promises = [];
              let forceAfter = 0;
              for (const [callbackAsync, wait] of callbackAsyncQueue) {
                forceAfter = Math.max(forceAfter, wait);
                promises.push(Promise.resolve(callbackAsync(exitCode)));
              }

              const asyncTimer = setTimeout(() => {
                terminate(true);
              }, forceAfter);
              await Promise.all(promises);
              clearTimeout(asyncTimer);
            }

            terminate();
          } catch (err) {
            error(\`The exit process failed to complete\${(err as Error)?.message ? \` - \${(err as Error).message}\` : ""}. Please contact the ${getAppTitle(
              context
            )} support team.\`);

            if (!options.skipProcessExit) {
              process.nextTick(() => process.exit(1));
            }
          }
        `}
      </FunctionDeclaration>
    </>
  );
}
