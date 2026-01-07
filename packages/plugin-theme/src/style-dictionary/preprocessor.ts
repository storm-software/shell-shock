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
  ThemeBorderStyleMessageStateUserConfig,
  ThemeBorderStyleSectionTypesUserConfig,
  ThemeBorderStylesResolvedConfig,
  ThemeBorderStyleSubItemUserConfig,
  ThemeBorderStylesUserConfig,
  ThemeColorBannerSubItem,
  ThemeColorBodySubItem,
  ThemeColorBorderItemsResolvedConfig,
  ThemeColorBorderItemsUserConfig,
  ThemeColorMessageState,
  ThemeColorMessageSubItemResolvedConfig,
  ThemeColorsResolvedConfig,
  ThemeColorSubItem,
  ThemeColorTextItemsResolvedConfig,
  ThemeColorTextItemsUserConfig,
  ThemeColorUsageSubItem,
  ThemeIconMessageStateConfig,
  ThemeIconsResolvedConfig,
  ThemeIconSubItemConfig,
  ThemeIconsUserConfig,
  ThemeIconTypeResolvedConfig,
  ThemeLabelsResolvedConfig,
  ThemeLabelsUserConfig,
  ThemeLabelTypeResolvedConfig,
  ThemePaddingResolvedConfig,
  ThemeResolvedConfig,
  ThemeStyleBorderIdentifiers
} from "../types/theme";
import { resolveBorderStyle } from "./helpers";

