---
title: Walk-through: Add the skills command
description: Follow the skills plugin from a skills directory to the command input.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Add the skills command

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You point `@shell-shock/plugin-skills` at a directory of skill files. The plugin adds a `skills` command only when that directory exists and contains files.

## Before you start

Create a directory and put at least one skill file in it. Install the package. On the CLI preset, the directory must exist or the preset will not enable this plugin.

## The path at a glance

1. `config()` sets the command name to `skills`.
2. `configResolved` resolves `path` tokens.
3. A missing or empty directory returns without a command.
4. Files are read and passed to `skillsGenerator`.

## Step 1 — Set the path

```ts
import { plugin as skills } from "@shell-shock/plugin-skills";

skills({ path: "skills" })
```

`packages/plugin-skills/src/index.tsx` — `config()` sets `command.name` to a string `command` option, or to `skills`. It does not insert a default path. Set `path` yourself. The type comment shows `{root}/skills`, and the CLI preset falls back to `skills` under the current working directory.

## Step 2 — Stop when the directory is missing

`configResolved` runs `replacePathTokens` when `path` is a string. It warns and returns when `path` is missing or `existsSync` fails. The command is not added.

## Step 3 — Stop when the directory is empty

The plugin lists the directory. When the list is empty, it warns and does not push a command.

## Step 4 — Render the command

When files exist and the command id is free, the plugin pushes an input and calls `executeCommandGenerator` with `skillsGenerator` and the file contents.

A command id that already matches the skills command name is left in place. The plugin logs that fact.

## Recap

`path` must exist and contain files. The command name defaults to `skills`. Empty and missing directories produce a warning and no command.

## Where to go next

On `@shell-shock/preset-cli`, create `skills` in the working directory before the build. Set `skills: false` to skip the plugin.
