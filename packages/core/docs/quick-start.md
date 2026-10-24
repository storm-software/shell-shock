---
title: Create a command
description: Add a shell-shock.config.ts file and a command file, then build the application.
documentType: getting-started
tags: [cli]
---

Create `shell-shock.config.ts` in the application root.

```ts
import { defineConfig } from "@shell-shock/core/config";

export default defineConfig({
  name: "my-app"
});
```

`name` is required. The core plugin uses `name` as the binary name when `bin` is omitted.

Create `src/start/command.ts`. The default export is the handler. This shape matches `playground/cli/src/start/command.ts`.

```ts
interface StartOptions {
  root: string;
  verbose?: boolean;
}

function start(options: StartOptions) {
  console.log(
    `Starting at ${options.root} with verbose=${options.verbose ?? false}`
  );
}

export default start;
```

Shell Shock reads the handler signature. The first parameter can be the options object. Later parameters are positional arguments. Allowed argument types are `string`, `number`, `boolean`, a literal of those types, or an array of those types.

Build the application with the Nx executor `@shell-shock/nx:build`. The playground target in `playground/cli/project.json` is the working example:

```json
{
  "build": {
    "executor": "@shell-shock/nx:build",
    "options": {
      "mode": "development"
    }
  }
}
```

Run the Nx target for the application project. The handler runs when the user invokes the `start` command.

You can also build from code with `createEngine` from `@shell-shock/core/engine`. Call `prepare`, then `build`, then `finalize`.
