---
title: Changelog plugin troubleshooting
description: Fix common @shell-shock/plugin-changelog setup failures.
documentType: recipe
tags: [troubleshooting]
---

## The changelog command is missing

Put a changelog file in the application root, or set `file` to the real path. The plugin skips the command when it cannot resolve a file.

The lookup list includes `CHANGELOG.md`, `RELEASE-NOTES.md`, `RELEASE_NOTES.md`, `RELEASES.md`, and `HISTORY.md`, plus `.markdown` and `.txt` variants and lowercase names.
