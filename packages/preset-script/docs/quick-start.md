---
title: Start a script application
description: Register the script preset and point input at the command directory.
documentType: getting-started
tags: [preset]
---

`playground/custom-commands-directory/shell-shock.config.ts` uses this preset with a custom command directory.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as script } from "@shell-shock/preset-script";

export default defineConfig({
  name: "playground-custom-commands-directory",
  input: "src/commands",
  plugins: [script()]
});
```

Put command files under that directory. `src/commands/start/command.ts` is the `start` command. Build with `@shell-shock/nx:build`.
