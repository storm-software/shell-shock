# Use OIDC PKCE and OS credential services for protected commands

- Status: accepted
- Date: 2026-11-03

## Context and Problem Statement

Shell Shock needs protected commands, browser login, persistent credentials, and
current-user inspection. The user explicitly prioritized security much more than
flexibility and approved the authentication plugin design.

## Considered Options

- OpenID Connect authorization code flow with S256 PKCE and a loopback callback.
- Device authorization for headless clients.
- An unrestricted application-supplied login callback.

## Decision Outcome

Use `openid-client` for OIDC protocol validation, fresh PKCE/state/nonce, and
signed identity checks. Store validated sessions in the OS credential service
through `@napi-rs/keyring`, explicitly selecting Linux Secret Service. Serialize
refresh and logout with namespace locks. Enforce inherited command protection at
the shared command execution boundary after the command tree is resolved.

Keep trusted runtime adapters separate from serialized public build configuration.
Environment tokens require an explicit provider validator and expected audience.
Do not provide a plaintext persistence fallback or embed client secrets.

This introduces native credential-service requirements and several dependencies.
Login initially requires an OIDC provider supporting public native clients and
ephemeral loopback redirects; arbitrary login pages and device authorization are
outside the initial scope. CLI guards do not replace backend authorization.
