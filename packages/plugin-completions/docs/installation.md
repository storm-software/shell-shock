---
title: Install @shell-shock/plugin-completions
description: Add @shell-shock/plugin-completions to an application that uses @shell-shock/core.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/plugin-completions` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/plugin-completions": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

The application also needs `@shell-shock/core`. Register the plugin in `shell-shock.config.ts`.
