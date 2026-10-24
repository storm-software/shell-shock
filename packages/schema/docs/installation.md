---
title: Install @shell-shock/schema
description: Add the command tree schema package.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/schema` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/schema": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

The package uses `@power-plant/core` and Zod. Those packages are dependencies of this package.
