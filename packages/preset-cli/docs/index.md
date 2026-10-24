---
title: CLI preset
description: Generate an interactive command-line application with help, prompts, update, and completions.
documentType: getting-started
tags: [preset]
---

`@shell-shock/preset-cli` is the preset for an interactive command-line application. One `plugin()` call registers the console, help, and prompts plugins. It also registers changelog, completions, skills, and update with the rules below.

The preset sets `globalOptions` from its own helper, sets `isCaseSensitive` to `false`, and sets `env.validate` to `false` unless your config replaces `env`.

Use `@shell-shock/preset-script` when the application does not need prompts, completions, changelog, skills, or update.

## Pages

- [Installation](./installation.md)
- [Quick start](./quick-start.md)
- [Configuration](./configuration.md)
- [API reference](./api-reference.md)

- [Troubleshooting](./troubleshooting.md)
- [Guide: Walk-through: Register the CLI preset](./guides/register-the-preset.md)
