---
title: Install @shell-shock/unified
description: Add the terminal HTML and Markdown renderer.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/unified` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/unified": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.
