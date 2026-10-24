---
title: Configure the script preset
description: Set the banner, global options, and the help and theme fields the preset accepts.
documentType: reference
tags: [configuration]
---

`ScriptPresetOptions` includes core options except the core `globalOptions` field, plus theme, console, and help options, plus these fields:

| Field | Default | Effect |
| --- | --- | --- |
| `globalOptions` | Preset helper | Option list, a function, or `false`. |
| `banner` | Unset | `{ title }` forwarded to the banner plugin. The application name is the banner text when title is omitted. |

Help options on this type:

| Field | Default | Effect |
| --- | --- | --- |
| `builtins` | `true` | Built-in help entries. |
| `command` | `"help"` | Help command name, partial config, or `false`. |

Theme options use `theme` from `@shell-shock/plugin-theme`. Core fields such as `bin`, `docs`, `isCaseSensitive`, and `autoAssignEnv` are also part of the options type.
