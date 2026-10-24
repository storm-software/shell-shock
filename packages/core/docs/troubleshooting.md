---
title: Core troubleshooting
description: Fix command-file layout errors and a missing application name.
documentType: recipe
tags: [troubleshooting]
---

## The config has no name

`UserConfig` requires `name`. Add `name` in `shell-shock.config.ts`.

## The handler is not a function

A command module must default-export a function. Export the handler as `export default function`. A default export of a non-function fails `@shell-shock/eslint-plugin` rule `invalid-command-export`.

## Two command files share a directory

Keep one `command.ts` file in each directory. The rule `duplicate-command-path` warns when a directory contains more than one command file, including through a path group.

## A positional parameter has another type

Handler parameters after the options object must be `string`, `number`, `boolean`, a literal of those types, or an array of those types. The rule `invalid-handler-params` reports other types.

## The command path is wrong

The folder under the commands root is the command path. `[name]` is a dynamic segment. `(group)` and folders that start with `_` are groups. Groups are removed from the public path.
