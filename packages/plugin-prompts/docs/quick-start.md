---
title: Add the Prompts plugin plugin
description: Register @shell-shock/plugin-prompts in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as prompts } from "@shell-shock/plugin-prompts";

export default defineConfig({
  name: "my-app",
  plugins: [prompts()]
});
```

`@shell-shock/preset-cli` already registers this plugin. Use the preset when the application also needs help, update, and completions.
