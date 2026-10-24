---
title: Install @shell-shock/preset-script
description: Add the script preset to an application that uses @shell-shock/core.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/preset-script` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/preset-script": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

Install `@shell-shock/core` in the same application.
