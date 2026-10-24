---
title: Configure @shell-shock/plugin-changelog
description: Options for @shell-shock/plugin-changelog.
documentType: reference
tags: [configuration]
---

`ChangelogPluginOptions` fields:

| Field | Default | Effect |
| --- | --- | --- |
| `file` | `{root}/CHANGELOG.md` | Changelog path. Absolute, or relative to the application root. |
| `command` | `"changelog"` | Command name or a partial command config. |

When no changelog file can be resolved, the plugin does not add the command.

The helper `resolve-changelog` is exported from `@shell-shock/plugin-changelog/helpers/resolve-changelog`. The generator export is `changelogGenerator`.
