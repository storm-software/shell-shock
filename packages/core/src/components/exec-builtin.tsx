/* -------------------------------------------------------------------

                  ⚡ Storm Software - Shell Shock

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

import { code, Show, splitProps } from "@alloy-js/core";
import {
  FunctionDeclaration,
  InterfaceDeclaration,
  InterfaceMember,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";

import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocParam,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import defu from "defu";

export interface ExecBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {}

/**
 * A built-in module for handling command execution in Shell Shock.
 */
export function ExecBuiltin(props: ExecBuiltinProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  return (
    <BuiltinFile
      id="exec"
      description="A module to handle command execution in a Shell Shock application."
      {...rest}
      imports={defu(rest.imports ?? {}, {
        "node:path": ["basename", "extname", "dirname", "join"],
        "node:fs": ["existsSync"],
        "node:child_process": [
          { name: "spawn", alias: "_spawn" },
          "execFileSync"
        ],
        "node:stream": [{ name: "Stream", default: true, type: true }]
      })}
      builtinImports={defu(rest.builtinImports ?? {}, {
        env: ["isWindows"]
      })}>
      <FunctionDeclaration
        name="resolveCommandEnv"
        parameters={[
          {
            name: "params",
            type: "{ argv: string[]; env?: NodeJS.ProcessEnv; baseEnv?: NodeJS.ProcessEnv; }"
          }
        ]}
        returnType="NodeJS.ProcessEnv">
        {code`const baseEnv = params.baseEnv ?? process.env;
const argv = params.argv;
const shouldSuppressNpmFund = (() => {
  const cmd = basename(argv[0] ?? "");
  if (cmd === "npm" || cmd === "npm.cmd" || cmd === "npm.exe") {
    return true;
  }
  if (cmd === "node" || cmd === "node.exe") {
    const script = argv[1] ?? "";

    return script.includes("npm-cli.js");
  }
  return false;
})();

const mergedEnv = params.env ? { ...baseEnv, ...params.env } : { ...baseEnv };
const resolvedEnv = Object.fromEntries(
  Object.entries(mergedEnv)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)])
);
if (shouldSuppressNpmFund) {
  resolvedEnv.NPM_CONFIG_FUND ??= "false";
  resolvedEnv.npm_config_fund ??= "false";
}
return resolvedEnv;`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="isWindowsBatchCommand"
        parameters={[{ name: "resolvedCommand", type: "string" }]}
        returnType="boolean">
        {code`if (!isWindows) {
  return false;
}
const ext = extname(resolvedCommand).toLowerCase();

return ext === ".cmd" || ext === ".bat";`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="escapeForCmdExe"
        parameters={[{ name: "arg", type: "string" }]}
        returnType="string">
        {code`if (/[&|<>^%\\\\r\\\\n]/.test(arg)) {
  throw new Error(
    \`Unsafe Windows cmd.exe argument detected: \${JSON.stringify(arg)}. \` +
      "Pass an explicit shell-wrapper argv at the call site instead."
  );
}
if (!arg.includes(" ") && !arg.includes('"')) {
  return arg;
}
return \`"\${arg.replace(/"/g, '""')}"\`;`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="buildCmdExeCommandLine"
        parameters={[
          { name: "resolvedCommand", type: "string" },
          { name: "args", type: "string[]" }
        ]}
        returnType="string">
        {code`return [escapeForCmdExe(resolvedCommand), ...args.map(escapeForCmdExe)].join(
  " "
);`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="resolveNpmArgvForWindows"
        doc="On Windows, Node 18.20.2+ (CVE-2024-27980) rejects spawning .cmd/.bat directly without shell, causing EINVAL. Resolve npm/npx to node + cli script so we spawn node.exe instead of npm.cmd."
        parameters={[{ name: "argv", type: "string[]" }]}
        returnType="string[] | null">
        {code`if (!isWindows || argv.length === 0) {
  return null;
}
const base = basename(argv[0] ?? "")
  .toLowerCase()
  .replace(/\.(?:cmd|exe|bat)$/, "");
const cliName =
  base === "npx" ? "npx-cli.js" : base === "npm" ? "npm-cli.js" : null;
if (!cliName) {
  return null;
}
const nodeDir = dirname(process.execPath);
const cliPath = join(nodeDir, "node_modules", "npm", "bin", cliName);
if (!existsSync(cliPath)) {
  const command = argv[0] ?? "";
  const ext = extname(command).toLowerCase();
  const shimmedCommand = ext ? command : \`\${command}.cmd\`;

  return [shimmedCommand, ...argv.slice(1)];
}
return [process.execPath, cliPath, ...argv.slice(1)];`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="resolveCommand"
        doc="Resolves a command for Windows compatibility. On Windows, non-.exe commands (like pnpm, yarn) are resolved to .cmd; npm/npx are handled by resolveNpmArgvForWindows to avoid spawn EINVAL (no direct .cmd)."
        parameters={[{ name: "command", type: "string" }]}
        returnType="string">
        {code`if (!isWindows) {
  return command;
}
const base = basename(command).toLowerCase();
if (extname(base)) {
  return command;
}
if (["pnpm", "yarn"].includes(base)) {
  return \`\${command}.cmd\`;
}
return command;`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="resolveCommandStdio"
        parameters={[
          {
            name: "params",
            type: "{ hasInput: boolean; preferInherit: boolean; }"
          }
        ]}
        returnType='["pipe" | "inherit" | "ignore", "pipe", "pipe"]'>
        {code`const stdin = params.hasInput
  ? "pipe"
  : params.preferInherit
    ? "inherit"
    : "pipe";

return [stdin, "pipe", "pipe"];`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="resolveProcessExitCode"
        parameters={[
          {
            name: "params",
            type: "{ explicitCode: number | null | undefined; childExitCode: number | null | undefined; resolvedSignal: NodeJS.Signals | null; usesWindowsExitCodeShim: boolean; timedOut: boolean; noOutputTimedOut: boolean; killIssuedByTimeout: boolean; }"
          }
        ]}
        returnType="number | null">
        {code`return (
  params.explicitCode ??
  params.childExitCode ??
  (params.usesWindowsExitCodeShim &&
  params.resolvedSignal == null &&
  !params.timedOut &&
  !params.noOutputTimedOut &&
  !params.killIssuedByTimeout
    ? 0
    : null)
);`}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="shouldSpawnWithShell"
        parameters={[
          {
            name: "params",
            type: "{ resolvedCommand: string; platform: NodeJS.Platform; }"
          }
        ]}
        returnType="boolean">
        {code`// SECURITY: never enable \`shell\` for argv-based execution.
// \`shell\` routes through cmd.exe on Windows, which turns untrusted argv values
// (like chat prompts passed as CLI args) into command-injection primitives.
// If you need a shell, use an explicit shell-wrapper argv (e.g. \`cmd.exe /c ...\`)
// and validate/escape at the call site.
void params;
return false;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="The result of a spawn operation." />
      <InterfaceDeclaration export name="SpawnResult">
        <TSDoc heading="The PID of the spawned child process, if available." />
        <InterfaceMember name="pid" optional type="number" />
        <Spacing />
        <TSDoc heading="The standard output produced by the child process." />
        <InterfaceMember name="stdout" type="string" />
        <Spacing />
        <TSDoc heading="The standard error produced by the child process." />
        <InterfaceMember name="stderr" type="string" />
        <Spacing />
        <TSDoc heading="The exit code of the child process, if available." />
        <InterfaceMember name="code" type="number | null" />
        <Spacing />
        <TSDoc heading="The signal that caused the child process to terminate, if it was killed by a signal." />
        <InterfaceMember name="signal" type="NodeJS.Signals | null" />
        <Spacing />
        <TSDoc heading="Whether the child process was killed." />
        <InterfaceMember name="killed" type="boolean" />
        <Spacing />
        <TSDoc heading="The reason for the child process termination." />
        <InterfaceMember
          name="termination"
          type={code`"exit" | "timeout" | "no-output-timeout" | "signal"`}
        />
        <Spacing />
        <TSDoc heading="Whether the child process timed out due to no output." />
        <InterfaceMember name="noOutputTimedOut" optional type="boolean" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Options for spawning a child process." />
      <InterfaceDeclaration export name="SpawnOptions">
        <TSDoc heading="The timeout in milliseconds for the spawn operation. If the process runs longer than this, it will be killed and the spawn promise will reject. This can also be provided as a number directly to the spawn function for convenience. Providing \`-1\` will disable the timeout.">
          <TSDocDefaultValue
            type={ReflectionKind.number}
            defaultValue="300000"
          />
        </TSDoc>
        <InterfaceMember name="timeoutMs" type="number" />
        <Spacing />
        <TSDoc heading="The current working directory of the child process." />
        <InterfaceMember name="cwd" optional type="string" />
        <Spacing />
        <TSDoc heading="The input to be passed to the child process." />
        <InterfaceMember name="input" optional type="string" />
        <Spacing />
        <TSDoc heading="The environment variables for the child process." />
        <InterfaceMember name="env" optional type="NodeJS.ProcessEnv" />
        <Spacing />
        <TSDoc heading="Whether to pass arguments to the child process verbatim on Windows." />
        <InterfaceMember
          name="windowsVerbatimArguments"
          optional
          type="boolean"
        />
        <Spacing />
        <TSDoc heading="The timeout in milliseconds for the child process to produce output on stdout or stderr. If the process produces no output for this duration, it will be killed and the spawn promise will reject with a no-output-timeout termination reason." />
        <InterfaceMember name="noOutputTimeoutMs" optional type="number" />
      </InterfaceDeclaration>
      <Spacing />
      <VarDeclaration
        const
        name="WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS"
        initializer={code`250`}
      />
      <Spacing />
      <VarDeclaration
        const
        name="WINDOWS_CLOSE_STATE_POLL_MS"
        initializer={code`10`}
      />
      <Spacing />
      <TSDoc heading="Spawns a child process with the given arguments and options, returning a promise that resolves with the result of the spawn operation.">
        <TSDocParam name="argv">
          {"The command and its arguments to spawn."}
        </TSDocParam>
        <TSDocParam name="optionsOrTimeoutMs">
          {`The options for spawning the command, or a number representing the timeout in milliseconds. This allows for a convenient shorthand when only a timeout is needed. Providing \`-1\` will disable the timeout. If no options or timeout are provided, a default timeout of 5 minutes will be used.`}
        </TSDocParam>
        <TSDocReturns>
          {
            "A promise that resolves with the result of the spawn operation, including stdout, stderr, exit code, signal, and termination reason."
          }
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="spawn"
        parameters={[
          { name: "argv", type: "string[]" },
          {
            name: "optionsOrTimeoutMs",
            type: "number | SpawnOptions",
            default: "300000"
          }
        ]}
        returnType="Promise<SpawnResult>">
        {code`const options: SpawnOptions =
  typeof optionsOrTimeoutMs === "number"
    ? { timeoutMs: optionsOrTimeoutMs }
    : optionsOrTimeoutMs;
const { timeoutMs, cwd, input, env, noOutputTimeoutMs } = options;
const hasInput = input !== undefined;
const resolvedEnv = resolveCommandEnv({ argv, env });
const stdio = resolveCommandStdio({ hasInput, preferInherit: true });

const finalArgv =
  isWindows
    ? (resolveNpmArgvForWindows(argv) ?? argv)
    : argv;
const resolvedCommand =
  finalArgv !== argv
    ? (finalArgv[0] ?? "")
    : resolveCommand(argv[0] ?? "");
const useCmdWrapper = isWindowsBatchCommand(resolvedCommand);

const child = _spawn(
  useCmdWrapper
    ? (process.env.ComSpec ?? "cmd.exe")
    : resolvedCommand,
  useCmdWrapper
    ? [
        "/d",
        "/s",
        "/c",
        buildCmdExeCommandLine(resolvedCommand, finalArgv.slice(1))
      ]
    : finalArgv.slice(1), {
  stdio,
  cwd,
  env: resolvedEnv,
  windowsHide: true,
  windowsVerbatimArguments: useCmdWrapper
    ? true
    : options.windowsVerbatimArguments,
  ...(shouldSpawnWithShell({
    resolvedCommand: useCmdWrapper
      ? (process.env.ComSpec ?? "cmd.exe")
      : resolvedCommand,
    platform: process.platform
  })
    ? { shell: true }
    : {})
});

return new Promise((resolve, reject) => {
  let stdout = "";
  let stderr = "";
  let settled = false;
  let timedOut = false;
  let noOutputTimedOut = false;
  let killIssuedByTimeout = false;
  let childExitState: {
    code: number | null;
    signal: NodeJS.Signals | null;
  } | null = null;
  let closeFallbackTimer: NodeJS.Timeout | null = null;
  let noOutputTimer: NodeJS.Timeout | null = null;
  const shouldTrackOutputTimeout =
    typeof noOutputTimeoutMs === "number" &&
    Number.isFinite(noOutputTimeoutMs) &&
    noOutputTimeoutMs > 0;

  const clearNoOutputTimer = () => {
    if (!noOutputTimer) {
      return;
    }
    clearTimeout(noOutputTimer);
    noOutputTimer = null;
  };

  const clearCloseFallbackTimer = () => {
    if (!closeFallbackTimer) {
      return;
    }
    clearTimeout(closeFallbackTimer);
    closeFallbackTimer = null;
  };

  const killChild = () => {
    if (settled || typeof child?.kill !== "function") {
      return;
    }
    killIssuedByTimeout = true;
    child.kill("SIGKILL");
  };

  const armNoOutputTimer = () => {
    if (!shouldTrackOutputTimeout || settled) {
      return;
    }
    clearNoOutputTimer();
    noOutputTimer = setTimeout(() => {
      if (settled) {
        return;
      }
      noOutputTimedOut = true;
      killChild();
    }, Math.floor(noOutputTimeoutMs));
  };

  const timer = setTimeout(() => {
    timedOut = true;
    killChild();
  }, timeoutMs >= 0 ? timeoutMs : Number.POSITIVE_INFINITY);
  armNoOutputTimer();

  if (hasInput && child.stdin) {
    child.stdin.write(input ?? "");
    child.stdin.end();
  }

  child.stdout?.on("data", (d: Stream) => {
    stdout += d.toString();
    armNoOutputTimer();
  });
  child.stderr?.on("data", (d: Stream) => {
    stderr += d.toString();
    armNoOutputTimer();
  });
  child.on("error", err => {
    if (settled) {
      return;
    }
    settled = true;
    clearTimeout(timer);
    clearNoOutputTimer();
    clearCloseFallbackTimer();
    reject(err);
  });
  child.on("exit", (code, signal) => {
    childExitState = { code, signal };
    if (settled || closeFallbackTimer) {
      return;
    }
    closeFallbackTimer = setTimeout(() => {
      if (settled) {
        return;
      }
      child.stdout?.destroy();
      child.stderr?.destroy();
    }, 250);
  });
  const resolveFromClose = (
    code: number | null,
    signal: NodeJS.Signals | null
  ) => {
    if (settled) {
      return;
    }
    settled = true;
    clearTimeout(timer);
    clearNoOutputTimer();
    clearCloseFallbackTimer();
    const resolvedSignal =
      childExitState?.signal ?? signal ?? child.signalCode ?? null;
    const resolvedCode = resolveProcessExitCode({
      explicitCode: childExitState?.code ?? code,
      childExitCode: child.exitCode,
      resolvedSignal,
      usesWindowsExitCodeShim: isWindows && (useCmdWrapper || finalArgv !== argv),
      timedOut,
      noOutputTimedOut,
      killIssuedByTimeout
    });
    const termination = noOutputTimedOut
      ? "no-output-timeout"
      : timedOut
        ? "timeout"
        : resolvedSignal != null
          ? "signal"
          : "exit";
    const normalizedCode =
      termination === "timeout" || termination === "no-output-timeout"
        ? resolvedCode === 0
          ? 124
          : resolvedCode
        : resolvedCode;
    resolve({
      pid: child.pid ?? undefined,
      stdout,
      stderr,
      code: normalizedCode,
      signal: resolvedSignal,
      killed: child.killed,
      termination,
      noOutputTimedOut
    });
  };
  child.on("close", (code, signal) => {
    if (
      !isWindows ||
      childExitState != null ||
      code != null ||
      signal != null ||
      child.exitCode != null ||
      child.signalCode != null
    ) {
      resolveFromClose(code, signal);
      return;
    }

    const startedAt = Date.now();
    const waitForExitState = () => {
      if (settled) {
        return;
      }
      if (
        childExitState != null ||
        child.exitCode != null ||
        child.signalCode != null
      ) {
        resolveFromClose(code, signal);
        return;
      }
      if (Date.now() - startedAt >= WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS) {
        resolveFromClose(code, signal);
        return;
      }
      setTimeout(waitForExitState, WINDOWS_CLOSE_STATE_POLL_MS);
    };
    waitForExitState();
  });
});`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="A helper function that executes a command and returns its stdout.">
        <TSDocParam name="argv">
          {`The command and its arguments to spawn. This is passed directly to the spawn function. Remember that on Windows, commands like \`npm\` or \`pnpm\` will be resolved to their .cmd shims, so you can just pass \`npm\` without worrying about the extension.`}
        </TSDocParam>
        <TSDocParam name="optionsOrTimeoutMs">
          {`The options for spawning the command, or a number representing the timeout in milliseconds. This is passed directly to the spawn function. Providing \`-1\` will disable the timeout. If no options or timeout are provided, a default timeout of 5 minutes will be used.`}
        </TSDocParam>
        <TSDocReturns>
          {
            "A promise that resolves with the result of the spawn operation if the command exits with code 0, or rejects with an error if the command exits with a non-zero code or if there is a problem spawning the process."
          }
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="exec"
        parameters={[
          { name: "argv", type: "string[]" },
          {
            name: "optionsOrTimeoutMs",
            type: "number | SpawnOptions",
            default: "300000"
          }
        ]}
        returnType="Promise<string>">
        {code`const spawnResult = await spawn(argv, optionsOrTimeoutMs);
          if (spawnResult.code !== 0) {
            throw Object.assign(new Error(
              \`Command "\${argv.join(" ")}" exited with code \${spawnResult.code} and signal \${spawnResult.signal}\`
            ), spawnResult);
          }

          return spawnResult.stdout.trim(); `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="A helper function that executes a command synchronously and returns its stdout. This is a thin wrapper around \`child_process.execFileSync\` with some added Windows compatibility handling.">
        <TSDocParam name="argv">
          {`The command and its arguments to spawn. This is passed directly to \`execFileSync\` after Windows-specific resolution. Remember that on Windows, commands like \`npm\` or \`pnpm\` will be resolved to their .cmd shims, so you can just pass \`npm\` without worrying about the extension.`}
        </TSDocParam>
        <TSDocParam name="options">
          {`The options for spawning the command. This is passed directly to \`execFileSync\` after some processing. The timeout option is supported, but note that it will throw an error if the process runs longer than the specified timeout. If no options are provided, a default timeout of 5 minutes will be used.`}
        </TSDocParam>
        <TSDocReturns>
          {
            "The standard output produced by the command if it exits with code 0. If the command exits with a non-zero code or if there is a problem spawning the process, an error will be thrown."
          }
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="execSync"
        parameters={[
          { name: "argv", type: "string[]" },
          { name: "options", type: "SpawnOptions", optional: true }
        ]}
        returnType="string">
        {code`return execFileSync(argv.length > 0 ? argv[0] : "", argv.slice(1), {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
          timeout: options?.timeoutMs ?? 300000,
          env: options?.env ? resolveCommandEnv({ argv, env: options.env }) : process.env,
          cwd: options?.cwd,
          windowsHide: true,
          windowsVerbatimArguments: options?.windowsVerbatimArguments,
          ...(shouldSpawnWithShell({
            resolvedCommand: argv[0] ?? "",
            platform: process.platform
          })
            ? { shell: true }
            : {})
        }).trim(); `}
      </FunctionDeclaration>
      <Spacing />

      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
