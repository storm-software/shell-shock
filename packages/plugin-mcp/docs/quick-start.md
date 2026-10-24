---
title: Add the MCP plugin plugin
description: Register @shell-shock/plugin-mcp in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Install the peer packages, then register the plugin.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as mcp } from "@shell-shock/plugin-mcp";

export default defineConfig({
  name: "my-app",
  plugins: [
    mcp({
      command: "mcp",
      includeTags: ["public"]
    })
  ]
});
```

The default command name is `mcp`. The plugin adds that command during `configResolved`. When a command with the same name is already in the input list, the plugin leaves the existing command in place and writes an info log.

`select-commands` filters the command tree. Include lists and include tags are combined with OR. Exclude lists and exclude tags take precedence.
