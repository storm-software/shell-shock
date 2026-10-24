---
title: @shell-shock/unified API
description: renderHtml, renderMarkdown, and the HTML tag map.
documentType: reference
tags: [reference]
---

| Entry | Export | Signature |
| --- | --- | --- |
| `@shell-shock/unified` | `renderHtml`, `renderMarkdown`, types | Re-exports `./html` and `./markdown` |
| `@shell-shock/unified/html` | `renderHtml` | `(html: string, options?: Options) => string` |
| `@shell-shock/unified/markdown` | `renderMarkdown` | `(markdown: string, options?: Options) => string` |

`renderHtml` parses the HTML with `parse5`, then renders each tag. The return value is a string. Object results from a tag renderer are reduced to `value` when that field is set.

`renderMarkdown` calls `markdownToHtml`, then `renderHtml`.

`tags` in `src/html/tags/index.ts` maps tag names to renderers. The map includes common HTML tags such as `p`, `a`, `code`, `table`, headings, lists, and form controls. Import path for that module follows the package build. The root export used by applications is `renderHtml` or `renderMarkdown`.

`MarkdownToken` is the markdown-it token type. `MarkdownToHtmlOptions` is the `filter` field.
