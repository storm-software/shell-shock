---
title: Walk-through: Add prompts
description: Follow the prompts plugin from a theme option to the prepare generator.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Add prompts

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-prompts`. It loads the theme plugin with `options.theme` and renders the prompts built-in during prepare.

## Before you start

Install the package. `@shell-shock/preset-cli` already registers it. The CLI preset `interactive` option decides when prompts run.

## The path at a glance

1. `plugin()` calls `theme({ theme: options.theme })`.
2. `shell-shock/prompts` returns the options from `config()`.
3. `prepare` runs `promptsGenerator`.

## Step 1 — Register the plugin

`packages/plugin-prompts/src/index.tsx` — `plugin()` returns the theme plugin and `shell-shock/prompts`.

```ts
import { plugin as prompts } from "@shell-shock/plugin-prompts";

prompts({ theme: { spinner: "dots" } })
```

`dots` is a key of the `spinners` object in `packages/plugin-theme/src/helpers/spinners.ts`. `SpinnerPreset` is `keyof` that object. `ThemeUserConfig.spinner` accepts a spinner config or a `SpinnerPreset`.

## Step 2 — Return options

`config()` returns `options`. The plugin does not rename fields.

## Step 3 — Render during prepare

`prepare` calls `executeCommandGenerator(this, promptsGenerator)`.

## Recap

Prompts reuse the theme plugin. Prepare writes the prompts built-in. The CLI preset controls whether the running command is interactive.

## Where to go next

Set `interactive` on `@shell-shock/preset-cli`. `true` prompts on a TTY. `"never"` disables prompts.
