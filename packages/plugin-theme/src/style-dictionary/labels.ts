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

import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import type { Config, PlatformConfig } from "style-dictionary";
import type {
  DesignToken,
  PreprocessedTokens,
  Preprocessor
} from "style-dictionary/types";
import { mergeThemes } from "../helpers/merge";
import type { ThemePluginContext } from "../types/plugin";
import type {
  ThemeLabelBannerSubItemConfig,
  ThemeLabelMessageStateConfig,
  ThemeLabelsResolvedConfig,
  ThemeLabelsUserConfig,
  ThemeLabelTypeResolvedConfig,
  ThemeLabelTypeUserConfig,
  ThemeResolvedConfig
} from "../types/theme";

/**
 * Shell Shock - Theme Labels Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const labels = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/labels",
  preprocessor: (
    dictionary: PreprocessedTokens,
    _options: Config | PlatformConfig
  ): PreprocessedTokens => {
    const resolvedConfig = {} as ThemeResolvedConfig;
    resolvedConfig.name =
      (dictionary as DesignToken).$theme ?? context.config.name;

    // #region Tiered token resolution

    // #region Labels

    resolvedConfig.labels ??= {
      message: { header: {}, footer: {} },
      banner: { header: {}, footer: {} }
    } as ThemeLabelsResolvedConfig;
    const labels = dictionary.labels as ThemeLabelsUserConfig;

    if (isSetString(labels)) {
      resolvedConfig.labels = {
        message: {
          header: {
            help: labels,
            success: labels,
            info: labels,
            debug: labels,
            warning: labels,
            danger: labels,
            error: labels
          },
          footer: {}
        },
        banner: {
          header: {
            primary: labels,
            secondary: labels,
            tertiary: labels
          },
          footer: {}
        }
      };
    } else if (isSetObject(labels)) {
      resolvedConfig.labels.message ??=
        {} as ThemeLabelTypeResolvedConfig<ThemeLabelMessageStateConfig>;
      const message =
        labels?.message as ThemeLabelTypeUserConfig<ThemeLabelMessageStateConfig>;

      if (isSetString(message)) {
        resolvedConfig.labels.message = {
          header: {
            help: message,
            success: message,
            info: message,
            debug: message,
            warning: message,
            danger: message,
            error: message
          },
          footer: {}
        };
      } else if (isSetObject(message)) {
        resolvedConfig.labels.message.header =
          {} as ThemeLabelMessageStateConfig;
        resolvedConfig.labels.message.footer =
          {} as ThemeLabelMessageStateConfig;
        const header = message.header;
        const footer = message.footer;

        if (isSetString(header)) {
          resolvedConfig.labels.message.header = {
            help: header,
            success: header,
            info: header,
            debug: header,
            warning: header,
            danger: header,
            error: header
          };
        } else if (isSetObject(header)) {
          if (isSetString(header.help)) {
            resolvedConfig.labels.message.header.help = header.help;
          }
          if (isSetString(header.success)) {
            resolvedConfig.labels.message.header.success = header.success;
          }
          if (isSetString(header.info)) {
            resolvedConfig.labels.message.header.info = header.info;
          }
          if (isSetString(header.debug)) {
            resolvedConfig.labels.message.header.debug = header.debug;
          }
          if (isSetString(header.warning)) {
            resolvedConfig.labels.message.header.warning = header.warning;
          }
          if (isSetString(header.danger)) {
            resolvedConfig.labels.message.header.danger = header.danger;
          }
          if (isSetString(header.error)) {
            resolvedConfig.labels.message.header.error = header.error;
          }
        }

        if (isSetString(footer)) {
          resolvedConfig.labels.message.footer = {
            help: footer,
            success: footer,
            info: footer,
            debug: footer,
            warning: footer,
            danger: footer,
            error: footer
          };
        } else if (isSetObject(footer)) {
          if (isSetString(footer.help)) {
            resolvedConfig.labels.message.footer.help = footer.help;
          }
          if (isSetString(footer.success)) {
            resolvedConfig.labels.message.footer.success = footer.success;
          }
          if (isSetString(footer.info)) {
            resolvedConfig.labels.message.footer.info = footer.info;
          }
          if (isSetString(footer.debug)) {
            resolvedConfig.labels.message.footer.debug = footer.debug;
          }
          if (isSetString(footer.warning)) {
            resolvedConfig.labels.message.footer.warning = footer.warning;
          }
          if (isSetString(footer.danger)) {
            resolvedConfig.labels.message.footer.danger = footer.danger;
          }
          if (isSetString(footer.error)) {
            resolvedConfig.labels.message.footer.error = footer.error;
          }
        }

        resolvedConfig.labels.banner ??=
          {} as ThemeLabelTypeResolvedConfig<ThemeLabelBannerSubItemConfig>;
        const banner =
          labels?.banner as ThemeLabelTypeUserConfig<ThemeLabelBannerSubItemConfig>;

        if (isSetString(banner)) {
          resolvedConfig.labels.banner = {
            header: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            footer: {}
          };
        } else if (isSetObject(banner)) {
          resolvedConfig.labels.banner.header =
            {} as ThemeLabelBannerSubItemConfig;
          resolvedConfig.labels.banner.footer =
            {} as ThemeLabelBannerSubItemConfig;
          const header = banner.header;
          const footer = banner.footer;

          if (isSetString(header)) {
            resolvedConfig.labels.banner.header = {
              primary: header,
              secondary: header,
              tertiary: header
            };
          } else if (isSetObject(header)) {
            if (isSetString(header.primary)) {
              resolvedConfig.labels.banner.header.primary = header.primary;
            }
            if (isSetString(header.secondary)) {
              resolvedConfig.labels.banner.header.secondary = header.secondary;
            }
            if (isSetString(header.tertiary)) {
              resolvedConfig.labels.banner.header.tertiary = header.tertiary;
            }
          }

          if (isSetString(footer)) {
            resolvedConfig.labels.banner.footer = {
              primary: footer,
              secondary: footer,
              tertiary: footer
            };
          } else if (isSetObject(footer)) {
            if (isSetString(footer.primary)) {
              resolvedConfig.labels.banner.footer.primary = footer.primary;
            }
            if (isSetString(footer.secondary)) {
              resolvedConfig.labels.banner.footer.secondary = footer.secondary;
            }
            if (isSetString(footer.tertiary)) {
              resolvedConfig.labels.banner.footer.tertiary = footer.tertiary;
            }
          }
        }
      }
    }

    // #endregion Labels

    // #endregion Tiered token resolution

    mergeThemes(context, resolvedConfig);

    return dictionary;
  }
});
