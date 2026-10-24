---
title: Walk-through: Show the changelog
description: Follow changelog file resolution until the plugin adds or skips the command.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Show the changelog

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-changelog`. The plugin looks for a changelog file. It adds a `changelog` command only when that file exists.

## Before you start

Add a `CHANGELOG.md` at the application root, or choose another supported name. Install the package.

## The path at a glance

1. `config()` sets the command name to `changelog`.
2. `configResolved` calls `resolveChangelog` when `file` is empty.
3. A missing file logs a warning and returns.
4. A file that exists becomes a command input.

## Step 1 — Register the plugin

`packages/plugin-changelog/src/index.tsx` — the plugin name is `shell-shock/changelog`. `config()` sets `command.name` from a string `command` option, or to `changelog`.

## Step 2 — Resolve the file

`packages/plugin-changelog/src/helpers/resolve-changelog.ts` — `resolveChangelog` tries `options.file` first. It then tries `CHANGELOG_FILE_NAMES` with extensions `md`, `markdown`, and `txt`. Names include `CHANGELOG`, `RELEASE-NOTES`, `RELEASE_NOTES`, `RELEASES`, and `HISTORY`.

The lookup joins `{root}` with the file name.

## Step 3 — Skip or add the command

Back in `configResolved`, a missing path or a path `existsSync` rejects causes a warning, and the function returns. The command is not added.

When the file exists and no input uses that command id, the plugin reads the file and pushes a command input.

## Recap

The command name defaults to `changelog`. The helper searches common file names under the application root. No file means no command.

## Where to go next

Rename `CHANGELOG.md` to `HISTORY.md` and rebuild. The helper still finds it. Set `file` when the changelog lives in another path.
