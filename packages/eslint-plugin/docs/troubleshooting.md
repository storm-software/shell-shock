---
title: ESLint rule failures
description: Correct the command file when a Shell Shock rule reports an error.
documentType: recipe
tags: [troubleshooting]
---

## invalid-command-export

Export a function as the default export.

```ts
export default function handler(options) {
  // command body
}
```

A default export of a constant fails the rule.

## invalid-handler-params

Keep the first parameter for options. Make every later parameter `string`, `number`, `boolean`, a literal of those types, or an array of those types.

## duplicate-command-path

Leave one `command.ts` in the directory. Remove the extra command file from a `(group)` directory or a `_` directory in the same path.
