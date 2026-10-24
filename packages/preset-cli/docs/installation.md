---
title: Install @shell-shock/preset-cli
description: Add the CLI preset to an application that uses @shell-shock/core.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/preset-cli` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/preset-cli": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

The preset depends on the Shell Shock plugins it registers. Install `@shell-shock/core` in the same application. `playground/cli/package.json` lists `@shell-shock/preset-cli` in `devDependencies` and `@shell-shock/core` in `dependencies`.
