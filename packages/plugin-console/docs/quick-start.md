---
title: Add the Console plugin plugin
description: Register @shell-shock/plugin-console in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin next to the core config.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as consolePlugin } from "@shell-shock/plugin-console";

export default defineConfig({
  name: "my-app",
  plugins: [consolePlugin()]
});
```

Pass a theme object when you want this plugin to carry theme options. `@shell-shock/preset-cli` and `@shell-shock/preset-script` already register the console plugin.
