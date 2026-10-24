---
title: Install @shell-shock/plugin-help
description: Add @shell-shock/plugin-help to an application that uses @shell-shock/core.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/plugin-help` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/plugin-help": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

The application also needs `@shell-shock/core`. Register the plugin in `shell-shock.config.ts`.
