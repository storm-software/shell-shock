---
title: Configure @shell-shock/plugin-theme
description: Options for @shell-shock/plugin-theme.
documentType: reference
tags: [configuration]
---

`ThemePluginOptions` adds `theme` to the Style Dictionary and Alloy plugin options. `theme` is a `ThemeUserConfig`.

| Field | Effect |
| --- | --- |
| `$theme` | Theme name. The default theme uses `default`. |
| `colors` | Partial color tokens, or a string. |
| `borderStyles` | Partial border styles, or one border type. |
| `padding` | Partial padding, or a number. |
| `icons` | Partial icons, or a string. |
| `labels` | Partial labels, or a string. |
| `spinner` | Spinner config or a spinner preset. |
| `settings` | Extra settings record. |

Message variants are `help`, `success`, `info`, `debug`, `warning`, `danger`, and `error`. Color variants are `primary`, `secondary`, and `tertiary`.

The resolved theme always has `name`, `colors`, `borderStyles`, `padding`, `icons`, `labels`, `spinner`, and `settings`.
