---
title: Configure the CLI preset
description: Control interactivity, the banner, update behavior, and bundled plugins.
documentType: reference
tags: [configuration]
---

`plugin(options?)` accepts `CLIPresetOptions`. The type includes script preset options except `globalOptions`, plus help and prompts options, plus the fields below.

| Field | Default | Effect |
| --- | --- | --- |
| `interactive` | `true` | `true` prompts on a TTY. `false` prompts only with an explicit flag. `"never"` disables prompts. |
| `globalOptions` | Preset helper | Option list, a function, or `false`. |
| `updateType` | `"confirm"` | `confirm`, `auto`, `manual`, or `false`. |
| `banner` | Application name | String, figlet options, or `{ override }`. |
| `completions` | Enabled | `{ shells }` or `false`. |
| `changelog` | Enabled | Changelog plugin options or `false`. |
| `skills` | Enabled when the directory exists | Skills plugin options or `false`. |
| `theme` | Default theme | Theme tokens. See `@shell-shock/plugin-theme`. |

`updateType` values:

- `confirm` asks before an update.
- `auto` updates with no prompt.
- `manual` prints the latest version and does not update.
- `false` is accepted by the type.

`banner` as a string sets the banner text. An object can set figlet fields and `text`. `CLIPresetBannerFontOption` includes `console`, `block`, `simple`, `tiny`, and other names in the type. `{ override: "text" }` prints that text with no figlet styling.

`completions: false` skips the completions plugin. `changelog: false` skips the changelog plugin. `skills: false` skips the skills plugin. A skills path that does not exist also skips the skills plugin. The fallback directory is `skills` under the current working directory.

Help fields `builtins` and `command` are part of this options type. Update fields `staleTime` and `command` are part of this options type.
