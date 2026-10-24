---
title: @shell-shock/preset-script API
description: Script preset plugin, generator, and option types.
documentType: reference
tags: [reference]
---

```ts
import { plugin } from "@shell-shock/preset-script";
```

`plugin(options?: ScriptPresetOptions)` returns a Powerlines plugin list. It spreads the console, help, and banner plugins, then adds `shell-shock/script-preset`.

| Export | Role |
| --- | --- |
| `plugin` | Preset plugin list |
| `scriptEntrypointGenerator` | Entrypoint generator |

Types: `ScriptPresetOptions`, `ScriptPresetUserConfig`, `ScriptPresetResolvedConfig`, `ScriptPresetContext`.

Component entries: `bin-entry`, `command-entry`, `command-router`, `exit-function-declaration`, `virtual-command-entry`.
