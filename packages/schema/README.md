<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/shell-shock/media/banner-1280x427-dark.gif">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/shell-shock/media/banner-1280x427-light.gif">
<img src="https://public.storm-cdn.com/shell-shock/media/banner-1280x427-dark.gif" width="100%" alt="Shell Shock" />
</picture>
</div>
<br />

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- END header -->

# Shell Shock - Schema Package

A [Power Plant](https://github.com/storm-software/power-plant) schema package for the Shell Shock **command tree** specification.

Validates a `Record<string, CommandTree>` document — the same shape as `context.commands` in `@shell-shock/core`. Individual nodes match the `CommandTree` type (`options`, `args`, `parent`, `children`, plus required metadata).

## Quick Features

- Zod schemas for the Shell Shock command tree.
- Power Plant document `command-schema` version `1.0`.
- Parameter types are `string`, `number`, and `boolean`.

## Installation

Add `@shell-shock/schema` with the `workspace:*` protocol and run `pnpm install` from the repository root.

The repository README says a public registry release is still pending. In this workspace, depend on the package with `workspace:*`.

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

## Development

Run `pnpm install` from the repository root. `packages/schema/project.json` names the project `schema` and does not declare a test target.

