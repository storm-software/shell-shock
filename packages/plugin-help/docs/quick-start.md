---
title: Add the Help plugin plugin
description: Register @shell-shock/plugin-help in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as help } from "@shell-shock/plugin-help";

export default defineConfig({
  name: "my-app",
  plugins: [
    help({
      command: "help"
    })
  ]
});
```

The default command name is `help`. Set `command` to `false` to skip the help command. Built-in help entries are added for commands when `builtins` is omitted. The default is `true`.

`@shell-shock/preset-cli` and `@shell-shock/preset-script` already include this plugin.
