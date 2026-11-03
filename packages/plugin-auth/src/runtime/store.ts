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

import { createHash } from "node:crypto";
import { lstat, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AuthOptions, AuthSession, CredentialStore } from "./types";

/** No credentials touch the filesystem: files here contain only namespace locks. */
export function createCredentialStore(
  options: Pick<AuthOptions, "issuer" | "clientId" | "namespace">
): CredentialStore {
  const key = createHash("sha256")
    .update(
      JSON.stringify([options.namespace, options.issuer, options.clientId])
    )
    .digest("hex");
  const directory = join(homedir(), ".shell-shock", "auth-locks");
  const unavailable = () =>
    new Error(
      "Secure credential store unavailable. Unlock your OS credential store; plaintext fallback is disabled."
    );
  return {
    async withLock(operation) {
      let release: (() => Promise<void>) | undefined;
      let compromised = false;
      try {
        const parent = join(homedir(), ".shell-shock");
        await mkdir(parent, { recursive: true, mode: 0o700 });
        await mkdir(directory, { recursive: true, mode: 0o700 });
        for (const path of [parent, directory]) {
          const stat = await lstat(path);
          if (
            !stat.isDirectory() ||
            stat.isSymbolicLink() ||
            (process.platform !== "win32" &&
              ((stat.mode & 0o077) !== 0 || stat.uid !== process.getuid?.()))
          ) {
            throw unavailable();
          }
        }
        const [{ lock }, { AsyncEntry }] = await Promise.all([
          import("proper-lockfile"),
          import("@napi-rs/keyring")
        ]);
        release = await lock(join(directory, key), {
          realpath: false,
          stale: 300_000,
          update: 1000,
          retries: { retries: 30, minTimeout: 100, maxTimeout: 1000 },
          onCompromised: () => {
            compromised = true;
          }
        });
        // Secret Service is required on Linux; the keyring binding's automatic
        // kernel-keyring fallback does not persist across restarts.
        const entry = new AsyncEntry("shell-shock-auth", key, {
          linux: { store: "secret-service" }
        });
        const active = () => {
          if (compromised) {
            throw unavailable();
          }
        };
        const deadline = () => AbortSignal.timeout(30_000);
        const result = await operation({
          read: async () => {
            active();
            const text = await entry.getPassword(deadline());
            active();
            if (text === null) {
              return null;
            }
            try {
              return JSON.parse(text) as AuthSession;
            } catch {
              throw unavailable();
            }
          },
          write: async session => {
            active();
            await entry.setPassword(JSON.stringify(session), deadline());
            active();
          },
          delete: async () => {
            active();
            await entry.deleteCredential(deadline());
            active();
          }
        });
        active();
        return result;
      } finally {
        if (release) {
          await release();
        }
      }
    }
  };
}
