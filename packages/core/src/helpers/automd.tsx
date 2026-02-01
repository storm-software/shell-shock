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
import { For, Show } from "@alloy-js/core/components";
import { Heading } from "@alloy-js/markdown";
import { renderString } from "@powerlines/plugin-alloy/render";
import { defineGenerator } from "automd";
import { CommandDocs } from "../components/docs";
import { getAppTitle } from "../plugin-utils";
import type { Context } from "../types/context";

/**
 * AutoMD generator to generate CLI command documentation
 *
 * @see https://automd.unjs.io/
 *
 * @param context - The generator context.
 * @returns The generated documentation content.
 */
export const commands = (context: Context) =>
  defineGenerator({
    name: "commands",
    async generate() {
      return {
        contents: renderString(
          context,
          <>
            <Heading level={2}>Commands</Heading>
            <hbr />
            <hbr />
            {code`The following commands are available in the ${getAppTitle(
              context
            )} CLI application:`}
            <hbr />
            <hbr />
            <For each={Object.values(context.commands)} doubleHardline>
              {child => (
                <Show when={!child.isVirtual}>
                  <CommandDocs command={child} levelOffset={2} />
                </Show>
              )}
            </For>
            <hbr />
            <hbr />
          </>
        )
      };
    }
  });
