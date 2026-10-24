---
title: Walk-through: Run a Shell Shock build in Nx
description: Follow a project.json build target into the Shell Shock build executor.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Run a Shell Shock build in Nx

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You point an Nx target at `@shell-shock/nx:build`. Nx calls the build executor. The executor forwards `skipCache` and `autoInstall` into the Powerlines build.

## Before you start

Install `nx` `>=22.7.0` and `@shell-shock/nx`. Open `playground/cli/project.json`. This workspace does not register the plugin in `nx.json`, so the target must name the executor.

## The path at a glance

1. `project.json` names `@shell-shock/nx:build`.
2. `executors.json` maps `build` to the executor implementation.
3. `withExecutor` binds the function to the `build` phase.
4. The executor calls the Powerlines API and returns `{ success: true }`.

## Step 1 — Declare the target

`playground/cli/project.json` — the `build` target uses executor `@shell-shock/nx:build` and sets `mode` to `development`. `prepare` uses the same mode. `docs` depends on `build`.

Run `pnpm exec nx build playground-cli` from the workspace root.

## Step 2 — Resolve the executor

`packages/nx/executors.json` — the `build` entry points at `./dist/executors/build/executor` and describes the target as the Shell Shock `build` command. `package.json` sets `"executors": "./executors.json"`.

## Step 3 — Bind the phase

`packages/nx/src/base/base-executor.ts` — `withExecutor(command, executorFn)` wraps the Powerlines executor helper. `packages/nx/src/executors/build/executor.ts` calls `withExecutor("build", executorFn)`.

## Step 4 — Forward options

In that executor, `executorFn` passes `skipCache` and `autoInstall` from `context.options` into the inline config. It then returns `{ success: true }`.

`prepare` forwards the same two fields. `clean`, `lint`, and `docs` are separate executors in `executors.json`.

## Recap

The playground target names the executor. The manifest loads `executor.ts`. `withExecutor` selects the build phase. The function forwards two options and reports success.

## Where to go next

Add a `clean` target with `@shell-shock/nx:clean` before a rebuild. To infer targets, register `@shell-shock/nx` so Nx loads `createNodesV2` from `packages/nx/src/plugin/index.ts`. This repo keeps targets explicit.
