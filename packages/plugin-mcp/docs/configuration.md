---
title: Configure @shell-shock/plugin-mcp
description: Options for @shell-shock/plugin-mcp.
documentType: reference
tags: [configuration]
---

`McpPluginOptions` extends `McpToolFilterOptions`.

| Field | Effect |
| --- | --- |
| `command` | Command name or a partial `CommandConfig`. The default name is `mcp`. |
| `include` | Command IDs to include. Combined with `includeTags` using OR. |
| `exclude` | Command IDs to exclude. Exclusions win. |
| `includeTags` | Include commands that have any of these tags. |
| `excludeTags` | Exclude commands that have any of these tags. Exclusions win. |

The generator export is `mcpGenerator`.
