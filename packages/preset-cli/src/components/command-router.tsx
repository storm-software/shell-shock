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

import { code, For } from "@alloy-js/core";
import { IfStatement } from "@alloy-js/typescript";
import type { CommandTree } from "@shell-shock/core/types/command";
import type { CommandRouterProps } from "@shell-shock/preset-script/components/command-router";
import {
  CommandRouter as BaseCommandRouter,
  CommandRouterBody
} from "@shell-shock/preset-script/components/command-router";

export interface CommandRouterSelectOptionsProps {
  commands?: Record<string, CommandTree>;
}

export function CommandRouterSelectOptions(
  props: CommandRouterSelectOptionsProps
) {
  const { commands } = props;

  return (
    <For each={Object.values(commands ?? {})} joiner="," hardline>
      {command =>
        command.isVirtual ? (
          <CommandRouterSelectOptions commands={command.children ?? {}} />
        ) : (
          code`{ value: [${command.segments
            .map(segment => `"${segment}"`)
            .join(
              ", "
            )}], label: "${command.icon ? `${command.icon}  ` : ""}${command.title}", hint: "${
            command.description
          }" }`
        )
      }
    </For>
  );
}

/**
 * A component that renders a command router interface, allowing users to select and execute commands from a provided list of commands and segments. This component serves as a wrapper around the base CommandRouter, adding additional UI elements and logic for command selection.
 */
export function CommandRouter(props: CommandRouterProps) {
  const { segments, commands } = props;

  return (
    <>
      <BaseCommandRouter {...props} segments={segments} commands={commands} />
      <hbr />
      <hbr />
      <IfStatement condition={code`isInteractive && !isHelp`}>
        {code`
        banner();

        intro("Command selection");

        let segments = await select({
          message: "Please select a command to execute:",
          options: [ `}
        <CommandRouterSelectOptions commands={commands} />
        {` ],
        });
        if (isCancel(segments)) {
          return;
        }

        let dynamics = {} as Record<string, string>;
        for (const dynamic of segments.filter(segment => segment.startsWith("[") && segment.endsWith("]"))) {
          const value = await text({
            message: \`Please provide a value for \${dynamic.replace(/^\[+/, "").replace(/\]+$/, "")}:\`,
          });
          if (isCancel(value)) {
            return;
          }
          dynamics[dynamic] = value;
        }

        segments = segments.map(segment => dynamics[segment] || segment);
        const context = useApp();
        context.set("args", [args.length > 0 ? args[0] : undefined, args.length > 1 ? args[1] : undefined, ...segments, ...args.slice(${
          segments.length + 2
        })].filter(Boolean) as string[]);

        outro(\`Executing \${segments.join(" ")} command\`);

        command = segments[0];
        args = context.get("args"); `}
        <CommandRouterBody {...props} segments={segments} commands={commands} />
      </IfStatement>
      <hbr />
      <hbr />
    </>
  );
}
