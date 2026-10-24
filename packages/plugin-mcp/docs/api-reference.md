---
title: @shell-shock/plugin-mcp API
description: Public exports for @shell-shock/plugin-mcp.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-mcp";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-mcp` or from `@shell-shock/plugin-mcp/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `mcpGenerator`, plugin types |
| `./components/mcp-command` | MCP command module used by the generator |
| `./types` | `McpPluginOptions`, `McpToolFilterOptions` |

Peer dependencies:

- `@modelcontextprotocol/server` `^2.3.0`
- `zod` `^4.6.5`
