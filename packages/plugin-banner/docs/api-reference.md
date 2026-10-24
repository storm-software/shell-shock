---
title: @shell-shock/plugin-banner API
description: Public exports for @shell-shock/plugin-banner.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-banner";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-banner` or from `@shell-shock/plugin-banner/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `bannerGenerator`, plugin types |
| `./generator` | `bannerGenerator` |
| `./types` | `BannerPluginOptions`, user config, resolved config, context |
| `./components` | Banner built-in generators |
