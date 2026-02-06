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

import { code, Match, Switch } from "@alloy-js/core";
import { snakeCase } from "@stryke/string-format/snake-case";
import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type { CommandTree } from "../types/command";

export interface UsageProps {
  /**
   * The command to generate help for.
   */
  command: CommandTree;

  /**
   * The package manager to generate the usage example for.
   *
   * @remarks
   * If not specified, examples for all supported package managers will be generated.
   *
   * @defaultValue "npm"
   */
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";

  /**
   * The bin name to use in the usage display.
   */
  bin: string;
}

/**
 * A component that generates the usage display for a command.
 */
export function Usage(props: UsageProps) {
  const { command, bin, packageManager } = props;

  return (
    <>
      {code`$ `}
      <Switch>
        <Match when={packageManager === "yarn"}>{`yarn exec `}</Match>
        <Match when={packageManager === "pnpm"}>{`pnpm exec `}</Match>
        <Match when={packageManager === "bun"}>{`bun x `}</Match>
        <Match else>{`npx `}</Match>
      </Switch>
      {code`${bin} ${command.path.segments
        .map(segment =>
          isDynamicPathSegment(segment)
            ? `<${snakeCase(
                command.path.dynamics[segment]?.name ||
                  getDynamicPathSegmentName(segment)
              )}${command.path.dynamics[segment]?.variadic ? "..." : ""}>`
            : segment
        )
        .join(" ")}${
        Object.values(command.children).length > 0 ? " [commands]" : ""
      } [options]`}
    </>
  );
}
