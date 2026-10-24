---
title: @shell-shock/plugin-prompts API
description: Public exports for @shell-shock/plugin-prompts.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-prompts";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-prompts` or from `@shell-shock/plugin-prompts/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `promptsGenerator`, plugin types |
| `./components/prompts-builtin` | Prompts built-in generator |
