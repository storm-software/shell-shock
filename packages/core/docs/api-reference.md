---
title: @shell-shock/core API
description: Public helpers, the engine, the core plugin, and the command module contract.
documentType: reference
tags: [reference]
---

## `@shell-shock/core`

| Export | Signature | Effect |
| --- | --- | --- |
| `defineConfig` | See [Configuration](./configuration.md) | Returns the same config value. |
| `defineMetadata` | `(metadata: Partial<CommandMetadata>) => CommandMetadata` | Returns the metadata object. |
| `defineOptions` | `(options: Record<string, CommandOptionConfig>) => Record<string, CommandOptionConfig>` | Returns the options object. |
| `defineArguments` | `(args: CommandArgumentConfig[]) => CommandArgumentConfig[]` | Returns the argument list. |

`CommandMetadata` fields are `title`, `description`, `alias`, `tags`, `icon`, and `docs`. `alias` is a string or a string list. `tags` is a string list.

`CommandOptionConfig` and `CommandArgumentConfig` use parameter type `string`, `number`, or `boolean`. Shared fields include `name`, `type`, `title`, `description`, `alias`, `default`, `env`, `required`, and `variadic`. String parameters can set `format` and `choices`.

## Command module

A command file can export this `CommandModule` shape:

| Export | Type | Role |
| --- | --- | --- |
| `default` | Function | Handler. |
| `metadata` | `CommandMetadata` | Display data. |
| `options` | Option record or schema | Flag definitions. |
| `args` | Argument list or schemas | Positional definitions. |

The resolver also reads the handler signature with `parseCommandSignature`.

## `@shell-shock/core/engine`

`createEngine(options)` returns `Engine.from(options)`. `EngineOptions` is the Powerlines engine options without `root`, `name`, and `framework`. The constructor sets the framework itself.

| Member | Behavior |
| --- | --- |
| `Engine.from(options)` | Creates the engine. |
| `context` | Current Powerlines build context. |
| `clean(inlineConfig)` | Clean phase. |
| `prepare(inlineConfig)` | Prepare phase. |
| `lint(inlineConfig)` | Lint phase. |
| `build(inlineConfig)` | Build phase. |
| `docs(inlineConfig)` | Documentation phase. |
| `finalize()` | Final phase. Call it after the other phases. |

## `@shell-shock/core/plugin`

`plugin(options?)` returns the core Powerlines plugins. `options` is the Shell Shock `Options` type. The plugin name for configuration is `shell-shock/core:config`.

## `@shell-shock/core/api`

The default export is the Powerlines API for framework `shell-shock`. It registers `plugin()` and these phases: `types`, `prepare`, `create`, `clean`, `lint`, `test`, `build`, `docs`, `deploy`.

## Other entry points

The package also exports `./components`, `./contexts`, `./generator`, `./helpers/power-plant`, `./plugin-utils`, `./schemas`, and `./types`. Component modules are build-time generators. Use `./types` for the public command and config types. Use `./plugin-utils` for command-tree helpers such as `getCommandTree`, `getCommandList`, `traverseCommandTree`, and `traverseCommands`.
