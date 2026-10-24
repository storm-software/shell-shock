---
title: Enable the recommended config
description: Register the Shell Shock recommended flat config in eslint.config.js.
documentType: getting-started
tags: [lint]
---

Add the recommended config to the ESLint flat config.

```js
import shellShock from "@shell-shock/eslint-plugin";

export default [shellShock.configs.recommended];
```

`configs.recommended` sets this behavior:

| Rule | Level |
| --- | --- |
| `shell-shock/duplicate-command-path` | `warn` |
| `shell-shock/invalid-command-export` | `error` |
| `shell-shock/invalid-handler-params` | `error` |

The config matches `**/*.{,c,m}{j,t}s{,x}` and ignores `.shell-shock`.

`configs.base` uses the same rules and files. Import it from `@shell-shock/eslint-plugin/configs/base` when you want that entry directly.
