import type { OutputDirectory, OutputFile } from "@alloy-js/core";
import { Output, render } from "@alloy-js/core";
import { createComponent } from "@alloy-js/core/jsx-runtime";
import { MetaContext } from "@power-plant/alloy-js/core/contexts/meta";
import { PowerlinesContext } from "@powerlines/plugin-alloy/core/contexts/context";
import assert from "node:assert/strict";
import { test } from "node:test";
import { HelpCommand } from "../../src/components/help-command";

test("HelpCommand imports prefixed builtins and calls the matching aliases", () => {
  const output = render(
    createComponent(Output, {
      children: createComponent(MetaContext.Provider, {
        value: {},
        children: createComponent(PowerlinesContext.Provider, {
          value: {
            entryPath: ".shell-shock/entry",
            config: { framework: { name: "shell-shock" } }
          } as never,
          children: createComponent(HelpCommand, {
            commands: [["search-tokens"], ["completions", "bash"]]
          })
        })
      })
    })
  );
  const findFile = (directory: OutputDirectory): OutputFile | undefined => {
    for (const item of directory.contents) {
      if (item.kind === "file" && item.path.endsWith("help/command.ts")) {
        return item;
      }
      if (item.kind === "directory") {
        const found = findFile(item);
        if (found) return found;
      }
    }
    return undefined;
  };
  const file = findFile(output);

  assert.equal(file?.kind, "file");
  if (file?.kind !== "file" || !("contents" in file)) {
    throw new Error("HelpCommand did not render a source file");
  }

  const builtinPaths = [...file.contents.matchAll(/from "([^"]+)";/g)]
    .map(([, path]) => path ?? "")
    .filter(path => !path.startsWith("node:"));
  assert.deepEqual(builtinPaths, [
    "shell-shock:help/search-tokens",
    "shell-shock:help/completions/bash",
    "shell-shock:help",
    "shell-shock:console"
  ]);

  const importedAliases = [
    ...file.contents.matchAll(/showHelp(?: as (showHelp\w+))?/g)
  ].map(([, alias]) => alias ?? "showHelp");
  const calledNames = [...file.contents.matchAll(/\b(showHelp\w*)\(\)/g)].map(
    ([, name]) => name
  );
  assert.deepEqual(calledNames, [
    "showHelpSearchTokens",
    "showHelpCompletionsBash",
    "showHelp"
  ]);
  assert.equal(
    calledNames.every(name => importedAliases.includes(name)),
    true
  );
});
