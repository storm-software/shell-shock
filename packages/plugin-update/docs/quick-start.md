---
title: Add the Update plugin plugin
description: Register @shell-shock/plugin-update in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as update } from "@shell-shock/plugin-update";

export default defineConfig({
  name: "my-app",
  plugins: [
    update({
      staleTime: 36 * 60 * 60 * 1000
    })
  ]
});
```

The default command name is `update`. The plugin sets `staleTime` to 36 hours, in milliseconds (`36 * 60 * 60 * 1000`). Set `staleTime` to `-1` to check only when the command runs. The option type comment says two hours. The value applied in `plugin()` is 36 hours.

`@shell-shock/preset-cli` always registers this plugin. Control the prompt behavior with the preset `updateType` option.
