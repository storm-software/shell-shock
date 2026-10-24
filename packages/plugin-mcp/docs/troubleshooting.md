---
title: MCP plugin troubleshooting
description: Fix common @shell-shock/plugin-mcp setup failures.
documentType: recipe
tags: [troubleshooting]
---

## The MCP command was not replaced

The plugin checks `this.inputs` for an entry whose id equals the MCP command name. When that entry exists, the plugin keeps it and logs that the command already exists. Rename your command, or remove it, when you want this plugin to own the `mcp` command.

## Filters hide every command

`exclude` and `excludeTags` take precedence over `include` and `includeTags`. Remove the command id or tag from the exclude list.
