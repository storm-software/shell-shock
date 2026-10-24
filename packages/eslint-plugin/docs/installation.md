---
title: Install @shell-shock/eslint-plugin
description: Add the ESLint plugin and the required ESLint peer dependency.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/eslint-plugin` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/eslint-plugin": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

Install these peer dependencies as well:

- `eslint` `>=9.39.3`

Put the plugin in `devDependencies` when it is only used while linting.
