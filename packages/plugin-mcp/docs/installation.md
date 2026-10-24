---
title: Install @shell-shock/plugin-mcp
description: Add @shell-shock/plugin-mcp to an application that uses @shell-shock/core.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/plugin-mcp` to the application `package.json`.

```json
{
  "dependencies": {
    "@shell-shock/plugin-mcp": "workspace:*"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

The package `type` is `module`. The export map publishes ESM and CommonJS entry points.

Install these peer dependencies as well:

- `@modelcontextprotocol/server` `^2.3.0`
- `zod` `^4.6.5`

The application also needs `@shell-shock/core`. Register the plugin in `shell-shock.config.ts`.
