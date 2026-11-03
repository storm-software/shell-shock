/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

 This code was released as part of the Shell Shock project. Shell Shock
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/shell-shock.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/shell-shock
 Documentation:            https://docs.stormsoftware.com/projects/shell-shock
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/** Minimal display-safe identity. Tokens are never part of this object. */
export interface AuthIdentity {
  subject: string;
  name?: string;
  email?: string;
}

/** A validated session, persisted only in the OS credential service. */
export interface AuthSession {
  issuer: string;
  clientId: string;
  subject: string;
  accessToken: string;
  refreshToken?: string;
  /** Absolute Unix time in milliseconds. */
  expiresAt: number;
  identity: AuthIdentity;
}

/** All methods execute under an exclusive cross-process namespace lock. */
export interface CredentialTransaction {
  read(): Promise<AuthSession | null>;
  write(session: AuthSession): Promise<void>;
  delete(): Promise<void>;
}

/** Custom stores must implement an exclusive lock shared by all CLI processes. */
export interface CredentialStore {
  withLock<T>(
    operation: (transaction: CredentialTransaction) => Promise<T>
  ): Promise<T>;
}

/** A trusted provider adapter must validate tokens, not simply decode JWT claims. */
export interface AuthProvider {
  login(): Promise<AuthSession>;
  validate(session: AuthSession): Promise<AuthIdentity>;
  refresh(session: AuthSession): Promise<AuthSession>;
  revoke(session: AuthSession): Promise<void>;
}

export interface ValidatedEnvironmentToken {
  active: boolean;
  issuer: string;
  audience: string[];
  subject: string;
  expiresAt: number;
  identity: AuthIdentity;
}

/** Trusted application-owned runtime integrations, imported rather than serialized. */
export interface AuthRuntimeOverrides {
  store?: CredentialStore;
  provider?: AuthProvider;
  openBrowser?: (url: string) => Promise<void>;
  onAuthorizationUrl?: (url: string) => void;
  validateEnvironmentToken?: (
    token: string
  ) => Promise<ValidatedEnvironmentToken>;
  environment?: Record<string, string | undefined>;
  now?: () => number;
}

export interface AuthOptions extends AuthRuntimeOverrides {
  issuer: string;
  clientId: string;
  namespace: string;
  scopes?: string[];
  /** Must equal the discovered authorization endpoint, without query parameters. */
  loginUrl?: string;
  tokenEnv?: string;
  /** Expected resource audience for the explicit environment-token validator. */
  audience?: string;
  /** Browser login deadline in milliseconds, up to five minutes. */
  loginTimeoutMs?: number;
  /** Per-request OIDC network deadline in seconds, up to thirty seconds. */
  requestTimeoutSeconds?: number;
}

export interface AuthClient {
  login(): Promise<AuthIdentity>;
  logout(): Promise<void>;
  whoami(): Promise<AuthIdentity>;
  requireAuth(): Promise<AuthSession>;
  getAccessToken(): Promise<string>;
}
