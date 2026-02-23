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
  ThemeIconMessageStateConfig,
  ThemeIconPromptStateConfig,
  ThemeIconSpinnerStateConfig,
  ThemeIconsResolvedConfig,
  ThemeIconSubItemConfig,
  ThemeIconsUserConfig,
  ThemeIconTypeResolvedConfig,
  ThemeResolvedConfig
} from "../types/theme";

/**
 * Shell Shock - Theme Icons Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const icons = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/icons",
  preprocessor: (
    dictionary: PreprocessedTokens,
    _options: Config | PlatformConfig
  ): PreprocessedTokens => {
    const resolvedConfig = {} as ThemeResolvedConfig;
    resolvedConfig.name =
      (dictionary as DesignToken).$theme ?? context.config.name;

    // #region Tiered token resolution

    // #region Icons

    resolvedConfig.icons ??= {
      message: { header: {} },
      banner: { header: {} },
      prompt: {}
    } as ThemeIconsResolvedConfig;
    const icons = dictionary.icons as ThemeIconsUserConfig;

    if (isSetString(icons)) {
      resolvedConfig.icons = {
        message: {
          header: {
            help: icons,
            success: icons,
            info: icons,
            debug: icons,
            warning: icons,
            danger: icons,
            error: icons
          }
        },
        banner: {
          header: {
            primary: icons,
            secondary: icons,
            tertiary: icons
          }
        },
        prompt: {
          active: icons,
          cancelled: icons,
          warning: icons,
          error: icons,
          submitted: icons,
          disabled: icons
        },
        spinner: {
          help: icons,
          success: icons,
          info: icons,
          warning: icons,
          error: icons
        }
      };
    } else if (isSetObject(icons)) {
      resolvedConfig.icons.message =
        {} as ThemeIconTypeResolvedConfig<ThemeIconMessageStateConfig>;
      const message = icons.message;

      if (isSetString(message)) {
        resolvedConfig.icons.message = {
          header: {
            help: message,
            success: message,
            info: message,
            debug: message,
            warning: message,
            danger: message,
            error: message
          }
        };
      } else if (isSetObject(message)) {
        resolvedConfig.icons.message.header ??=
          {} as ThemeIconMessageStateConfig;
        const header = message.header;

        if (isSetString(header)) {
          resolvedConfig.icons.message = {
            header: {
              help: header,
              success: header,
              info: header,
              debug: header,
              warning: header,
              danger: header,
              error: header
            }
          };
        } else if (isSetObject(header)) {
          if (isSetString(header.help)) {
            resolvedConfig.icons.message.header.help = header.help;
          }
          if (isSetString(header.success)) {
            resolvedConfig.icons.message.header.success = header.success;
          }
          if (isSetString(header.info)) {
            resolvedConfig.icons.message.header.info = header.info;
          }
          if (isSetString(header.debug)) {
            resolvedConfig.icons.message.header.debug = header.debug;
          }
          if (isSetString(header.warning)) {
            resolvedConfig.icons.message.header.warning = header.warning;
          }
          if (isSetString(header.danger)) {
            resolvedConfig.icons.message.header.danger = header.danger;
          }
          if (isSetString(header.error)) {
            resolvedConfig.icons.message.header.error = header.error;
          }
        }
      }

      resolvedConfig.icons.banner ??= {
        header: {}
      } as ThemeIconTypeResolvedConfig<ThemeIconSubItemConfig>;
      const banner = icons.banner;

      if (isSetString(banner)) {
        resolvedConfig.icons.banner = {
          header: {
            primary: banner,
            secondary: banner,
            tertiary: banner
          }
        };
      } else if (isSetObject(banner)) {
        resolvedConfig.icons.banner.header ??= {} as ThemeIconSubItemConfig;
        const header = banner.header as ThemeIconSubItemConfig;

        if (isSetString(banner.header)) {
          resolvedConfig.icons.banner = {
            header: {
              primary: banner.header,
              secondary: banner.header,
              tertiary: banner.header
            }
          };
        } else if (isSetObject(banner.header)) {
          if (isSetString(header.primary)) {
            resolvedConfig.icons.banner.header.primary = header.primary;
          }
          if (isSetString(header.secondary)) {
            resolvedConfig.icons.banner.header.secondary = header.secondary;
          }
          if (isSetString(header.tertiary)) {
            resolvedConfig.icons.banner.header.tertiary = header.tertiary;
          }
        }
      }

      resolvedConfig.icons.prompt ??= {} as ThemeIconPromptStateConfig;
      const prompt = icons.prompt;

      if (isSetString(prompt)) {
        resolvedConfig.icons.prompt = {
          active: prompt,
          cancelled: prompt,
          error: prompt,
          warning: prompt,
          submitted: prompt,
          disabled: prompt
        };
      } else if (isSetObject(prompt)) {
        if (isSetString(prompt.active)) {
          resolvedConfig.icons.prompt.active = prompt.active;
        }
        if (isSetString(prompt.cancelled)) {
          resolvedConfig.icons.prompt.cancelled = prompt.cancelled;
        }
        if (isSetString(prompt.error)) {
          resolvedConfig.icons.prompt.error = prompt.error;
        }
        if (isSetString(prompt.warning)) {
          resolvedConfig.icons.prompt.warning = prompt.warning;
        }
        if (isSetString(prompt.submitted)) {
          resolvedConfig.icons.prompt.submitted = prompt.submitted;
        }
        if (isSetString(prompt.disabled)) {
          resolvedConfig.icons.prompt.disabled = prompt.disabled;
        }
      }

      resolvedConfig.icons.spinner ??= {} as ThemeIconSpinnerStateConfig;
      const spinner = icons.spinner;

      if (isSetString(spinner)) {
        resolvedConfig.icons.spinner = {
          help: spinner,
          success: spinner,
          info: spinner,
          warning: spinner,
          error: spinner
        };
      } else if (isSetObject(spinner)) {
        if (isSetString(spinner.help)) {
          resolvedConfig.icons.spinner.help = spinner.help;
        }
        if (isSetString(spinner.success)) {
          resolvedConfig.icons.spinner.success = spinner.success;
        }
        if (isSetString(spinner.info)) {
          resolvedConfig.icons.spinner.info = spinner.info;
        }
        if (isSetString(spinner.warning)) {
          resolvedConfig.icons.spinner.warning = spinner.warning;
        }
        if (isSetString(spinner.error)) {
          resolvedConfig.icons.spinner.error = spinner.error;
        }
      }
    }

    // #endregion Icons

    // #endregion Tiered token resolution

    // #region Missing token defaulting

    if (
      !resolvedConfig.icons.prompt?.active &&
      resolvedConfig.icons?.banner?.header?.primary
    ) {
      resolvedConfig.icons.prompt.active =
        resolvedConfig.icons.banner.header.primary;
    }
    if (
      !resolvedConfig.icons.prompt?.submitted &&
      resolvedConfig.icons.message?.header?.success
    ) {
      resolvedConfig.icons.prompt.submitted =
        resolvedConfig.icons.message.header.success;
    }
    if (
      !resolvedConfig.icons.prompt?.warning &&
      resolvedConfig.icons.message?.header?.warning
    ) {
      resolvedConfig.icons.prompt.warning =
        resolvedConfig.icons.message.header.warning;
    }
    if (
      !resolvedConfig.icons.prompt?.error &&
      resolvedConfig.icons.message?.header?.error
    ) {
      resolvedConfig.icons.prompt.error =
        resolvedConfig.icons.message.header.error;
    }
    if (
      !resolvedConfig.icons.prompt?.cancelled &&
      resolvedConfig.icons.message?.header?.error
    ) {
      resolvedConfig.icons.prompt.cancelled =
        resolvedConfig.icons.message.header.error;
    }

    if (
      !resolvedConfig.icons.spinner?.success &&
      resolvedConfig.icons.message?.header?.success
    ) {
      resolvedConfig.icons.spinner.success =
        resolvedConfig.icons.message.header.success;
    }
    if (
      !resolvedConfig.icons.spinner?.warning &&
      resolvedConfig.icons.message?.header?.warning
    ) {
      resolvedConfig.icons.spinner.warning =
        resolvedConfig.icons.message.header.warning;
    }
    if (
      !resolvedConfig.icons.spinner?.error &&
      resolvedConfig.icons.message?.header?.error
    ) {
      resolvedConfig.icons.spinner.error =
        resolvedConfig.icons.message.header.error;
    }
    if (
      !resolvedConfig.icons.spinner?.info &&
      resolvedConfig.icons.message?.header?.info
    ) {
      resolvedConfig.icons.spinner.info =
        resolvedConfig.icons.message.header.info;
    }
    if (
      !resolvedConfig.icons.spinner?.help &&
      resolvedConfig.icons.message?.header?.help
    ) {
      resolvedConfig.icons.spinner.help =
        resolvedConfig.icons.message.header.help;
    }

    // #endregion Missing token defaulting

    mergeThemes(context, resolvedConfig);

    return dictionary;
  }
});
