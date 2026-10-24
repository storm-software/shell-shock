---
title: Add the Completions plugin plugin
description: Register @shell-shock/plugin-completions in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as completions } from "@shell-shock/plugin-completions";

export default defineConfig({
  name: "my-app",
  plugins: [
    completions({
      shells: ["bash", "zsh"]
    })
  ]
});
```

Omit `shells` to generate every supported shell. `SHELL_TYPES` is `bash`, `fish`, `zsh`, and `powershell`.

`@shell-shock/preset-cli` registers this plugin unless you set `completions` to `false`. The CLI preset only forwards the `shells` field.
