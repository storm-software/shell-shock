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

import { Show, splitProps } from "@alloy-js/core";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import type { CommandTree } from "@shell-shock/core";
import {
  getAppTitle,
  isDynamicPathSegment
} from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path";
import defu from "defu";
import type { BannerPluginContext } from "../types";
import { BannerFunctionDeclaration } from "./banner-function-declaration";

export type BannerBuiltinProps = Omit<
  BuiltinFileProps,
  "id" | "description"
> & {
  /**
   * The command to generate the `banner` function declaration for.
   */
  command: CommandTree;
};

/**
 * A built-in banner module for Shell Shock.
 */
export function BannerBuiltin(props: BannerBuiltinProps) {
  const [{ command, children }, rest] = splitProps(props, [
    "command",
    "children"
  ]);
  const context = usePowerlines<BannerPluginContext>();

  return (
    <BuiltinFile
      id={joinPaths(
        "banner",
        ...command.segments.filter(segment => !isDynamicPathSegment(segment))
      )}
      description={
        command.path
          ? `A collection of utility functions that assist in displaying banner information for the ${command.title} command.`
          : `A collection of utility functions that assist in displaying banner information for the ${getAppTitle(
              context,
              true
            )} command-line interface application.`
      }
      {...rest}
      builtinImports={defu(rest.builtinImports ?? {}, {
        utils: [
          "isUnicodeSupported",
          "isMinimal",
          "sleep",
          "isInteractive",
          "getTerminalSize"
        ],
        state: ["useGlobal", "hasFlag", "isHelp", "useMeta"],
        console: [
          "splitText",
          "writeLine",
          "help",
          "bold",
          "table",
          "stripAnsi",
          "textColors",
          "borderColors"
        ]
      })}>
      <Show
        when={Boolean(children)}
        fallback={<BannerFunctionDeclaration command={command} />}>
        {children}
      </Show>
    </BuiltinFile>
  );
}
