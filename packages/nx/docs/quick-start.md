---
title: Add Shell Shock targets
description: Point Nx targets at the Shell Shock executors and run the build.
documentType: getting-started
tags: [nx]
---

Copy the target pattern from `playground/cli/project.json`.

```json
{
  "targets": {
    "clean": {
      "executor": "@shell-shock/nx:clean"
    },
    "prepare": {
      "executor": "@shell-shock/nx:prepare",
      "options": {
        "mode": "development"
      }
    },
    "build": {
      "executor": "@shell-shock/nx:build",
      "options": {
        "mode": "development"
      }
    },
    "docs": {
      "executor": "@shell-shock/nx:docs"
    }
  }
}
```

Run `pnpm exec nx build <project>` from the workspace root. Use the Nx project name. The playground CLI project name is `playground-cli`.

The prepare target in the playground writes `{projectRoot}/.shell-shock`. The docs target writes `{projectRoot}/docs` and depends on `build`.
