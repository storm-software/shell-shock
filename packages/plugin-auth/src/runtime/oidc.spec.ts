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

import { jest } from "@jest/globals";

const metadata = {
  issuer: "https://identity.example.com",
  authorization_endpoint: "https://identity.example.com/authorize",
  token_endpoint: "https://identity.example.com/token",
  jwks_uri: "https://identity.example.com/jwks",
  userinfo_endpoint: "https://identity.example.com/userinfo",
  revocation_endpoint: "https://identity.example.com/revoke"
};
const configuration = { serverMetadata: () => metadata };
const tokens = {
  access_token: "access-secret",
  refresh_token: "refresh-secret",
  expires_in: 60,
  token_type: "bearer",
  claims: () => ({ sub: "user-1" })
};
const discovery = jest.fn(async () => configuration);
const authorizationCodeGrant = jest.fn(async () => tokens);
const fetchUserInfo = jest.fn(async () => ({ sub: "user-1", name: "User" }));
const enableNonRepudiationChecks = jest.fn();
const refreshTokenGrant = jest.fn(async () => tokens);
const tokenRevocation = jest.fn(async () => undefined);
const None = jest.fn(() => "none");
jest.unstable_mockModule("openid-client", () => ({
  discovery,
  authorizationCodeGrant,
  fetchUserInfo,
  enableNonRepudiationChecks,
  refreshTokenGrant,
  tokenRevocation,
  None,
  randomState: () => "fresh-state",
  randomNonce: () => "fresh-nonce",
  randomPKCECodeVerifier: () => "secret-verifier",
  calculatePKCECodeChallenge: async () => "challenge",
  buildAuthorizationUrl: (_config: unknown, values: Record<string, string>) => {
    const url = new URL(metadata.authorization_endpoint);
    for (const [key, value] of Object.entries(values)) {
      url.searchParams.set(key, value);
    }
    return url;
  }
}));
const { createOidcProvider } = await import("./oidc");

const options = {
  issuer: metadata.issuer,
  clientId: "native-cli",
  namespace: "app"
};

describe("OIDC native public client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses S256 PKCE, state, nonce, public client auth and signature checking", async () => {
    let authorizationUrl = "";
    const provider = createOidcProvider({
      ...options,
      openBrowser: async value => {
        authorizationUrl = value;
        const url = new URL(value);
        const redirect = new URL(url.searchParams.get("redirect_uri")!);
        expect(redirect.hostname).toBe("127.0.0.1");
        redirect.searchParams.set("state", url.searchParams.get("state")!);
        redirect.searchParams.set("code", "authorization-code");
        await fetch(redirect);
      }
    });
    const result = await provider.login();
    const authorization = new URL(authorizationUrl);
    expect(authorization.searchParams.get("code_challenge_method")).toBe(
      "S256"
    );
    expect(authorization.searchParams.get("scope")).toBe("openid");
    expect(authorizationUrl).not.toContain("secret-verifier");
    expect(discovery).toHaveBeenCalledWith(
      expect.any(URL),
      "native-cli",
      undefined,
      "none",
      expect.objectContaining({ execute: [enableNonRepudiationChecks] })
    );
    expect(authorizationCodeGrant).toHaveBeenCalledWith(
      configuration,
      expect.any(URL),
      {
        pkceCodeVerifier: "secret-verifier",
        expectedState: "fresh-state",
        expectedNonce: "fresh-nonce"
      }
    );
    expect(fetchUserInfo).toHaveBeenCalledWith(
      configuration,
      "access-secret",
      "user-1"
    );
    expect(result.subject).toBe("user-1");
  });

  it("rejects arbitrary login URLs before opening a browser", async () => {
    for (const loginUrl of [
      "https://evil.example/login",
      `${metadata.authorization_endpoint}?redirect_uri=https://evil.example`
    ]) {
      const openBrowser = jest.fn(async () => undefined);
      await expect(
        createOidcProvider({ ...options, loginUrl, openBrowser }).login()
      ).rejects.toThrow(/securely configure/);
      expect(openBrowser).not.toHaveBeenCalled();
    }
  });

  it("bounds login and closes the listener when the browser opener hangs", async () => {
    let callback = "";
    const provider = createOidcProvider({
      ...options,
      loginTimeoutMs: 30,
      openBrowser: value => {
        callback = new URL(value).searchParams.get("redirect_uri")!;
        return new Promise<void>(() => undefined);
      }
    });
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    try {
      await expect(
        Promise.race([
          provider.login(),
          new Promise<never>((_, reject) => {
            watchdog = setTimeout(
              () => reject(new Error("opener deadline exceeded")),
              200
            );
          })
        ])
      ).rejects.toThrow(/timed out/i);
      await expect(fetch(callback)).rejects.toThrow();
    } finally {
      clearTimeout(watchdog);
    }
  });

  it("provides a safe manual link after browser failure and closes listener on timeout", async () => {
    const urls: string[] = [];
    const provider = createOidcProvider({
      ...options,
      loginTimeoutMs: 30,
      openBrowser: async () => {
        throw new Error("browser-private-details");
      },
      onAuthorizationUrl: value => urls.push(value)
    });
    await expect(provider.login()).rejects.toThrow(/timed out/i);
    expect(urls).toHaveLength(1);
    expect(urls[0]).not.toContain("secret-verifier");
    const callback = new URL(urls[0]!).searchParams.get("redirect_uri")!;
    await expect(fetch(callback)).rejects.toThrow();
  });
});
