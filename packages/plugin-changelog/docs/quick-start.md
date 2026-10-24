---
title: Add the Changelog plugin plugin
description: Register @shell-shock/plugin-changelog in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as changelog } from "@shell-shock/plugin-changelog";

export default defineConfig({
  name: "my-app",
  plugins: [changelog()]
});
```

The default command name is `changelog`. The default file is `{root}/CHANGELOG.md`. When that file is missing, the plugin looks for common changelog names such as `CHANGELOG.md`, `RELEASE-NOTES.md`, `RELEASES.md`, and `HISTORY.md` in Markdown, text, and lowercase variants.

`@shell-shock/preset-cli` registers this plugin unless you set `changelog` to `false`.
