---
title: Skills plugin troubleshooting
description: Fix common @shell-shock/plugin-skills setup failures.
documentType: recipe
tags: [troubleshooting]
---

## The skills command is missing

`plugin()` returns early when `path` is not a string or the directory is missing. It also skips the command when the directory is empty. Create the directory, add skill files, and set `path`.

## The CLI preset skips skills

`@shell-shock/preset-cli` checks that the skills directory exists before it enables this plugin. Create the directory, or pass `skills: { path: "<directory>" }` with a path that exists. Set `skills: false` on the CLI preset when you want the preset to skip skills.
