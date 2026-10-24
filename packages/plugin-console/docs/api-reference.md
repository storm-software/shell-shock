---
title: @shell-shock/plugin-console API
description: Public exports for @shell-shock/plugin-console.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-console";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-console` or from `@shell-shock/plugin-console/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `consoleGenerator`, plugin types |
| `./components/console-builtin` | Console built-in generator |
