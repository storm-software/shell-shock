---
title: Add the Skills plugin plugin
description: Register @shell-shock/plugin-skills in shell-shock.config.ts.
documentType: getting-started
tags: [plugin]
---

Create a `skills` directory in the project root, or set `path`. Register the plugin in `shell-shock.config.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as skills } from "@shell-shock/plugin-skills";

export default defineConfig({
  name: "my-app",
  plugins: [
    skills({
      path: "skills"
    })
  ]
});
```

Set `path` to a directory that exists and contains skill files. The plugin command name defaults to `skills`. The plugin does not add the command when `path` is empty, missing, or points at a missing directory.

`@shell-shock/preset-cli` enables this plugin only when `skills` is not `false` and the skills directory exists. The preset looks at `options.skills.path`, or `skills` under the current working directory.
