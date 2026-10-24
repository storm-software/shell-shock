---
title: @shell-shock/nx API
description: Inference export and executor entry points.
documentType: reference
tags: [reference]
---

| Entry | Export | Role |
| --- | --- | --- |
| `@shell-shock/nx` | Re-exports `./base` | Package root |
| `@shell-shock/nx/plugin` | `createNodesV2` | Nx inference plugin |
| `@shell-shock/nx/executors/<name>/executor` | Default executor function | One phase |
| `executors.json` | Executor manifest | Nx executor registry |

`withExecutor` in `src/base/base-executor.ts` binds an executor function to a phase name. Each phase executor calls the Powerlines executor API and returns `{ success: true }`.

Schema modules live at `@shell-shock/nx/executors/<name>/untyped` and `executors/<name>/schema.json`.
