---
title: @shell-shock/tsconfig API
description: JSON configs exported by the package.
documentType: reference
tags: [reference]
---

This package has no TypeScript runtime API. Consumers extend a JSON config.

| Export | Source file |
| --- | --- |
| `@shell-shock/tsconfig/base.json` | `src/base.json` |
| `@shell-shock/tsconfig/recommended.json` | `src/recommended.json` |
| `@shell-shock/tsconfig/strict.json` | `src/strict.json` |

`package.json` also lists those three JSON files in `files`.