/**
 * Shell Shock - Theme Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const preprocessor = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/preprocessor",
  preprocessor: (
    dictionary: PreprocessedTokens,
    _options: Config | PlatformConfig
  ): PreprocessedTokens => {
    const resolvedConfig = {} as ThemeResolvedConfig;
    resolvedConfig.name =
      (dictionary as DesignToken).$theme ?? context.config.name;

    // #region Tiered token resolution

    // #region Colors

    resolvedConfig.colors ??= {
      text: {
        banner: {},
        heading: {},
        body: {},
        message: { link: {}, header: {}, footer: {}, description: {} }
      },
      border: {
        banner: { outline: {}, divider: {} },
        app: { outline: {}, divider: {} },
        message: { outline: {}, divider: {} }
      }
    } as ThemeColorsResolvedConfig;
    const colors = dictionary.colors;

    if (isSetString(colors)) {
      resolvedConfig.colors = {
        text: {
          banner: {
            title: colors,
            header: colors,
            footer: colors,
            command: colors,
            description: colors
          },
          heading: {
            primary: colors,
            secondary: colors,
            tertiary: colors
          },
          body: {
            primary: colors,
            secondary: colors,
            tertiary: colors,
            link: colors
          },
          message: {
            link: {
              help: colors,
              success: colors,
              info: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            header: {
              help: colors,
              success: colors,
              info: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            footer: {
              help: colors,
              success: colors,
              info: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            description: {
              help: colors,
              success: colors,
              info: colors,
              warning: colors,
              danger: colors,
              error: colors
            }
          },
          usage: {
            bin: colors,
            command: colors,
            subcommand: colors,
            options: colors,
            params: colors,
            description: colors
          }
        },
        border: {
          banner: {
            outline: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            divider: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            }
          },
          app: {
            outline: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            divider: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            }
          },
          message: {
            outline: {
              help: colors,
              success: colors,
              info: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            divider: {
              help: colors,
              success: colors,
              info: colors,
              warning: colors,
              danger: colors,
              error: colors
            }
          }
        }
      };
    } else if (isSetObject(colors)) {
      resolvedConfig.colors.text ??= {
        banner: {},
        heading: {},
        body: {},
        message: { link: {}, header: {}, footer: {}, description: {} }
      } as ThemeColorTextItemsResolvedConfig;
      const text = colors.text as ThemeColorTextItemsUserConfig;

      if (isSetString(text)) {
        resolvedConfig.colors.text = {
          banner: {
            title: text,
            header: text,
            footer: text,
            command: text,
            description: text
          },
          heading: {
            primary: text,
            secondary: text,
            tertiary: text
          },
          body: {
            primary: text,
            secondary: text,
            tertiary: text,
            link: text
          },
          message: {
            link: {
              help: text,
              success: text,
              info: text,
              warning: text,
              danger: text,
              error: text
            },
            header: {
              help: text,
              success: text,
              info: text,
              warning: text,
              danger: text,
              error: text
            },
            footer: {
              help: text,
              success: text,
              info: text,
              warning: text,
              danger: text,
              error: text
            },
            description: {
              help: text,
              success: text,
              info: text,
              warning: text,
              danger: text,
              error: text
            }
          },
          usage: {
            bin: text,
            command: text,
            subcommand: text,
            options: text,
            params: text,
            description: text
          }
        };
      } else if (isSetObject(text)) {
        resolvedConfig.colors.text.banner ??= {} as ThemeColorBannerSubItem;
        const banner = text.banner;

        if (isSetString(banner)) {
          resolvedConfig.colors.text.banner = {
            title: banner,
            header: banner,
            footer: banner,
            command: banner,
            description: banner
          };
        } else if (isSetObject(text.banner)) {
          if (isSetString(text.banner.title)) {
            resolvedConfig.colors.text.banner.title = text.banner.title;
          }
          if (isSetString(text.banner.header)) {
            resolvedConfig.colors.text.banner.header = text.banner.header;
          }
          if (isSetString(text.banner.footer)) {
            resolvedConfig.colors.text.banner.footer = text.banner.footer;
          }
          if (isSetString(text.banner.command)) {
            resolvedConfig.colors.text.banner.command = text.banner.command;
          }
          if (isSetString(text.banner.description)) {
            resolvedConfig.colors.text.banner.description =
              text.banner.description;
          }
        }

        resolvedConfig.colors.text.body ??= {} as ThemeColorBodySubItem;

        if (isSetString(text.body)) {
          const color = (text as DesignToken).body as string;

          resolvedConfig.colors.text.body = {
            primary: color,
            secondary: color,
            tertiary: color,
            link: color
          };
        } else if (isSetObject(text.body)) {
          if (isSetString(text.body.primary)) {
            resolvedConfig.colors.text.body.primary = text.body.primary;
          }
          if (isSetString(text.body.secondary)) {
            resolvedConfig.colors.text.body.secondary = text.body.secondary;
          }
          if (isSetString(text.body.tertiary)) {
            resolvedConfig.colors.text.body.tertiary = text.body.tertiary;
          }
          if (isSetString(text.body.link)) {
            resolvedConfig.colors.text.body.link = text.body.link;
          }
        }

        resolvedConfig.colors.text.heading ??= {} as ThemeColorSubItem;

        if (isSetString(text.heading)) {
          const color = (text as DesignToken).heading as string;

          resolvedConfig.colors.text.heading = {
            primary: color,
            secondary: color,
            tertiary: color
          };
        } else if (isSetObject(text.heading)) {
          if (isSetString(text.heading.primary)) {
            resolvedConfig.colors.text.heading.primary = text.heading.primary;
          }
          if (isSetString(text.heading.secondary)) {
            resolvedConfig.colors.text.heading.secondary =
              text.heading.secondary;
          }
          if (isSetString(text.heading.tertiary)) {
            resolvedConfig.colors.text.heading.tertiary = text.heading.tertiary;
          }
        }

        resolvedConfig.colors.text.usage ??= {} as ThemeColorUsageSubItem;

        if (isSetString(text.usage)) {
          resolvedConfig.colors.text.usage = {
            bin: text.usage,
            command: text.usage,
            subcommand: text.usage,
            options: text.usage,
            params: text.usage,
            description: text.usage
          };
        } else if (isSetObject(text.usage)) {
          if (isSetString(text.usage.bin)) {
            resolvedConfig.colors.text.usage.bin = text.usage.bin;
          }
          if (isSetString(text.usage.command)) {
            resolvedConfig.colors.text.usage.command = text.usage.command;
          }
          if (isSetString(text.usage.subcommand)) {
            resolvedConfig.colors.text.usage.subcommand = text.usage.subcommand;
          }
          if (isSetString(text.usage.options)) {
            resolvedConfig.colors.text.usage.options = text.usage.options;
          }
          if (isSetString(text.usage.params)) {
            resolvedConfig.colors.text.usage.params = text.usage.params;
          }
          if (isSetString(text.usage.description)) {
            resolvedConfig.colors.text.usage.description =
              text.usage.description;
          }
        }

        resolvedConfig.colors.text.message ??= {
          link: {},
          header: {},
          footer: {},
          description: {}
        } as ThemeColorMessageSubItemResolvedConfig;
        const message = text.message;

        if (isSetString(message)) {
          resolvedConfig.colors.text.message = {
            link: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            },
            header: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            },
            footer: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            },
            description: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            }
          };
        } else if (isSetObject(message)) {
          resolvedConfig.colors.text.message.link ??=
            {} as ThemeColorMessageState;
          const link = message.link;

          if (isSetString(link)) {
            resolvedConfig.colors.text.message.link = {
              help: link,
              success: link,
              info: link,
              warning: link,
              danger: link,
              error: link
            };
          } else if (isSetObject(link)) {
            if (isSetString(link.help)) {
              resolvedConfig.colors.text.message.link.help = link.help;
            }
            if (isSetString(link.success)) {
              resolvedConfig.colors.text.message.link.success = link.success;
            }
            if (isSetString(link.info)) {
              resolvedConfig.colors.text.message.link.info = link.info;
            }
            if (isSetString(link.warning)) {
              resolvedConfig.colors.text.message.link.warning = link.warning;
            }
            if (isSetString(link.danger)) {
              resolvedConfig.colors.text.message.link.danger = link.danger;
            }
            if (isSetString(link.error)) {
              resolvedConfig.colors.text.message.link.error = link.error;
            }
          }

          resolvedConfig.colors.text.message.description ??=
            {} as ThemeColorMessageState;
          const description = message.description;

          if (isSetString(description)) {
            resolvedConfig.colors.text.message.description = {
              help: description,
              success: description,
              info: description,
              warning: description,
              danger: description,
              error: description
            };
          } else if (isSetObject(description)) {
            if (isSetString(description.help)) {
              resolvedConfig.colors.text.message.description.help =
                description.help;
            }
            if (isSetString(description.success)) {
              resolvedConfig.colors.text.message.description.success =
                description.success;
            }
            if (isSetString(description.info)) {
              resolvedConfig.colors.text.message.description.info =
                description.info;
            }
            if (isSetString(description.warning)) {
              resolvedConfig.colors.text.message.description.warning =
                description.warning;
            }
            if (isSetString(description.danger)) {
              resolvedConfig.colors.text.message.description.danger =
                description.danger;
            }
            if (isSetString(description.error)) {
              resolvedConfig.colors.text.message.description.error =
                description.error;
            }
          }

          resolvedConfig.colors.text.message.header ??=
            {} as ThemeColorMessageState;
          const header = message.header;

          if (isSetString(header)) {
            resolvedConfig.colors.text.message.header = {
              help: header,
              success: header,
              info: header,
              warning: header,
              danger: header,
              error: header
            };
          } else if (isSetObject(header)) {
            if (isSetString(header.help)) {
              resolvedConfig.colors.text.message.header.help = header.help;
            }
            if (isSetString(header.success)) {
              resolvedConfig.colors.text.message.header.success =
                header.success;
            }
            if (isSetString(header.info)) {
              resolvedConfig.colors.text.message.header.info = header.info;
            }
            if (isSetString(header.warning)) {
              resolvedConfig.colors.text.message.header.warning =
                header.warning;
            }
            if (isSetString(header.danger)) {
              resolvedConfig.colors.text.message.header.danger = header.danger;
            }
            if (isSetString(header.error)) {
              resolvedConfig.colors.text.message.header.error = header.error;
            }
          }

          resolvedConfig.colors.text.message.footer ??=
            {} as ThemeColorMessageState;
          const footer = message.footer;

          if (isSetString(footer)) {
            resolvedConfig.colors.text.message.footer = {
              help: footer,
              success: footer,
              info: footer,
              warning: footer,
              danger: footer,
              error: footer
            };
          } else if (isSetObject(footer)) {
            if (isSetString(footer.help)) {
              resolvedConfig.colors.text.message.footer.help = footer.help;
            }
            if (isSetString(footer.success)) {
              resolvedConfig.colors.text.message.footer.success =
                footer.success;
            }
            if (isSetString(footer.info)) {
              resolvedConfig.colors.text.message.footer.info = footer.info;
            }
            if (isSetString(footer.warning)) {
              resolvedConfig.colors.text.message.footer.warning =
                footer.warning;
            }
            if (isSetString(footer.danger)) {
              resolvedConfig.colors.text.message.footer.danger = footer.danger;
            }
            if (isSetString(footer.error)) {
              resolvedConfig.colors.text.message.footer.error = footer.error;
            }
          }
        }
      }

      resolvedConfig.colors.border ??= {
        banner: { outline: {}, divider: {} },
        app: { outline: {}, divider: {} },
        message: { outline: {}, divider: {} }
      } as ThemeColorBorderItemsResolvedConfig;
      const border = colors.border as ThemeColorBorderItemsUserConfig;

      if (isSetString(border)) {
        resolvedConfig.colors.border = {
          banner: {
            outline: {
              primary: border,
              secondary: border,
              tertiary: border
            },
            divider: {
              primary: border,
              secondary: border,
              tertiary: border
            }
          },
          app: {
            outline: {
              primary: border,
              secondary: border,
              tertiary: border
            },
            divider: {
              primary: border,
              secondary: border,
              tertiary: border
            }
          },
          message: {
            outline: {
              help: border,
              success: border,
              info: border,
              warning: border,
              danger: border,
              error: border
            },
            divider: {
              help: border,
              success: border,
              info: border,
              warning: border,
              danger: border,
              error: border
            }
          }
        };
      } else if (isSetObject(border)) {
        resolvedConfig.colors.border.banner ??= {
          outline: {},
          divider: {}
        } as ThemeColorBorderItemsResolvedConfig["banner"];
        const banner = border.banner;

        if (isSetString(banner)) {
          resolvedConfig.colors.border.banner = {
            outline: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            divider: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            }
          };
        } else if (isSetObject(banner)) {
          if ("outline" in banner || "divider" in banner) {
            resolvedConfig.colors.border.banner.outline =
              {} as ThemeColorSubItem;
            const outline = banner.outline as ThemeColorSubItem;
            if (isSetString(outline)) {
              resolvedConfig.colors.border.banner.outline = {
                primary: outline,
                secondary: outline,
                tertiary: outline
              };
            } else if (isSetObject(outline)) {
              if (isSetString(outline.primary)) {
                resolvedConfig.colors.border.banner.outline.primary =
                  outline.primary;
              }
              if (isSetString(outline.secondary)) {
                resolvedConfig.colors.border.banner.outline.secondary =
                  outline.secondary;
              }
              if (isSetString(outline.tertiary)) {
                resolvedConfig.colors.border.banner.outline.tertiary =
                  outline.tertiary;
              }
            }

            resolvedConfig.colors.border.banner.divider ??=
              {} as ThemeColorSubItem;
            const divider = banner.divider as ThemeColorSubItem;

            if (isSetString(divider)) {
              resolvedConfig.colors.border.banner.divider = {
                primary: divider,
                secondary: divider,
                tertiary: divider
              };
            } else if (isSetObject(divider)) {
              if (isSetString(divider.primary)) {
                resolvedConfig.colors.border.banner.divider.primary =
                  divider.primary;
              }
              if (isSetString(divider.secondary)) {
                resolvedConfig.colors.border.banner.divider.secondary =
                  divider.secondary;
              }
              if (isSetString(divider.tertiary)) {
                resolvedConfig.colors.border.banner.divider.tertiary =
                  divider.tertiary;
              }
            }
          } else {
            resolvedConfig.colors.border.banner.outline ??=
              {} as ThemeColorSubItem;
            resolvedConfig.colors.border.banner.divider ??=
              {} as ThemeColorSubItem;
            const banner = border.banner as ThemeColorSubItem;

            if (isSetString(banner.primary)) {
              resolvedConfig.colors.border.banner.outline.primary =
                banner.primary;
              resolvedConfig.colors.border.banner.divider.primary =
                banner.primary;
            }

            if (isSetString(banner.secondary)) {
              resolvedConfig.colors.border.banner.outline.secondary =
                banner.secondary;
              resolvedConfig.colors.border.banner.divider.secondary =
                banner.secondary;
            }

            if (isSetString(banner.tertiary)) {
              resolvedConfig.colors.border.banner.outline.tertiary =
                banner.tertiary;
              resolvedConfig.colors.border.banner.divider.tertiary =
                banner.tertiary;
            }
          }
        }

        resolvedConfig.colors.border.app ??= {
          outline: {},
          divider: {}
        } as ThemeColorBorderItemsResolvedConfig["app"];
        const app = border.app;

        if (isSetString(app)) {
          resolvedConfig.colors.border.app = {
            outline: {
              primary: app,
              secondary: app,
              tertiary: app
            },
            divider: {
              primary: app,
              secondary: app,
              tertiary: app
            }
          };
        } else if (isSetObject(app)) {
          resolvedConfig.colors.border.app ??=
            {} as ThemeColorBorderItemsResolvedConfig["app"];

          if ("outline" in app || "divider" in app) {
            if (isSetString(app.outline)) {
              resolvedConfig.colors.border.app.outline = {
                primary: app.outline,
                secondary: app.outline,
                tertiary: app.outline
              };
            } else if (isSetObject(app.outline)) {
              resolvedConfig.colors.border.app.outline =
                {} as ThemeColorSubItem;
              const outline = app.outline as ThemeColorSubItem;

              if (isSetString(outline.primary)) {
                resolvedConfig.colors.border.app.outline.primary =
                  outline.primary;
              }
              if (isSetString(outline.secondary)) {
                resolvedConfig.colors.border.app.outline.secondary =
                  outline.secondary;
              }
              if (isSetString(outline.tertiary)) {
                resolvedConfig.colors.border.app.outline.tertiary =
                  outline.tertiary;
              }
            }

            if (isSetString(app.divider)) {
              resolvedConfig.colors.border.app.divider = {
                primary: app.divider,
                secondary: app.divider,
                tertiary: app.divider
              };
            } else if (isSetObject(app.divider)) {
              resolvedConfig.colors.border.app.divider =
                {} as ThemeColorSubItem;
              const divider = app.divider as ThemeColorSubItem;

              if (isSetString(divider.primary)) {
                resolvedConfig.colors.border.app.divider.primary =
                  divider.primary;
              }
              if (isSetString(divider.secondary)) {
                resolvedConfig.colors.border.app.divider.secondary =
                  divider.secondary;
              }
              if (isSetString(divider.tertiary)) {
                resolvedConfig.colors.border.app.divider.tertiary =
                  divider.tertiary;
              }
            }
          } else {
            resolvedConfig.colors.border.app.outline ??=
              {} as ThemeColorSubItem;
            resolvedConfig.colors.border.app.divider ??=
              {} as ThemeColorSubItem;
            const app = border.app as ThemeColorSubItem;

            if (isSetString(app.primary)) {
              resolvedConfig.colors.border.app.outline.primary = app.primary;
              resolvedConfig.colors.border.app.divider.primary = app.primary;
            }
            if (isSetString(app.secondary)) {
              resolvedConfig.colors.border.app.outline.secondary =
                app.secondary;
              resolvedConfig.colors.border.app.divider.secondary =
                app.secondary;
            }
            if (isSetString(app.tertiary)) {
              resolvedConfig.colors.border.app.outline.tertiary = app.tertiary;
              resolvedConfig.colors.border.app.divider.tertiary = app.tertiary;
            }
          }
        }

        resolvedConfig.colors.border.message ??= {
          outline: {},
          divider: {}
        } as ThemeColorBorderItemsResolvedConfig["message"];
        const message = border.message;

        if (isSetString(message)) {
          resolvedConfig.colors.border.message = {
            outline: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            },
            divider: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            }
          };
        } else if (isSetObject(message)) {
          resolvedConfig.colors.border.message ??=
            {} as ThemeColorBorderItemsResolvedConfig["message"];

          if ("outline" in message || "divider" in message) {
            if (isSetString(message.outline)) {
              resolvedConfig.colors.border.message.outline = {
                help: message.outline,
                success: message.outline,
                info: message.outline,
                warning: message.outline,
                danger: message.outline,
                error: message.outline
              };
            } else if (isSetObject(message.outline)) {
              resolvedConfig.colors.border.message.outline ??=
                {} as ThemeColorMessageState;
              const outline = message.outline as ThemeColorMessageState;

              if (isSetString(outline.help)) {
                resolvedConfig.colors.border.message.outline.help =
                  outline.help;
              }
              if (isSetString(outline.success)) {
                resolvedConfig.colors.border.message.outline.success =
                  outline.success;
              }
              if (isSetString(outline.info)) {
                resolvedConfig.colors.border.message.outline.info =
                  outline.info;
              }
              if (isSetString(outline.warning)) {
                resolvedConfig.colors.border.message.outline.warning =
                  outline.warning;
              }
              if (isSetString(outline.danger)) {
                resolvedConfig.colors.border.message.outline.danger =
                  outline.danger;
              }
              if (isSetString(outline.error)) {
                resolvedConfig.colors.border.message.outline.error =
                  outline.error;
              }
            }

            if (isSetString(message.divider)) {
              resolvedConfig.colors.border.message.divider = {
                help: message.divider,
                success: message.divider,
                info: message.divider,
                warning: message.divider,
                danger: message.divider,
                error: message.divider
              };
            } else if (isSetObject(message.divider)) {
              resolvedConfig.colors.border.message.divider ??=
                {} as ThemeColorMessageState;
              const divider = message.divider as ThemeColorMessageState;

              if (isSetString(divider.help)) {
                resolvedConfig.colors.border.message.divider.help =
                  divider.help;
              }
              if (isSetString(divider.success)) {
                resolvedConfig.colors.border.message.divider.success =
                  divider.success;
              }
              if (isSetString(divider.info)) {
                resolvedConfig.colors.border.message.divider.info =
                  divider.info;
              }
              if (isSetString(divider.warning)) {
                resolvedConfig.colors.border.message.divider.warning =
                  divider.warning;
              }
              if (isSetString(divider.danger)) {
                resolvedConfig.colors.border.message.divider.danger =
                  divider.danger;
              }
              if (isSetString(divider.error)) {
                resolvedConfig.colors.border.message.divider.error =
                  divider.error;
              }
            }
          } else {
            resolvedConfig.colors.border.message.outline ??=
              {} as ThemeColorMessageState;
            resolvedConfig.colors.border.message.divider ??=
              {} as ThemeColorMessageState;

            const message = border.message as ThemeColorMessageState;
            if (isSetString(message.help)) {
              resolvedConfig.colors.border.message.outline.help = message.help;
              resolvedConfig.colors.border.message.divider.help = message.help;
            }
            if (isSetString(message.success)) {
              resolvedConfig.colors.border.message.outline.success =
                message.success;
              resolvedConfig.colors.border.message.divider.success =
                message.success;
            }
            if (isSetString(message.info)) {
              resolvedConfig.colors.border.message.outline.info = message.info;
              resolvedConfig.colors.border.message.divider.info = message.info;
            }
            if (isSetString(message.warning)) {
              resolvedConfig.colors.border.message.outline.warning =
                message.warning;
              resolvedConfig.colors.border.message.divider.warning =
                message.warning;
            }
            if (isSetString(message.danger)) {
              resolvedConfig.colors.border.message.outline.danger =
                message.danger;
              resolvedConfig.colors.border.message.divider.danger =
                message.danger;
            }
            if (isSetString(message.error)) {
              resolvedConfig.colors.border.message.outline.error =
                message.error;
              resolvedConfig.colors.border.message.divider.error =
                message.error;
            }
          }
        }
      }
    }

    // #endregion Colors

    // #region BorderStyles

    resolvedConfig.borderStyles ??= {
      banner: { outline: {}, divider: {} },
      message: { outline: {}, divider: {} },
      app: { outline: {}, divider: {} }
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
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          },
          divider: {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          }
        },
        app: {
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
        outline: {},
        divider: {}
      } as ThemeBorderStylesResolvedConfig["app"];
      const app = borderStyles.app;

      if (isSetString(app)) {
        const borderStyle = resolveBorderStyle(app);

        resolvedConfig.borderStyles.app = {
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
      } else if (isSetObject(app)) {
        resolvedConfig.borderStyles.app ??=
          {} as ThemeBorderStylesResolvedConfig["app"];

        const outline = (
          app as ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
        ).outline;

        if (isSetString(outline)) {
          const borderStyle = resolveBorderStyle(outline);

          resolvedConfig.borderStyles.app.outline = {
            primary: borderStyle,
            secondary: borderStyle,
            tertiary: borderStyle
          };
        } else if (isSetObject(outline)) {
          resolvedConfig.borderStyles.app.outline =
            {} as ThemeBorderStylesResolvedConfig["app"]["outline"];

          if (
            isSetString(
              (outline as ThemeBorderStyleSectionTypesUserConfig).primary
            )
          ) {
            resolvedConfig.borderStyles.app.outline.primary =
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
            resolvedConfig.borderStyles.app.outline.secondary =
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
            resolvedConfig.borderStyles.app.outline.tertiary =
              resolveBorderStyle(
                (outline as ThemeBorderStyleSectionTypesUserConfig)
                  .tertiary as ThemeStyleBorderIdentifiers
              );
          }
        }

        const divider = (
          app as ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
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
            warning: borderStyle,
            danger: borderStyle,
            error: borderStyle
          },
          divider: {
            help: borderStyle,
            success: borderStyle,
            info: borderStyle,
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
        app: padding
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
    }

    // #endregion Padding

    // #region Icons

    resolvedConfig.icons ??= {
      message: { header: {} },
      banner: { header: {} }
    } as ThemeIconsResolvedConfig;
    const icons = dictionary.icons as ThemeIconsUserConfig;

    if (isSetString(icons)) {
      resolvedConfig.icons = {
        message: {
          header: {
            help: icons,
            success: icons,
            info: icons,
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
    }

    // #endregion Icons

    // #region Labels

    resolvedConfig.labels ??= {
      message: { header: {} }
    } as ThemeLabelsResolvedConfig;
    const labels = dictionary.labels as ThemeLabelsUserConfig;

    if (isSetString(labels)) {
      resolvedConfig.labels = {
        message: {
          header: {
            help: labels,
            success: labels,
            info: labels,
            warning: labels,
            danger: labels,
            error: labels
          }
        }
      };
    } else if (isSetObject(labels)) {
      resolvedConfig.labels.message ??= {} as ThemeLabelTypeResolvedConfig;
      const message = labels.message;

      if (isSetString(message)) {
        resolvedConfig.labels = {
          message: {
            header: {
              help: message,
              success: message,
              info: message,
              warning: message,
              danger: message,
              error: message
            }
          }
        };
      } else if (isSetObject(message)) {
        resolvedConfig.labels.message.header =
          {} as ThemeIconMessageStateConfig;
        const header = message.header as ThemeIconMessageStateConfig;

        if (isSetString(header)) {
          resolvedConfig.labels = {
            message: {
              header: {
                help: header,
                success: header,
                info: header,
                warning: header,
                danger: header,
                error: header
              }
            }
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
      }
    }

    // #endregion Labels

    // #endregion Tiered token resolution

    // #region Missing token defaulting

    if (
      !resolvedConfig.colors.text?.body?.tertiary &&
      resolvedConfig.colors.text?.body?.secondary
    ) {
      resolvedConfig.colors.text.body.tertiary =
        resolvedConfig.colors.text.body.secondary;
    }
    if (
      !resolvedConfig.colors.text?.body?.secondary &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.body.secondary =
        resolvedConfig.colors.text.body.tertiary;
    }

    if (
      !resolvedConfig.colors.text?.heading?.tertiary &&
      resolvedConfig.colors.text?.heading?.secondary
    ) {
      resolvedConfig.colors.text.heading.tertiary =
        resolvedConfig.colors.text.heading.secondary;
    }
    if (
      !resolvedConfig.colors.text?.heading?.secondary &&
      resolvedConfig.colors.text?.heading?.tertiary
    ) {
      resolvedConfig.colors.text.heading.secondary =
        resolvedConfig.colors.text.heading.tertiary;
    }

    if (
      !resolvedConfig.colors.text?.heading?.primary &&
      resolvedConfig.colors.text?.banner?.title
    ) {
      resolvedConfig.colors.text.heading.primary =
        resolvedConfig.colors.text.banner.title;
    }
    if (
      !resolvedConfig.colors.text?.heading?.tertiary &&
      resolvedConfig.colors.text?.body?.secondary
    ) {
      resolvedConfig.colors.text.heading.tertiary =
        resolvedConfig.colors.text.body.secondary;
    }
    if (
      !resolvedConfig.colors.text?.heading?.secondary &&
      resolvedConfig.colors.text?.body?.primary
    ) {
      resolvedConfig.colors.text.heading.secondary =
        resolvedConfig.colors.text.body.primary;
    }

    if (
      !resolvedConfig.colors.text?.usage?.bin &&
      resolvedConfig.colors.text?.body?.primary
    ) {
      resolvedConfig.colors.text.usage.bin =
        resolvedConfig.colors.text.body.primary;
    }
    if (
      !resolvedConfig.colors.text?.usage?.command &&
      resolvedConfig.colors.text?.body?.secondary
    ) {
      resolvedConfig.colors.text.usage.command =
        resolvedConfig.colors.text.body.secondary;
    }
    if (
      !resolvedConfig.colors.text?.usage?.subcommand &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.usage.subcommand =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text?.usage?.options &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.usage.options =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text?.usage?.params &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.usage.params =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text?.usage?.description &&
      resolvedConfig.colors.text?.body?.secondary
    ) {
      resolvedConfig.colors.text.usage.description =
        resolvedConfig.colors.text.body.secondary;
    }

    if (
      !resolvedConfig.colors.text?.banner?.title &&
      resolvedConfig.colors.text?.heading?.primary
    ) {
      resolvedConfig.colors.text.banner.title =
        resolvedConfig.colors.text.heading.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.command &&
      (resolvedConfig.colors.text?.heading?.secondary ||
        resolvedConfig.colors.text?.heading?.primary)
    ) {
      resolvedConfig.colors.text.banner.command =
        resolvedConfig.colors.text.heading.secondary ||
        resolvedConfig.colors.text.heading.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.description &&
      resolvedConfig.colors.text?.body?.primary
    ) {
      resolvedConfig.colors.text.banner.description =
        resolvedConfig.colors.text.body.primary;
    }
    if (
      !resolvedConfig.colors.border?.banner?.outline?.primary &&
      (resolvedConfig.colors.border?.banner?.outline?.secondary ||
        resolvedConfig.colors.border?.banner?.outline?.tertiary)
    ) {
      resolvedConfig.colors.border.banner.outline.primary =
        resolvedConfig.colors.border.banner.outline.secondary ||
        resolvedConfig.colors.border.banner.outline.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.banner?.outline?.secondary &&
      (resolvedConfig.colors.border?.banner?.outline?.primary ||
        resolvedConfig.colors.border?.banner?.outline?.tertiary)
    ) {
      resolvedConfig.colors.border.banner.outline.secondary =
        resolvedConfig.colors.border.banner.outline.primary ||
        resolvedConfig.colors.border.banner.outline.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.banner?.outline?.tertiary &&
      (resolvedConfig.colors.border?.banner?.outline?.primary ||
        resolvedConfig.colors.border?.banner?.outline?.secondary)
    ) {
      resolvedConfig.colors.border.banner.outline.tertiary =
        resolvedConfig.colors.border.banner.outline.primary ||
        resolvedConfig.colors.border.banner.outline.secondary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.header &&
      resolvedConfig.colors.border?.banner?.outline?.primary
    ) {
      resolvedConfig.colors.text.banner.header =
        resolvedConfig.colors.border.banner.outline.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.footer &&
      resolvedConfig.colors.border?.banner?.outline?.primary
    ) {
      resolvedConfig.colors.text.banner.footer =
        resolvedConfig.colors.border.banner.outline.primary;
    }
    if (
      !resolvedConfig.colors.border?.banner?.outline?.primary &&
      resolvedConfig.colors.text?.banner?.title
    ) {
      resolvedConfig.colors.border.banner.outline.primary =
        resolvedConfig.colors.text.banner.title;
    }

    if (
      !resolvedConfig.colors.border?.app?.divider?.primary &&
      (resolvedConfig.colors.border?.app?.divider?.secondary ||
        resolvedConfig.colors.border?.app?.divider?.tertiary)
    ) {
      resolvedConfig.colors.border.app.divider.primary =
        resolvedConfig.colors.border.app.divider.secondary ||
        resolvedConfig.colors.border.app.divider.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.app?.divider?.secondary &&
      (resolvedConfig.colors.border?.app?.divider?.primary ||
        resolvedConfig.colors.border?.app?.divider?.tertiary)
    ) {
      resolvedConfig.colors.border.app.divider.secondary =
        resolvedConfig.colors.border.app.divider.primary ||
        resolvedConfig.colors.border.app.divider.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.app?.divider?.tertiary &&
      (resolvedConfig.colors.border?.app?.divider?.primary ||
        resolvedConfig.colors.border?.app?.divider?.secondary)
    ) {
      resolvedConfig.colors.border.app.divider.tertiary =
        resolvedConfig.colors.border.app.divider.primary ||
        resolvedConfig.colors.border.app.divider.secondary;
    }

    if (
      !resolvedConfig.colors.border?.app?.outline?.primary &&
      (resolvedConfig.colors.border?.app?.outline?.secondary ||
        resolvedConfig.colors.border?.app?.outline?.tertiary)
    ) {
      resolvedConfig.colors.border.app.outline.primary =
        resolvedConfig.colors.border.app.outline.secondary ||
        resolvedConfig.colors.border.app.outline.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.app?.outline?.secondary &&
      (resolvedConfig.colors.border?.app?.outline?.primary ||
        resolvedConfig.colors.border?.app?.outline?.tertiary)
    ) {
      resolvedConfig.colors.border.app.outline.secondary =
        resolvedConfig.colors.border.app.outline.primary ||
        resolvedConfig.colors.border.app.outline.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.app?.outline?.tertiary &&
      (resolvedConfig.colors.border?.app?.outline?.primary ||
        resolvedConfig.colors.border?.app?.outline?.secondary)
    ) {
      resolvedConfig.colors.border.app.outline.tertiary =
        resolvedConfig.colors.border.app.outline.primary ||
        resolvedConfig.colors.border.app.outline.secondary;
    }

    if (
      !resolvedConfig.colors.border?.message?.divider?.error &&
      resolvedConfig.colors.border?.message?.divider?.danger
    ) {
      resolvedConfig.colors.border.message.divider.error =
        resolvedConfig.colors.border.message.divider.danger;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.danger &&
      resolvedConfig.colors.border?.message?.divider?.error
    ) {
      resolvedConfig.colors.border.message.divider.danger =
        resolvedConfig.colors.border.message.divider.error;
    }
    if (
      !resolvedConfig.colors.border?.message?.outline?.error &&
      resolvedConfig.colors.border?.message?.outline?.danger
    ) {
      resolvedConfig.colors.border.message.outline.error =
        resolvedConfig.colors.border.message.outline.danger;
    }
    if (
      !resolvedConfig.colors.border?.message?.outline?.danger &&
      resolvedConfig.colors.border?.message?.outline?.error
    ) {
      resolvedConfig.colors.border.message.outline.danger =
        resolvedConfig.colors.border.message.outline.error;
    }

    if (
      !resolvedConfig.colors.border?.message?.divider?.help &&
      resolvedConfig.colors.border?.message?.outline?.help
    ) {
      resolvedConfig.colors.border.message.divider.help =
        resolvedConfig.colors.border.message.outline.help;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.success &&
      resolvedConfig.colors.border?.message?.outline?.success
    ) {
      resolvedConfig.colors.border.message.divider.success =
        resolvedConfig.colors.border.message.outline.success;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.info &&
      resolvedConfig.colors.border?.message?.outline?.info
    ) {
      resolvedConfig.colors.border.message.divider.info =
        resolvedConfig.colors.border.message.outline.info;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.warning &&
      resolvedConfig.colors.border?.message?.outline?.warning
    ) {
      resolvedConfig.colors.border.message.divider.warning =
        resolvedConfig.colors.border.message.outline.warning;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.danger &&
      resolvedConfig.colors.border?.message?.outline?.danger
    ) {
      resolvedConfig.colors.border.message.divider.danger =
        resolvedConfig.colors.border.message.outline.danger;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.error &&
      resolvedConfig.colors.border?.message?.outline?.error
    ) {
      resolvedConfig.colors.border.message.divider.error =
        resolvedConfig.colors.border.message.outline.error;
    }

    if (
      !resolvedConfig.colors.text.message?.header?.help &&
      resolvedConfig.colors.border?.message?.outline?.help
    ) {
      resolvedConfig.colors.text.message.header.help =
        resolvedConfig.colors.border.message.outline.help;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.help &&
      resolvedConfig.colors.border?.message?.outline?.help
    ) {
      resolvedConfig.colors.text.message.footer.help =
        resolvedConfig.colors.border.message.outline.help;
    }

    if (
      !resolvedConfig.colors.text.message?.header?.success &&
      resolvedConfig.colors.border?.message?.outline?.success
    ) {
      resolvedConfig.colors.text.message.header.success =
        resolvedConfig.colors.border.message.outline.success;
    }
    if (
      !resolvedConfig.colors.text.message.footer.success &&
      resolvedConfig.colors.border?.message?.outline?.success
    ) {
      resolvedConfig.colors.text.message.footer.success =
        resolvedConfig.colors.border.message.outline.success;
    }

    if (
      !resolvedConfig.colors.text.message?.header?.info &&
      resolvedConfig.colors.border?.message?.outline?.info
    ) {
      resolvedConfig.colors.text.message.header.info =
        resolvedConfig.colors.border.message.outline.info;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.info &&
      resolvedConfig.colors.border?.message?.outline?.info
    ) {
      resolvedConfig.colors.text.message.footer.info =
        resolvedConfig.colors.border.message.outline.info;
    }

    if (
      !resolvedConfig.colors.text.message?.header?.warning &&
      resolvedConfig.colors.border?.message?.outline?.warning
    ) {
      resolvedConfig.colors.text.message.header.warning =
        resolvedConfig.colors.border.message.outline.warning;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.warning &&
      resolvedConfig.colors.border?.message?.outline?.warning
    ) {
      resolvedConfig.colors.text.message.footer.warning =
        resolvedConfig.colors.border.message.outline.warning;
    }

    if (
      !resolvedConfig.colors.text.message?.header?.danger &&
      resolvedConfig.colors.border?.message?.outline?.danger
    ) {
      resolvedConfig.colors.text.message.header.danger =
        resolvedConfig.colors.border.message.outline.danger;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.danger &&
      resolvedConfig.colors.border?.message?.outline?.danger
    ) {
      resolvedConfig.colors.text.message.footer.danger =
        resolvedConfig.colors.border.message.outline.danger;
    }

    if (
      !resolvedConfig.colors.text.message?.header?.error &&
      resolvedConfig.colors.border?.message?.outline?.error
    ) {
      resolvedConfig.colors.text.message.header.error =
        resolvedConfig.colors.border.message.outline.error;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.error &&
      resolvedConfig.colors.border?.message?.outline?.error
    ) {
      resolvedConfig.colors.text.message.footer.error =
        resolvedConfig.colors.border.message.outline.error;
    }

    if (
      !resolvedConfig.colors.text.message?.link?.help &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.help =
        resolvedConfig.colors.text.body.link;
    }
    if (
      !resolvedConfig.colors.text.message?.link?.success &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.success =
        resolvedConfig.colors.text.body.link;
    }
    if (
      !resolvedConfig.colors.text.message?.link?.info &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.info =
        resolvedConfig.colors.text.body.link;
    }
    if (
      !resolvedConfig.colors.text.message?.link?.warning &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.warning =
        resolvedConfig.colors.text.body.link;
    }
    if (
      !resolvedConfig.colors.text.message?.link?.danger &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.danger =
        resolvedConfig.colors.text.body.link;
    }
    if (
      !resolvedConfig.colors.text.message?.link?.error &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.error =
        resolvedConfig.colors.text.body.link;
    }

    // #endregion Missing token defaulting

    context.theme = resolvedConfig;

    return dictionary;
  }
});
