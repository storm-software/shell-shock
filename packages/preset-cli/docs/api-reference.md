---
title: @shell-shock/preset-cli API
description: Preset plugin, generators, and option types.
documentType: reference
tags: [reference]
---

```ts
import { plugin } from "@shell-shock/preset-cli";
```

`plugin(options?: CLIPresetOptions)` returns a Powerlines plugin list. The default export is the same function.

| Export | Role |
| --- | --- |
| `plugin` | Registers console, help, prompts, changelog, completions, skills, and update |
| `cliBuiltinsGenerator` | Built-in module generator |
| `cliEntrypointGenerator` | Entrypoint generator |

Types from `./types`: `CLIPresetOptions`, `CLIPresetUserConfig`, `CLIPresetResolvedConfig`, `CLIPresetContext`, `UpdateType`, `CLIPresetBannerOption`, `CLIPresetBannerOverrideOption`, `CLIPresetBannerFontOption`.

Component entries: `banner-builtin`, `command-entry`, `command-router`, `update-builtin`, `virtual-command-entry`.
