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

import { isNumber } from "@stryke/type-checks/is-number";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { Config, PlatformConfig } from "style-dictionary";
import type {
  DesignToken,
  PreprocessedTokens,
  Preprocessor
} from "style-dictionary/types";
import type { ThemePluginContext } from "../types/plugin";
import type {
  ThemeBorderStyleAppSubItemUserConfig,
  ThemeBorderStyleMessageStateUserConfig,
  ThemeBorderStyleSectionTypesUserConfig,
  ThemeBorderStylesResolvedConfig,
  ThemeBorderStyleSubItemUserConfig,
  ThemeBorderStylesUserConfig,
  ThemePaddingResolvedConfig,
  ThemeResolvedConfig,
  ThemeStyleBorderIdentifiers
} from "../types/theme";
import { mergeThemes, resolveBorderStyle } from "./helpers";

/**
 * Shell Shock - Theme Padding Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const padding = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/padding",
  preprocessor: (
    dictionary: PreprocessedTokens,
    _options: Config | PlatformConfig
  ): PreprocessedTokens => {
    const resolvedConfig = {} as ThemeResolvedConfig;
    resolvedConfig.name =
      (dictionary as DesignToken).$theme ?? context.config.name;

    // #region Tiered token resolution
    resolvedConfig.borderStyles ??= {
      banner: { outline: {}, divider: {} },
      message: { outline: {}, divider: {} },
      app: { table: {}, divider: {} }
    } as ThemeBorderStylesResolvedConfig;
    const borderStyles = dictionary.borderStyles as ThemeBorderStylesUserConfig;

    if (isSetString(borderStyles)) {
      const borderStyle = resolveBorderStyle(
        borderStyles as ThemeStyleBorderIdentifiers
      );

      resolvedConfig.borderStyles = {
        banner: {
          outline: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          },
          divider: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          }
        },
        message: {
          outline: {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            debug: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          },
          divider: {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            debug: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          }
        },
        app: {
          table: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          },
          divider: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          }
        }
      };
    } else if (isSetObject(borderStyles)) {
      resolvedConfig.borderStyles.banner ??= {
        outline: {},
        divider: {}
      } as ThemeBorderStylesResolvedConfig["banner"];
      const banner = borderStyles.banner;

      if (isSetString(banner)) {
        const borderStyle = resolveBorderStyle(banner);

        resolvedConfig.borderStyles.banner = {
          outline: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          },
          divider: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          }
        };
      } else if (isSetObject(banner)) {
        resolvedConfig.borderStyles.banner ??=
          {} as ThemeBorderStylesResolvedConfig["banner"];
        const outline = (
          banner as ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).outline;

        if (isSetString(outline)) {
          const borderStyle = resolveBorderStyle(outline);

          resolvedConfig.borderStyles.banner.outline = {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          };
        } else if (isSetObject(outline)) {
          resolvedConfig.borderStyles.banner.outline =
            {} as ThemeBorderStylesResolvedConfig["banner"]["outline"];

          if (
            isSetString(
              (outline as ThemeBorderStyleSectionTypesUserConfig).primary
            )
          ) {
            resolvedConfig.borderStyles.banner.outline.primary =
              resolveBorderStyle(
                (outline as ThemeBorderStyleSectionTypesUserConfig)
                  .primary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleSectionTypesUserConfig).secondary
            )
          ) {
            resolvedConfig.borderStyles.banner.outline.secondary =
              resolveBorderStyle(
                (outline as ThemeBorderStyleSectionTypesUserConfig)
                  .secondary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleSectionTypesUserConfig).tertiary
            )
          ) {
            resolvedConfig.borderStyles.banner.outline.tertiary =
              resolveBorderStyle(
                (outline as ThemeBorderStyleSectionTypesUserConfig)
                  .tertiary as ThemeStyleBorderIdentifiers
              );
          }
        }

        const divider = (
          banner as ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).divider;

        if (isSetString(divider)) {
          const borderStyle = resolveBorderStyle(divider);

          resolvedConfig.borderStyles.banner.divider = {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          };
        } else if (isSetObject(divider)) {
          resolvedConfig.borderStyles.banner.divider =
            {} as ThemeBorderStylesResolvedConfig["banner"]["divider"];

          if (
            isSetString(
              (divider as ThemeBorderStyleSectionTypesUserConfig).primary
            )
          ) {
            resolvedConfig.borderStyles.banner.divider.primary =
              resolveBorderStyle(
                (divider as ThemeBorderStyleSectionTypesUserConfig)
                  .primary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleSectionTypesUserConfig).secondary
            )
          ) {
            resolvedConfig.borderStyles.banner.divider.secondary =
              resolveBorderStyle(
                (divider as ThemeBorderStyleSectionTypesUserConfig)
                  .secondary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleSectionTypesUserConfig).tertiary
            )
          ) {
            resolvedConfig.borderStyles.banner.divider.tertiary =
              resolveBorderStyle(
                (divider as ThemeBorderStyleSectionTypesUserConfig)
                  .tertiary as ThemeStyleBorderIdentifiers
              );
          }
        }
      }

      resolvedConfig.borderStyles.app ??= {
        table: {},
        divider: {}
      } as ThemeBorderStylesResolvedConfig["app"];
      const app = borderStyles.app;

      if (isSetString(app)) {
        const borderStyle = resolveBorderStyle(app);

        resolvedConfig.borderStyles.app = {
          table: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          },
          divider: {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          }
        };
      } else if (isSetObject(app)) {
        resolvedConfig.borderStyles.app ??=
          {} as ThemeBorderStylesResolvedConfig["app"];

        const table = (
          app as ThemeBorderStyleAppSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).table;

        if (isSetString(table)) {
          const borderStyle = resolveBorderStyle(table);

          resolvedConfig.borderStyles.app.table = {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          };
        } else if (isSetObject(table)) {
          resolvedConfig.borderStyles.app.table =
            {} as ThemeBorderStylesResolvedConfig["app"]["table"];

          if (
            isSetString(
              (table as ThemeBorderStyleSectionTypesUserConfig).primary
            )
          ) {
            resolvedConfig.borderStyles.app.table.primary = resolveBorderStyle(
              (table as ThemeBorderStyleSectionTypesUserConfig)
                .primary as ThemeStyleBorderIdentifiers
            );
          }
          if (
            isSetString(
              (table as ThemeBorderStyleSectionTypesUserConfig).secondary
            )
          ) {
            resolvedConfig.borderStyles.app.table.secondary =
              resolveBorderStyle(
                (table as ThemeBorderStyleSectionTypesUserConfig)
                  .secondary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (table as ThemeBorderStyleSectionTypesUserConfig).tertiary
            )
          ) {
            resolvedConfig.borderStyles.app.table.tertiary = resolveBorderStyle(
              (table as ThemeBorderStyleSectionTypesUserConfig)
                .tertiary as ThemeStyleBorderIdentifiers
            );
          }
        }

        const divider = (
          app as ThemeBorderStyleAppSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).divider;

        if (isSetString(divider)) {
          const borderStyle = resolveBorderStyle(divider);

          resolvedConfig.borderStyles.app.divider = {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          };
        } else if (isSetObject(divider)) {
          resolvedConfig.borderStyles.app.divider =
            {} as ThemeBorderStylesResolvedConfig["app"]["divider"];

          if (
            isSetString(
              (divider as ThemeBorderStyleSectionTypesUserConfig).primary
            )
          ) {
            resolvedConfig.borderStyles.app.divider.primary =
              resolveBorderStyle(
                (divider as ThemeBorderStyleSectionTypesUserConfig)
                  .primary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleSectionTypesUserConfig).secondary
            )
          ) {
            resolvedConfig.borderStyles.app.divider.secondary =
              resolveBorderStyle(
                (divider as ThemeBorderStyleSectionTypesUserConfig)
                  .secondary as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleSectionTypesUserConfig).tertiary
            )
          ) {
            resolvedConfig.borderStyles.app.divider.tertiary =
              resolveBorderStyle(
                (divider as ThemeBorderStyleSectionTypesUserConfig)
                  .tertiary as ThemeStyleBorderIdentifiers
              );
          }
        }
      }

      resolvedConfig.borderStyles.message ??=
        {} as ThemeBorderStylesResolvedConfig["message"];
      const message = borderStyles.message;

      if (isSetString(message)) {
        const borderStyle = resolveBorderStyle(message);

        resolvedConfig.borderStyles.message = {
          outline: {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            debug: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          },
          divider: {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            debug: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          }
        };
      } else if (isSetObject(message)) {
        const outline = (
          message as ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).outline;

        if (isSetString(outline)) {
          const borderStyle = resolveBorderStyle(outline);

          resolvedConfig.borderStyles.message.outline = {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            debug: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          };
        } else if (isSetObject(outline)) {
          resolvedConfig.borderStyles.message.outline =
            {} as ThemeBorderStylesResolvedConfig["message"]["outline"];

          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).help
            )
          ) {
            resolvedConfig.borderStyles.message.outline.help =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .help as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).success
            )
          ) {
            resolvedConfig.borderStyles.message.outline.success =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .success as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).info
            )
          ) {
            resolvedConfig.borderStyles.message.outline.info =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .info as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).debug
            )
          ) {
            resolvedConfig.borderStyles.message.outline.debug =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .debug as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).warning
            )
          ) {
            resolvedConfig.borderStyles.message.outline.warning =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .warning as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).danger
            )
          ) {
            resolvedConfig.borderStyles.message.outline.danger =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .danger as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (outline as ThemeBorderStyleMessageStateUserConfig).error
            )
          ) {
            resolvedConfig.borderStyles.message.outline.error =
              resolveBorderStyle(
                (outline as ThemeBorderStyleMessageStateUserConfig)
                  .error as ThemeStyleBorderIdentifiers
              );
          }
        }

        resolvedConfig.borderStyles.message.divider ??=
          {} as ThemeBorderStylesResolvedConfig["message"]["divider"];
        const divider = (
          message as ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).divider;

        if (isSetString(divider)) {
          const borderStyle = resolveBorderStyle(divider);

          resolvedConfig.borderStyles.message.divider = {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            debug: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          };
        } else if (isSetObject(divider)) {
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).help
            )
          ) {
            resolvedConfig.borderStyles.message.divider.help =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .help as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).success
            )
          ) {
            resolvedConfig.borderStyles.message.divider.success =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .success as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).info
            )
          ) {
            resolvedConfig.borderStyles.message.divider.info =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .info as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).debug
            )
          ) {
            resolvedConfig.borderStyles.message.divider.debug =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .debug as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).warning
            )
          ) {
            resolvedConfig.borderStyles.message.divider.warning =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .warning as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).danger
            )
          ) {
            resolvedConfig.borderStyles.message.divider.danger =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .danger as ThemeStyleBorderIdentifiers
              );
          }
          if (
            isSetString(
              (divider as ThemeBorderStyleMessageStateUserConfig).error
            )
          ) {
            resolvedConfig.borderStyles.message.divider.error =
              resolveBorderStyle(
                (divider as ThemeBorderStyleMessageStateUserConfig)
                  .error as ThemeStyleBorderIdentifiers
              );
          }
        }
      }
    }

    // #endregion BorderStyles

    // #region Padding

    resolvedConfig.padding ??= {} as ThemePaddingResolvedConfig;
    const padding = dictionary.padding;

    if (isNumber(padding)) {
      resolvedConfig.padding = {
        banner: padding,
        message: padding,
        app: padding,
        table: padding
      };
    } else if (isSetObject(padding)) {
      if (isNumber(padding.banner)) {
        resolvedConfig.padding.banner = padding.banner;
      }
      if (isNumber(padding.message)) {
        resolvedConfig.padding.message = padding.message;
      }
      if (isNumber(padding.app)) {
        resolvedConfig.padding.app = padding.app;
      }
      if (isNumber(padding.table)) {
        resolvedConfig.padding.table = padding.table;
      }
    }

    // #endregion Padding

    // #endregion Tiered token resolution

    mergeThemes(context, resolvedConfig);

    return dictionary;
  }
});
