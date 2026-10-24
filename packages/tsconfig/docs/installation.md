---
title: Install @shell-shock/tsconfig
description: Add the shared TypeScript configs and the Powerlines config they extend.
documentType: recipe
tags: [setup]
---

Add `@shell-shock/tsconfig` to the project.

```json
{
  "devDependencies": {
    "@shell-shock/tsconfig": "workspace:*",
    "@powerlines/tsconfig": "catalog:"
  }
}
```

The repository README says these packages are still in the initial development phase. A public registry release is still pending. In this workspace, declare the package with the `workspace:*` protocol. Run `pnpm install` from the workspace root.

`base.json` extends `@powerlines/tsconfig/recommended.json`. Install `@powerlines/tsconfig` so TypeScript can resolve that extend. This package lists `@powerlines/tsconfig` as a dev dependency and marks it required in `peerDependenciesMeta`.
