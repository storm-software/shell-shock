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

import * as oidc from "openid-client";
import { createCallback } from "./callback";
import type {
  AuthIdentity,
  AuthOptions,
  AuthProvider,
  AuthSession
} from "./types";

/** Validate URLs before opening a browser or sending credentials. */
function httpsEndpoint(value: string | undefined): URL {
  if (!value) {
    throw new Error("Authentication provider is missing a required endpoint.");
  }
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.hash) {
    throw new Error(
      "Authentication provider endpoints must use HTTPS without URL credentials or fragments."
    );
  }
  return url;
}

export function createOidcProvider(options: AuthOptions): AuthProvider {
  let configuration: Promise<oidc.Configuration> | undefined;
  const now = options.now ?? Date.now;
  const config = () =>
    (configuration ??= oidc
      .discovery(
        new URL(options.issuer),
        options.clientId,
        undefined,
        oidc.None(),
        {
          timeout: options.requestTimeoutSeconds ?? 15,
          execute: [oidc.enableNonRepudiationChecks]
        }
      )
      .then(value => {
        const metadata = value.serverMetadata();
        if (metadata.issuer !== options.issuer) {
          throw new Error("Authentication issuer mismatch.");
        }
        const endpoint = httpsEndpoint(metadata.authorization_endpoint);
        httpsEndpoint(metadata.token_endpoint);
        httpsEndpoint(metadata.jwks_uri);
        httpsEndpoint(metadata.userinfo_endpoint);
        if (metadata.revocation_endpoint) {
          httpsEndpoint(metadata.revocation_endpoint);
        }
        if (options.loginUrl) {
          const override = httpsEndpoint(options.loginUrl);
          if (override.search || override.href !== endpoint.href) {
            throw new Error(
              "Login URL must match the discovered authorization endpoint without query parameters."
            );
          }
        }
        return value;
      })
      .catch(() => {
        configuration = undefined;
        throw new Error(
          "Unable to securely configure the authentication provider."
        );
      }));
  const user = async (
    configuration: oidc.Configuration,
    accessToken: string,
    subject: string
  ): Promise<AuthIdentity> => {
    const claims = await oidc.fetchUserInfo(
      configuration,
      accessToken,
      subject
    );
    if (claims.sub !== subject) {
      throw new Error("Authentication subject mismatch.");
    }
    return {
      subject,
      ...(typeof claims.name === "string" ? { name: claims.name } : {}),
      ...(typeof claims.email === "string" ? { email: claims.email } : {})
    };
  };
  const tokenSession = async (
    configuration: oidc.Configuration,
    tokens: oidc.TokenEndpointResponse & oidc.TokenEndpointResponseHelpers,
    previous?: AuthSession
  ): Promise<AuthSession> => {
    const claims = tokens.claims();
    const subject = claims?.sub ?? previous?.subject;
    if (
      !subject ||
      (previous && subject !== previous.subject) ||
      typeof tokens.access_token !== "string" ||
      !tokens.access_token ||
      typeof tokens.expires_in !== "number" ||
      !Number.isFinite(tokens.expires_in) ||
      tokens.expires_in <= 5 ||
      tokens.token_type.toLowerCase() !== "bearer"
    ) {
      throw new Error("Authentication provider returned an invalid session.");
    }
    if (!previous && !claims) {
      throw new Error("A validated OpenID Connect identity token is required.");
    }
    const identity = await user(configuration, tokens.access_token, subject);
    return {
      issuer: options.issuer,
      clientId: options.clientId,
      subject,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? previous?.refreshToken,
      expiresAt: now() + tokens.expires_in * 1000,
      identity
    };
  };
  return {
    async login() {
      const configuration = await config();
      const state = oidc.randomState();
      const nonce = oidc.randomNonce();
      let verifier = oidc.randomPKCECodeVerifier();
      const callback = await createCallback(
        state,
        options.loginTimeoutMs ?? 180_000
      );
      let completed = false;
      try {
        const authorization = oidc.buildAuthorizationUrl(configuration, {
          redirect_uri: callback.redirectUri,
          scope: [...new Set(["openid", ...(options.scopes ?? [])])].join(" "),
          code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
          code_challenge_method: "S256",
          state,
          nonce
        });
        const openBrowser =
          options.openBrowser ??
          (async (url: string) => {
            const { default: open } = await import("open");
            await open(url, { wait: false });
          });
        // Only the authorization URL is printable. It contains no token or verifier.
        const announce =
          options.onAuthorizationUrl ??
          ((url: string) =>
            process.stderr.write(
              `Open this URL in your browser to log in:\n${url}\n`
            ));
        const browserAttempt = Promise.resolve()
          .then(() => openBrowser(authorization.href))
          .catch(() => {
            if (!completed) {
              announce(authorization.href);
            }
          });
        // The callback deadline also bounds a hung browser launcher. Keep its
        // rejection outside the browser-failure handler so timeouts propagate.
        await Promise.race([browserAttempt, callback.result]);
        const response = await callback.result;
        const tokens = await oidc.authorizationCodeGrant(
          configuration,
          response,
          {
            pkceCodeVerifier: verifier,
            expectedState: state,
            expectedNonce: nonce
          }
        );
        return await tokenSession(configuration, tokens);
      } finally {
        completed = true;
        verifier = "";
        await callback.close();
      }
    },
    async validate(session) {
      return user(await config(), session.accessToken, session.subject);
    },
    async refresh(session) {
      if (!session.refreshToken) {
        throw new Error("No refresh credential available.");
      }
      const configuration = await config();
      return tokenSession(
        configuration,
        await oidc.refreshTokenGrant(configuration, session.refreshToken),
        session
      );
    },
    async revoke(session) {
      const configuration = await config();
      if (!configuration.serverMetadata().revocation_endpoint) {
        return;
      }
      let failed = false;
      if (session.refreshToken) {
        try {
          await oidc.tokenRevocation(configuration, session.refreshToken, {
            token_type_hint: "refresh_token"
          });
        } catch {
          failed = true;
        }
      }
      try {
        await oidc.tokenRevocation(configuration, session.accessToken, {
          token_type_hint: "access_token"
        });
      } catch {
        failed = true;
      }
      if (failed) {
        throw new Error("Authentication provider revocation failed.");
      }
    }
  };
}
