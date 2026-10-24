---
title: @shell-shock/plugin-help API
description: Public exports for @shell-shock/plugin-help.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-help";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-help` or from `@shell-shock/plugin-help/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `helpGenerator`, plugin types |
| `./components` | `display`, `help-builtin`, `help-command` |
