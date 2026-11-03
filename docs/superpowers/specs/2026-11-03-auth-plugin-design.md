# Protected commands and authentication plugin

## Intent and priorities

Add `@shell-shock/plugin-auth` so applications can mark commands as protected,
sign in through a browser, sign out, and display the authenticated user. Security
has substantially higher priority than flexibility, per the user's direction.
The implementation choices below are recommendations based on that direction.

## Approaches

1. **Recommended: OpenID Connect authorization code with S256 PKCE.** Use a
   maintained protocol library (`openid-client`) and an ephemeral loopback
   callback. Validate state, nonce, issuer, audience, signatures, and token
   responses through the library. Requires an OIDC provider supporting public
   native clients and loopback redirects. This provides a well-defined identity
   contract without embedding a client secret in a distributed executable.
2. **Device authorization.** Useful for headless environments, but provider
   support varies and users must take care with device-code phishing. Defer from
   the initial implementation; noninteractive invocations can supply a validated
   environment token.
3. **Arbitrary login callback.** Most flexible but delegates protocol security to
   each consumer. Do not expose an unrestricted callback as the default login
   mechanism. Credential storage remains replaceable through an explicit adapter.

## Command contract and enforcement

- Add optional `protected: boolean` metadata to `packages/core`; omission means
  public. Preserve it through extraction, resolution, serialization, and the
  command-tree schema in `packages/schema`.
- Add protection at the shared execution boundary, before invoking a handler.
  Check CLI, script, and programmatic/MCP invocation paths. Help and completion
  must remain accessible without authenticating or starting browser login.
- Protected ancestors protect descendants; a descendant cannot override an
  ancestor with `protected: false`.
- Fail closed when protected commands exist without a configured auth provider;
  fail generation for presets that cannot enforce the guard. Do not silently
  produce unguarded commands.
- Reject protected root/ancestor configurations that would protect the generated
  login/logout commands; do not add an implicit guard bypass.
- Missing, expired, or unverifiable credentials prevent handler execution with a
  useful login instruction and nonzero exit status. Do not auto-open a browser
  during normal protected-command execution.
- The backend must still authorize every API request. A CLI guard is a local UX
  and execution safeguard, not a replacement for server authorization.

## Plugin configuration

- Require HTTPS `issuer` and public `clientId`; request `openid` and explicitly
  configured scopes. Do not bundle client secrets.
- Allow a browser login URL option only when it matches the discovered provider's
  authorization endpoint. Reject arbitrary redirect destinations, URL credentials,
  fragments, and caller overrides of state, nonce, PKCE, or redirect URI.
  Providers remain configurable through issuer discovery rather than arbitrary
  token forwarding URLs.
- Expose an explicit application/account namespace and credential-store adapter.
  Namespace stored credentials by application, issuer, and client ID to prevent
  accidental sharing between environments.
- Allow a configurable environment variable for nonpersistent CI credentials.
  Disable this feature unless an explicit provider validator proves issuer,
  configured resource/audience, active status, and subject. UserInfo alone is
  insufficient to prove audience; public native clients generally cannot
  authenticate to introspection endpoints. A nonempty variable or unverified
  decoded JWT never establishes authentication.
- Expose runtime helpers for obtaining the current authenticated identity and
  access token in a command, without placing credentials in generated source,
  global command options, diagnostics, or command metadata.

## Login and identity

`login` binds only to `127.0.0.1` on an ephemeral port, generates fresh PKCE,
state, and nonce, and opens the configured/discovered authorization URL with a
browser-opening library that does not invoke a shell. The redirect URI is an
exact callback path. The listener rejects unexpected paths, hosts, methods, and
state; unrelated requests must not consume the pending login. Use a bounded
login timeout and clean up the listener and in-memory verifier on every exit.
Never accept access tokens in callback query parameters.

The protocol library exchanges the authorization code and validates the ID token.
Fetch user information with the expected subject from that validated token.
Only persist a validated session. Display a simple success message without
secrets. Browser failure must provide a safe manual authorization link, without
printing tokens or the PKCE verifier.

`whoami` resolves and validates the current session and prints a minimal user
identity, never tokens. It returns a nonzero status when unauthenticated.

`logout` attempts provider revocation when supported, always removes local
credentials even if revocation fails, and explains that a separately supplied
CI environment token must be removed by its owner. Local logout does not imply
ending all browser SSO sessions.

## Persistence and refresh

Use the platform credential service (macOS Keychain, Windows Credential Manager,
Linux Secret Service) through a maintained adapter. No plaintext file fallback,
embedded encryption key, or secret on process arguments. If the secure service
is unavailable, fail persistence with actionable guidance; do not silently store
credentials elsewhere. Test stores can use an explicitly injected memory adapter.

Store the minimum session needed, including refresh token if issued, expiration,
issuer/client identity, and validated subject. Refresh expired tokens through the
provider and persist rotated refresh tokens. Revalidate identity and binding.
Reject expired sessions without refresh credentials. Bound network requests and
avoid duplicate refresh within a process. Treat cross-process refresh races
with an exclusive per-namespace lock around reread, refresh, and persist.
Login and logout mutations use the same lock. An old session must never overwrite
a newly rotated credential; stale-refresh failures must not delete credentials
written by another process.
Environment tokens take precedence, are never persisted, and must not overwrite
or silently fall back to a different stored account when invalid.

## Repository integration

Follow existing plugin package conventions: config lifecycle, command inputs,
Alloy generators, generated builtin, package exports, Nx targets, TypeScript
references, and workspace dependencies. Extend repository-owned code only; do
not modify external Powerlines or Power Plant packages. Discover suitable Nx
generators before scaffolding and inspect their source and dry-run output.

## Validation

Use injected provider, browser, clock, and credential-store seams to test missing,
invalid, expired, and refreshed credentials; guard execution and inheritance;
public help; wrong callback state/path; timeout and cleanup; issuer/subject
mismatch; secure-store failure; logout despite revocation failure; environment
precedence; rotated refresh persistence; and no secrets in generated artifacts.
Render generated commands and run them to prove rejected requests never reach
the handler. Run the relevant Nx tests, typechecks, and builds inside Devenv.
Report real-provider login and native OS credential-service behavior separately
from automated tests; no provider has been supplied for an end-to-end live test.

## Deliberate limits

Initial login supports OIDC public native clients, not arbitrary web login pages.
Headless browser login and custom OAuth protocols are deferred. These limits
keep the security contract concrete; future adapters must preserve that contract.
