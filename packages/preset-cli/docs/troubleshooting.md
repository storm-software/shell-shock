---
title: CLI preset troubleshooting
description: Restore a bundled plugin that the preset skipped.
documentType: recipe
tags: [troubleshooting]
---

## Skills did not register

The preset enables skills when `skills` is not `false` and the directory exists. Create `skills` in the current working directory, or set `skills.path` to a directory that exists.

## Changelog or completions are missing

Set `changelog` or `completions` to an options object. The value `false` disables that plugin.

## Prompts never appear

`interactive: "never"` disables prompts. `interactive: false` waits for an explicit interactive flag. The default `true` prompts when a TTY is present.
