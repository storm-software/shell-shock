---
title: Renderer options
description: Line width, ASCII mode, font attributes, and Markdown token filters.
documentType: reference
tags: [configuration]
---

`Options` is the argument for `renderHtml` and `renderMarkdown`. Every field is optional.

| Field | Default in the type docs | Effect |
| --- | --- | --- |
| `pre` | Unset | Wrap lines at a width. |
| `lineWidth` | Terminal width minus 2, with a maximum of 120 | Wrap width. |
| `fontAttrs` | `true` | Include bold, italic, and other font attributes. `false` omits them. |
| `depth` | `0` | Nesting depth for indentation. |
| `asciiMode` | `false` | Use ASCII for borders and dividers. |
| `filter` | Unset | Function from Markdown tokens to tokens. Runs before HTML render. |
| `postProcess` | Unset | Function from the output string to a string. |

`filter` applies to Markdown. `renderHtml` accepts the same options object. `ResolvedOptions` requires every field except `filter` and `postProcess`.
