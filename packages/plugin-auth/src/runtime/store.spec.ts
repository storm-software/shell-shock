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
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AuthSession } from "./types";

const directory = await mkdtemp(join(tmpdir(), "shell-shock-auth-store-"));
const credentials = new Map<string, string>();
const constructorOptions: unknown[] = [];
let fail = false;
jest.unstable_mockModule("node:os", () => ({ homedir: () => directory }));
jest.unstable_mockModule("@napi-rs/keyring", () => ({
  AsyncEntry: class {
    private key: string;
    constructor(service: string, user: string, options: unknown) {
      this.key = `${service}:${user}`;
      constructorOptions.push(options);
    }
    async getPassword() {
      if (fail) {
        throw new Error("native-store-error");
      }
      return credentials.get(this.key) ?? null;
    }
    async setPassword(value: string) {
      if (fail) {
        throw new Error("native-store-error");
      }
      credentials.set(this.key, value);
    }
    async deleteCredential() {
      return credentials.delete(this.key);
    }
  }
}));
const { createCredentialStore } = await import("./store");
const options = {
  issuer: "https://identity.example.com",
  clientId: "native",
  namespace: "test"
};
const session: AuthSession = {
  ...options,
  subject: "user",
  accessToken: "secret-access",
  expiresAt: Date.now() + 60_000,
  identity: { subject: "user" }
};

describe("secure credential-store adapter", () => {
  afterAll(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("pins Secret Service and keeps credentials out of lock files", async () => {
    const store = createCredentialStore(options);
    await store.withLock(async transaction => {
      await transaction.write(session);
    });
    const read = await store.withLock(transaction => transaction.read());
    expect(read).toEqual(session);
    expect(constructorOptions).toContainEqual({
      linux: { store: "secret-service" }
    });
    expect(
      await readdir(join(directory, ".shell-shock", "auth-locks"))
    ).toEqual([]);
  });

  it("isolates issuer, client and application namespaces", async () => {
    for (const changed of [
      { issuer: "https://other.example.com" },
      { clientId: "other" },
      { namespace: "other" }
    ]) {
      expect(
        await createCredentialStore({ ...options, ...changed }).withLock(
          transaction => transaction.read()
        )
      ).toBeNull();
    }
  });

  it("serializes actual lock acquisition across two store instances", async () => {
    const first = createCredentialStore(options);
    const second = createCredentialStore(options);
    const order: string[] = [];
    await Promise.all([
      first.withLock(async transaction => {
        order.push("read");
        await transaction.read();
        await new Promise(resolve => setTimeout(resolve, 20));
        order.push("write");
        await transaction.write(session);
      }),
      second.withLock(async transaction => {
        order.push("delete");
        await transaction.delete();
      })
    ]);
    expect(order).toEqual(["read", "write", "delete"]);
    expect(await first.withLock(transaction => transaction.read())).toBeNull();
  });

  it("fails rather than writing a plaintext fallback when native store access fails", async () => {
    fail = true;
    try {
      await expect(
        createCredentialStore(options).withLock(transaction =>
          transaction.write(session)
        )
      ).rejects.toThrow();
      expect(
        await readdir(join(directory, ".shell-shock", "auth-locks"))
      ).toEqual([]);
    } finally {
      fail = false;
    }
  });
});
