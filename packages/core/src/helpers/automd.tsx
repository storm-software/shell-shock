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

import { code, For, Show } from "@alloy-js/core";
import { Heading } from "@alloy-js/markdown";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { renderString } from "@powerlines/plugin-alloy/render";
import { defineGenerator } from "automd";
import type { CommandDocsUsageExampleProps } from "../components/docs";
import {
  CommandArgumentDocs,
  CommandDocs,
  CommandDocsUsageExample,
  CommandOptionsDocs
} from "../components/docs";
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
    async generate(ctx) {
      let commands = Object.values(context.commands).filter(
        cmd => !cmd.virtual
      );
      if (ctx.args.command) {
        if (!context.commands[ctx.args.command]) {
          throw new Error(
            `The command "${ctx.args.command}" does not exist in the application.`
          );
        }

        commands = [context.commands[ctx.args.command]!];
      }

      return {
        contents: renderString(
          context,
          <>
            <Show when={!ctx.args.command}>
              <Heading level={2}>Commands</Heading>
              <Spacing />
              {code`The following commands are available in the ${getAppTitle(
                context,
                true
              )} command-line interface application:`}
              <Spacing />
            </Show>
            <For each={commands} doubleHardline>
              {child => (
                <Show when={!child.virtual}>
                  <CommandDocs command={child} levelOffset={2} />
                </Show>
              )}
            </For>
            <Spacing />
          </>
        )
      };
    }
  });

/**
 * AutoMD generator to generate usage examples for a specific command.
 *
 * @param context - The generator context.
 * @returns The generated usage content.
 */
export const usage = (context: Context) =>
  defineGenerator({
    name: "usage",
    async generate(ctx) {
      if (!ctx.args.command) {
        throw new Error(
          "The 'usage' generator requires the \"command\" argument."
        );
      }
      if (!context.commands[ctx.args.command]) {
        throw new Error(
          `The command "${ctx.args.command}" does not exist in the application.`
        );
      }

      let packageManagers = ["npm", "yarn", "pnpm", "bun"];
      if (ctx.args.packageManager) {
        packageManagers = [String(ctx.args.packageManager)];
      }

      if (
        packageManagers.some(pm => !["npm", "yarn", "pnpm", "bun"].includes(pm))
      ) {
        throw new Error(
          `Invalid package manager specified. Supported package managers are: npm, yarn, pnpm, and bun.`
        );
      }

      return {
        contents: renderString(
          context,
          <>
            <For each={packageManagers} doubleHardline>
              {packageManager => (
                <>
                  <CommandDocsUsageExample
                    packageManager={
                      packageManager as CommandDocsUsageExampleProps["packageManager"]
                    }
                    command={context.commands[ctx.args.command]!}
                    expand={packageManagers && packageManagers.length > 1}
                  />
                </>
              )}
            </For>
          </>
        )
      };
    }
  });

/**
 * AutoMD generator to generate options for a specific command.
 *
 * @param context - The generator context.
 * @returns The generated options content.
 */
export const options = (context: Context) =>
  defineGenerator({
    name: "options",
    async generate(ctx) {
      if (!ctx.args.command) {
        throw new Error(
          "The 'options' generator requires the \"command\" argument."
        );
      }
      if (!context.commands[ctx.args.command]) {
        throw new Error(
          `The command "${ctx.args.command}" does not exist in the application.`
        );
      }

      return {
        contents: renderString(
          context,
          <CommandOptionsDocs command={context.commands[ctx.args.command]!} />
        )
      };
    }
  });

/**
 * AutoMD generator to generate arguments for a specific command.
 *
 * @param context - The generator context.
 * @returns The generated arguments content.
 */
export const args = (context: Context) =>
  defineGenerator({
    name: "args",
    async generate(ctx) {
      if (!ctx.args.command) {
        throw new Error(
          "The 'args' generator requires the \"command\" argument."
        );
      }
      if (!context.commands[ctx.args.command]) {
        throw new Error(
          `The command "${ctx.args.command}" does not exist in the application.`
        );
      }

      return {
        contents: renderString(
          context,
          <CommandArgumentDocs command={context.commands[ctx.args.command]!} />
        )
      };
    }
  });
