---
title: @shell-shock/plugin-skills API
description: Public exports for @shell-shock/plugin-skills.
documentType: reference
tags: [reference]
---

`plugin(options?)` returns one or more Powerlines plugins. Import it from the package root.

```ts
import { plugin } from "@shell-shock/plugin-skills";
```

The package also exports the generator and the plugin types from the entry points in `package.json`. Component modules under `./components` are build-time generators. Import types from `@shell-shock/plugin-skills` or from `@shell-shock/plugin-skills/types`.

| Entry | Export |
| --- | --- |
| `.` | `plugin`, `skillsGenerator`, plugin types |
| `./components/skills-command` | Skills command generator |
