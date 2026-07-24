<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/shell-shock/media/banner-1280x640-dark.gif">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/shell-shock/media/banner-1280x640-light.gif">
<img src="https://public.storm-cdn.com/shell-shock/media/banner-1280x640-dark.gif" width="100%" alt="Shell Shock" />
</picture>
</div>
<br />

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- END header -->

# Shell Shock - Schema Package

A [Power Plant](https://github.com/storm-software/power-plant) schema package for the Shell Shock **command tree** specification.

Validates a `Record<string, CommandTree>` document — the same shape as `context.commands` in `@shell-shock/core`. Individual nodes match the `CommandTree` type (`options`, `args`, `parent`, `children`, plus required metadata).

## Usage

```ts
import commandSchema, {
  commandTreeSchema,
  commandsSchema,
  type CommandTree,
  type Commands
} from "@shell-shock/schema";
import { defineGenerator } from "@power-plant/core";

export default defineGenerator({
  schema: commandSchema,
  generator: async (commands: Commands, options) => {
    // generate from the command tree
  }
});
```

See also: [Power Plant schemas](https://github.com/storm-software/power-plant/tree/main/packages/schemas).
