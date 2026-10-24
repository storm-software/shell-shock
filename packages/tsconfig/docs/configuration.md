---
title: TypeScript config chain
description: Compiler options in the base, recommended, and strict configs.
documentType: reference
tags: [configuration]
---

## base

Extends `@powerlines/tsconfig/recommended.json`. Display name: `Shell Shock - Base Configuration`.

| Option | Value |
| --- | --- |
| `target` | `esnext` |
| `module` | `ESNext` |
| `moduleResolution` | `Bundler` |
| `moduleDetection` | `force` |
| `lib` | `ESNext`, `DOM`, `DOM.Iterable`, `DOM.AsyncIterable` |
| `types` | `node` |
| `declaration` | `true` |
| `declarationMap` | `true` |
| `skipLibCheck` | `true` |
| `allowJs` | `true` |
| `resolveJsonModule` | `true` |
| `verbatimModuleSyntax` | `false` |
| `noPropertyAccessFromIndexSignature` | `false` |

## recommended

Extends `@shell-shock/tsconfig/base.json`.

| Option | Value |
| --- | --- |
| `composite` | `true` |
| `incremental` | `true` |
| `isolatedModules` | `true` |

## strict

Extends `@shell-shock/tsconfig/recommended.json`.

| Option | Value |
| --- | --- |
| `strict` | `true` |
| `verbatimModuleSyntax` | `true` |
| `noPropertyAccessFromIndexSignature` | `true` |

A project config can override any of these options.
