---
title: Walk-through: Build a command
description: Follow a command file from shell-shock.config.ts through discovery to the build phase.
documentType: tutorial
audience: End user
perspective: hands-on
tags: [guide]
---

# Walk-through: Build a command

**Audience:** End user · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You start with an application name and a `command.ts` file. You finish with a command the Shell Shock engine can build. The folder path is the command path.

## Before you start

Install `@shell-shock/core` in the application. Open `playground/cli/shell-shock.config.ts` and `playground/cli/src/start/command.ts`.

## The path at a glance

1. `defineConfig` stores the application name.
2. The core plugin selects `src/**/command.ts` when `input` is empty.
3. The command file default-exports a handler.
4. The resolver reads that handler signature.
5. `Engine.build` runs the build phase.

## Step 1 — Name the application

`packages/core/src/config.ts` — `defineConfig` returns the same object, array, promise, or function you pass. `UserConfig` requires `name`.

`playground/minimal/shell-shock.config.ts` sets `name` to `playground-minimal`. That is the smallest config in this repo. The core plugin uses `name` as the binary name when `bin` is omitted.

## Step 2 — Let the plugin find command files

`packages/core/src/plugin.tsx` — `plugin()` registers `shell-shock/core:config`. In `config()`, an empty `input` becomes `src/**/command.ts` and `src/**/command.tsx`.

Set `input` when the command files live somewhere else. `playground/custom-commands-directory/shell-shock.config.ts` sets `input` to `src/commands`.

## Step 3 — Export the handler

`playground/cli/src/start/command.ts` — the file sits in the `start` folder, so the command path is `start`. `export default start` is the handler. The first parameter is the options object.

A folder named `[task]` is a dynamic segment. A folder named `(group)`, or a folder that starts with `_`, is a path group. Groups stay out of the public command path. See `isDynamicPathSegment` and `isPathSegmentGroup` in `packages/core/src/plugin-utils/context-helpers.ts`.

## Step 4 — Read options from the signature

`packages/core/src/resolver/signature.ts` — `parseCommandSignature` reads the handler. `packages/core/src/resolver/resolve.ts` calls `applySignatureParameters` so the command tree gets those options and arguments.

You can also export `metadata`, `options`, and `args`. `defineMetadata`, `defineOptions`, and `defineArguments` in `packages/core/src/index.ts` return those objects unchanged.

## Step 5 — Build

`packages/core/src/engine.ts` — `createEngine` calls `Engine.from`. `build(inlineConfig)` runs the Powerlines build phase. Call `finalize()` after the other phases.

In this workspace the usual trigger is the Nx executor `@shell-shock/nx:build`. See the guide in `@shell-shock/nx`.

## Recap

`defineConfig` names the app. The core plugin globs command files. The default export is the handler. The resolver turns the signature into the command tree. The engine builds that tree.

## Where to go next

Add `@shell-shock/preset-cli` when you want help, prompts, and update. Change the folder name of `command.ts` and build again. The command path follows the folder.
