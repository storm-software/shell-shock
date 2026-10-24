---
title: @shell-shock/schema API
description: Power Plant schema export and Zod command-tree schemas.
documentType: reference
tags: [reference]
---

| Entry | Content |
| --- | --- |
| `@shell-shock/schema` | `schema`, default export, and a re-export of `./schema` |
| `@shell-shock/schema/schema` | Schema barrel |
| `@shell-shock/schema/schema/command-tree` | Zod schemas and inferred types |

```ts
import schema, { commandsSchema, type Commands } from "@shell-shock/schema";
```

`schema.meta` includes `name`, `title`, `version`, `description`, `spec`, `tags`, and `links`. `schema.schema` is the JSON Schema for `commandsSchema`.
