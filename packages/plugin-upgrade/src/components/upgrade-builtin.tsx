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
  ElseClause,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import {
  InterfaceMember,
  TSDoc,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns,
  TypeDeclaration
} from "@powerlines/plugin-alloy/typescript";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import defu from "defu";

/**
 * The `locatePackageJson` handler function declaration code for the Shell Shock project.
 */
export function LocatePackageJsonFunctionDeclaration() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="LocatePackageJsonOptions"
        doc="Options for the `locatePackageJson` handler function.">
        <InterfaceMember
          name="cwd"
          optional
          type="string"
          doc="The current working directory to use. If not provided, the process's current working directory will be used."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Locate the package.json file currently being used by the command-line/workspace.">
        <TSDocRemarks>
          {`This function is used to determine the package.json file currently being used by the command-line/workspace. It can be used in the CLI upgrade command to check if the application is using npm, yarn, or another package manager.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="options">
          {`The options for the \`locatePackageJson\` function. Currently, there are no options available, but this parameter is included for future extensibility.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves to the package.json file currently being used by the command-line/workspace as a string.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="locatePackageJson"
        parameters={[
          {
            name: "options",
            type: "LocatePackageJsonOptions",
            default: "{}"
          }
        ]}
        returnType="string | undefined">
        <VarDeclaration
          let
          name="currentPath"
          type="string"
          initializer={code`options.cwd ?? process.cwd(); `}
        />
        <hbr />
        <VarDeclaration
          let
          name="parentPath"
          initializer={code`resolve(currentPath, ".."); `}
        />
        <Spacing />
        {code`while (parentPath !== currentPath && currentPath !== homePath && currentPath !== tempPath) { `}
        <IfStatement
          condition={code`existsSync(join(currentPath, "package.json"))`}>
          {code`return join(currentPath, "package.json"); `}
        </IfStatement>
        <ElseClause>
          {code`currentPath = pathParent;
          parentPath = resolve(currentPath, ".."); `}
        </ElseClause>
        {code` }

        return undefined; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `locateLockfile` handler function declaration code for the Shell Shock project.
 */
export function LocateLockfileFunctionDeclaration() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="LocateLockfileOptions"
        doc="Options for the `locateLockfile` handler function.">
        <InterfaceMember
          name="cwd"
          optional
          type="string"
          doc="The current working directory to use. If not provided, the process's current working directory will be used."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Locate the lockfile currently being used by the command-line/workspace.">
        <TSDocRemarks>
          {`This function is used to determine the lockfile currently being used by the command-line/workspace. It can be used in the CLI upgrade command to check if the application is using npm, yarn, or another package manager.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="options">
          {`The options for the \`locateLockfile\` function. Currently, there are no options available, but this parameter is included for future extensibility.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves to the lockfile currently being used by the command-line/workspace as a string.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="locateLockfile"
        parameters={[
          {
            name: "options",
            type: "LocateLockfileOptions",
            default: "{}"
          }
        ]}
        returnType="string | undefined">
        <VarDeclaration
          let
          name="currentPath"
          type="string"
          initializer={code`options.cwd ?? process.cwd(); `}
        />
        <hbr />
        <VarDeclaration
          let
          name="parentPath"
          initializer={code`resolve(currentPath, ".."); `}
        />
        <Spacing />
        {code`while (parentPath !== currentPath && currentPath !== homePath && currentPath !== tempPath) { `}
        <VarDeclaration
          const
          name="lockfile"
          initializer={code`[
            "package-lock.json",
            "npm-shrinkwrap.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            "pnpm-workspace.yaml",
            "deno.lock",
            "deno.json",
            "deno.jsonc",
            "bun.lock",
            "bun.lockb"
          ].find(lf => existsSync(join(currentPath, lf))); `}
        />
        <hbr />
        <IfStatement condition={code`lockfile`}>
          {code`return lockfile; `}
        </IfStatement>
        <ElseClause>
          {code`currentPath = pathParent;
          parentPath = resolve(currentPath, ".."); `}
        </ElseClause>
        {code` }

        return undefined; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `getPackageManager` handler function declaration code for the Shell Shock project.
 */
export function GetPackageManagerFunctionDeclaration() {
  return (
    <>
      <TypeDeclaration
        export
        name="GetPackageManagerOptions"
        doc="Options for the `getPackageManager` handler function.">{code`LocateLockfileOptions;`}</TypeDeclaration>
      <Spacing />
      <TSDoc heading="Get the package manager currently being used by the command-line/workspace.">
        <TSDocRemarks>
          {`This function is used to determine the package manager currently being used by the command-line/workspace. It can be used in the CLI upgrade command to check if the application is using npm, yarn, or another package manager.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="options">
          {`The options for the \`getPackageManager\` function. Currently, there are no options available, but this parameter is included for future extensibility.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves to the package manager currently being used by the command-line/workspace as a string.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="getPackageManager"
        parameters={[
          {
            name: "options",
            type: "GetPackageManagerOptions",
            default: "{}"
          }
        ]}
        returnType={code`Promise<"npm" | "yarn" | "deno" | "pnpm" | "bun">`}>
        <VarDeclaration
          const
          name="userAgent"
          type="string"
          initializer={code`process.env.npm_config_user_agent ?? ""; `}
        />
        <hbr />
        <VarDeclaration
          const
          name="execPath"
          type="string"
          initializer={code`process.env.npm_execpath ?? ""; `}
        />
        <Spacing />
        <IfStatement
          condition={code`userAgent.startsWith("yarn") || execPath.includes("yarn")`}>
          {code`return "yarn"; `}
        </IfStatement>
        <ElseIfClause
          condition={code`userAgent.startsWith("pnpm") || execPath.includes("pnpm")`}>
          {code`return "pnpm"; `}
        </ElseIfClause>
        <ElseIfClause
          condition={code`userAgent.startsWith("bun") || execPath.includes("bun") || typeof Bun !== "undefined" || process.versions.bun`}>
          {code`return "bun"; `}
        </ElseIfClause>
        <ElseClause>
          <VarDeclaration
            const
            name="lockfilePath"
            initializer={code`locateLockfile(options); `}
          />
          <Spacing />
          <IfStatement condition={code`lockfilePath === "yarn.lock"`}>
            {code`return "yarn"; `}
          </IfStatement>
          <ElseIfClause
            condition={code`lockfilePath === "deno.lock" || lockfilePath === "deno.json" || lockfilePath === "deno.jsonc"`}>
            {code`return "deno"; `}
          </ElseIfClause>
          <ElseIfClause
            condition={code`lockfilePath === "pnpm-lock.yaml" || lockfilePath === "pnpm-workspace.yaml"`}>
            {code`return "pnpm"; `}
          </ElseIfClause>
          <ElseIfClause
            condition={code`lockfilePath === "bun.lock" || lockfilePath === "bun.lockb"`}>
            {code`return "bun"; `}
          </ElseIfClause>
          <ElseClause>
            <VarDeclaration
              const
              name="packageJsonPath"
              initializer={code`locatePackageJson(options); `}
            />
            <IfStatement
              condition={code`packageJsonPath && existsSync(packageJsonPath)`}>
              <VarDeclaration
                const
                name="packageJson"
                initializer={code`JSON.parse(await readFile(packageJsonPath, "utf8")); `}
              />
              <IfStatement
                condition={code`packageJson.devEngines?.packageManager?.name && typeof packageJson.devEngines.packageManager.name === "string" && ["npm", "yarn", "pnpm", "deno", "bun"].includes(packageJson.devEngines.packageManager.name)`}>
                {code`return packageJson.devEngines.packageManager.name; `}
              </IfStatement>
              <Spacing />
              <VarDeclaration
                const
                name="dependencies"
                initializer={code`{
                ...packageJson.dependencies,
                ...packageJson.devDependencies,
                ...packageJson.peerDependencies,
                ...packageJson.optionalDependencies,
              }; `}
              />
              <IfStatement
                condition={code`Object.keys(dependencies).some(dep => dep === "yarn" || dep.startsWith("yarn@") || dep === "yarnpkg" || dep.startsWith("yarnpkg@"))`}>
                {code`return "yarn"; `}
              </IfStatement>
              <ElseIfClause
                condition={code`Object.keys(dependencies).some(dep => dep === "bun" || dep.startsWith("bun@"))`}>
                {code`return "bun"; `}
              </ElseIfClause>
              <ElseIfClause
                condition={code`Object.keys(dependencies).some(dep => dep === "pnpm" || dep.startsWith("pnpm@"))`}>
                {code`return "pnpm"; `}
              </ElseIfClause>
              <ElseIfClause
                condition={code`Object.keys(dependencies).some(dep => dep === "deno" || dep.startsWith("deno@"))`}>
                {code`return "deno"; `}
              </ElseIfClause>
            </IfStatement>
            <Spacing />
            {code`return "npm"; `}
          </ElseClause>
        </ElseClause>
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `fetchNpmPackage` handler function declaration code for the Shell Shock project.
 */
export function FetchNpmPackageFunctionDeclaration() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="NpmPackageMaintainer"
        doc="Represents a maintainer of an npm package.">
        <InterfaceMember
          name="email"
          type="string"
          doc="The email of the npm package maintainer."
        />
        <hbr />
        <InterfaceMember
          name="username"
          type="string"
          doc="The username of the npm package maintainer."
        />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="NpmPackageLinks"
        doc="Represents the links of an npm package.">
        <InterfaceMember
          name="homepage"
          type="string"
          optional
          doc="The homepage of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="repository"
          type="string"
          optional
          doc="The repository of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="bugs"
          type="string"
          optional
          doc="The bugs page of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="npm"
          type="string"
          optional
          doc="The npm page of the npm package."
        />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="NpmPackage"
        doc="Represents an npm package.">
        <InterfaceMember
          name="name"
          type="string"
          doc="The name of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="date"
          type="Date"
          doc="The date when the npm package was last updated."
        />
        <hbr />
        <InterfaceMember
          name="version"
          type="string"
          doc="The version of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="description"
          type="string"
          optional
          doc="The description of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="keywords"
          type="string[]"
          doc="A list of keywords associated with the npm package."
        />
        <hbr />
        <InterfaceMember
          name="license"
          type="string"
          optional
          doc="The license of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="maintainers"
          type="NpmPackageMaintainer[]"
          doc="The maintainers of the npm package."
        />
        <hbr />
        <InterfaceMember
          name="links"
          type="NpmPackageLinks"
          doc="The links of the npm package."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="NpmPackageSearchResultItem"
        doc="Represents an npm package search result item.">
        <InterfaceMember
          name="package"
          type="NpmPackage"
          doc="The npm package details."
        />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="NpmPackageSearchResult"
        doc="Represents an npm package search result.">
        <InterfaceMember
          name="objects"
          type="NpmPackageSearchResultItem[]"
          doc="The list of npm package search result items."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Fetch details of an npm package.">
        <TSDocRemarks>
          {`This function is used to fetch an npm package. It can be used in the CLI upgrade command to check if the application is using npm, yarn, or another package manager.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="packageName">
          {`The name of the npm package to fetch.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves to the npm package details or undefined if the package is not found.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="fetchNpmPackage"
        parameters={[
          {
            name: "packageName",
            type: "string"
          }
        ]}
        returnType={code`Promise<NpmPackage | undefined>`}>
        <VarDeclaration
          const
          name="result"
          initializer={code` await fetch(\`https://registry.npmjs.com/-/v1/search?text=\${packageName}&size=1\`).then(res => res.json()) as NpmPackageSearchResult; `}
        />
        <hbr />
        <IfStatement
          condition={code`result.objects && result.objects.length > 0 && result.objects[0].package && result.objects[0].package.name === packageName`}>
          {code`return result.objects[0].package; `}
        </IfStatement>
        <ElseClause>{code`return undefined; `}</ElseClause>
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `getLatest` handler function declaration code for the Shell Shock project.
 */
export function GetLatestFunctionDeclaration() {
  return (
    <>
      <TSDoc heading="Get the latest version of the application from the npm registry.">
        <TSDocRemarks>
          {`This function is used to retrieve the latest version of the application from the npm registry. It can be used in the CLI upgrade command to check if there is a newer version of the application available.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="packageName">
          {`The name of the npm package to fetch.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves to the latest version of the specified npm package as a string.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="getLatest"
        parameters={[
          {
            name: "packageName",
            type: "string"
          }
        ]}>
        <VarDeclaration
          const
          name="package"
          initializer={code`await fetchNpmPackage(packageName); `}
        />
        <Spacing />
        {code`return package?.version; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `install` handler function declaration code for the Shell Shock project.
 */
export function InstallFunctionDeclaration() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="InstallOptions"
        doc="Options for the `install` handler function.">
        <InterfaceMember
          name="stdout"
          optional
          type="(string) => void"
          doc="A callback function that is called with the stdout output of the command."
        />
        <hbr />
        <InterfaceMember
          name="stderr"
          optional
          type="(string) => void"
          doc="A callback function that is called with the stderr output of the command."
        />
        <hbr />
        <InterfaceMember
          name="color"
          optional
          type="boolean"
          doc="Whether to enable color output in the command. If not provided, color output will be enabled by default."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Install the application dependencies.">
        <TSDocRemarks>
          {`This function is used to install the application dependencies. It can be used in the CLI upgrade command to ensure that all necessary dependencies are installed.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="options">
          {`The options for the \`install\` function. Currently, there are no options available, but this parameter is included for future extensibility.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves when the installation of dependencies is complete.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="install"
        parameters={[
          {
            name: "options",
            type: "InstallOptions",
            default: "{}"
          }
        ]}
        returnType="Promise<string>">
        <VarDeclaration
          const
          name="packageManager"
          initializer={code`getPackageManager(); `}
        />
        <hbr />
        <VarDeclaration let name="output" initializer={code`""; `} />
        <hbr />
        {code`try {
            // await spawn(
            //   \`\${packageManager}\${isWindows && packageManager !== "bun" ? ".cmd" : ""}\`,
            //   ["install"],
            //   {
            //     stdout: (data: string) => {
            //       options.stdout?.(data);
            //       output += data;
            //     },
            //     stderr: (data: string) => {
            //       options.stderr?.(data);
            //     },
            //   },
            //   {
            //     cwd: options.cwd ?? process.cwd(),
            //     env: {
            //       ...process.env,
            //       ...(options.color !== false ? { FORCE_COLOR: true } : null),
            //       // With spawn, pnpm install will fail with ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies.
            //       // When pnpm install is run directly from the terminal, this error does not occur.
            //       // When pnpm install is run from a simple spawn script, this error does not occur.
            //       // The issue only seems to be when pnpm install is executed from npm-check-updates, but it's not clear what configuration or environmental factors are causing this.
            //       // For now, turn off strict-peer-dependencies on pnpm auto-install.
            //       // See: https://github.com/raineorshine/npm-check-updates/issues/1191
            //       ...(packageManager === 'pnpm' ? { npm_config_strict_peer_dependencies: false } : null),
            //     },
            //   },
            // );
          } catch (err) {
            console.error("Error executing install command:", err);
            throw err;
          }
          `}
      </FunctionDeclaration>
    </>
  );
}

export interface UpgradeBuiltinProps extends Omit<
  BuiltinFileProps,
  "id" | "description"
> {}

/**
 * A built-in upgrade module for Shell Shock.
 */
export function UpgradeBuiltin(props: UpgradeBuiltinProps) {
  const [{ children }, rest] = splitProps(props, ["children"]);

  return (
    <BuiltinFile
      id="upgrade"
      description="A collection of application upgrade utility functions for Shell Shock."
      {...rest}
      imports={defu(rest.imports ?? {}, {
        "node:os": "os",
        "node:path": ["join", "resolve"],
        "node:fs": ["existsSync"],
        "node:fs/promises": ["readFile", "writeFile"],
        "node:process": "process"
      })}
      builtinImports={defu(rest.builtinImports ?? {}, {
        console: ["error", "verbose", "writeLine"],
        env: ["paths", "isWindows"]
      })}>
      <VarDeclaration
        const
        name="homePath"
        type="string"
        initializer={code`os.homedir(); `}
      />
      <Spacing />
      <VarDeclaration
        const
        name="tempPath"
        type="string"
        initializer={code`os.tmpdir(); `}
      />
      <Spacing />
      <LocateLockfileFunctionDeclaration />
      <Spacing />
      <GetPackageManagerFunctionDeclaration />
      <Spacing />
      <FetchNpmPackageFunctionDeclaration />
      <Spacing />
      <GetLatestFunctionDeclaration />
      <Spacing />
      <InstallFunctionDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
