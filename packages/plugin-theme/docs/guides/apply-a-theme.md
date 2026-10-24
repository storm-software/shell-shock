---
title: Walk-through: Apply a theme
description: Follow a theme object from the plugin option to the default theme merge.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Apply a theme

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You pass a `theme` object to `@shell-shock/plugin-theme`. The plugin keeps your tokens and fills the rest from the default theme.

## Before you start

Install `@shell-shock/plugin-theme`. The CLI playground passes the same shape through `@shell-shock/preset-cli`.

## The path at a glance

1. `plugin()` starts Style Dictionary and the theme plugin.
2. `config()` publishes preprocessors for each token group.
3. `configResolved` merges your theme over `defaultTheme`.
4. The resolved theme drives colors, borders, padding, icons, labels, and the spinner.

## Step 1 — Pass tokens

Call `plugin({ theme })`. A small override matches the playground:

```ts
theme({
  theme: {
    labels: {
      banner: {
        header: "Shell Shock Playground",
        footer: "https://stormsoftware.com"
      }
    }
  }
})
```

`ThemeUserConfig` also accepts `colors`, `borderStyles`, `padding`, `icons`, `spinner`, `settings`, and `$theme`.

## Step 2 — Register preprocessors

`packages/plugin-theme/src/index.ts` — `plugin()` calls the Style Dictionary plugin with your options except `theme`. The inner plugin name is `shell-shock/theme`. Its `config()` returns `styleDictionary.customPreprocessors` for colors, border styles, padding, icons, labels, spinners, and settings.

## Step 3 — Merge the default theme

In `configResolved`, when `this.config.theme` is an object, the plugin sets Style Dictionary `tokens` to `defu(this.config.theme, defaultTheme)`. Otherwise the tokens are `defaultTheme` from `packages/plugin-theme/src/themes/default.ts`. That file sets `$theme` to `default`.

Your `labels.banner.header` stays. Missing groups come from the default theme.

## Recap

The theme option is partial. Style Dictionary preprocessors normalize each group. `defu` lays your tokens on top of the default theme.

## Where to go next

Change `labels.banner.header` and rebuild the playground CLI. Open `src/themes/default.ts` to see the color values you inherit.
