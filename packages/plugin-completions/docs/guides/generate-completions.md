---
title: Walk-through: Generate shell completions
description: Follow the completions plugin from the shells option to the completions command.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Generate shell completions

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-completions`. The plugin selects shell types and adds a `completions` command unless that command id already exists.

## Before you start

Install the package. Supported shells are `bash`, `fish`, `zsh`, and `powershell` (`SHELL_TYPES`).

## The path at a glance

1. `config()` stores `completions.shells`.
2. Omitted shells become the full `SHELL_TYPES` list.
3. `configResolved` skips the command when id `completions` already exists.
4. Otherwise it pushes the completions command.

## Step 1 — Choose shells

```ts
import { plugin as completions } from "@shell-shock/plugin-completions";

completions({ shells: ["bash", "zsh"] })
```

`packages/plugin-completions/src/index.tsx` — `config()` returns `{ completions: { shells: [...SHELL_TYPES], ...options } }`. Your `shells` array replaces the default list because it is spread after the default.

## Step 2 — Avoid a name clash

`configResolved` checks `this.inputs` for id `completions`. When that id exists, the plugin logs and does not push another command. Remove or rename your command when this plugin should own completions.

## Step 3 — Add the command

The else branch pushes an input with id, name, and path `completions`. Later in the same function the plugin adds per-shell command inputs. Component modules are `<shell>-config-command` and `<shell>-script-command`.

## Recap

`shells` selects the scripts. The default is every supported shell. An existing `completions` command blocks that parent command. The plugin still adds each selected shell command when that shell's command id is free.

## Where to go next

On the CLI preset, set `completions: { shells: ["zsh"] }` or `completions: false`.
