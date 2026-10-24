---
title: Configure the ESLint rules
description: Choose the base or recommended config, or enable each rule yourself.
documentType: reference
tags: [configuration]
---

Both published configs use the same rule levels. There are no rule options. Each rule schema is an empty array.

| Config export | ESLint config name |
| --- | --- |
| `configs.base` | `shell-shock:base` |
| `configs.recommended` | `shell-shock:recommended` |

Enable one rule in your own flat config:

```js
import shellShock from "@shell-shock/eslint-plugin";

export default [
  {
    plugins: { "shell-shock": shellShock },
    rules: {
      "shell-shock/invalid-command-export": "error"
    }
  }
];
```

The default plugin object includes `configs`. The `plugin` export from `@shell-shock/eslint-plugin/plugin` is the rules object without configs.
