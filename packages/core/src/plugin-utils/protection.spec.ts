import type { CommandTree } from "../types";
import { isProtectedCommand } from "./context-helpers";

function command(values: Partial<CommandTree> = {}): CommandTree {
  return { parent: null, children: {}, ...values } as CommandTree;
}

describe("protected command inheritance", () => {
  it("keeps public commands public", () => {
    expect(isProtectedCommand(command())).toBe(false);
  });

  it("protects descendants even when they explicitly opt out", () => {
    const root = command({ protected: true });
    const group = command({ protected: false, parent: root });
    expect(
      isProtectedCommand(command({ protected: false, parent: group }))
    ).toBe(true);
  });

  it("protects commands with their own metadata", () => {
    expect(isProtectedCommand(command({ protected: true }))).toBe(true);
  });
});

import type { Context } from "../types";
import { getCommandAuthGuard } from "./context-helpers";

function guardContext(auth = true): Context {
  const root = command({ name: "admin", path: "admin", protected: true });
  const child = command({
    name: "inspect",
    path: "admin/[id]/inspect",
    parent: root,
    protected: false
  });
  root.children = { inspect: child };
  return {
    config: { auth, commandExecution: "withCommand" },
    commands: { admin: root }
  } as unknown as Context;
}

const AsyncFunction = Object.getPrototypeOf(async () => undefined).constructor;

function invokeGuard(
  context: Context,
  requireAuth: () => Promise<unknown>,
  path: string,
  handler: () => unknown
) {
  return new AsyncFunction(
    "requireAuth",
    "path",
    "handler",
    `${getCommandAuthGuard(context)}\nreturn handler();`
  )(requireAuth, path, handler);
}

describe("generated command authentication guard", () => {
  it("rejects presets that do not declare the shared execution boundary", () => {
    const context = guardContext();
    delete (context.config as { commandExecution?: string }).commandExecution;
    expect(() => getCommandAuthGuard(context)).toThrow(
      /preset|execution boundary/i
    );
  });

  it("refuses to generate a guard before command resolution", () => {
    expect(() =>
      getCommandAuthGuard({
        config: { auth: true, commandExecution: "withCommand" }
      } as unknown as Context)
    ).toThrow("resolved");
  });

  it("rejects protected authentication bootstrap commands", () => {
    const root = command({ path: null, protected: true });
    root.children = { login: command({ path: "login", parent: root }) };
    expect(() =>
      getCommandAuthGuard({
        config: { auth: true, commandExecution: "withCommand" },
        commands: { root }
      } as unknown as Context)
    ).toThrow("login");
  });
  it("rejects unauthenticated dynamic descendants before handler execution", async () => {
    let called = false;
    await expect(
      invokeGuard(
        guardContext(),
        async () => {
          throw new Error("Login required");
        },
        "admin/[id]/inspect",
        () => {
          called = true;
        }
      )
    ).rejects.toThrow("Login required");
    expect(called).toBe(false);
  });

  it("permits protected handlers after successful authentication", async () => {
    let checks = 0;
    await expect(
      invokeGuard(
        guardContext(),
        async () => {
          checks++;
        },
        "admin/[id]/inspect",
        () => "done"
      )
    ).resolves.toBe("done");
    expect(checks).toBe(1);
  });

  it("does not authenticate public commands", async () => {
    await expect(
      invokeGuard(
        guardContext(),
        async () => {
          throw new Error("unexpected auth");
        },
        "login",
        () => "public"
      )
    ).resolves.toBe("public");
  });

  it("protects a root command whose static path is null", async () => {
    const root = command({ path: null, protected: true });
    const context = {
      config: { auth: true, commandExecution: "withCommand" },
      commands: { root }
    } as unknown as Context;
    await expect(
      invokeGuard(
        context,
        async () => {
          throw new Error("Login required");
        },
        "null",
        () => "private"
      )
    ).rejects.toThrow("Login required");
  });

  it("fails closed when the auth plugin is missing", async () => {
    let called = false;
    await expect(
      invokeGuard(
        guardContext(false),
        async () => undefined,
        "admin",
        () => {
          called = true;
        }
      )
    ).rejects.toThrow("@shell-shock/plugin-auth");
    expect(called).toBe(false);
  });
});
