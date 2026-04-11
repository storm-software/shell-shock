#!/usr/bin/env zx
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

import { $, argv, chalk, echo } from "zx";

try {
  let configuration = argv.configuration;
  if (!configuration) {
    if (argv.prod) {
      configuration = "production";
    } else if (argv.dev) {
      configuration = "development";
    } else {
      configuration = "production";
    }
  }

  echo`${chalk.whiteBright(
    ` 🏗️  Building the monorepo in ${configuration} mode...`
  )}`;

  let proc = $`pnpm bootstrap`.timeout(`${1 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while bootstrapping the monorepo: \n\n${
        result.message
      }\n`
    );
  }

  proc =
    $`pnpm nx run core:build:${configuration} --verbose --outputStyle=dynamic-legacy --parallel=5`.timeout(
      `${5 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while building the core Shell Shock package in ${configuration} mode: \n\n${result.message}\n`
    );
  }

  proc =
    $`pnpm nx run nx:build:${configuration} --outputStyle=dynamic-legacy --parallel=5`.timeout(
      `${10 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while building the Nx plugin package in ${configuration} mode: \n\n${result.message}\n`
    );
  }

  proc = $`pnpm nx run-many --target=build --exclude=monorepo --configuration=${
    configuration
  } --outputStyle=dynamic-legacy --parallel=5`.timeout(`${45 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (result.exitCode !== 0) {
    throw new Error(
      `An error occurred while building the monorepo in ${
        configuration
      } mode: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green(
    ` ✔ Successfully built the monorepo in ${configuration} mode!`
  )}\n`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while building the monorepo")}`;

  process.exit(1);
}
