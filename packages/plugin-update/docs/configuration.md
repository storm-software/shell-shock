---
title: Configure @shell-shock/plugin-update
description: Options for @shell-shock/plugin-update.
documentType: reference
tags: [configuration]
---

`UpdatePluginOptions` fields:

| Field | Default | Effect |
| --- | --- | --- |
| `staleTime` | `129600000` (36 hours) | Milliseconds before cached version data is stale. `-1` checks only when the command runs. The plugin applies this default in `config()`. |
| `command` | `"update"` | Command name or a partial command config. |

`PackageManager` is `npm`, `yarn`, `pnpm`, `deno`, or `bun`. `PACKAGE_MANAGER_LOCKFILE_MAP` maps lockfile name fragments to those managers.

The environment schema adds `SKIP_UPDATE_CHECK`. Set that variable to skip the version check. The schema treats it as an optional boolean. The field description says any set value makes the check unnecessary.
