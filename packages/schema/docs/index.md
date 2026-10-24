---
title: Command tree schema
description: Validate a Shell Shock command tree with the Power Plant schema package.
documentType: getting-started
tags: [schema]
---

`@shell-shock/schema` describes the Shell Shock command tree for Power Plant. The document shape is `Record<string, CommandTree>`. That is the same shape as `context.commands` in `@shell-shock/core`.

Each node carries metadata, `options`, `args`, `parent`, and `children`.

## Pages

- [Installation](./installation.md)
- [Quick start](./quick-start.md)
- [Configuration](./configuration.md)
- [API reference](./api-reference.md)
- [Guide: Walk-through: Validate a command tree](./guides/validate-a-command-tree.md)
