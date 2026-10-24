---
title: Walk-through: Lint a command file
description: Enable the recommended config and see how each rule checks a command file.
documentType: tutorial
audience: End user
perspective: hands-on
tags: [guide]
---

# Walk-through: Lint a command file

**Audience:** End user · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register the recommended flat config. ESLint then checks every `command` file for one handler, one path, and allowed parameter types.

## Before you start

Install `eslint` `>=9.39.3` and `@shell-shock/eslint-plugin`. Use a flat config file, `eslint.config.js`.

## The path at a glance

1. The recommended config loads the plugin and three rules.
2. Each rule returns immediately when the file name is not `command`.
3. `invalid-command-export` requires a function default export.
4. `invalid-handler-params` checks positional parameter types.
5. `duplicate-command-path` warns on a second command file in the directory.

## Step 1 — Add the config

`packages/eslint-plugin/src/configs/recommended.ts` — the config name is `shell-shock:recommended`. It matches `**/*.{,c,m}{j,t}s{,x}`, ignores `.shell-shock`, and sets the three rules.

```js
import shellShock from "@shell-shock/eslint-plugin";

export default [shellShock.configs.recommended];
```

`configs.base` in `packages/eslint-plugin/src/configs/base.ts` uses the same rules.

## Step 2 — Limit the check to command files

`packages/eslint-plugin/src/rules/invalid-command-export.ts` — `Program` reads the file name. The rule returns when the name without extension is not `command`. The other two rules use the same gate.

## Step 3 — Require a handler

In the same file, `ExportDefaultDeclaration` must be a function declaration, or an identifier that points at a function or variable in the file. Any other default export reports `invalidExport`.

## Step 4 — Check parameter types

`packages/eslint-plugin/src/rules/invalid-handler-params.ts` — the first parameter may be the options object. Later parameters must be `string`, `number`, `boolean`, a literal of those types, or an array of those types. The message id is `invalidArgsParam`.

## Step 5 — Keep one command file

`packages/eslint-plugin/src/rules/duplicate-command-path.ts` — the rule looks for more than one `command.ts` in the directory, including `(group)` and `_` directories. It reports `duplicateCommandPath` at warn level in the recommended config.

## Recap

The recommended config turns on three problem rules. They run on `command` files. Export one function, use the allowed parameter types, and keep one command file in the directory.

## Where to go next

Read the rule pages under `docs/rules`. Run ESLint on `playground/cli/src/start/command.ts`. That file default-exports a function, so `invalid-command-export` stays quiet.
