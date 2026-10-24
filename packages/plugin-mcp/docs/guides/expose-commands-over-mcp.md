---
title: Walk-through: Expose commands over MCP
description: Follow the MCP plugin from command filters to the mcp command input.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Expose commands over MCP

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You register `@shell-shock/plugin-mcp`. The plugin adds an `mcp` command that exposes CLI commands. Include and exclude filters select those commands. An existing command with the same name is left alone.

## Before you start

Install peers `@modelcontextprotocol/server` `^2.3.0` and `zod` `^4.6.5`. Install `@shell-shock/plugin-mcp`.

## The path at a glance

1. `config()` sets the command name to `mcp`.
2. Filters live on the same options object.
3. `configResolved` returns when that command id exists.
4. Otherwise the plugin adds the MCP command.

## Step 1 — Choose a command name and filters

```ts
import { plugin as mcp } from "@shell-shock/plugin-mcp";

mcp({
  command: "mcp",
  includeTags: ["public"],
  exclude: ["secret"]
})
```

`packages/plugin-mcp/src/types/plugin.ts` — `include` and `includeTags` combine with OR. `exclude` and `excludeTags` take precedence.

## Step 2 — Default the name

`packages/plugin-mcp/src/index.tsx` — plugin name `shell-shock/mcp`. `config()` sets `command.name` from a string, from an object `name`, or to `mcp`.

## Step 3 — Keep an existing command

`configResolved` scans `this.inputs`. When an input id equals the MCP command name, the plugin logs and returns. Rename your command when this plugin should own that name.

## Step 4 — Select commands

`packages/plugin-mcp/src/helpers/select-commands.ts` applies the filter. Exclusions win. The generator export is `mcpGenerator`.

## Recap

The MCP command name defaults to `mcp`. Tags and ids filter the tool list. A name clash keeps the existing command.

## Where to go next

Put `tags: ["public"]` on a command with `defineMetadata`. Set `includeTags: ["public"]` and rebuild. Commands without that tag stay out of the include list unless their id is in `include`.
