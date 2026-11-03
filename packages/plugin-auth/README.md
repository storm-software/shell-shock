# @shell-shock/plugin-auth

Browser authentication and protected commands for Shell Shock applications.

## Quick Features

- `protected: true` command metadata, inherited by descendants.
- Browser login using OpenID Connect authorization code flow, S256 PKCE, state,
  nonce, and a temporary IPv4 loopback callback.
- `login`, `logout`, and `whoami` commands.
- Persistent credentials in macOS Keychain, Windows Credential Manager, or Linux
  Secret Service, with refresh-token rotation and cross-process mutation locking.
- Explicit runtime adapters for credential storage and CI token validation.

## Installation

This is a new workspace package; publication has not been verified. In this
workspace, add `@shell-shock/plugin-auth` as a `workspace:*` dependency of the
CLI package and install with `devenv shell -- pnpm install`.

Requires Node.js 20.19 or newer, an OIDC provider, and a functioning OS credential
service. On Linux, Secret Service must be available and unlocked. There is no
plaintext or kernel-keyring fallback.

Register a **public native application** with your OIDC provider, enable S256
PKCE, and permit `http://127.0.0.1:<ephemeral-port>/callback` loopback redirects.
The callback path and exact provider capabilities must match the runtime; providers
that require a fixed port or HTTPS redirects need a different integration. Do not
configure a client secret in a distributed CLI.

## Usage

Add the plugin alongside your existing Shell Shock preset:

```ts
import auth from "@shell-shock/plugin-auth";

// In your existing Shell Shock configuration:
const authentication = auth({
  issuer: "https://identity.example.com",
  clientId: "native-cli",
  namespace: "example-cli-production",
  scopes: ["openid", "profile", "offline_access"],
  // Optional: must match the issuer's discovered authorization endpoint.
  loginUrl: "https://identity.example.com/authorize"
});
// Include authentication in the configuration's plugins array.
```

Use the provider's actual issuer and endpoint URLs. The login URL is an optional
check against discovery, not an arbitrary page that can receive credentials.
Request `offline_access` only if your provider uses that scope to issue refresh
tokens; provider consent and policy determine whether refresh tokens are issued.

Protect a command in its `command.ts` module:

```ts
import { defineMetadata } from "@shell-shock/core";
import { getAccessToken } from "shell-shock:auth";

export const metadata = defineMetadata({ protected: true });

export default async function handler() {
  const token = await getAccessToken();
  // Send the token only to your trusted API in its Authorization header.
}
```

Run `<your-cli> login`, then your protected commands. `whoami` prints the current
identity without tokens. `logout` removes local credentials and attempts provider
revocation. It does not end all browser SSO sessions. Help remains public.
Authentication failures do not automatically launch a browser. The API must still
validate credentials and enforce permissions for every request.

Command names and aliases `login`, `logout`, and `whoami` are reserved. Do not
protect an ancestor of the authentication commands. A descendant cannot disable
protection inherited from a parent. Protected commands without the plugin fail
closed. Custom presets must route every handler through the shared `withCommand`
boundary and declare `commandExecution: "withCommand"` in their resolved config;
protected-command generation rejects presets that omit this contract.

### Runtime integrations and CI

For application-owned adapters, configure a module reference rather than passing
functions or secrets into build-time options:

```ts
const authentication = auth({
  issuer: "https://identity.example.com",
  clientId: "native-cli",
  namespace: "example-cli-production",
  tokenEnv: "EXAMPLE_CLI_TOKEN",
  audience: "https://api.example.com",
  runtime: { file: "./src/auth-runtime.ts", export: "authRuntime" }
});
```

The referenced export implements `AuthRuntimeOverrides` from
`@shell-shock/plugin-auth/runtime`. `validateEnvironmentToken(token)` must verify
with your trusted provider and return `{ active, issuer, audience, subject,
expiresAt, identity }`. Expiration is Unix time in milliseconds; `audience` is a
string array and `identity.subject` must match `subject`. Do not merely decode a
JWT or trust UserInfo to prove audience. The runtime independently checks those
returned bindings. Enable environment tokens only with an explicit validator and
expected audience. Invalid environment credentials never fall back to a different
stored account; they are never persisted. Logout cannot unset a parent process's
environment variable.

Custom credential stores implement `withLock(operation)`, supplying a transaction
with `read`, `write`, and `delete`. The lock must serialize all processes using the
same namespace. Custom adapters are trusted application code and must preserve
secure storage and provider validation. Use a unique namespace per app/environment.

## Development

From the repository root:

```sh
devenv shell -- pnpm nx run plugin-auth:test
devenv shell -- pnpm nx run plugin-auth:typecheck
devenv shell -- pnpm nx run plugin-auth:typecheck-source
devenv shell -- pnpm nx run plugin-auth:test-generated
devenv shell -- pnpm nx run plugin-auth:build
```

The tests use injected providers and stores and a real local callback listener.
Live identity-provider login and native credential-service behavior require
separate platform/provider validation.
