---
title: Command tree document
description: Fields the command tree schema accepts.
documentType: reference
tags: [configuration]
---

Parameter types are the enum `string`, `number`, and `boolean` (`commandParameterTypeSchema`).

The package exports these Zod schemas:

| Schema | Inferred type |
| --- | --- |
| `commandParameterTypeSchema` | `CommandParameterType` |
| `baseCommandParameterSchema` | `BaseCommandParameter` |
| `commandOptionSchema` | `CommandOption` |
| `commandArgumentSchema` | `CommandArgument` |
| `resolvedEntryFileReferenceSchema` | `ResolvedEntryFileReference` |
| `commandTreeBaseSchema` | `CommandTreeBase` |
| `commandTreeSchema` | `CommandTree` |
| `serializedCommandTreeSchema` | `SerializedCommandTree` |
| `commandsSchema` | `Commands` |
| `serializedCommandsSchema` | `SerializedCommands` |

`schema` from the package root is `defineSchema` metadata plus `z.toJSONSchema(commandsSchema)`. Links in the metadata point at this repository and the Power Plant schemas package.

There is no separate runtime configuration file for this package.
