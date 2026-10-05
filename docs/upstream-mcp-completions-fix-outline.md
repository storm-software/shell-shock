# Shell Shock MCP and completions upstream fix outline

The attached report covers `@shell-shock/plugin-mcp` 0.1.4,
`@shell-shock/plugin-completions` 0.4.34, and `@shell-shock/preset-cli` 0.9.38.
This was the initial fix outline. The user subsequently approved implementation
in this upstream checkout, overriding its `AGENTS.md` package restriction.

## 1. MCP generation during `configResolved`

`packages/plugin-mcp/src/index.tsx` evaluates `Object.values(this.commands)`
before `packages/core/src/plugin.tsx` initializes `this.commands` in its
post-order `prepare` hook. Render the initial MCP module with `commands={[]}`;
the MCP plugin's post-order `prepare` hook already renders the resolved command
tree. Add a regression test that runs `configResolved` with `commands` unset,
then confirms the later render contains resolved commands.

## 2. Invalid generated Zod import

`packages/plugin-mcp/src/components/mcp-command.tsx` supplies `"* as z"` as a
named import to `TypescriptFile`, yielding `import { * as z }`. Use its named
`z` export (`"zod/v4": ["z"]`). Test the rendered file by parsing or building
it, and assert that it imports `z` from `zod/v4`.

## 3. Broken generated string literal

The `code` template in the same file contains `.join("\n")`. The template
turns that escape into a literal line break inside the generated quoted string.
Write `.join("\\n")` in the template source. Audit the rest of the template
for escapes intended to survive rendering. Parse/build the rendered module and
assert that command output joins stdout and stderr with a newline.

## 4. Bare built-in imports in virtual completion entries

`packages/preset-cli/src/components/virtual-command-entry.tsx` renders virtual
command groups with `TypescriptFile` and `builtinImports` keyed by bare names.
`CommandEntry` and `BinEntry` use Powerlines' `EntryFile`, while the generated
completion group entries currently retain imports such as `banner/completions`,
`help/completions`, `console`, and `state`. Prefix every built-in source in the
virtual entry with `shell-shock:` at the Shell Shock owner layer. The owning
`TypescriptFile` supports a `prefix` prop, which `EntryFile` already sets from
`getPrefix(context)`; pass that prop in both CLI and script virtual entries.
Generate the playground CLI and assert that every generated
entry import for `banner/*`, `help/*`, `console`, `prompts`, `state`, `utils`,
`env`, and `exec` uses the `shell-shock:` prefix. Build and start the CLI to
confirm that `dist/bin.mjs` has no unresolved `banner` import.

## 5. Generated MCP module dependencies

The generated `mcp/command.ts` imports `@modelcontextprotocol/server`, its
`/stdio` subpath, and `zod/v4`, but the CLI consumer need not have these as
direct dependencies. Declare `@modelcontextprotocol/server` and `zod` as
supported peer dependencies of `@shell-shock/plugin-mcp` and document that an
MCP-enabled CLI must install them. Verify with an isolated consumer installed
under pnpm's strict dependency layout, then build its generated MCP command.

## 6. MCP tool selection and names

`McpPluginOptions` exposes only `command`; `McpCommandModule` currently
registers every non-virtual command other than the MCP command itself. Add
documented include/exclude filters by command ID or tag, with a specified
precedence and a backward-compatible default. A useful opt-in policy is to
exclude the `Utility` tag, which covers help, update, and completions. Test
selection across nested commands and collisions. Document the existing tool
name rule (`/` to `_`, hyphens retained), or add an explicit normalization
option; if normalization changes, preserve unique names with collision tests.

## 7. Package documentation

Update `packages/plugin-mcp/README.md` with plugin configuration, generated
`mcp` command behavior, runtime dependencies, and tool selection/naming rules.
Update `packages/plugin-theme/README.md` with `ThemePluginOptions`, the theme
schema in `src/types/theme.ts`, defaults, and a minimal example. Both READMEs
currently contain mostly package template text.

## Original verification boundary

The initial outline was based on source inspection. The subsequent implementation
has separate test and build results. `devenv shell` could not initialize in this
sandbox because Nix needed a fetcher lock or unavailable network access.
