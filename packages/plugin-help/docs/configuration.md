---
title: Configure @shell-shock/plugin-help
description: Options for @shell-shock/plugin-help.
documentType: reference
tags: [configuration]
---

`HelpPluginOptions` fields:

| Field | Default | Effect |
| --- | --- | --- |
| `builtins` | `true` | Add built-in help entries for application commands. |
| `command` | `"help"` | Command name, a partial command config, or `false`. |
| `theme` | Unset | Theme plugin options. |
| `console` | Unset | Console plugin options. |

The generator export is `helpGenerator`.
