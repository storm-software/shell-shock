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
import { createAuth } from "./client";
import type {
  AuthOptions,
  AuthProvider,
  AuthSession,
  CredentialStore,
  CredentialTransaction
} from "./types";

const issuer = "https://identity.example.com";
const session = (extra: Partial<AuthSession> = {}): AuthSession => ({
  issuer,
  clientId: "native-cli",
  subject: "user-1",
  accessToken: "access-secret",
  refreshToken: "refresh-secret",
  expiresAt: Date.now() + 60_000,
  identity: { subject: "user-1", name: "Example User" },
  ...extra
});

function setup(initial: AuthSession | null = null) {
  let saved = initial;
  let tail: Promise<unknown> = Promise.resolve();
  const transaction: CredentialTransaction = {
    read: async () => saved,
    write: async value => {
      saved = structuredClone(value);
    },
    delete: async () => {
      saved = null;
    }
  };
  const store: CredentialStore = {
    withLock: async operation => {
      const result = tail.then(() => operation(transaction));
      tail = result.catch(() => undefined);
      return result;
    }
  };
  const provider: AuthProvider = {
    login: jest.fn(async () => session()),
    validate: jest.fn(async value => value.identity),
    refresh: jest.fn(async value =>
      session({ refreshToken: "rotated-secret", subject: value.subject })
    ),
    revoke: jest.fn(async () => undefined)
  };
  const options: AuthOptions = {
    issuer,
    clientId: "native-cli",
    namespace: "test-app",
    store,
    provider
  };
  return {
    options,
    provider,
    store,
    saved: () => saved,
    auth: createAuth(options)
  };
}

