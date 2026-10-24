---
title: Walk-through: Validate a command tree
description: Parse a command record with commandsSchema and the Power Plant schema document.
documentType: tutorial
audience: Integrator
perspective: hands-on
tags: [guide]
---

# Walk-through: Validate a command tree

**Audience:** Integrator · **Perspective:** hands-on · **Time:** ~10 min

## What you will learn

You validate a `Record` of command tree nodes with Zod. The same shape is what `@shell-shock/core` keeps on `context.commands`. The package also publishes a Power Plant schema document.

## Before you start

Install `@shell-shock/schema`. Have a command record, or build an application and read the resolved command tree from the engine context.

## The path at a glance

1. Import `commandsSchema`.
2. Call `safeParse`.
3. Read parameter types from the enum schema.
4. Use the Power Plant `schema` export when a tool expects a schema document.

## Step 1 — Parse the record

```ts
import { commandsSchema } from "@shell-shock/schema";

const result = commandsSchema.safeParse(commands);
```

`safeParse` returns a result object. Invalid nodes stay in `result.error` instead of throwing.

## Step 2 — Read the node shape

`packages/schema/src/schema/command-tree.ts` — `commandParameterTypeSchema` is the Zod enum `string`, `number`, `boolean`. `commandTreeSchema` and `commandsSchema` build the tree and the record. Exported types include `CommandTree` and `Commands`.

## Step 3 — Use the Power Plant document

`packages/schema/src/index.ts` — `schema` is `defineSchema`. Meta name is `command-schema`, version is `1.0`, and `schema.schema` is `z.toJSONSchema(commandsSchema)`. The default export is the same object.

## Recap

`commandsSchema` checks the command record. Parameter types are string, number, or boolean. `schema` is the Power Plant wrapper around that JSON Schema.

## Where to go next

Compare a parsed tree with `CommandTree` from `@shell-shock/core`. The schema package comment says the node fields match that type, including `options`, `args`, `parent`, and `children`.
