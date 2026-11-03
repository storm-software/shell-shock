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

import { authConfiguration, assertAuthCommands } from "./helpers";

const options = {
  issuer: "https://identity.example.com",
  clientId: "native-cli",
  namespace: "example-cli"
};

describe("authentication plugin configuration", () => {
  it("rejects insecure issuers and browser URLs before emitting source", () => {
    expect(() =>
      authConfiguration({ ...options, issuer: "http://identity.example.com" })
    ).toThrow();
    expect(() =>
      authConfiguration({ ...options, loginUrl: "javascript:alert(1)" })
    ).toThrow();
  });

  it("rejects CI configuration without a runtime validator module and audience", () => {
    expect(() =>
      authConfiguration({ ...options, tokenEnv: "APP_TOKEN" })
    ).toThrow(/runtime|audience/);
    expect(() =>
      authConfiguration({
        ...options,
        tokenEnv: "APP_TOKEN",
        runtime: { file: "./auth.ts" }
      })
    ).toThrow(/audience/);
  });

  it("rejects invalid scopes and request deadlines at build time", () => {
    expect(() =>
      authConfiguration({ ...options, scopes: ["openid profile"] })
    ).toThrow(/scope/);
    expect(() =>
      authConfiguration({ ...options, requestTimeoutSeconds: 0.5 })
    ).toThrow(/timeout|Timeout/);
  });

  it("serializes only allowlisted public configuration", () => {
    const result = authConfiguration({
      ...options,
      clientSecret: "NEVER_EMIT"
    } as never);
    expect(JSON.stringify(result)).not.toContain("NEVER_EMIT");
    expect(result.issuer).toBe(options.issuer);
    expect(result.scopes).toContain("openid");
  });

  it("registers three public commands and rejects collisions", async () => {
    const context = {
      inputs: [],
      entryPath: ".shell-shock/entry",
      commands: {},
      config: { auth: authConfiguration(options) }
    };
    // The unit uses the plugin's input registration helper; actual generation is tested separately.
    const { registerAuthCommands } = await import("./helpers");
    registerAuthCommands(context as never);
    expect(context.inputs.map((input: any) => input.name)).toEqual([
      "login",
      "logout",
      "whoami"
    ]);
    expect(
      context.inputs.every((input: any) => input.protected === false)
    ).toBe(true);
    expect(() => registerAuthCommands(context as never)).toThrow(
      /already exists/i
    );
  });

  it("rejects case-insensitive aliases that shadow login", async () => {
    const { registerAuthCommands } = await import("./helpers");
    const context = {
      inputs: [{ id: "other", name: "other", alias: ["LoGiN"] }],
      entryPath: ".shell-shock/entry",
      config: { isCaseSensitive: false }
    };
    expect(() => registerAuthCommands(context as never)).toThrow(
      /already exists/
    );
  });

  it("rejects bootstrap commands protected by an ancestor", () => {
    const parent = { protected: true, parent: null };
    const commands = {
      login: { name: "login", protected: false, parent, children: {} }
    };
    expect(() => assertAuthCommands(commands as never)).toThrow(/login/);
  });
});