describe("authentication runtime", () => {
  it("rejects missing credentials without invoking login", async () => {
    const { auth, provider } = setup();
    await expect(auth.requireAuth()).rejects.toThrow(/login/);
    expect(provider.login).not.toHaveBeenCalled();
  });

  it("persists a validated login and provides identity without exposing tokens", async () => {
    const { auth, saved, provider } = setup();
    expect(await auth.login()).toEqual({
      subject: "user-1",
      name: "Example User"
    });
    expect(saved()?.accessToken).toBe("access-secret");
    expect(provider.validate).toHaveBeenCalled();
    expect(await auth.whoami()).toEqual({
      subject: "user-1",
      name: "Example User"
    });
  });

  it("rejects stored issuer, client and subject mismatches", async () => {
    for (const extra of [
      { issuer: "https://other.example.com" },
      { clientId: "other" },
      { subject: "other" }
    ]) {
      const { auth } = setup(session(extra));
      await expect(auth.requireAuth()).rejects.toThrow(
        /authentication|session/i
      );
    }
  });

  it("refreshes once across concurrent clients and persists rotated refresh credentials", async () => {
    const { options, provider, saved } = setup(
      session({ expiresAt: Date.now() - 1 })
    );
    const clients = [createAuth(options), createAuth(options)];
    await Promise.all(clients.map(client => client.requireAuth()));
    expect(provider.refresh).toHaveBeenCalledTimes(1);
    expect(saved()?.refreshToken).toBe("rotated-secret");
  });

  it("rejects expired sessions without refresh credentials", async () => {
    const { auth } = setup(
      session({ expiresAt: Date.now() - 1, refreshToken: undefined })
    );
    await expect(auth.requireAuth()).rejects.toThrow(/login/);
  });

  it("does not replace stored credentials after a failed refresh", async () => {
    const { auth, provider, saved } = setup(
      session({ expiresAt: Date.now() - 1 })
    );
    provider.refresh = jest.fn(async () => {
      throw new Error("refresh-secret");
    });
    await expect(auth.requireAuth()).rejects.toThrow(/login/);
    expect(saved()?.refreshToken).toBe("refresh-secret");
  });

  it("always clears local credentials when provider revocation fails", async () => {
    const { auth, provider, saved } = setup(session());
    provider.revoke = jest.fn(async () => {
      throw new Error("access-secret");
    });
    await expect(auth.logout()).rejects.toThrow(/local credentials.*removed/i);
    expect(saved()).toBeNull();
  });

  it("removes corrupted credentials even when reading the saved session fails", async () => {
    const { options } = setup();
    const remove = jest.fn(async () => undefined);
    options.store = {
      withLock: async operation =>
        operation({
          read: async () => {
            throw new Error("corrupted-session");
          },
          write: async () => undefined,
          delete: remove
        })
    };
    await expect(createAuth(options).logout()).rejects.toThrow(
      /local credentials.*removed/i
    );
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("fails safely when secure storage is unavailable and never leaks provider errors", async () => {
    const { options } = setup();
    options.store = {
      withLock: async () => {
        throw new Error("private-store-details");
      }
    };
    await expect(createAuth(options).login()).rejects.toThrow(
      /credential store/i
    );
    await expect(createAuth(options).login()).rejects.not.toThrow(
      "private-store-details"
    );
  });

  it("does not persist or fall back when an environment credential is invalid", async () => {
    const { options, saved } = setup(session());
    options.tokenEnv = "SHELL_SHOCK_TEST_TOKEN";
    options.audience = "https://api.example.com";
    options.validateEnvironmentToken = async () => {
      throw new Error("environment-secret");
    };
    process.env.SHELL_SHOCK_TEST_TOKEN = "environment-secret";
    try {
      await expect(createAuth(options).requireAuth()).rejects.toThrow(
        /environment credential/i
      );
      expect(saved()?.accessToken).toBe("access-secret");
    } finally {
      delete process.env.SHELL_SHOCK_TEST_TOKEN;
    }
  });

  it("checks environment token issuer, audience, active state, expiry and subject", async () => {
    const { options, saved } = setup(session());
    options.tokenEnv = "SHELL_SHOCK_TEST_TOKEN";
    options.audience = "https://api.example.com";
    const valid = {
      active: true as const,
      issuer,
      audience: [options.audience],
      subject: "ci-user",
      expiresAt: Date.now() + 60_000,
      identity: { subject: "ci-user" }
    };
    process.env.SHELL_SHOCK_TEST_TOKEN = "environment-secret";
    try {
      for (const invalid of [
        { active: false },
        { issuer: "https://wrong.example" },
        { audience: ["other"] },
        { expiresAt: 0 },
        { identity: { subject: "other" } }
      ]) {
        options.validateEnvironmentToken = async () => ({
          ...valid,
          ...invalid
        });
        await expect(createAuth(options).requireAuth()).rejects.toThrow(
          /environment credential/i
        );
      }
      options.validateEnvironmentToken = async () => valid;
      expect(await createAuth(options).getAccessToken()).toBe(
        "environment-secret"
      );
      expect(saved()?.accessToken).toBe("access-secret");
    } finally {
      delete process.env.SHELL_SHOCK_TEST_TOKEN;
    }
  });

  it("does not persist credentials when login validation fails", async () => {
    const { auth, provider, saved } = setup();
    provider.validate = jest.fn(async () => {
      throw new Error("private-token");
    });
    await expect(auth.login()).rejects.not.toThrow("private-token");
    expect(saved()).toBeNull();
  });

  it("validates credentials on every invocation and rejects revoked tokens", async () => {
    const { auth, provider } = setup(session());
    await auth.requireAuth();
    provider.validate = jest.fn(async () => {
      throw new Error("revoked-access-secret");
    });
    await expect(auth.requireAuth()).rejects.toThrow(/login/);
  });

  it("serializes refresh and logout without resurrecting the session", async () => {
    const { options, saved } = setup(session({ expiresAt: Date.now() - 1 }));
    const a = createAuth(options);
    const b = createAuth(options);
    await Promise.all([a.requireAuth(), b.logout()]);
    expect(saved()).toBeNull();
    await expect(a.requireAuth()).rejects.toThrow(/login/);
  });

  it("rejects refresh responses that switch identity without overwriting credentials", async () => {
    const { auth, provider, saved } = setup(
      session({ expiresAt: Date.now() - 1 })
    );
    provider.refresh = jest.fn(async () =>
      session({ subject: "attacker", identity: { subject: "attacker" } })
    );
    await expect(auth.requireAuth()).rejects.toThrow(/login/);
    expect(saved()?.subject).toBe("user-1");
  });

  it("rejects insecure issuer and incomplete environment validation configuration", () => {
    const { options } = setup();
    expect(() =>
      createAuth({ ...options, issuer: "http://example.com" })
    ).toThrow(/HTTPS/);
    expect(() => createAuth({ ...options, tokenEnv: "TOKEN" })).toThrow(
      /validator|validation/i
    );
  });
});
