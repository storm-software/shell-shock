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
import { FunctionDeclaration, VarDeclaration } from "@alloy-js/typescript";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { ScriptPresetContext } from "../types/plugin";

/**
 * The `shutdown` handler function declaration code for the Shell Shock project.
 */
export function ShutdownFunctionDeclaration() {
  const context = usePowerlines<ScriptPresetContext>();

  return (
    <>
      <VarDeclaration
        let
        name="isShutdown"
        type="boolean"
        initializer={code`false;`}
      />
      <hbr />
      <FunctionDeclaration
        name="shutdown"
        parameters={[
          { name: "exception", type: "string | Error", optional: true }
        ]}>
        {code`
          try {
            if (isShutdown) {
              return;
            }

            isShutdown = true;

            if (exception) {
              error(\`A fatal error occured while running the application - please contact the ${
                context.config.title
              } support team: \\n\${typeof exception === "string" ? exception : exception.message}\`);
            }

            verbose(\`The ${context.config.title} application exited \${exception ? \`early due to an exception\` : "successfully"}...\`);
            process.exit(exception ? 1 : 0);
          } catch (err) {
            error(\`The shutdown process failed to complete\${(err as Error).message ? \` - (err as Error).message\` : ""}. Please contact the ${
              context.config.title
            } support team.\`);
            process.exit(1);
          }
        `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `shutdown` handler function usage code for the Shell Shock project.
 */
export function ShutdownFunctionUsage() {
  return (
    <>
      <hbr />
      {code`try {
        if ("process" in globalThis && !("Deno" in globalThis)) {
          // eslint-disable-next-line ts/no-misused-promises
          process.on("exit", shutdown);
        }

        for (const type of ["unhandledRejection", "uncaughtException"]) {
          process.on(type, err => shutdown(err || new Error(\`An \${type === "unhandledRejection" ? "unhandled promise rejection" : "uncaught exception"} occurred during processing - the application is shutting down.\`)));
        }

        for (const type of ["SIGTERM", "SIGINT", "SIGUSR2"]) {
          process.once(type, () => {
            verbose("The application was terminated by the user");
            return shutdown();
          });
        }

        const result = await main();
        if (result?.error) {
          danger(result.error);
        }

        shutdown();
      } catch (err) {
        verbose("An exception occurred during processing");
        shutdown(err);
      }
      `}
      <hbr />
    </>
  );
}
