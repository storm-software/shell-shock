/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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
import { FunctionDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import { TypescriptFile } from "@powerlines/plugin-alloy/typescript";
import {
  TSDoc,
  TSDocParam
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { getAppTitle } from "@shell-shock/core/plugin-utils";
import { joinPaths } from "@stryke/path/join";
import { AGENT_SKILL_DIRS, AGENT_SKILL_NAMES } from "../helpers/constants";
import type { SkillsPluginContext } from "../types/plugin";

export interface SkillsCommandProps {
  skills: Record<string, string>;
}

/**
 * The Skills command's handler wrapper for the Shell Shock project.
 */
export function SkillsCommand({ skills }: SkillsCommandProps) {
  const context = usePowerlines<SkillsPluginContext>();

  return (
    <TypescriptFile
      path={joinPaths(context.entryPath, "skills", "command.ts")}
      imports={{
        "node:fs/promises": ["mkdir", "writeFile"],
        "node:path": ["dirname", "join", "resolve"]
      }}
      builtinImports={{
        console: ["bold", "writeLine", "body", "warn"],
        prompts: ["multiselect", "isCancel"]
      }}>
      {code`const AGENT_SKILL_DIR: Record<string, string> = ${JSON.stringify(
        AGENT_SKILL_DIRS,
        null,
        2
      )};`}
      <Spacing />
      <TSDoc
        heading={`This command adds agent skills for the ${getAppTitle(
          context
        )} commands to the current repository.`}>
        <TSDocParam name="agents">
          An array of agent names to add skills for. If not provided, the user
          will be prompted to select one or more agents.
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        default
        async
        name="handler"
        parameters={[
          {
            name: "agents",
            type: `(${Object.values(AGENT_SKILL_NAMES)
              .map(name => JSON.stringify(name))
              .join(" | ")})[]`,
            default: "[]"
          }
        ]}>
        {code`writeLine(bold(body("Adding ${
          Object.keys(skills).length
        } ${getAppTitle(context)} skills to the repository...")));

        const validAgents = [ ${Object.values(AGENT_SKILL_NAMES)
          .map(name => JSON.stringify(name))
          .join(", ")} ];
        let targetAgents: string[];

        if (agents.includes("*")) {
          targetAgents = validAgents;
        } else if (agents.length > 0) {
          const invalidAgents = agents.filter(agent => !validAgents.includes(agent));
          if (invalidAgents.length > 0) {
            throw new Error(
              \`\${invalidAgents.length} invalid agent\${invalidAgents.length > 1 ? "s" : ""} \${invalidAgents.length > 1 ? "were" : "was"} provided: \${invalidAgents.join(", ")}. Please only provide agent types from the following list: \${validAgents.join(", ")}.\`
            );
          }

          targetAgents = agents;
        } else {
          const selectedAgents = await multiselect({
            message: "Select agents to install skills for",
            required: true,
            options: [
              ${Object.entries(AGENT_SKILL_NAMES).map(
                ([agentKey, agentName]) =>
                  code`{
                    value: ${JSON.stringify(agentKey)},
                    label: ${JSON.stringify(agentName)},
                    description: ${JSON.stringify(
                      AGENT_SKILL_DIRS[agentKey] || ".agents/skills"
                    )}
                  }`
              )}
            ]
          });
          if (isCancel(selectedAgents)) {
            writeLine(body("Skills installation was cancelled."));
            return;
          }

          if (selectedAgents.length === 0) {
            warn("No agents were selected, so there is nothing to install.");
            return;
          }

          const invalidAgents = selectedAgents.filter(agent => !validAgents.includes(agent));
          if (invalidAgents.length > 0) {
            throw new Error(
              \`\${invalidAgents.length} invalid agent\${invalidAgents.length > 1 ? "s" : ""} \${invalidAgents.length > 1 ? "were" : "was"} provided: \${invalidAgents.join(", ")}. Please only provide agent types from the following list: \${validAgents.join(", ")}.\`
            );
          }

          targetAgents = selectedAgents;
        }

        const isPathSafe = (basePath: string, targetPath: string): boolean => {
          const resolvedBase = resolve(basePath);
          const resolvedTarget = resolve(targetPath);
          return (
            resolvedTarget === resolvedBase ||
            resolvedTarget.startsWith(resolvedBase + "/")
          );
        };`}
        <Spacing />
        <For each={Object.entries(skills)} doubleHardline>
          {([skillName, skillContent]) =>
            code`for (const targetBase of Array.from(new Set(targetAgents.map(agent => join(process.cwd(), AGENT_SKILL_DIRS[agent] || ".agents/skills"))))) {
              const skillDir = join(targetBase, "${skillName
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[/\\:\0]/g, "")
                .replace(/^-+|-+$/g, "")}");
              const skillPath = join(skillDir, "SKILL.md");

              if (
                "${skillName
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[/\\:\0]/g, "")
                  .replace(/^-+|-+$/g, "")}".length > 0 &&
                isPathSafe(targetBase, skillDir) &&
                isPathSafe(skillDir, skillPath)
              ) {


              await mkdir(dirname(skillPath), { recursive: true });
              await writeFile(skillPath, ${JSON.stringify(skillContent)}, "utf8");

              writeLine(body(\`Added ${skillName} skills to \${skillPath}\`));
              } else {
                warn(\`Skipped adding the "${
                  skillName
                }" skill due to an invalid skill name. Invalid skill names could lead to an unsafe file path. Skill names must not be empty and cannot contain characters that are not allowed in file paths, such as / \\ : \\0. The skill name will be sanitized by replacing spaces with dashes, removing leading and trailing dashes, and removing any invalid characters. If the resulting skill name is empty or if the resolved skill path is outside of the target base directory, the skill will be skipped for that agent.\`
                );
              }
            } `
          }
        </For>
        <Spacing />
        {code`writeLine(bold(body("Done!")));`}
      </FunctionDeclaration>
    </TypescriptFile>
  );
}
