---
title: Walk-through: Add a banner
description: Follow the banner plugin from its title option to the per-command prepare hook.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Add a banner

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You pass a title to `@shell-shock/plugin-banner`. The plugin loads the theme and console plugins, stores the title, and renders a banner built-in for each command during prepare.

## Before you start

Install `@shell-shock/plugin-banner` and `@shell-shock/core`. The script preset already includes this plugin. Use this package when you want the banner without the rest of the preset.

## The path at a glance

1. `plugin()` loads theme and console.
2. `config()` stores `banner.title`.
3. `prepare` lists commands and runs `bannerGenerator`.

## Step 1 — Pass the title

```ts
import { plugin as banner } from "@shell-shock/plugin-banner";

banner({ title: "My App" })
```

`packages/plugin-banner/src/index.tsx` — `plugin()` spreads `theme(options.theme)` and `console(options.console)`, then adds `shell-shock/banner` with `enforce: "post"`.

## Step 2 — Store the title

The `config()` hook returns `{ banner: { title: options.title } }`. When `title` is omitted, the options type says the theme application title is used.

## Step 3 — Render one banner per command

The `prepare` handler calls `getCommandList`, then `executeCommandGenerator(this, bannerGenerator)`. The debug log includes the command count. `bannerGenerator` is exported from the package root.

## Recap

Theme and console load first. The banner plugin records the title. Prepare renders the banner built-in for every command.

## Where to go next

Set `theme.labels.banner` on the theme plugin when you want header and footer text. The CLI preset passes that shape in `playground/cli/shell-shock.config.ts`.
