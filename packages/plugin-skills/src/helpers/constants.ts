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

export const AGENT_SKILL_DIRS: Record<string, string> = {
  universal: ".agents/skills",
  "claude-code": ".claude/skills",
  opencode: ".agents/skills",
  codex: ".agents/skills",
  cursor: ".agents/skills",
  "github-copilot": ".agents/skills",
  warp: ".agents/skills",
  cline: ".agents/skills",
  continue: ".continue/skills",
  "command-code": ".commandcode/skills",
  "gemini-cli": ".agents/skills",
  openhands: ".openhands/skills",
  roo: ".roo/skills",
  windsurf: ".windsurf/skills",
  zencoder: ".zencoder/skills",
  augment: ".augment/skills",
  openclaw: "skills",
  codebuddy: ".codebuddy/skills",
  "codearts-agent": ".codeartsdoer/skills",
  codemaker: ".codemaker/skills",
  codestudio: ".codestudio/skills",
  crush: ".crush/skills",
  pi: ".pi/skills",
  "tabnine-cli": ".tabnine/agent/skills",
  replit: ".agents/skills"
};

export const AGENT_SKILL_NAMES: Record<string, string> = {
  universal: "Universal",
  "claude-code": "Claude Code",
  opencode: "OpenCode",
  codex: "Codex",
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  warp: "Warp",
  cline: "Cline",
  continue: "Continue",
  "command-code": "Command Code",
  "gemini-cli": "Gemini CLI",
  openhands: "OpenHands",
  roo: "Roo",
  windsurf: "Windsurf",
  zencoder: "Zencoder",
  augment: "Augment",
  openclaw: "OpenClaw",
  codebuddy: "CodeBuddy",
  "codearts-agent": "CodeArts Agent",
  codemaker: "CodeMaker",
  codestudio: "CodeStudio",
  crush: "Crush",
  pi: "Pi",
  "tabnine-cli": "TabNine CLI",
  replit: "Replit"
};
