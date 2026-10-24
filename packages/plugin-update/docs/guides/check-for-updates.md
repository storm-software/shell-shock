---
title: Walk-through: Check for updates
description: Follow the update plugin from staleTime and the environment schema to the update command.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Check for updates

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-update`. The plugin sets the command name, a stale time, and an environment schema that can skip the version check.

## Before you start

Install the package. `@shell-shock/preset-cli` always registers this plugin. The preset `updateType` option changes confirm, auto, and manual behavior.

## The path at a glance

1. `config()` fills command name, `type`, and `staleTime`.
2. The environment schema is `@shell-shock/plugin-update/schemas/env`.
3. `SKIP_UPDATE_CHECK` skips the version check.
4. The CLI preset can still change `updateType`.

## Step 1 — Read the defaults

`packages/plugin-update/src/index.tsx` — plugin name `shell-shock/update`. `defu` sets `command.name` to the string `command` option, or to `update`. The defaults also set `type` to `confirm` and `staleTime` to `36 * 60 * 60 * 1000` (36 hours).

The type comment on `staleTime` says two hours. The value in `plugin()` is 36 hours. `-1` checks only when the command runs.

## Step 2 — Load the environment schema

The same `config()` sets `env.config.file` to `@shell-shock/plugin-update/schemas/env` and `env.config.export` to `envSchema`. `env.validate` is `false`.

`packages/plugin-update/src/schemas/env.ts` adds `SKIP_UPDATE_CHECK` as an optional boolean. The description says any set value skips the version check.

## Step 3 — Choose update behavior on the preset

`packages/preset-cli/src/types/plugin.ts` — `updateType` is `confirm`, `auto`, `manual`, or `false`. `confirm` asks first. `auto` updates with no prompt. `manual` prints the latest version and does not update.

## Recap

The update command name defaults to `update`. Version data stays fresh for 36 hours unless you change `staleTime`. `SKIP_UPDATE_CHECK` skips the check. The CLI preset `updateType` selects confirm, auto, or manual.

## Where to go next

Set `SKIP_UPDATE_CHECK` in CI. Set `staleTime: -1` when the check should run only from the update command.
