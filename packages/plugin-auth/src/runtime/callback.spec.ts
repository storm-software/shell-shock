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

import { request } from "node:http";
import { createCallback } from "./callback";

describe("loopback authentication callback", () => {
  it("rejects wrong path/state/method/host and accepts a subsequent valid code", async () => {
    const callback = await createCallback("expected-state", 3000);
    try {
      const wrongPath = new URL(callback.redirectUri);
      wrongPath.pathname = "/wrong";
      expect((await fetch(wrongPath)).status).toBe(404);
      expect(
        (await fetch(`${callback.redirectUri}?code=code&state=wrong`)).status
      ).toBe(400);
      expect(
        (await fetch(callback.redirectUri, { method: "POST" })).status
      ).toBe(405);
      expect(
        await new Promise<number | undefined>((resolve, reject) => {
          request(
            `${callback.redirectUri}?code=code&state=expected-state`,
            { headers: { host: "evil.example" } },
            response => {
              response.resume();
              resolve(response.statusCode);
            }
          )
            .on("error", reject)
            .end();
        })
      ).toBe(400);
      expect(
        await new Promise<number | undefined>((resolve, reject) => {
          request(
            callback.redirectUri,
            { path: "//evil.example/callback?code=code&state=expected-state" },
            response => {
              response.resume();
              resolve(response.statusCode);
            }
          )
            .on("error", reject)
            .end();
        })
      ).toBe(400);
      expect(
        (
          await fetch(
            `${callback.redirectUri}?code=code&state=expected-state&access_token=secret`
          )
        ).status
      ).toBe(400);
      const response = await fetch(
        `${callback.redirectUri}?code=code&state=expected-state`
      );
      expect(response.status).toBe(200);
      expect((await callback.result).searchParams.get("code")).toBe("code");
    } finally {
      await callback.close();
    }
    await expect(fetch(callback.redirectUri)).rejects.toThrow();
  });

  it("times out and closes the listener", async () => {
    const callback = await createCallback("state", 20);
    await expect(callback.result).rejects.toThrow(/timed out/i);
    await callback.close();
    await expect(fetch(callback.redirectUri)).rejects.toThrow();
  });
});
