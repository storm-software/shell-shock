---
title: Walk-through: Register the CLI preset
description: Follow the CLI preset from shell-shock.config.ts through the plugins it enables.
documentType: tutorial
audience: End user
perspective: hands-on
tags: [guide]
---

# Walk-through: Register the CLI preset

**Audience:** End user · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You add `plugin` from `@shell-shock/preset-cli`. The preset turns on console, help, prompts, changelog, completions, skills, and update. Some of those plugins stay off when you pass `false` or when a directory is missing.

## Before you start

Install `@shell-shock/core` and `@shell-shock/preset-cli`. Open `playground/cli/shell-shock.config.ts`.

## The path at a glance

1. The config calls `cli({ theme })`.
2. `plugin()` returns the bundled plugin list.
3. Changelog, completions, and skills can be skipped.
4. The preset sets global options and `isCaseSensitive: false`.
5. Prepare renders built-ins and the entrypoint.

## Step 1 — Call the preset

`playground/cli/shell-shock.config.ts` — `defineConfig` sets `name` to `playground-cli` and passes `cli()` in `plugins`. The theme sets `labels.banner.header` and `labels.banner.footer`.

## Step 2 — Read the plugin list

`packages/preset-cli/src/index.tsx` — `plugin()` spreads console, help, and prompts. `enable()` wraps changelog and completions. Those two run when the option is not `false`.

Skills run when `skills` is not `false` and the directory exists. The path is `options.skills.path`, or `skills` under the current working directory.

`update()` is always in the list.

## Step 3 — Apply preset defaults

The plugin named `shell-shock/cli-preset:main` returns `globalOptions`, `isCaseSensitive: false`, and `env.validate: false` merged with your `env`. Default flags include `--help`, `--version`, `--interactive`, `--no-interactive`, `--no-banner`, and `--verbose`.

`interactive` defaults to `true` on the options type. That prompts when a TTY is present.

## Step 4 — Generate files

The same plugin's `prepare` hook calls `executeCommandGenerator` with `cliBuiltinsGenerator`. The plugin `shell-shock/cli-preset:generate-entrypoint` calls `cliEntrypointGenerator`.

## Recap

One preset call registers the interactive CLI plugins. `false` turns changelog or completions off. A missing skills directory leaves skills off. Prepare writes the built-ins and the entrypoint.

## Where to go next

Set `updateType` to `manual` and build again. The update command prints the latest version and does not apply it. Use `@shell-shock/preset-script` when you do not want prompts or update.
