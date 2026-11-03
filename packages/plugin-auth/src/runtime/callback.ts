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

import { timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

export interface LoginCallback {
  redirectUri: string;
  result: Promise<URL>;
  close(): Promise<void>;
}

/** Listen only on IPv4 loopback; unrelated requests cannot consume the login. */
export async function createCallback(
  state: string,
  timeoutMs: number
): Promise<LoginCallback> {
  let resolve!: (url: URL) => void;
  let reject!: (error: Error) => void;
  let consumed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let redirectUri = "";
  const result = new Promise<URL>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  // A timeout can happen while the browser opener is still pending.
  void result.catch(() => undefined);
  const server = createServer((request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; frame-ancestors 'none'"
    );
    response.setHeader("X-Content-Type-Options", "nosniff");
    const deny = (status: number) => {
      response.writeHead(status);
      response.end("Invalid login callback.");
    };
    if (request.method !== "GET") {
      deny(405);
      return;
    }
    if (
      !redirectUri ||
      request.headers.host !== new URL(redirectUri).host ||
      !request.url?.startsWith("/")
    ) {
      deny(400);
      return;
    }
    let url: URL;
    try {
      url = new URL(request.url, redirectUri);
    } catch {
      deny(400);
      return;
    }
    if (url.origin !== new URL(redirectUri).origin) {
      deny(400);
      return;
    }
    if (url.pathname !== "/callback") {
      deny(404);
      return;
    }
    const received = url.searchParams.get("state") ?? "";
    const a = Buffer.from(state);
    const b = Buffer.from(received);
    if (
      consumed ||
      url.searchParams.getAll("state").length !== 1 ||
      a.length !== b.length ||
      !timingSafeEqual(a, b)
    ) {
      deny(400);
      return;
    }
    const params = url.searchParams;
    if (
      params.has("access_token") ||
      params.has("id_token") ||
      params.has("refresh_token") ||
      params.getAll("code").length > 1 ||
      params.getAll("error").length > 1 ||
      !!params.get("code") === !!params.get("error")
    ) {
      deny(400);
      return;
    }
    consumed = true;
    clearTimeout(timer);
    response.end("Login response received. Return to your terminal.");
    resolve(url);
  });
  server.requestTimeout = Math.min(timeoutMs, 10_000);
  server.headersTimeout = Math.min(timeoutMs, 10_000);
  server.maxHeadersCount = 30;
  server.maxConnections = 10;
  await new Promise<void>((yes, no) => {
    server.once("error", no);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", no);
      yes();
    });
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Unable to start secure login callback.");
  }
  redirectUri = `http://127.0.0.1:${address.port}/callback`;
  const close = async () => {
    clearTimeout(timer);
    if (!consumed) {
      consumed = true;
      reject(new Error("Login cancelled."));
    }
    await new Promise<void>(yes => {
      server.close(() => yes());
      server.closeAllConnections();
    });
  };
  server.on("error", () => {
    reject(new Error("Login callback failed."));
    void close();
  });
  timer = setTimeout(() => {
    reject(new Error("Browser login timed out. Run login again."));
    void close();
  }, timeoutMs);
  return { redirectUri, result, close };
}
