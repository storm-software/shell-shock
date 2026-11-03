import { Output, render } from "@alloy-js/core";
import { createComponent } from "@alloy-js/core/jsx-runtime";
import { MetaContext } from "@power-plant/alloy-js/core/contexts/meta";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { StateBuiltin } from "../../core/dist/components/state-builtin.mjs";
import { AuthBuiltin, AuthCommands } from "../dist/components/auth.mjs";

// The context must come from core's peer-resolved plugin-alloy instance; another
// pnpm peer copy has a different context symbol even at the same version.
const coreRequire = createRequire(
  new URL("../../core/dist/contexts/power-plant.mjs", import.meta.url)
);
const { PowerlinesContext } = await import(
  pathToFileURL(
    coreRequire
      .resolve("@powerlines/plugin-alloy/core/contexts/context")
      .replace(/\.cjs$/, ".mjs")
  ).href
);

function renderFiles(component, context) {
  const output = render(
    createComponent(Output, {
      children: createComponent(MetaContext.Provider, {
        value: {},
        children: createComponent(PowerlinesContext.Provider, {
          value: context,
          children: createComponent(component, {})
        })
      })
    })
  );
  const files = [];
  const visit = directory => {
    for (const item of directory.contents) {
      if (item.kind === "file") files.push(item);
      else if (item.kind === "directory") visit(item);
    }
  };
  visit(output);
  return files;
}

function context() {
  return {
    entryPath: "/tmp/shell-shock-test/entry",
    globalOptions: [],
    config: {
      name: "example",
      title: "Example",
      cwd: process.cwd(),
      root: ".",
      framework: { name: "shell-shock" },
      commandExecution: "withCommand",
      auth: {
        issuer: "https://identity.example.com",
        clientId: "native",
        namespace: "example"
      }
    },
    commands: {
      deploy: {
        name: "deploy",
        path: "deploy",
        segments: ["deploy"],
        protected: true,
        parent: null,
        children: {}
      }
    }
  };
}

test("auth builtin imports runtime configuration without serializing secrets", () => {
  const ctx = context();
  ctx.config.auth.clientSecret = "NEVER_EMIT_THIS";
  ctx.config.auth.runtime = {
    file: "/application/auth.ts",
    export: "authRuntime"
  };
  const files = renderFiles(AuthBuiltin, ctx);
  assert.equal(files.length, 1);
  const source = files[0].contents;
  assert.match(source, /@shell-shock\/plugin-auth\/runtime/);
  assert.match(source, /authRuntime as authRuntimeOverrides/);
  assert.match(source, /getAccessToken/);
  assert.doesNotMatch(source, /NEVER_EMIT_THIS/);
});

test("auth builtin binds default runtime adapters to the generated alias", () => {
  for (const exported of [undefined, "default"]) {
    const ctx = context();
    ctx.config.auth.runtime = {
      file: "/application/auth.ts",
      ...(exported ? { export: exported } : {})
    };
    const source = renderFiles(AuthBuiltin, ctx)[0].contents;
    assert.match(
      source,
      /import authRuntimeOverrides from "\/application\/auth\.ts";/
    );
    assert.match(source, /\.\.\.authRuntimeOverrides/);
  }
});

test("auth commands use generated builtin helpers and never print tokens", () => {
  const files = renderFiles(AuthCommands, context());
  assert.equal(files.length, 3);
  for (const file of files) {
    assert.match(file.contents, /shell-shock:auth/);
    assert.match(file.contents, /protected: false/);
    assert.doesNotMatch(file.contents, /accessToken|refreshToken/);
  }
  assert.match(
    files.find(file => file.path.endsWith("whoami/command.ts")).contents,
    /JSON.stringify\(user\)/
  );
});

test("state builtin imports auth guard before invoking protected handlers", () => {
  const files = renderFiles(StateBuiltin, context());
  const source = files[0].contents;
  assert.match(source, /from "shell-shock:auth"/);
  assert.match(source, /await requireAuth\(\)/);
  assert.ok(
    source.indexOf("await requireAuth()") < source.indexOf("Reflect.apply")
  );
});

test("state builtin without auth fails closed and introduces no missing builtin import", () => {
  const ctx = context();
  delete ctx.config.auth;
  const source = renderFiles(StateBuiltin, ctx)[0].contents;
  assert.doesNotMatch(source, /from "shell-shock:auth"/);
  assert.match(source, /@shell-shock\/plugin-auth/);
});

function transpile(source, fileName) {
  const result = ts.transpileModule(source, {
    fileName,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext
    }
  });
  const errors =
    result.diagnostics?.filter(
      diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
    ) ?? [];
  assert.equal(
    errors.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: file => file,
      getNewLine: () => "\n"
    })
  );
  return result.outputText;
}

