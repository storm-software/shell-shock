---
title: Walk-through: Register the script preset
description: Follow the script preset from a custom command directory to the console, help, and banner plugins.
documentType: tutorial
audience: End user
perspective: hands-on
tags: [guide]
---

# Walk-through: Register the script preset

**Audience:** End user · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You add `plugin` from `@shell-shock/preset-script`. The preset registers console, help, and banner. Your `input` directory still decides where command files live.

## Before you start

Install `@shell-shock/core` and `@shell-shock/preset-script`. Open `playground/custom-commands-directory/shell-shock.config.ts`.

## The path at a glance

1. The config sets `input` and calls `script()`.
2. `plugin()` loads console, help, and banner.
3. The preset plugin applies global options.
4. The entrypoint generator runs on prepare.

## Step 1 — Point at the command directory

`playground/custom-commands-directory/shell-shock.config.ts` — `input` is `src/commands`. `plugins` is `[script()]`. `name` is `playground-custom-commands-directory`.

`src/commands/start/command.ts` is the `start` command because of that folder.

## Step 2 — Load the three plugins

`packages/preset-script/src/index.tsx` — `plugin()` spreads `console(options)`, `help(options)`, and `banner(options.banner)`. Banner receives only the `banner` field, which is `{ title }` on the options type.

## Step 3 — Set script defaults

The plugin `shell-shock/script-preset` is the last entry. Default global options for this preset are `--help` (`-h`, `-?`), `--version` (`-v`), and `--verbose`. Set `globalOptions` to `false` to skip them.

## Step 4 — Write the entrypoint

The preset exports `scriptEntrypointGenerator`. The plugin prepare hook uses that generator. Component modules for the entry live under `./components`, including `bin-entry` and `command-router`.

## Recap

The script preset is console, help, and banner. `input` selects the command root. Global options add help, version, and verbose flags.

## Where to go next

Pass `banner: { title: "My Script" }` and build. Switch to `@shell-shock/preset-cli` when the script needs prompts and an update command.
