---
title: Update plugin troubleshooting
description: Fix common @shell-shock/plugin-update setup failures.
documentType: recipe
tags: [troubleshooting]
---

## The version check runs in CI

Set the environment variable `SKIP_UPDATE_CHECK`. The update environment schema documents this variable as a way to skip the version check.

## The check is too frequent

Raise `staleTime`. The value is milliseconds. The plugin default is 36 hours. Set `staleTime` to `-1` to check only when the update command runs.
