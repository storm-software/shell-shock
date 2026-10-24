---
title: @shell-shock/eslint-plugin API
description: Rules, config objects, and public entry points.
documentType: reference
tags: [reference]
---

## Default export

The default export is an ESLint plugin named `shell-shock`. It includes `meta`, `rules`, and `configs`.

`RuleOptions` and `Rules` are exported types for the rule option map.

## Rules

| Rule | Message | Report |
| --- | --- | --- |
| `duplicate-command-path` | `duplicateCommandPath` | More than one `command.ts` in a directory, including path groups. |
| `invalid-command-export` | `invalidExport` | The default export is not a function. |
| `invalid-handler-params` | `invalidArgsParam` | A positional parameter type is outside the allowed list. |

Each rule runs on files whose name, without extension, is `command`.

Rule detail pages:

- [duplicate-command-path](./rules/duplicate-command-path.md)
- [invalid-command-export](./rules/invalid-command-export.md)
- [invalid-handler-params](./rules/invalid-handler-params.md)

## Entry points

| Import | Content |
| --- | --- |
| `@shell-shock/eslint-plugin` | Default plugin and `configs` |
| `@shell-shock/eslint-plugin/configs` | `{ base, recommended }` |
| `@shell-shock/eslint-plugin/configs/base` | Base config |
| `@shell-shock/eslint-plugin/configs/recommended` | Recommended config |
| `@shell-shock/eslint-plugin/plugin` | Plugin without configs |
| `@shell-shock/eslint-plugin/rules/<rule>` | One rule module |
