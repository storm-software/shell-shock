---
title: Shell Shock core
description: Build a command-line application from command files with @shell-shock/core.
documentType: getting-started
tags: [cli]
---

`@shell-shock/core` is the build core for Shell Shock. Shell Shock maps a directory of command files to a command-line application.

Put each command in a `command.ts` file. The folder path is the command path. A file at `src/start/command.ts` is the `start` command. A folder named `[task]` is a dynamic path segment. A folder named `(group)` or a folder that starts with `_` is a path group. Path groups stay out of the public command path.

The core plugin is the default command discovery. When `input` is empty, the plugin reads `src/**/command.ts` and `src/**/command.tsx`.

## Package map

| Package | Role |
| --- | --- |
| `@shell-shock/core` | Configuration, engine, and command discovery |
| `@shell-shock/preset-script` | Script application preset |
| `@shell-shock/preset-cli` | Interactive CLI preset |
| `@shell-shock/plugin-theme` | Terminal theme tokens |
| `@shell-shock/plugin-console` | `console` built-in module |
| `@shell-shock/plugin-banner` | Banner built-in module |
| `@shell-shock/plugin-help` | Help command and help built-in |
| `@shell-shock/plugin-prompts` | `prompts` built-in module |
| `@shell-shock/plugin-completions` | Shell completion commands |
| `@shell-shock/plugin-changelog` | Changelog command |
| `@shell-shock/plugin-update` | Update command |
| `@shell-shock/plugin-skills` | Agent skills command |
| `@shell-shock/plugin-mcp` | MCP server command |
| `@shell-shock/schema` | Command tree schema |
| `@shell-shock/unified` | Terminal HTML and Markdown renderers |
| `@shell-shock/eslint-plugin` | Command-file lint rules |
| `@shell-shock/nx` | Nx executors |
| `@shell-shock/tsconfig` | Shared TypeScript configs |

## Pages

- [Installation](./installation.md)
- [Quick start](./quick-start.md)
- [Configuration](./configuration.md)
- [API reference](./api-reference.md)
- [Troubleshooting](./troubleshooting.md)
- [Guide: Walk-through: Build a command](./guides/build-a-command.md)
