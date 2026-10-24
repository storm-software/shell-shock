---
title: Render Markdown in the terminal
description: Call renderMarkdown with a Markdown string and read the returned source.
documentType: getting-started
tags: [rendering]
---

Import `renderMarkdown` from `@shell-shock/unified` or from `@shell-shock/unified/markdown`.

```ts
import { renderMarkdown } from "@shell-shock/unified";

const output = renderMarkdown("# Title\n\nHello");
console.log(output);
```

`renderMarkdown` returns a string. The string is source that displays the Markdown in the terminal.

For HTML, call `renderHtml` from `@shell-shock/unified/html`.

```ts
import { renderHtml } from "@shell-shock/unified/html";

const output = renderHtml("<p>Hello</p>");
```

Both functions accept an options object. An empty options object uses the defaults.
