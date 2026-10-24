---
title: Terminal markup
description: Render HTML and Markdown as terminal source with @shell-shock/unified.
documentType: getting-started
tags: [rendering]
---

`@shell-shock/unified` turns HTML and Markdown into a string a terminal can display. `renderHtml` parses HTML. `renderMarkdown` converts Markdown to HTML, then calls `renderHtml`.

The package name in the manifest describes unified built-in modules. The public functions are the renderers in `src/html` and `src/markdown`.

## Pages

- [Installation](./installation.md)
- [Quick start](./quick-start.md)
- [Configuration](./configuration.md)
- [API reference](./api-reference.md)
- [Guide: Walk-through: Render Markdown](./guides/render-markdown.md)
