---
title: Configure @shell-shock/core
description: Set name, binaries, docs URLs, global options, and command discovery in shell-shock.config.ts.
documentType: reference
tags: [configuration]
---

Write the configuration with `defineConfig` from `@shell-shock/core/config`. The helper accepts one of these values:

- A `UserConfig` object.
- An array of `UserConfig` objects.
- A promise of either value.
- A function. The function receives Powerlines `ConfigParams` and returns a config, an array, or a promise.

`UserConfig` requires `name`. These Shell Shock fields are defined on the config type:

| Field | Default | Effect |
| --- | --- | --- |
| `name` | Required | Application name. Also the binary name when `bin` is omitted. |
| `bin` | `name` | One binary name, or a list. Each name links to the same output file. |
| `isCaseSensitive` | `false` | Command and option name matching. |
| `globalOptions` | Inherited options | Options added to every command. Set `false` to skip them. A function can return the list. |
| `autoAssignEnv` | Unset | `true` uses a prefix from the application name. A string sets the prefix. The option name is converted to constant case. |
| `docs` | Unset | A documentation URL, or `{ app, commands }`. `{command}` and `{cmd}` in a URL become the command path. |
| `output.dts` | `false` | Type declaration emit. The core plugin also sets output format to ESM. |
| `output.path` | Powerlines default | Output directory. |
| `output.copy` | Powerlines default | Files to copy. |
| `output.storage` | Powerlines default | Output storage. Playgrounds set `"fs"`. |
| `output.sourceMap` | Powerlines default | Source map emit. |

`UserConfig` also accepts the Powerlines build fields `title`, `description`, `input`, `logLevel`, `mode`, `define`, `inject`, `resolve`, `organization`, `skipCache`, `autoInstall`, `plugins`, `tsconfig`, and `tsconfigRaw`.

When `input` is empty, the core plugin sets the input to `src/**/command.ts` and `src/**/command.tsx`. Set `input` to use another directory. `playground/custom-commands-directory/shell-shock.config.ts` sets `input` to `src/commands`.

`autoAssignEnv` builds the variable name from the prefix and the option name. With prefix `MY_APP` and option `configPath`, the variable is `MY_APP_CONFIG_PATH`.

The resolved config adds `appSpecificEnvPrefix`, a `docs` object, and a `bin` map.

## Environment variables

`@shell-shock/core/schemas/env` extends the Powerlines environment schema. These fields are added or given a local default of `false`:

- `MINIMAL`
- `NO_COLOR`
- `FORCE_HYPERLINK`
- `INCLUDE_ERROR_DATA`
- `CI`
- `PATHEXT`
- `PATH`
- `npm_config_user_agent`
- `npm_config_fund`
- `npm_execpath`

`PATHEXT`, `PATH`, and the `npm_*` fields are marked hidden and runtime-only.
