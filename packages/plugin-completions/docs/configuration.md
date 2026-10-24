---
title: Configure @shell-shock/plugin-completions
description: Options for @shell-shock/plugin-completions.
documentType: reference
tags: [configuration]
---

`CompletionsPluginOptions` fields:

| Field | Default | Effect |
| --- | --- | --- |
| `shells` | All supported shells | Subset of `bash`, `fish`, `zsh`, `powershell`. |

The package exports completion command components for each shell. Each shell has a config command module and a script command module.

`SHELL_TYPES` is the full list. Import it from `@shell-shock/plugin-completions` or `@shell-shock/plugin-completions/types/shell-type`.
