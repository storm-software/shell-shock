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

import type { AutoMDPluginResolvedConfig } from "@powerlines/plugin-automd/types/plugin";
import type {
  NodeJsPluginOptions,
  NodeJsPluginResolvedConfig,
  NodeJsPluginUserConfig
} from "@powerlines/plugin-nodejs/types/plugin";
import type {
  TsdownPluginResolvedConfig,
  TsdownPluginUserConfig
} from "@powerlines/plugin-tsdown/types/plugin";
import type { OutputConfig as PowerlinesOutputConfig } from "powerlines";
import type { CommandBase, CommandOption } from "./command";
import type { Context } from "./context";

type BuildOptions = Pick<
  TsdownPluginUserConfig,
  | "root"
  | "name"
  | "title"
  | "description"
  | "logLevel"
  | "mode"
  | "skipCache"
  | "autoInstall"
  | "plugins"
  | "tsconfig"
  | "tsconfigRaw"
>;

export interface ReferenceOptions {
  /**
   * A URL to the application documentation or reference.
   */
  app: string;

  /**
   * A URL to the application command specific documentation or reference.
   *
   * @remarks
   * This URL is expected to contain the token `{command}`, which will be replaced with the full command path to provide links to command specific documentation. For example, `myapp command subcommand` will be translated to `{reference}/command/subcommand`.
   */
  commands?: string;
}

type BaseOptions = Partial<BuildOptions> & {
  /**
   * A set of global command options to apply to each command.
   *
   * @remarks
   * Each command will inherit these global options. To disable the addition of these global options, set this property to `false`, or provide a custom set of options/a function that returns them. A `GlobalOptions` interface will be created by the `shell-shock types` command and added to the generated `shell-shock.d.ts` file.
   */
  globalOptions?:
    | CommandOption[]
    | ((context: Context, input: CommandBase) => CommandOption[])
    | false;

  /**
   * Determines whether commands and option names are treated as case-sensitive.
   *
   * @defaultValue `false`
   */
  isCaseSensitive?: boolean;

  /**
   * The name of the binary (the {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin | "bin" field} in package.json) that will be used to run the application through NodeJs package managers (e.g., npm, yarn, pnpm).
   *
   * @remarks
   * If an array is provided, each binary will be linked to the same compiled output file. If not provided, the {@link Options.name | name} option will be used.
   *
   * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin
   * @see https://yarnpkg.com/cli/bin
   * @see https://pnpm.io/package_json#bin
   */
  bin?: string | string[];

  /**
   * Should Shell Shock attempt to automatically assign environment variables to manipulate default values for command options based on the option name?
   *
   * @remarks
   * If set to a string, Shell Shock will use the provided string as an application specific environment variable prefix, convert the option name to {@link https://stringcase.org/cases/constant/ | constant case}, and prepend the provided `string` value to determine the corresponding environment variable name. For example, if an option is named `"configPath"` and the `autoAssignEnv` is `"MY_APP_"`, Shell Shock will look for an environment variable named `"MY_APP_CONFIG_PATH"` and assign its value to the option if it exists. If set to `true`, Shell Shock will use a default environment variable prefix derived from the {@link Options.name | application name}.
   *
   * @see https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa
   * @see https://stringcase.org/cases/constant/
   */
  autoAssignEnv?: true | string;

  /**
   * A URL to the application documentation or reference.
   *
   * @remarks
   * This URL can be used in various displays of the user interface and documentation to provide users with a reference for the application. It can also be used by plugins to link to the documentation in relevant contexts. If the token `{command}` is included in the URL, it will be replaced with the full command path to provide links to command specific documentation. For example, `myapp command subcommand` will be translated to `{reference}/command/subcommand`.
   */
  reference?: ReferenceOptions | string;
};

/**
 * The plugin options for Shell Shock.
 */
export type Options = BaseOptions & Partial<NodeJsPluginOptions>;

/**
 * The output configuration options for Shell Shock.
 */
export type OutputConfig = Pick<
  PowerlinesOutputConfig,
  "path" | "copy" | "storage"
> & {
  /**
   * An indicator specifying whether to generate TypeScript declaration files (.d.ts) during the build process.
   */
  dts?: false;
};

/**
 * The user configuration options for Shell Shock.
 */
export type UserConfig = BaseOptions &
  Partial<NodeJsPluginUserConfig> & {
    /**
     * Configuration for the output of the build process
     */
    output?: OutputConfig;
  };

/**
 * The resolved configuration options for Shell Shock.
 */
export type ResolvedConfig = TsdownPluginResolvedConfig &
  AutoMDPluginResolvedConfig &
  NodeJsPluginResolvedConfig &
  Required<Omit<Options, "bin" | "reference">> & {
    /**
     * The name of the binary (the {@link https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin | "bin" field} in package.json) that will be used to run the application through NodeJs package managers (e.g., npm, yarn, pnpm).
     *
     * @remarks
     * If an array is provided, each binary will be linked to the same compiled output file. If not provided, the {@link Options.name | name} option will be used.
     *
     * @see https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin
     * @see https://yarnpkg.com/cli/bin
     * @see https://pnpm.io/package_json#bin
     */
    bin: Record<string, string>;

    /**
     * The URL(s) to the application documentation or reference.
     */
    reference: ReferenceOptions;

    /**
     * The command-line application specific environment variable prefix used for automatically assigning environment variables to command options.
     */
    appSpecificEnvPrefix: string;

    /**
     * The user configuration for the Shell Shock process.
     */
    userConfig: UserConfig;
  };
