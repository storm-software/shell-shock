---
title: Install @shell-shock/nx
description: Add the Nx plugin and the Nx peer dependency to an application.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/nx` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/nx": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

Install these peer dependencies as well:

- `nx` `>=22.7.0`

The playground applications list `@shell-shock/nx` in `devDependencies`. The package depends on `@shell-shock/core`.
