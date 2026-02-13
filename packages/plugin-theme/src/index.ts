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

import styleDictionary from "@powerlines/plugin-style-dictionary";
import { omit } from "@stryke/helpers/omit";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import defu from "defu";
import type { Plugin } from "powerlines";
import type { Config } from "style-dictionary/types";
import { borderStyles } from "./style-dictionary/border-styles";
import { colors } from "./style-dictionary/colors";
import { icons } from "./style-dictionary/icons";
import { labels } from "./style-dictionary/labels";
import { padding } from "./style-dictionary/padding";
import { settings } from "./style-dictionary/settings";
import { theme as defaultTheme } from "./themes/storm";
import type { ThemePluginContext, ThemePluginOptions } from "./types/plugin";

export * from "./types";

/**
 * The Style Dictionary - Shell Shock plugin to use Style Dictionary tokens to select theme colors to Shell Shock projects.
 */
export const plugin = <
  TContext extends ThemePluginContext = ThemePluginContext
>(
  options: ThemePluginOptions = {}
): Plugin<TContext>[] => {
  return [
    styleDictionary(defu({ skipBuild: false }, omit(options, ["theme"]))),
    {
      name: "shell-shock:theme",
      config() {
        this.debug(
          "Providing default configuration for the Shell Shock `theme` plugin."
        );

        return {
          // theme: options.theme,
          styleDictionary: {
            customPreprocessors: (context: TContext) => ({
              "shell-shock/colors": colors(context),
              "shell-shock/border-styles": borderStyles(context),
              "shell-shock/padding": padding(context),
              "shell-shock/icons": icons(context),
              "shell-shock/labels": labels(context),
              "shell-shock/settings": settings(context)
            })
          }
        };
      },
      configResolved: {
        order: "pre",
        async handler() {
          this.debug("Shell Shock `theme` plugin configuration resolved.");

          this.config.styleDictionary = defu(this.config.styleDictionary, {
            tokens: isSetObject(this.config.theme)
              ? defu(this.config.theme, defaultTheme)
              : defaultTheme,
            platforms: {
              js: {
                preprocessors: ["shell-shock/preprocessor"],
                transformGroup: "js",
                transforms: ["name/camel"],
                fileHeader: "powerlines/file-header",
                buildPath: this.config.output.outputPath,
                files: [
                  {
                    format: "javascript/module",
                    destination: "theme.js",
                    options: {
                      minify: this.config.mode === "production"
                    }
                  },
                  {
                    format: "typescript/module-declarations",
                    destination: "theme.d.ts",
                    options: {
                      minify: this.config.mode === "production"
                    }
                  }
                ]
              }
            }
          } as Config);
        }
      }
    }
  ];
};

export default plugin;
