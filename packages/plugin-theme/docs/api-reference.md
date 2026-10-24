---
title: @shell-shock/plugin-theme API
description: Public exports for @shell-shock/plugin-theme.
documentType: reference
tags: [reference]
---

```ts
import { plugin } from "@shell-shock/plugin-theme";
```

`plugin(options?)` returns the Style Dictionary plugin plus the `shell-shock/theme` plugin. It merges `options.theme` with the default theme.

| Entry | Export |
| --- | --- |
| `.` | `plugin` and theme types |
| `./types` | `ThemePluginOptions`, `ThemeUserConfig`, `ThemeResolvedConfig` |
| `./contexts/theme` | Theme context helper |
| `./helpers` | ANSI helpers, border styles, merge, spinners |

`ThemeUserConfig` is the public theme document. Helper modules support the renderer. Prefer the `theme` option over calling helper functions from an application.