async function executeRenderedState(t, ctx) {
  const directory = await mkdtemp(
    join(tmpdir(), "shell-shock-auth-generated-")
  );
  t.after(() => rm(directory, { recursive: true, force: true }));
  const envUrl = pathToFileURL(join(directory, "env.mjs")).href;
  const authUrl = pathToFileURL(join(directory, "auth.mjs")).href;
  await writeFile(
    new URL(envUrl),
    "export const isCI = false; export const env = {};\n"
  );
  await writeFile(
    new URL(authUrl),
    `
    let authenticated = false;
    let checks = 0;
    export function authenticate() { authenticated = true; }
    export function authChecks() { return checks; }
    export async function requireAuth() {
      checks++;
      if (!authenticated) throw new Error("Login required");
      return { subject: "user-123" };
    }
  `
  );
  const source = renderFiles(StateBuiltin, ctx)[0]
    .contents.replaceAll('"shell-shock:env"', JSON.stringify(envUrl))
    .replaceAll('"shell-shock:auth"', JSON.stringify(authUrl));
  const stateUrl = pathToFileURL(join(directory, "state.mjs")).href;
  await writeFile(new URL(stateUrl), transpile(source, "state.ts"));
  return {
    state: await import(stateUrl),
    auth: await import(authUrl),
    directory
  };
}

function inheritedCommandContext() {
  const ctx = context();
  const admin = {
    name: "admin",
    path: "admin",
    segments: ["admin"],
    protected: true,
    parent: null,
    children: {}
  };
  const inspect = {
    name: "inspect",
    path: "admin/[id]/inspect",
    segments: ["admin", "[id]", "inspect"],
    protected: false,
    parent: admin,
    children: {},
    options: {},
    args: []
  };
  admin.children.inspect = inspect;
  ctx.commands = { admin };
  return { ctx, inspect };
}

test("executed state builtin rejects unauthenticated handlers and accepts authenticated/public handlers", async t => {
  const { state, auth } = await executeRenderedState(t, context());
  let handlerCalls = 0;
  const handler = () => {
    handlerCalls++;
  };
  await assert.rejects(
    state.withGlobal(() =>
      state.withCommand("deploy", ["deploy"], [], handler)
    ),
    /Login required/
  );
  assert.equal(handlerCalls, 0);
  assert.equal(auth.authChecks(), 1);

  assert.deepEqual(
    await state.withGlobal(() =>
      state.withCommand("public", ["public"], [], handler)
    ),
    { error: null }
  );
  assert.equal(handlerCalls, 1);
  assert.equal(
    auth.authChecks(),
    1,
    "public commands must not consult authentication"
  );

  auth.authenticate();
  assert.deepEqual(
    await state.withGlobal(() =>
      state.withCommand("deploy", ["deploy"], [], handler)
    ),
    { error: null }
  );
  assert.equal(handlerCalls, 2);
  assert.equal(auth.authChecks(), 2);
});

test("executed state builtin without the plugin rejects protected handlers", async t => {
  const ctx = context();
  delete ctx.config.auth;
  const { state, auth } = await executeRenderedState(t, ctx);
  let called = false;
  await assert.rejects(
    state.withGlobal(() =>
      state.withCommand("deploy", ["deploy"], [], () => {
        called = true;
      })
    ),
    /@shell-shock\/plugin-auth/
  );
  assert.equal(called, false);
  assert.equal(auth.authChecks(), 0);
  assert.deepEqual(
    await state.withGlobal(() =>
      state.withCommand("public", ["public"], [], () => {
        called = true;
      })
    ),
    { error: null }
  );
  assert.equal(
    called,
    true,
    "public commands remain executable without the auth plugin"
  );
});

// A full preset-script import currently reaches an unrelated undeclared
// @deepkit/type dependency through the core utility barrel. Exercise the actual
// rendered shared execution boundary with the same static path/runtime segments
// used by the preset's CommandInvocation, without bypassing the auth guard.
test("executed state builtin preserves inherited protection for a dynamic route", async t => {
  const { ctx, inspect } = inheritedCommandContext();
  const { state, auth } = await executeRenderedState(t, ctx);
  let called = false;
  const handler = () => {
    called = true;
    assert.equal(state.usePath(), "admin/[id]/inspect");
    assert.deepEqual(state.useSegments(), ["admin", "resource-123", "inspect"]);
  };
  const invoke = () =>
    state.withGlobal(() =>
      state.withCommand(
        inspect.path,
        ["admin", "resource-123", "inspect"],
        [],
        handler
      )
    );
  await assert.rejects(invoke(), /Login required/);
  assert.equal(
    called,
    false,
    "an explicit protected:false child must remain guarded by its parent"
  );
  auth.authenticate();
  assert.deepEqual(await invoke(), { error: null });
  assert.equal(called, true);
});
