---
title: Extend a Shell Shock tsconfig
description: Point tsconfig.json at the recommended Shell Shock config.
documentType: getting-started
tags: [typescript]
---

Create `tsconfig.json` in the project.

```json
{
  "extends": "@shell-shock/tsconfig/recommended.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

Use `@shell-shock/tsconfig/strict.json` when you want `strict`, `verbatimModuleSyntax`, and `noPropertyAccessFromIndexSignature`. Use `@shell-shock/tsconfig/base.json` when you want the base compiler options without the recommended project flags.
