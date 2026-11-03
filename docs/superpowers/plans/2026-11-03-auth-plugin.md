# Authentication Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add browser authentication and fail-closed protected commands.

**Architecture:** Core retains protected metadata and calls a generated auth guard at its shared execution boundary. The plugin emits an auth builtin configured with an OIDC public client and OS credential store; runtime code owns login, validation, refresh, and logout.

**Tech Stack:** TypeScript, Alloy, Nx/Jest, openid-client, OS credential-store adapter.

**Spec:** docs/superpowers/specs/2026-11-03-auth-plugin-design.md

## Global Constraints

- Security has substantially higher priority than flexibility.
- No plaintext fallback or bundled client secrets.
- No changes to external Powerlines/Power Plant source or vendored layers.
- Preserve existing unrelated work. Run project commands through Devenv and Nx.

## Review Focus

- Invalid environment credentials must not fall back to another identity.
- Login/logout must not inherit protection and deadlock authentication.
- Concurrent refresh/logout must not resurrect stale credentials.
- Help, aliases, dynamic routes, scripts, and MCP must respect the guard boundary.
- Callback rejection and errors must not leak secrets or leave a listener running.

## Task 1: Core protected-command contract

Files: core command types, resolver, state builtin and tests; schema command-tree definition and tests.
Interfaces: `CommandMetadata.protected?: boolean`; generated `withCommand` checks effective command protection before handler invocation. Auth plugin presence means generated state imports `requireAuth` from `shell-shock:auth`; without it protected invocations throw a static login/configuration error. Effective protection includes all ancestors. Plugin sets a core config marker `auth` consumed at generation time.

- [x] Add regression tests for metadata preservation and inherited protection.
- [x] Run tests and observe missing behavior.
- [x] Implement schema/resolver preservation and shared-boundary guard; inspect script/CLI/MCP invocation.
- [x] Run core tests and generated-boundary checks.

## Task 2: Authentication runtime

Files: `packages/plugin-auth/src/runtime/{types,client,oidc,store,callback}.ts` and accompanying tests.
Interfaces: `createAuth(options: AuthOptions): AuthClient`; AuthClient has `login(): Promise<AuthIdentity>`, `logout(): Promise<void>`, `requireAuth(): Promise<AuthSession>`, `whoami(): Promise<AuthIdentity>`. AuthOptions requires issuer/clientId/namespace and optional loginUrl/scopes/tokenEnv/validateEnvironmentToken/store; exposes secure provider/browser seams for tests. Persisted AuthSession contains accessToken, refreshToken?, expiresAt, subject, identity and issuer/client binding. Runtime `requireAuth` returns session, never logs it.

- [x] Write tests for unauthenticated/expired/environment-token precedence, store failure, identity binding, refresh rotation, logout failures, callback state/path and timeout.
- [x] Run failing tests before production code.
- [x] Implement OIDC PKCE/state/nonce flow, bounded loopback callback, secure OS storage with namespace mutation lock, validation and refresh, and safe errors.
- [x] Run full runtime suite.

## Task 3: Package and plugin integration

Files: plugin-auth package/build/test config, src/index.tsx, generator.tsx, types/plugin.ts, components/auth.tsx, README; workspace lock/references.
Interfaces: auth plugin accepts runtime-safe issuer/clientId/namespace/scopes/loginUrl/tokenEnv options plus `runtime` module reference for custom adapters; generated builtin imports `createAuth`, constructs one instance and exports bound login/logout/whoami/requireAuth/getAccessToken helpers. Custom adapters are imported at runtime, never serialized.

- [x] Inspect suitable Nx node-library generator and dry-run; generate package or adapt scaffold to existing conventions.
- [x] Test command registration, collision rejection, bootstrap protection rejection, generated builtin configuration and guarded execution.
- [x] Implement three commands and builtin using existing plugin lifecycle.
- [x] Wire dependencies and exports; document issuer registration, secure-store requirements, CI validation and backend authorization.
- [x] Run relevant Nx tests/typechecks/builds, formatting and diff checks.

## Task 4: Final verification and review

- [x] Independent review of security boundaries and integration against approved spec.
- [x] Fix significant findings with regression tests.
- [x] Report automated evidence separately from untested live-provider/native credential-service behavior.

## Decisions

Implementation proceeds under the user's approved design; no additional approval round is needed for this plan. Use the existing workspace and preserve uncommitted design documents. No commits/push/publication are required for this task.

Task 3 ruling: the installed Storm node-library generator is missing its template directory and exits without producing files. Reproduce/dry-run/source inspection completed; scaffold from sibling plugin-mcp instead. No external package edits.


## Verification record

- Final `devenv shell -- pnpm nx run-many --targets=test,typecheck-source,test-generated --projects=core,plugin-auth --excludeTaskDependencies --skipNxCache`: PASS, 25 core tests + 33 plugin/runtime tests + 8 rendered-module tests; source typecheck PASS.
- Schema, core, plugin-auth, preset-script, and preset-cli library builds passed. Final changed core and presets rebuilt after introducing the execution-boundary contract.
- Generated tests execute rendered/transpiled shared `withCommand`, including rejection before the handler, successful authentication, public execution, missing-plugin rejection, and inherited dynamic-path protection. They check generated auth-command prefixes and named/default adapter imports.
- Standard workspace typechecking stops at the existing missing `@shell-shock/tools-config/powerlines.shared` declaration in schema configuration. An attempted full preset entry import also encountered the existing undeclared `@deepkit/type` dependency in the utility barrel. The direct rendered shared-boundary execution test is the integration proof; a full consuming CLI/MCP end-to-end run is not claimed.
- Workspace Prettier target is blocked by missing `prettier-plugin-sh`; focused built-in Prettier formatting using the workspace's style options passed. Final diff whitespace check passed.
- Real identity-provider login, native platform credential-service interaction, and publication were not performed.

## Review and implementation decisions

- Independent security review found no confirmed severe code defect, but required execution of the actual rendered guard rather than inspecting only text. Added that proof.
- Follow-up regressions exposed and fixed a hanging browser opener bypassing the login deadline and a scheme-relative callback target changing the parsed origin. Both were observed RED then GREEN.
- Generated-source checks exposed and fixed missing `shell-shock:` auth-command import prefixes. Additional RED/GREEN tests cover case-insensitive command alias collisions and CI configuration without an explicit runtime validator module/audience.
- Core builtins now render after command resolution; the previous early render could omit the protection map on first build. Official presets declare `commandExecution: "withCommand"`; protected generation rejects unknown execution boundaries. Custom presets must implement that contract rather than silently bypassing it.
- Narrowed StateBuiltin's internal utility import to avoid pulling the unrelated Deepkit utility barrel into authentication generation. Full preset invocation tests were not represented as passing.
- No commits, merges, pushes, dependency patches, or releases were made.

## Upstream generator fix outline

The installed `@storm-software/workspace-tools` node-library generator resolves its templates at `dist/src/generators/node-library/files`, but the published package lacks that directory. Update its upstream package assembly to include the generator templates at the path used by the compiled factory (or correct the factory's template path), and add a packed-package Nx generation smoke test. This repository was scaffolded from existing plugin conventions; the external package was not modified.
