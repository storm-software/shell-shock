---
title: Walk-through: Render Markdown
description: Follow a Markdown string through renderMarkdown into renderHtml.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Render Markdown

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You call `renderMarkdown` with a Markdown string. The function converts it to HTML, then `renderHtml` returns terminal source.

## Before you start

Install `@shell-shock/unified`.

## The path at a glance

1. Call `renderMarkdown`.
2. `markdownToHtml` produces HTML.
3. `renderHtml` parses that HTML.
4. Options change width, ASCII mode, and font attributes.

## Step 1 — Call the renderer

```ts
import { renderMarkdown } from "@shell-shock/unified";

const output = renderMarkdown("# Title\n\nHello", {
  asciiMode: true
});
```

`packages/unified/src/markdown/index.ts` — `renderMarkdown` calls `renderHtml(markdownToHtml(markdown, options), options)`.

## Step 2 — Convert Markdown

`markdownToHtml` lives in `packages/unified/src/markdown/markdown-to-html.ts`. The `filter` option receives markdown-it tokens and can return a new token list before HTML is produced. `MarkdownToken` is the markdown-it token type.

## Step 3 — Render HTML

`packages/unified/src/html/index.ts` — `renderHtml` parses the string with `parse5`, then `renderTag` walks the tree. The function returns a string. When a tag result is an object, the function uses the `value` field when it is set.

`packages/unified/src/html/tags/index.ts` exports `tags`, the map of tag renderers.

## Step 4 — Set options

`packages/unified/src/types.ts` — `lineWidth` defaults to the terminal width minus 2, capped at 120. `fontAttrs` defaults to `true`. `asciiMode` defaults to `false`. `postProcess` receives the final string.

## Recap

Markdown becomes HTML, then terminal source. The same options object applies to both stages. `filter` runs only on the Markdown token list.

## Where to go next

Call `renderHtml("<p>Hello</p>")` from `@shell-shock/unified/html` when the input is already HTML. Set `asciiMode: true` and compare the border characters.
