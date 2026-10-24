---
title: Install @shell-shock/core
description: Add @shell-shock/core to an application and install workspace dependencies.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/core` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/core": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

The package runs on the Node.js platform. The core plugin sets `platform` to `node` and the output format to ESM.

Import the configuration helper from `@shell-shock/core/config`. Import command helpers from `@shell-shock/core`.
