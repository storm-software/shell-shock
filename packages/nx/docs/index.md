---
title: Shell Shock Nx plugin
description: Run Shell Shock clean, prepare, lint, build, and docs targets from Nx.
documentType: getting-started
tags: [nx]
---

`@shell-shock/nx` adds Nx executors for a Shell Shock application. It also exports `createNodesV2` for Nx project inference. The inference plugin sets the framework to `shell-shock` through `@powerlines/nx`.

This workspace does not register `@shell-shock/nx` in `nx.json`. Playground applications set the executor on each target in `project.json`.

## Pages

- [Installation](./installation.md)
- [Quick start](./quick-start.md)
- [Configuration](./configuration.md)
- [API reference](./api-reference.md)
- [Troubleshooting](./troubleshooting.md)
- [Guide: Walk-through: Run a Shell Shock build in Nx](./guides/run-a-build.md)
