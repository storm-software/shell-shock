---
title: Walk-through: Add the help command
description: Follow the help plugin from the command option to the default command name.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Add the help command

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-help`. It loads theme and console, then resolves a `help` command. Set `command` to `false` to skip that command.

## Before you start

Install the package. Both presets already include this plugin.

## The path at a glance

1. `plugin()` loads theme and console.
2. `config()` builds the `help` object.
3. `builtins` defaults to `true`.
4. The command name defaults to `help`.

## Step 1 — Register the plugin

`packages/plugin-help/src/index.tsx` — `plugin()` spreads `theme(options.theme)` and `console(options.console)`, then adds `shell-shock/help` with `enforce: "post"`.

## Step 2 — Resolve the command

`config()` uses `defu`. When `options.command` is `false`, the command value is `false`. When it is a string, the command name is that string. Otherwise the name is `help`.

The defaults object sets `builtins: true`, so built-in help entries are on unless you set `builtins: false`.

## Step 3 — Generate

The package exports `helpGenerator`. Component entries are `display`, `help-builtin`, and `help-command`.

## Recap

Theme and console load first. The help plugin turns `command` into a name or `false`. Built-ins stay on by default.

## Where to go next

Set `command: "usage"` and rebuild. The help command uses that name. Set `command: false` when another plugin owns help text.
