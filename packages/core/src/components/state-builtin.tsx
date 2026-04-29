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

import { code, computed, For, Show, splitProps } from "@alloy-js/core";
import {
  FunctionDeclaration,
  InterfaceDeclaration,
  InterfaceMember,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocInternal,
  TSDocLink,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import defu from "defu";
import { computedOptions } from "../contexts/options";
import { getAppBin } from "../plugin-utils";
import { getAppTitle } from "../plugin-utils/context-helpers";
import type { Context } from "../types";
import { OptionsMember, OptionsParserLogic } from "./options-parser-logic";

export function GlobalTypeDefinitions() {
  const context = usePowerlines<Context>();

  const options = computed(() => computedOptions(context.globalOptions));

  return (
    <>
      <TSDoc
        heading={`An object representing the global options available for every command in the ${getAppTitle(
          context,
          true
        )} command-line application.`}
      />
      <InterfaceDeclaration export name="GlobalOptions">
        <For each={Object.values(options.value)} hardline>
          {option => <OptionsMember option={option} />}
        </For>
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="The context object for the current command execution, containing the command path and segments." />
      <InterfaceDeclaration
        export
        name="CommandContext"
        typeParameters={[
          {
            name: "THandler",
            extends: "(...params: any[]) => any",
            default: "any"
          }
        ]}>
        <TSDoc
          heading={`The full command path as a string. For example, if the user runs \`${getAppBin(
            context
          )} foo bar\`, this would be \`foo bar\`. This is useful for commands that need to know their full invocation path, such as for help text or for commands that have dynamic behavior based on their position in the command hierarchy.`}
        />
        <InterfaceMember name="path" type="string" />
        <Spacing />
        <TSDoc
          heading={`An array of command path segments. For example, if the user runs \`${getAppBin(
            context
          )} foo bar\`, this would be \`["foo", "bar"]\`. This is useful for commands that need to know their individual path segments, such as for dynamic routing or for commands that have behavior based on specific segments in the command hierarchy.`}
        />
        <InterfaceMember name="segments" type="string[]" />
        <Spacing />
        <TSDoc
          heading={`The parameters for the current command's handler function.`}
        />
        <InterfaceMember name="params" type="Parameters<THandler>" />
      </InterfaceDeclaration>
      <Spacing />
      <TypeDeclaration export name="GlobalContextStatus">
        {code`"initializing" | "preparing" | "executing" | "completed"`}
      </TypeDeclaration>
      <Spacing />
      <TSDoc
        heading={`The state object for the ${getAppTitle(context)} application context.`}
      />
      <InterfaceDeclaration export name="GlobalContextState">
        <TSDoc heading="The unique identifier for the current execution context." />
        <InterfaceMember name="executionId" type="string" />
        <Spacing />
        <TSDoc heading="The status of the current execution context." />
        <InterfaceMember name="status" type="GlobalContextStatus" />
        <Spacing />
        <TSDoc heading="Indicates whether the current execution context has encountered an error." />
        <InterfaceMember name="isError" type="boolean" />
        <Spacing />
        <TSDoc heading="A map containing arbitrary data associated with the current execution context." />
        <InterfaceMember name="meta" type="Map<string, unknown>" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc
        heading={`The context object for the ${getAppTitle(context)} application.`}
      />
      <InterfaceDeclaration export name="GlobalContext">
        <TSDoc heading="The global options shared across all commands in the application." />
        <InterfaceMember name="options" type="GlobalOptions" />
        <Spacing />
        <TSDoc heading="The raw command-line arguments passed to the application." />
        <InterfaceMember name="inputArgs" type="string[]" />
        <Spacing />
        <TSDoc heading="The state of the current execution context." />
        <InterfaceMember name="state" type="GlobalContextState" />
      </InterfaceDeclaration>
    </>
  );
}

/**
 * Generates utilities for detecting terminal color support.
 */
export function ArgsUtilities() {
  return (
    <>
      <TSDoc heading="Retrieves the command-line arguments from Deno or Node.js environments.">
        <TSDocRemarks>
          {`This function is only intended for internal use. Please use \`useArgs()\` instead.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocInternal />
        <Spacing />
        <TSDocReturns>
          {`An array of command-line arguments from Deno or Node.js environments.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration name="getInputArgs" returnType="string[]">
        {code`return ((globalThis as { Deno?: { args: string[] } })?.Deno?.args ?? process.argv ?? []) as string[];`}
      </FunctionDeclaration>
    </>
  );
}

export function ContextUtilities() {
  const context = usePowerlines<Context>();

  const options = computed(() =>
    Object.fromEntries(
      context.globalOptions.map(option => [option.name, option])
    )
  );

  return (
    <>
      <Spacing />

      <TSDoc
        heading={`The global ${getAppTitle(context)} application context store instance.`}>
        <TSDocInternal />
      </TSDoc>
      <VarDeclaration export const name="unstable_globalStore">
        {code`  new AsyncLocalStorage<GlobalContext>({ name: "globalStore" }); `}
      </VarDeclaration>
      <Spacing />
      <TSDoc
        heading={`Get the ${getAppTitle(
          context
        )} application context for the current application.`}>
        <TSDocReturns>
          {`The ${getAppTitle(
            context
          )} application context for the current application or undefined if the context is not available.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="useGlobal" returnType="GlobalContext">
        {code`return unstable_globalStore.getStore() as GlobalContext;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility hook function to get the command-line arguments from the ${getAppTitle(
          context
        )} application context.`}>
        <TSDocReturns>
          {"An array of command-line arguments from the application context."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="useArgs" returnType="string[]">
        {code`return useGlobal()?.inputArgs ?? getInputArgs();`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility hook function to get the command-line global options from the ${getAppTitle(
          context
        )} application context.`}>
        <TSDocReturns>
          {
            "An object containing the global options from the application context."
          }
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="useGlobalOptions"
        returnType="GlobalOptions">
        {code`return useGlobal()?.options ?? {};`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility hook function to get the state of the ${getAppTitle(
          context
        )} application context.`}>
        <TSDocReturns>{"The state of the application context."}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="useState"
        returnType="GlobalContextState">
        {code`return useGlobal()?.state;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility function to update the state of the ${getAppTitle(
          context
        )} application context.`}>
        <TSDocRemarks>
          {`This function will throw an error if the global context is not available, so it should only be used within a valid context scope, such as within a command handler or within the \`withGlobal()\` function.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="update">
          {`The new state or a function that receives the previous state and returns the new state. This allows for both direct state updates and functional updates based on the previous state.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="setState"
        parameters={[
          {
            name: "update",
            type: "Partial<GlobalContextState> | ((prev: GlobalContextState) => GlobalContextState)"
          }
        ]}>
        {code`const prev = useGlobal()?.state;
        if (!prev) {
          throw new Error(
            \`The ${getAppTitle(
              context
            )} application context is not available. Make sure to call setState() within a valid context scope.\`
          );
        }

        useGlobal().state = typeof update === "function" ? update(prev) : { ...prev, ...update }; `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility hook function to get the execution ID of the ${getAppTitle(
          context
        )} application context.`}>
        <TSDocReturns>
          {"The execution ID of the application context."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="useExecutionId" returnType="string">
        {code`return useState().executionId;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility hook function to get the metadata of the ${getAppTitle(
          context
        )} application context.`}>
        <TSDocReturns>
          {"The metadata of the application context."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="useMeta"
        returnType="Map<string, unknown>">
        {code`return useState().meta;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility hook function to get the current status of the ${getAppTitle(
          context
        )} application.`}>
        <TSDocReturns>{"The current status of the application."}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="useStatus"
        returnType="GlobalContextStatus">
        {code`return useState().status;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`The global ${getAppTitle(context)} - command context store instance.`}>
        <TSDocInternal />
      </TSDoc>
      <VarDeclaration export name="unstable_commandStore">
        {code`new AsyncLocalStorage<CommandContext>({ name: "commandStore" });`}
      </VarDeclaration>
      <Spacing />
      <TSDoc
        heading={`Get the ${getAppTitle(context)} - command context for the current application.`}>
        <TSDocReturns>
          {`The ${getAppTitle(context)} - command context for the current application.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="useCommand" returnType="CommandContext">
        {code`const result = unstable_commandStore.getStore();
if (!result) {
  throw new Error(
    \`The ${getAppTitle(context)} - command context is not available. Make sure to call useCommand() within a valid context scope.\`
  );
}
return result;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="A utility hook function to get the individual segments of the current command path.">
        <TSDocReturns>{"An array of command path segments."}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="useSegments" returnType="string[]">
        {code`return useCommand().segments;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="A utility hook function to get the full command path as a string.">
        <TSDocReturns>
          {`The full command path as a string. For example, if the user runs \`${getAppBin(
            context
          )} foo bar\`, this would return \`"foo bar"\`. This is useful for commands that need to know their full invocation path, such as for help text or for commands that have dynamic behavior based on their position in the command hierarchy.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="usePath" returnType="string">
        {code`return useCommand().path;`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Checks if a specific flag is present in the command-line arguments.">
        <TSDocLink>
          {"https://github.com/sindresorhus/has-flag/blob/main/index.js"}
        </TSDocLink>
        <TSDocParam name="flag">
          {
            'The flag (or an array of flags/aliases) to check for, e.g., "color", "no-color".'
          }
        </TSDocParam>
        <TSDocParam name="argv">
          {
            "The command-line arguments to check against. Defaults to global Deno args or process args."
          }
        </TSDocParam>
        <TSDocReturns>
          {"True if the flag is present, false otherwise."}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="hasFlag"
        parameters={[
          { name: "flag", type: "string | string[]" },
          {
            name: "argv",
            type: "string[]",
            default: "useArgs()"
          }
        ]}>
        <VarDeclaration
          const
          name="position"
          type="number"
          initializer={code`(Array.isArray(flag) ? flag : [flag]).reduce((ret, f) => {
            const pos = argv.findIndex(arg => (f.startsWith("-") ? "" : (f.length === 1 ? "-" : "--") + f)?.toLowerCase() === arg?.toLowerCase() || arg?.toLowerCase().startsWith((f.length === 1 ? "-" : "--") + f + "="));
            return pos !== -1 ? pos : ret;
          }, -1);`}
        />
        <hbr />
        {code`return position !== -1 && argv.indexOf("--") === -1 || position < argv.indexOf("--");`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="A utility function to determine if the help flag is present or if the command is in an error state during preparation.">
        <TSDocReturns>
          {`True if the help flag is present or if the command is in an error state during preparation, false otherwise. This can be used to conditionally display help text or to alter command behavior when the user is likely seeking help.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration export name="isHelp" returnType="boolean">
        {code`return !isCI && (hasFlag(["help", "h", "?"]) || (useStatus() === "preparing" && useState().isError)); `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility function to wrap the ${getAppTitle(
          context
        )} application within the global context scope.`}>
        <TSDocParam name="handler">
          {`The callback function to run within the global context scope. This function will receive the global context as its argument, allowing it to access any properties or utilities defined on the context. The callback function can be asynchronous and can return a value or a promise.`}
        </TSDocParam>
        <TSDocReturns>
          {`The result of the callback function, which can be a value or a promise that resolves to a value.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="withGlobal"
        parameters={[{ name: "handler", type: "() => any" }]}
        returnType="Promise<void>">
        <VarDeclaration
          const
          name="args"
          initializer={code`getInputArgs(); `}
        />
        <Spacing />
        <OptionsParserLogic
          options={options.value}
          appSpecificEnvPrefix={context.config.appSpecificEnvPrefix}
          isCaseSensitive={context.config.isCaseSensitive}
        />
        <Spacing />
        {code`
        return unstable_globalStore.run({ options, inputArgs: args, state: { executionId: randomUUID(), status: "initializing", isError: false, meta: new Map() } as GlobalContextState }, handler);`}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc
        heading={`A utility function to wrap a ${getAppTitle(
          context
        )} application command handler within the command context scope.`}>
        <TSDocParam name="handler">
          {`The callback function to run within the command context scope. This function will receive the command context as its argument, allowing it to access any properties or utilities defined on the context. The callback function can be asynchronous and can return a value or a promise.`}
        </TSDocParam>
        <TSDocReturns>
          {`The result of the callback function, which can be a value or a promise that resolves to a value.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="withCommand"
        typeParameters={[
          {
            name: "THandler",
            extends: "(this: CommandContext, ...params: any[]) => any",
            default: "(this: CommandContext, ...params: any[]) => any"
          }
        ]}
        parameters={[
          { name: "path", type: "string" },
          { name: "segments", type: "string[]" },
          { name: "params", type: "Parameters<THandler>" },
          { name: "handler", type: "THandler" }
        ]}
        returnType="Promise<{ error: string | Error | null }>">
        {code`setState({ status: "preparing", isError: false });

        const ctx = { path, segments, params } as CommandContext<THandler>;
        const result = await Promise.resolve(unstable_commandStore.run(ctx, () => Reflect.apply(handler, ctx, params)));
        if (result instanceof Error || (typeof result === "object" && ((result as { error: unknown }).error instanceof Error || typeof (result as { error: unknown }).error === "string"))) {
          setState({ status: "completed", isError: true });
          return { error: result instanceof Error ? result : (result as { error: Error | string }).error };
        }

        setState({ status: "completed", isError: false });
        return { error: null }; `}
      </FunctionDeclaration>
    </>
  );
}

export interface StateBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {}

/**
 * A built-in module for handling application state utilities in Shell Shock.
 */
export function StateBuiltin(props: StateBuiltinProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  return (
    <BuiltinFile
      id="state"
      description="A module that provides context hooks and utilities for accessing the application state."
      {...rest}
      imports={defu(rest.imports ?? {}, {
        "node:async_hooks": ["AsyncLocalStorage"],
        "node:crypto": ["randomUUID"]
      })}
      builtinImports={defu(rest.builtinImports ?? {}, {
        env: ["isCI", "env"]
      })}>
      <GlobalTypeDefinitions />
      <Spacing />
      <ArgsUtilities />
      <Spacing />
      <ContextUtilities />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
