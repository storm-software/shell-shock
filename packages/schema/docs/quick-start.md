---
title: Validate a command tree
description: Parse a command record with commandsSchema from @shell-shock/schema.
documentType: getting-started
tags: [schema]
---

Import the Zod schema and parse a command record.

```ts
import { commandsSchema } from "@shell-shock/schema";

const result = commandsSchema.safeParse(commands);
```

`commands` is a record of command tree nodes. Use `safeParse` so invalid data returns an error instead of throwing.

The Power Plant document is the default export, also named `schema`. Its meta name is `command-schema` and its version is `1.0`.
