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
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
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
import type { UpgradePluginContext } from "../types/plugin";

/**
 * The `locatePackageJson` handler function declaration code for the Shell Shock project.
 */
export function LocatePackageJsonFunctionDeclaration() {
  const context = usePowerlines<UpgradePluginContext>();

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
        <Spacing />
        <InterfaceMember
          name="isDependencyRequired"
          optional
          type="boolean"
          doc="Whether to only locate a package.json file if it contains the application as a dependency. If set to `true`, the function will check if the located package.json file has the application listed as a dependency in its dependencies, devDependencies, peerDependencies, or optionalDependencies before returning its path. This can be useful in monorepo setups where multiple package.json files may exist, but only the one that includes the application as a dependency is relevant for upgrade purposes."
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
        <VarDeclaration
          const
          name="packageJsonPath"
          initializer={code`join(currentPath, "package.json"); `}
        />
        <IfStatement condition={code`existsSync(packageJsonPath)`}>
          <IfStatement condition={code`options.isDependencyRequired`}>
            <VarDeclaration
              const
              name="packageJson"
              initializer={code`JSON.parse(await readFile(packageJsonPath, "utf8")); `}
            />
            <IfStatement
              condition={code`Object.keys(packageJson.dependencies || {}).concat(Object.keys(packageJson.devDependencies || {})).concat(Object.keys(packageJson.peerDependencies || {})).concat(Object.keys(packageJson.optionalDependencies || {})).some(dep => dep === "${context.packageJson.name}" || dep.startsWith("${context.packageJson.name}@"))`}>
              {code`return packageJsonPath; `}
            </IfStatement>
          </IfStatement>
          <ElseClause>{code`return packageJsonPath; `}</ElseClause>
        </IfStatement>
        <ElseClause>
          {code`currentPath = parentPath;
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
          {code`currentPath = parentPath;
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
      {code`declare global {
        var Bun: any;
        namespace NodeJS {
          interface ProcessVersions {
            bun?: string;
          }
        }
      } `}
      <Spacing />
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
              initializer={code`await locatePackageJson(options); `}
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
 * The `getLatestVersion` handler function declaration code for the Shell Shock project.
 */
export function GetLatestVersionFunctionDeclaration() {
  const context = usePowerlines<UpgradePluginContext>();

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
        name="getLatestVersion"
        parameters={[
          {
            name: "packageName",
            default: `"${context.packageJson.name}"`
          }
        ]}
        returnType={code`Promise<string | undefined>`}>
        <VarDeclaration
          const
          name="result"
          initializer={code`await fetchNpmPackage(packageName); `}
        />
        <Spacing />
        {code`return result?.version; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `upgrade` handler function declaration code for the Shell Shock project.
 */
export function GetUpgradeCommandFunctionDeclaration() {
  const context = usePowerlines<UpgradePluginContext>();

  return (
    <>
      <TSDoc heading="A function to get the upgrade command for a specific package manager.">
        <TSDocRemarks>
          {`This function is used to get the appropriate upgrade command for a specific package manager. It can be used in the CLI upgrade command to determine which command to run based on the package manager being used by the application.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="packageManager">
          {`The name of the package manager to get the upgrade command for. This should be one of "npm", "yarn", "pnpm", "deno", or "bun".`}
        </TSDocParam>
        <TSDocParam name="cwd">
          {`The current working directory to use when determining the upgrade command. This can be used to locate the appropriate package.json and lockfile to determine how to run the upgrade command. If not provided, the process's current working directory will be used.`}
        </TSDocParam>
        <TSDocReturns>
          {`An array of strings representing the command and its arguments to run in order to upgrade the application dependencies using the specified package manager.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="getUpgradeCommand"
        parameters={[
          {
            name: "packageManager",
            type: "string"
          },
          {
            name: "cwd",
            type: "string",
            default: "process.cwd()"
          }
        ]}
        returnType="Promise<string[]>">
        <VarDeclaration
          const
          name="version"
          initializer={code`(await getLatestVersion("${context.packageJson.name}")) || "latest"; `}
        />
        <Spacing />
        <IfStatement condition={code`packageManager === "yarn"`}>
          {code`return ["upgrade", \`${
            context.packageJson.name
          }@\${version}\`]; `}
        </IfStatement>
        <ElseIfClause condition={code`packageManager === "pnpm"`}>
          {code`return ["update", \`${
            context.packageJson.name
          }@\${version}\`]; `}
        </ElseIfClause>
        <ElseIfClause condition={code`packageManager === "deno"`}>
          {code`return ["outdated", "--update", \`${
            context.packageJson.name
          }@\${version}\`]; `}
        </ElseIfClause>
        <ElseIfClause condition={code`packageManager === "bun"`}>
          {code`return ["update", "--save",  \`${
            context.packageJson.name
          }@\${version}\`]; `}
        </ElseIfClause>
        <ElseClause>{code`return ["update", "--save", "--bin-links", \`${
          context.packageJson.name
        }@\${version}\`]; `}</ElseClause>
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `upgrade` handler function declaration code for the Shell Shock project.
 */
export function UpgradeFunctionDeclaration() {
  return (
    <>
      <InterfaceDeclaration
        name="UpgradeBaseOptions"
        doc="Options for the `upgrade` handler function.">
        <InterfaceMember
          name="stdout"
          optional
          type="(data: string) => void"
          doc="A callback function that is called with the stdout output of the command."
        />
        <hbr />
        <InterfaceMember
          name="stderr"
          optional
          type="(err: string) => void"
          doc="A callback function that is called with the stderr output of the command."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TypeDeclaration
        export
        name="UpgradeOptions"
        doc="Options for the `upgrade` handler function.">{code`UpgradeBaseOptions & GetPackageManagerOptions & Parameters<typeof spawn>[2];`}</TypeDeclaration>
      <Spacing />
      <TSDoc heading="Upgrade the application dependencies.">
        <TSDocRemarks>
          {`This function is used to upgrade the application dependencies. It can be used in the CLI upgrade command to ensure that all necessary dependencies are up-to-date.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="options">
          {`The options for the \`upgrade\` function. Currently, there are no options available, but this parameter is included for future extensibility.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves when the upgrade of dependencies is complete.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="upgrade"
        parameters={[
          {
            name: "options",
            type: "UpgradeOptions",
            default: "{}"
          }
        ]}>
        <VarDeclaration
          const
          name="packageManager"
          initializer={code`await getPackageManager(options); `}
        />
        <Spacing />
        <VarDeclaration
          const
          name="args"
          initializer={code`await getUpgradeCommand(packageManager, options.cwd); `}
        />
        <hbr />
        <VarDeclaration let name="output" initializer={code`""; `} />
        <hbr />
        {code`await spawn(
          \`\${packageManager}\${isWindows && packageManager !== "bun" ? ".cmd" : ""}\`,
          [args.join(" ")],
          {
            ...options,
            env: {
              ...options.env,
              ...(packageManager === "pnpm" ? { npm_config_strict_peer_dependencies: false } : null),
            },
            stdout: (data: string) => {
              options.stdout?.(data);
              output += data;
            },
            stderr: (data: string) => {
              options.stderr?.(data);
            },
          },
        ); `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * The `checkForUpdates` handler function declaration code for the Shell Shock project.
 */
export function CheckForUpdatesFunctionDeclaration() {
  const context = usePowerlines<UpgradePluginContext>();

  return (
    <>
      <InterfaceDeclaration
        export
        name="CheckForUpdatesOptions"
        extends="GetPackageManagerOptions"
        doc="Options for the `checkForUpdates` handler function."></InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="CheckForUpdatesResult"
        doc="The result for the `checkForUpdates` handler function.">
        <InterfaceMember
          name="latestVersion"
          type="string"
          doc="The latest version of the application dependencies."
        />
        <hbr />
        <InterfaceMember
          name="currentVersion"
          type="string"
          doc="The current version of the application dependencies."
        />
        <hbr />
        <InterfaceMember
          name="isUpToDate"
          type="boolean"
          doc="Indicates whether the application dependencies are up-to-date."
        />
        <hbr />
        <InterfaceMember
          name="package"
          type="NpmPackage"
          doc="The npm package that was checked for updates."
        />
        <hbr />
        <InterfaceMember
          name="packageManager"
          type="'npm' | 'yarn' | 'pnpm' | 'deno' | 'bun'"
          doc="The package manager used to check for updates."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Check for updates to the application dependencies.">
        <TSDocRemarks>
          {`This function is used to check for updates to the application dependencies. It can be used in the CLI upgrade command to ensure that all necessary dependencies are up-to-date.`}
        </TSDocRemarks>
        <Spacing />
        <TSDocParam name="options">
          {`The options for the \`checkForUpdates\` function. Currently, there are no options available, but this parameter is included for future extensibility.`}
        </TSDocParam>
        <TSDocReturns>
          {`A promise that resolves when the check for updates is complete or undefined if the check was not performed.`}
        </TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        async
        name="checkForUpdates"
        parameters={[
          {
            name: "options",
            type: "CheckForUpdatesOptions",
            default: "{}"
          }
        ]}
        returnType="Promise<CheckForUpdatesResult | undefined>">
        <VarDeclaration
          const
          name="filePath"
          initializer={code`join(paths.data, "version-check.json"); `}
        />
        <IfStatement condition={code`existsSync(filePath)`}>
          <VarDeclaration
            const
            name="file"
            type="{ timestamp: number; }"
            initializer={code` JSON.parse(await readFile(filePath, "utf8")); `}
          />
          <IfStatement condition={code`!file.timestamp`}>
            {code`await writeFile(filePath, JSON.stringify({ timestamp: new Date().getTime() }), "utf8");
            return undefined; `}
          </IfStatement>
          <ElseIfClause
            condition={code`new Date().getTime() - file.timestamp < ${
              context.config.upgrade.staleTime
            }`}>
            {code`return undefined; `}
          </ElseIfClause>
        </IfStatement>
        <ElseClause>
          {code`await writeFile(filePath, JSON.stringify({ timestamp: new Date().getTime() }), "utf8");
              return undefined; `}
        </ElseClause>
        <Spacing />
        <VarDeclaration
          const
          name="packageManager"
          initializer={code`await getPackageManager(options); `}
        />
        <Spacing />
        <VarDeclaration
          const
          name="pkg"
          initializer={code`await fetchNpmPackage(); `}
        />
        <Spacing />
        <IfStatement condition={code`!pkg`}>
          {code`return undefined; `}
        </IfStatement>
        <Spacing />
        {code`await writeFile(filePath, JSON.stringify({ timestamp: new Date().getTime() }), "utf8");

          return {
          latestVersion: pkg?.version ?? "0.0.0",
          currentVersion: "${context.packageJson.version}",
          isUpToDate: pkg ? "${context.packageJson.version}" === pkg.version : true,
          package: pkg,
          packageManager,
        }; `}
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
        env: ["paths", "isWindows"],
        utils: ["isColorSupported", "spawn"]
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
      <LocatePackageJsonFunctionDeclaration />
      <Spacing />
      <LocateLockfileFunctionDeclaration />
      <Spacing />
      <GetPackageManagerFunctionDeclaration />
      <Spacing />
      <FetchNpmPackageFunctionDeclaration />
      <Spacing />
      <GetLatestVersionFunctionDeclaration />
      <Spacing />
      <GetUpgradeCommandFunctionDeclaration />
      <Spacing />
      <UpgradeFunctionDeclaration />
      <Spacing />
      <CheckForUpdatesFunctionDeclaration />
      <Spacing />
      <Show when={Boolean(children)}>{children}</Show>
    </BuiltinFile>
  );
}
