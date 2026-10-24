---
title: Configure @shell-shock/plugin-skills
description: Options for @shell-shock/plugin-skills.
documentType: reference
tags: [configuration]
---

`SkillsPluginOptions` fields:

| Field | Default | Effect |
| --- | --- | --- |
| `path` | Unset in `plugin()` | Skills directory. The type comment shows `{root}/skills`. The plugin does not fill that path itself. |
| `skipMissingSkills` | `false` | Skip skills for commands that are missing. |
| `command` | `skills` | Command name or a partial command config. A string replaces the name. |

The package keeps a map of agent skill directories in `src/helpers/constants.ts` (`AGENT_SKILL_DIRS`). Examples include `.agents/skills` for the `universal` key and `.claude/skills` for `claude-code`.
