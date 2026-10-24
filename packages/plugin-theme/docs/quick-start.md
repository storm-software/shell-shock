---
title: Add the Theme plugin plugin
description: Register @shell-shock/plugin-theme in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Pass a theme through the plugin, or through a preset that accepts `theme`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as theme } from "@shell-shock/plugin-theme";

export default defineConfig({
  name: "my-app",
  plugins: [
    theme({
      theme: {
        labels: {
          banner: {
            header: "My App",
            footer: "https://example.com"
          }
        }
      }
    })
  ]
});
```

`playground/cli/shell-shock.config.ts` sets the same `labels.banner` fields through `@shell-shock/preset-cli`.

The default theme object in `src/themes/default.ts` sets `$theme` to `default`.
