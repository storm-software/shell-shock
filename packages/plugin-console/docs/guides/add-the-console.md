---
title: Walk-through: Add the console built-in
description: Follow the console plugin from registration to the prepare generator.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Add the console built-in

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-console`. It loads the theme plugin, returns your options as config, and renders the console built-in during prepare.

## Before you start

Install the package. Presets already call this plugin. Use it directly when a preset is not in the config.

## The path at a glance

1. `plugin()` loads the theme plugin with the same options.
2. `shell-shock/console` returns those options from `config()`.
3. `prepare` runs `consoleGenerator`.

## Step 1 — Register the plugin

```ts
import { plugin as consolePlugin } from "@shell-shock/plugin-console";

consolePlugin()
```

`packages/plugin-console/src/index.tsx` — the return list starts with `theme(options)`. `ConsolePluginOptions` is the theme option type, so a theme object on this plugin is forwarded there.

## Step 2 — Keep the options

The plugin name is `shell-shock/console`. `config()` returns `options` unchanged.

## Step 3 — Render during prepare

`prepare` calls `executeCommandGenerator(this, consoleGenerator)`. The generator is exported from the package root. The built-in component entry is `./components/console-builtin`.

## Recap

The console plugin is a theme plugin plus a prepare hook. The hook renders `consoleGenerator` for the application.

## Where to go next

Pass a `theme` object if this plugin is your only theme source. Prefer `@shell-shock/plugin-theme` when several plugins share one theme.
