---
title: Walk-through: Extend the strict TypeScript config
description: Follow the strict config from its extends chain to a project tsconfig.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Extend the strict TypeScript config

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You extend `@shell-shock/tsconfig/strict.json`. TypeScript loads strict, then recommended, then base, then `@powerlines/tsconfig/recommended.json`.

## Before you start

Install `@shell-shock/tsconfig` and `@powerlines/tsconfig`. The base file extends `@powerlines/tsconfig/recommended.json`.

## The path at a glance

1. The project `tsconfig.json` extends `strict.json`.
2. Strict turns on `strict` and two extra checks.
3. Recommended turns on project build flags.
4. Base sets the module and library options.

## Step 1 — Extend strict

```json
{
  "extends": "@shell-shock/tsconfig/strict.json",
  "include": ["src"]
}
```

The export path is `@shell-shock/tsconfig/strict.json`. The source file is `packages/tsconfig/src/strict.json`.

## Step 2 — Read the strict flags

`src/strict.json` extends `@shell-shock/tsconfig/recommended.json`. It sets `strict` to `true`, `verbatimModuleSyntax` to `true`, and `noPropertyAccessFromIndexSignature` to `true`.

## Step 3 — Read the recommended flags

`src/recommended.json` extends `@shell-shock/tsconfig/base.json`. It sets `composite`, `incremental`, and `isolatedModules` to `true`.

## Step 4 — Read the base flags

`src/base.json` extends `@powerlines/tsconfig/recommended.json`. It sets `target` and `module` to ESNext, `moduleResolution` to `Bundler`, `types` to `node`, and `lib` to ESNext plus DOM libs. `verbatimModuleSyntax` is `false` here. The strict file turns it back on.

## Recap

Strict is a chain of three Shell Shock files plus the Powerlines recommended config. Override a flag in the project file when one project needs a different value.

## Where to go next

Extend `@shell-shock/tsconfig/base.json` when you want the base options without `composite` or `strict`.
