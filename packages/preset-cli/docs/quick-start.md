---
title: Start a CLI application
description: Register the CLI preset and add a command file.
documentType: getting-started
tags: [preset]
---

`playground/cli/shell-shock.config.ts` is the working example.

```ts
import { defineConfig } from "@shell-shock/core/config";
import { plugin as cli } from "@shell-shock/preset-cli";

export default defineConfig({
  name: "playground-cli",
  docs: "https://docs.stormsoftware.com/projects/shell-shock/reference/cli/{command}",
  plugins: [
    cli({
      theme: {
        labels: {
          banner: {
            header: "Shell Shock Playground",
            footer: "https://stormsoftware.com"
          }
        }
      }
    })
  ]
});
```

Add command files under `src`, such as `src/start/command.ts`. Build with `@shell-shock/nx:build`.

The preset adds these default options unless you replace `globalOptions`:

- `--help` (`-h`, `-?`)
- `--version` (`-v`)
- `--interactive` (`-i`, `--interact`)
- `--no-interactive`
- `--no-banner`
- `--verbose`

`interactive` defaults to `true`. That mode enables prompts when a TTY is present and the user did not pass an interactive flag.
