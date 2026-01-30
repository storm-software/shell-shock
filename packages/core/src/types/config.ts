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

import type { NodeJsPluginResolvedConfig } from "@powerlines/plugin-nodejs/types/plugin";
import type {
  TsdownPluginResolvedConfig,
  TsdownPluginUserConfig
} from "@powerlines/plugin-tsdown/types/plugin";
import type { OutputConfig as PowerlinesOutputConfig } from "powerlines/types/config";
import type { CommandBase, CommandOption } from "./command";
import type { Context } from "./context";

export type BaseConfig = Pick<
  TsdownPluginUserConfig,
  | "root"
  | "name"
  | "title"
  | "description"
  | "logLevel"
  | "mode"
  | "skipCache"
  | "autoInstall"
  | "entry"
  | "plugins"
  | "tsconfig"
  | "tsconfigRaw"
>;

/**
 * The plugin options for Shell Shock.
 */
export type Options = Partial<BaseConfig> & {
  /**
   * A set of default command options to apply to each command.
   *
   * @remarks
   * To disable the addition of these default options, set this property to `false`, or provide a custom set of options/a function that returns them.
   */
  defaultOptions?:
    | CommandOption[]
    | ((context: Context, input: CommandBase) => CommandOption[])
    | false;

  /**
   * Determines whether commands' name and option names are treated as case-sensitive.
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
   * An application specific prefix to check for environment variables.
   *
   * @remarks
   * If not provided, Shell Shock will convert {@link Options.name | name} to {@link https://stringcase.org/cases/constant/ | constant case} format and append an underscore (`_`). If the provided {@link Options.name | name} is `"my-app"`, environment variables starting with `"MY_APP_"` will be used - for example: `"MY_APP_CONFIG_NAME"`. If a trailing underscore already exists in the user provided value, it will result in two consecutive underscores - for example: `"MY_APP__CONFIG_NAME"` (this was done intentionally so that users who specifically want multiple underscores have a way to do so).
   *
   * @see https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa
   * @see https://stringcase.org/cases/constant/
   */
  envPrefix?: string;
};

/**
 * The output configuration options for Shell Shock.
 */
export type OutputConfig = Pick<
  PowerlinesOutputConfig,
  "outputPath" | "assets" | "storage"
> & {
  /**
   * An indicator specifying whether to generate TypeScript declaration files (.d.ts) during the build process.
   */
  dts?: false;
};

/**
 * The user configuration options for Shell Shock.
 */
export type UserConfig = Options & {
  /**
   * Configuration for the output of the build process
   */
  output?: OutputConfig;
};

/**
 * The resolved configuration options for Shell Shock.
 */
export type ResolvedConfig = TsdownPluginResolvedConfig &
  NodeJsPluginResolvedConfig &
  Required<Omit<Options, "bin">> & {
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
     * The user configuration for the Shell Shock process.
     */
    userConfig: UserConfig & NodeJsPluginResolvedConfig;
  };
