---
title: @shell-shock/plugin-update API
description: Public exports for @shell-shock/plugin-update.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-update";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-update` or from `@shell-shock/plugin-update/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `updateGenerator`, types |
| `./types/package-manager` | `PackageManager`, `PACKAGE_MANAGERS`, `PACKAGE_MANAGER_LOCKFILE_MAP` |
| `./schemas/env` | `envSchema`, `ShellShockUpdateEnv` |
| `./components` | Update built-in and update command generators |
