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

import { toArray } from "@stryke/convert/to-array";
import { getUnique } from "@stryke/helpers/get-unique";
import { StormJSON } from "@stryke/json/storm-json";
import { joinPaths } from "@stryke/path/join-paths";
import { replaceExtension } from "@stryke/path/replace";
import { kebabCase } from "@stryke/string-format/kebab-case";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import type { Context } from "../types";

function formatBinaryPath(
  name: string,
  format: string | string[] | undefined
): string {
  return `./bin/${kebabCase(replaceExtension(name))}.${
    format === "cjs" || (Array.isArray(format) && format.includes("cjs"))
      ? "cjs"
      : "mjs"
  }`;
}

export async function updatePackageJsonBinary(context: Context): Promise<void> {
  const packageJsonPath = joinPaths(
    context.workspaceConfig.workspaceRoot,
    context.config.projectRoot,
    "package.json"
  );
  if (
    context.config.bin &&
    Array.isArray(context.config.bin) &&
    context.config.bin.length > 0
  ) {
    context.packageJson.bin = Object.fromEntries(
      getUnique(toArray(context.config.bin)).map(bin => [
        bin,
        formatBinaryPath(bin, context.config.output.format)
      ])
    );

    await context.fs.write(
      packageJsonPath,
      StormJSON.stringify(context.packageJson)
    );
  } else if (
    !isSetObject(context.packageJson.bin) &&
    (context.config.name || context.packageJson.name)
  ) {
    context.packageJson.bin = {
      [(context.config.name || context.packageJson.name)!]: formatBinaryPath(
        (context.config.name || context.packageJson.name)!,
        context.config.output.format
      )
    };
    await context.fs.write(
      packageJsonPath,
      StormJSON.stringify(context.packageJson)
    );
  }

  if (!isSetObject(context.packageJson.bin)) {
    throw new Error(
      "Unable to determine the CLI binary name. Please specify the `bin` option in your Shell Shock configuration or ensure that the `name` field is set in your package.json."
    );
  }

  context.config.bin = Object.keys(context.packageJson.bin);
}
