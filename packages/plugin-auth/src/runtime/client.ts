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

import { createOidcProvider } from "./oidc";
import { createCredentialStore } from "./store";
import type {
  AuthClient,
  AuthIdentity,
  AuthOptions,
  AuthSession,
  ValidatedEnvironmentToken
} from "./types";

const loginMessage =
  "Authentication required or session expired. Run login and try again.";

function identity(value: AuthIdentity, subject: string): AuthIdentity {
  if (
    !value ||
    typeof value.subject !== "string" ||
    !value.subject ||
    value.subject !== subject
  ) {
    throw new Error(loginMessage);
  }
  // Only display-safe claims cross the public identity boundary.
  return {
    subject,
    ...(typeof value.name === "string" ? { name: value.name } : {}),
    ...(typeof value.email === "string" ? { email: value.email } : {})
  };
}

/** Validate public configuration without contacting a provider or credential service. */
export function validateAuthOptions(options: AuthOptions): void {
  let url: URL;
  try {
    url = new URL(options.issuer);
  } catch {
    throw new Error("Authentication issuer must be an HTTPS URL.");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Authentication issuer must be an HTTPS URL without credentials, query, or fragment."
    );
  }
  if (!options.clientId?.trim() || !options.namespace?.trim()) {
    throw new Error("Authentication clientId and namespace are required.");
  }
  if (
    options.tokenEnv &&
    (!options.validateEnvironmentToken || !options.audience?.trim())
  ) {
    throw new Error(
      "Environment credentials require an explicit validator and expected audience."
    );
  }
  if (
    options.loginTimeoutMs !== undefined &&
    (!Number.isFinite(options.loginTimeoutMs) ||
      options.loginTimeoutMs < 1 ||
      options.loginTimeoutMs > 300_000)
  ) {
    throw new Error("Login timeout must be between 1 and 300000 milliseconds.");
  }
  if (
    options.requestTimeoutSeconds !== undefined &&
    (!Number.isFinite(options.requestTimeoutSeconds) ||
      options.requestTimeoutSeconds < 1 ||
      options.requestTimeoutSeconds > 30)
  ) {
    throw new Error(
      "Authentication request timeout must be between 1 and 30 seconds."
    );
  }
  if (options.scopes?.some(scope => !scope || /\s/.test(scope))) {
    throw new Error(
      "Authentication scopes must be nonempty individual scope names."
    );
  }
}

/** Create a lazy auth client; this never opens a browser during command execution. */
export function createAuth(options: AuthOptions): AuthClient {
  validateAuthOptions(options);
  const now = options.now ?? Date.now;
  const environment = options.environment ?? process.env;
  const store = options.store ?? createCredentialStore(options);
  const provider = options.provider ?? createOidcProvider(options);
  const validateSession = (value: AuthSession): AuthSession => {
    if (
      !value ||
      value.issuer !== options.issuer ||
      value.clientId !== options.clientId ||
      typeof value.subject !== "string" ||
      !value.subject ||
      typeof value.accessToken !== "string" ||
      !value.accessToken ||
      !Number.isFinite(value.expiresAt) ||
      (value.refreshToken !== undefined &&
        (typeof value.refreshToken !== "string" || !value.refreshToken))
    ) {
      throw new Error(loginMessage);
    }
    return { ...value, identity: identity(value.identity, value.subject) };
  };
  const locked = async <T>(
    operation: Parameters<typeof store.withLock<T>>[0]
  ): Promise<T> => {
    try {
      return await store.withLock(operation);
    } catch (error) {
      if (
        error instanceof Error &&
        [
          loginMessage,
          "Local credentials were removed, but provider revocation failed.",
          "Local credentials were removed. Unset the configured environment credential to finish logout."
        ].includes(error.message)
      ) {
        throw error;
      }
      throw new Error(
        "Authentication failed or secure credential store unavailable. Unlock your OS credential store and run login again."
      );
    }
  };
  const requireAuth = async (): Promise<AuthSession> => {
    const token = options.tokenEnv ? environment[options.tokenEnv] : undefined;
    if (token !== undefined) {
      try {
        if (!token || !options.validateEnvironmentToken) {
          throw new Error();
        }
        const value: ValidatedEnvironmentToken =
          await options.validateEnvironmentToken(token);
        if (
          !value ||
          value.active !== true ||
          value.issuer !== options.issuer ||
          !Array.isArray(value.audience) ||
          !value.audience.includes(options.audience!) ||
          !Number.isFinite(value.expiresAt) ||
          value.expiresAt <= now()
        ) {
          throw new Error();
        }
        return validateSession({
          issuer: options.issuer,
          clientId: options.clientId,
          subject: value.subject,
          accessToken: token,
          expiresAt: value.expiresAt,
          identity: identity(value.identity, value.subject)
        });
      } catch {
        throw new Error(
          "Invalid or unverifiable environment credential. Replace it or unset it before running login."
        );
      }
    }
    return locked(async transaction => {
      let value = await transaction.read();
      if (!value) {
        throw new Error(loginMessage);
      }
      value = validateSession(value);
      if (value.expiresAt <= now() + 5000) {
        if (!value.refreshToken) {
          throw new Error(loginMessage);
        }
        try {
          const refreshed = validateSession(await provider.refresh(value));
          if (
            refreshed.subject !== value.subject ||
            refreshed.expiresAt <= now() + 5000
          ) {
            throw new Error();
          }
          refreshed.identity = identity(
            await provider.validate(refreshed),
            value.subject
          );
          await transaction.write(refreshed);
          return refreshed;
        } catch {
          throw new Error(loginMessage);
        }
      }
      try {
        value.identity = identity(
          await provider.validate(value),
          value.subject
        );
      } catch {
        throw new Error(loginMessage);
      }
      return value;
    });
  };
  return {
    requireAuth,
    getAccessToken: async () => (await requireAuth()).accessToken,
    whoami: async () => (await requireAuth()).identity,
    login: () =>
      locked(async transaction => {
        const value = validateSession(await provider.login());
        if (value.expiresAt <= now() + 5000) {
          throw new Error(loginMessage);
        }
        value.identity = identity(
          await provider.validate(value),
          value.subject
        );
        await transaction.write(value);
        return value.identity;
      }),
    logout: () =>
      locked(async transaction => {
        let failed = false;
        try {
          const value = await transaction.read();
          if (value) {
            await provider.revoke(validateSession(value));
          }
        } catch {
          failed = true;
        } finally {
          await transaction.delete();
        }
        if (options.tokenEnv && environment[options.tokenEnv] !== undefined) {
          throw new Error(
            "Local credentials were removed. Unset the configured environment credential to finish logout."
          );
        }
        if (failed) {
          throw new Error(
            "Local credentials were removed, but provider revocation failed."
          );
        }
      })
  };
}
