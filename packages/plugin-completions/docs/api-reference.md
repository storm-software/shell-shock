---
title: @shell-shock/plugin-completions API
description: Public exports for @shell-shock/plugin-completions.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-completions";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-completions` or from `@shell-shock/plugin-completions/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `completionsGenerator`, types |
| `./types/shell-type` | `ShellType`, `SHELL_TYPES` |
| `./helpers` | Completion command helpers and directive constants |
| `./components/<shell>-config-command` | Config command generator |
| `./components/<shell>-script-command` | Script command generator |

`<shell>` is `bash`, `fish`, `powershell`, or `zsh`.
