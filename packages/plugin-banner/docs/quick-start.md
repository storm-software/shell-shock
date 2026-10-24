---
title: Add the Banner plugin plugin
description: Register @shell-shock/plugin-banner in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as banner } from "@shell-shock/plugin-banner";

export default defineConfig({
  name: "my-app",
  plugins: [
    banner({
      title: "My App"
    })
  ]
});
```

`title` is the banner title. When `title` is omitted, the plugin uses the application title from the theme plugin.

The preset `@shell-shock/preset-script` already includes this plugin. Use that preset when you want the script banner with the other script built-ins.
