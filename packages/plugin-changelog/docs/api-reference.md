---
title: @shell-shock/plugin-changelog API
description: Public exports for @shell-shock/plugin-changelog.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-changelog";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-changelog` or from `@shell-shock/plugin-changelog/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `changelogGenerator`, plugin types |
| `./helpers/resolve-changelog` | Changelog file resolver |
| `./components/changelog-command` | Changelog command generator |
