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
import type { ThemePluginContext } from "../types/plugin";
import type {
  ThemeColorBannerSubItemResolvedConfig,
  ThemeColorBodySubItem,
  ThemeColorBorderItemsResolvedConfig,
  ThemeColorBorderItemsUserConfig,
  ThemeColorMessageState,
  ThemeColorMessageSubItemResolvedConfig,
  ThemeColorPromptSubItemResolvedConfig,
  ThemeColorsResolvedConfig,
  ThemeColorSubItem,
  ThemeColorTextItemsResolvedConfig,
  ThemeColorTextItemsUserConfig,
  ThemeColorUsageSubItem,
  ThemeResolvedConfig
} from "../types/theme";

/**
 * Shell Shock - Theme Colors Preprocessor
 *
 * @remarks
 * This preprocessor applies custom value transformations to design tokens based on the provided configuration options.
 */
export const colors = (context: ThemePluginContext): Preprocessor => ({
  name: "shell-shock/colors",
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
        app: { table: {}, divider: {} },
        message: { outline: {}, divider: {} }
      }
    } as ThemeColorsResolvedConfig;
    const colors = dictionary.colors;

    if (isSetString(colors)) {
      resolvedConfig.colors = {
        text: {
          banner: {
            title: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            header: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            footer: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            command: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            description: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            },
            link: {
              primary: colors,
              secondary: colors,
              tertiary: colors
            }
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
              debug: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            header: {
              help: colors,
              success: colors,
              info: colors,
              debug: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            footer: {
              help: colors,
              success: colors,
              info: colors,
              debug: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            description: {
              help: colors,
              success: colors,
              info: colors,
              debug: colors,
              warning: colors,
              danger: colors,
              error: colors
            }
          },
          usage: {
            bin: colors,
            command: colors,
            dynamic: colors,
            options: colors,
            arguments: colors,
            description: colors
          },
          prompt: {
            icon: {
              active: colors,
              cancelled: colors,
              warning: colors,
              error: colors,
              submitted: colors,
              disabled: colors
            },
            label: {
              active: colors,
              cancelled: colors,
              warning: colors,
              error: colors,
              submitted: colors,
              disabled: colors
            },
            input: {
              active: colors,
              inactive: colors,
              cancelled: colors,
              warning: colors,
              error: colors,
              submitted: colors,
              disabled: colors
            },
            description: {
              active: colors,
              inactive: colors,
              cancelled: colors,
              warning: colors,
              error: colors,
              submitted: colors,
              disabled: colors
            }
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
            table: {
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
              debug: colors,
              warning: colors,
              danger: colors,
              error: colors
            },
            divider: {
              help: colors,
              success: colors,
              info: colors,
              debug: colors,
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
            title: {
              primary: text,
              secondary: text,
              tertiary: text
            },
            header: {
              primary: text,
              secondary: text,
              tertiary: text
            },
            footer: {
              primary: text,
              secondary: text,
              tertiary: text
            },
            command: {
              primary: text,
              secondary: text,
              tertiary: text
            },
            description: {
              primary: text,
              secondary: text,
              tertiary: text
            },
            link: {
              primary: text,
              secondary: text,
              tertiary: text
            }
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
              debug: text,
              warning: text,
              danger: text,
              error: text
            },
            header: {
              help: text,
              success: text,
              info: text,
              debug: text,
              warning: text,
              danger: text,
              error: text
            },
            footer: {
              help: text,
              success: text,
              info: text,
              debug: text,
              warning: text,
              danger: text,
              error: text
            },
            description: {
              help: text,
              success: text,
              info: text,
              debug: text,
              warning: text,
              danger: text,
              error: text
            }
          },
          usage: {
            bin: text,
            command: text,
            dynamic: text,
            options: text,
            arguments: text,
            description: text
          },
          prompt: {
            icon: {
              active: text,
              cancelled: text,
              warning: text,
              error: text,
              submitted: text,
              disabled: text
            },
            label: {
              active: text,
              cancelled: text,
              warning: text,
              error: text,
              submitted: text,
              disabled: text
            },
            input: {
              active: text,
              inactive: text,
              cancelled: text,
              warning: text,
              error: text,
              submitted: text,
              disabled: text
            },
            description: {
              active: text,
              inactive: text,
              cancelled: text,
              warning: text,
              error: text,
              submitted: text,
              disabled: text
            }
          }
        };
      } else if (isSetObject(text)) {
        resolvedConfig.colors.text.banner ??=
          {} as ThemeColorBannerSubItemResolvedConfig;
        const banner = text.banner;

        if (isSetString(banner)) {
          resolvedConfig.colors.text.banner = {
            title: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            header: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            footer: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            command: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            description: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            },
            link: {
              primary: banner,
              secondary: banner,
              tertiary: banner
            }
          };
        } else if (isSetObject(text.banner)) {
          resolvedConfig.colors.text.banner.title ??= {} as ThemeColorSubItem;
          const title = text.banner.title;

          if (isSetString(text.banner.title)) {
            resolvedConfig.colors.text.banner.title = {
              primary: text.banner.title,
              secondary: text.banner.title,
              tertiary: text.banner.title
            };
          } else if (isSetObject(title)) {
            if (isSetString(title.primary)) {
              resolvedConfig.colors.text.banner.title.primary = title.primary;
            }
            if (isSetString(title.secondary)) {
              resolvedConfig.colors.text.banner.title.secondary =
                title.secondary;
            }
            if (isSetString(title.tertiary)) {
              resolvedConfig.colors.text.banner.title.tertiary = title.tertiary;
            }
          }

          resolvedConfig.colors.text.banner.header ??= {} as ThemeColorSubItem;
          const header = text.banner.header;

          if (isSetString(text.banner.header)) {
            resolvedConfig.colors.text.banner.header = {
              primary: text.banner.header,
              secondary: text.banner.header,
              tertiary: text.banner.header
            };
          } else if (isSetObject(header)) {
            if (isSetString(header.primary)) {
              resolvedConfig.colors.text.banner.header.primary = header.primary;
            }
            if (isSetString(header.secondary)) {
              resolvedConfig.colors.text.banner.header.secondary =
                header.secondary;
            }
            if (isSetString(header.tertiary)) {
              resolvedConfig.colors.text.banner.header.tertiary =
                header.tertiary;
            }
          }

          resolvedConfig.colors.text.banner.footer ??= {} as ThemeColorSubItem;
          const footer = text.banner.footer;

          if (isSetString(text.banner.footer)) {
            resolvedConfig.colors.text.banner.footer = {
              primary: text.banner.footer,
              secondary: text.banner.footer,
              tertiary: text.banner.footer
            };
          } else if (isSetObject(footer)) {
            if (isSetString(footer.primary)) {
              resolvedConfig.colors.text.banner.footer.primary = footer.primary;
            }
            if (isSetString(footer.secondary)) {
              resolvedConfig.colors.text.banner.footer.secondary =
                footer.secondary;
            }
            if (isSetString(footer.tertiary)) {
              resolvedConfig.colors.text.banner.footer.tertiary =
                footer.tertiary;
            }
          }

          resolvedConfig.colors.text.banner.command ??= {} as ThemeColorSubItem;
          const command = text.banner.command;

          if (isSetString(text.banner.command)) {
            resolvedConfig.colors.text.banner.command = {
              primary: text.banner.command,
              secondary: text.banner.command,
              tertiary: text.banner.command
            };
          } else if (isSetObject(command)) {
            if (isSetString(command.primary)) {
              resolvedConfig.colors.text.banner.command.primary =
                command.primary;
            }
            if (isSetString(command.secondary)) {
              resolvedConfig.colors.text.banner.command.secondary =
                command.secondary;
            }
            if (isSetString(command.tertiary)) {
              resolvedConfig.colors.text.banner.command.tertiary =
                command.tertiary;
            }
          }

          resolvedConfig.colors.text.banner.description ??=
            {} as ThemeColorSubItem;
          const description = text.banner.description;

          if (isSetString(text.banner.description)) {
            resolvedConfig.colors.text.banner.description = {
              primary: text.banner.description,
              secondary: text.banner.description,
              tertiary: text.banner.description
            };
          } else if (isSetObject(description)) {
            if (isSetString(description.primary)) {
              resolvedConfig.colors.text.banner.description.primary =
                description.primary;
            }
            if (isSetString(description.secondary)) {
              resolvedConfig.colors.text.banner.description.secondary =
                description.secondary;
            }
            if (isSetString(description.tertiary)) {
              resolvedConfig.colors.text.banner.description.tertiary =
                description.tertiary;
            }
          }

          resolvedConfig.colors.text.banner.link ??= {} as ThemeColorSubItem;
          const link = text.banner.link;

          if (isSetString(text.banner.link)) {
            resolvedConfig.colors.text.banner.link = {
              primary: text.banner.link,
              secondary: text.banner.link,
              tertiary: text.banner.link
            };
          } else if (isSetObject(link)) {
            if (isSetString(link.primary)) {
              resolvedConfig.colors.text.banner.link.primary = link.primary;
            }
            if (isSetString(link.secondary)) {
              resolvedConfig.colors.text.banner.link.secondary = link.secondary;
            }
            if (isSetString(link.tertiary)) {
              resolvedConfig.colors.text.banner.link.tertiary = link.tertiary;
            }
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
            dynamic: text.usage,
            options: text.usage,
            arguments: text.usage,
            description: text.usage
          };
        } else if (isSetObject(text.usage)) {
          if (isSetString(text.usage.bin)) {
            resolvedConfig.colors.text.usage.bin = text.usage.bin;
          }
          if (isSetString(text.usage.command)) {
            resolvedConfig.colors.text.usage.command = text.usage.command;
          }
          if (isSetString(text.usage.dynamic)) {
            resolvedConfig.colors.text.usage.dynamic = text.usage.dynamic;
          }
          if (isSetString(text.usage.options)) {
            resolvedConfig.colors.text.usage.options = text.usage.options;
          }
          if (isSetString(text.usage.arguments)) {
            resolvedConfig.colors.text.usage.arguments = text.usage.arguments;
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
              debug: message,
              warning: message,
              danger: message,
              error: message
            },
            header: {
              help: message,
              success: message,
              info: message,
              debug: message,
              warning: message,
              danger: message,
              error: message
            },
            footer: {
              help: message,
              success: message,
              info: message,
              debug: message,
              warning: message,
              danger: message,
              error: message
            },
            description: {
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
          resolvedConfig.colors.text.message.link ??=
            {} as ThemeColorMessageState;
          const link = message.link;

          if (isSetString(link)) {
            resolvedConfig.colors.text.message.link = {
              help: link,
              success: link,
              info: link,
              debug: link,
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
            if (isSetString(link.debug)) {
              resolvedConfig.colors.text.message.link.debug = link.debug;
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
              debug: description,
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
            if (isSetString(description.debug)) {
              resolvedConfig.colors.text.message.description.debug =
                description.debug;
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
              debug: header,
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
            if (isSetString(header.debug)) {
              resolvedConfig.colors.text.message.header.debug = header.debug;
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
              debug: footer,
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
            if (isSetString(footer.debug)) {
              resolvedConfig.colors.text.message.footer.debug = footer.debug;
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

        resolvedConfig.colors.text.prompt ??=
          {} as ThemeColorPromptSubItemResolvedConfig;
        const prompt = text.prompt;

        if (isSetString(prompt)) {
          resolvedConfig.colors.text.prompt = {
            icon: {
              active: prompt,
              cancelled: prompt,
              warning: prompt,
              error: prompt,
              submitted: prompt,
              disabled: prompt
            },
            label: {
              active: prompt,
              cancelled: prompt,
              warning: prompt,
              error: prompt,
              submitted: prompt,
              disabled: prompt
            },
            input: {
              active: prompt,
              inactive: prompt,
              cancelled: prompt,
              warning: prompt,
              error: prompt,
              submitted: prompt,
              disabled: prompt
            },
            description: {
              active: prompt,
              inactive: prompt,
              cancelled: prompt,
              warning: prompt,
              error: prompt,
              submitted: prompt,
              disabled: prompt
            }
          };
        } else if (isSetObject(prompt)) {
          if (isSetString(prompt.icon)) {
            const icon = prompt.icon;
            resolvedConfig.colors.text.prompt.icon = {
              active: icon,
              cancelled: icon,
              warning: icon,
              error: icon,
              submitted: icon,
              disabled: icon
            };
          } else if (isSetObject(prompt.icon)) {
            if (isSetString(prompt.icon.active)) {
              resolvedConfig.colors.text.prompt.icon.active =
                prompt.icon.active;
            }
            if (isSetString(prompt.icon.cancelled)) {
              resolvedConfig.colors.text.prompt.icon.cancelled =
                prompt.icon.cancelled;
            }
            if (isSetString(prompt.icon.warning)) {
              resolvedConfig.colors.text.prompt.icon.warning =
                prompt.icon.warning;
            }
            if (isSetString(prompt.icon.error)) {
              resolvedConfig.colors.text.prompt.icon.error = prompt.icon.error;
            }
            if (isSetString(prompt.icon.submitted)) {
              resolvedConfig.colors.text.prompt.icon.submitted =
                prompt.icon.submitted;
            }
            if (isSetString(prompt.icon.disabled)) {
              resolvedConfig.colors.text.prompt.icon.disabled =
                prompt.icon.disabled;
            }
          }

          if (isSetString(prompt.label)) {
            const label = prompt.label;
            resolvedConfig.colors.text.prompt.label = {
              active: label,
              cancelled: label,
              warning: label,
              error: label,
              submitted: label,
              disabled: label
            };
          } else if (isSetObject(prompt.label)) {
            if (isSetString(prompt.label.active)) {
              resolvedConfig.colors.text.prompt.label.active =
                prompt.label.active;
            }
            if (isSetString(prompt.label.cancelled)) {
              resolvedConfig.colors.text.prompt.label.cancelled =
                prompt.label.cancelled;
            }
            if (isSetString(prompt.label.warning)) {
              resolvedConfig.colors.text.prompt.label.warning =
                prompt.label.warning;
            }
            if (isSetString(prompt.label.error)) {
              resolvedConfig.colors.text.prompt.label.error =
                prompt.label.error;
            }
            if (isSetString(prompt.label.submitted)) {
              resolvedConfig.colors.text.prompt.label.submitted =
                prompt.label.submitted;
            }
            if (isSetString(prompt.label.disabled)) {
              resolvedConfig.colors.text.prompt.label.disabled =
                prompt.label.disabled;
            }
          }

          if (isSetString(prompt.input)) {
            const input = prompt.input;
            resolvedConfig.colors.text.prompt.input = {
              active: input,
              inactive: input,
              cancelled: input,
              warning: input,
              error: input,
              submitted: input,
              disabled: input
            };
          } else if (isSetObject(prompt.input)) {
            if (isSetString(prompt.input.active)) {
              resolvedConfig.colors.text.prompt.input.active =
                prompt.input.active;
            }
            if (isSetString(prompt.input.inactive)) {
              resolvedConfig.colors.text.prompt.input.inactive =
                prompt.input.inactive;
            }
            if (isSetString(prompt.input.cancelled)) {
              resolvedConfig.colors.text.prompt.input.cancelled =
                prompt.input.cancelled;
            }
            if (isSetString(prompt.input.warning)) {
              resolvedConfig.colors.text.prompt.input.warning =
                prompt.input.warning;
            }
            if (isSetString(prompt.input.error)) {
              resolvedConfig.colors.text.prompt.input.error =
                prompt.input.error;
            }
            if (isSetString(prompt.input.submitted)) {
              resolvedConfig.colors.text.prompt.input.submitted =
                prompt.input.submitted;
            }
            if (isSetString(prompt.input.disabled)) {
              resolvedConfig.colors.text.prompt.input.disabled =
                prompt.input.disabled;
            }
          }

          if (isSetString(prompt.description)) {
            const description = prompt.description;
            resolvedConfig.colors.text.prompt.description = {
              active: description,
              inactive: description,
              cancelled: description,
              warning: description,
              error: description,
              submitted: description,
              disabled: description
            };
          } else if (isSetObject(prompt.description)) {
            if (isSetString(prompt.description.active)) {
              resolvedConfig.colors.text.prompt.description.active =
                prompt.description.active;
            }
            if (isSetString(prompt.description.inactive)) {
              resolvedConfig.colors.text.prompt.description.inactive =
                prompt.description.inactive;
            }
            if (isSetString(prompt.description.cancelled)) {
              resolvedConfig.colors.text.prompt.description.cancelled =
                prompt.description.cancelled;
            }
            if (isSetString(prompt.description.warning)) {
              resolvedConfig.colors.text.prompt.description.warning =
                prompt.description.warning;
            }
            if (isSetString(prompt.description.error)) {
              resolvedConfig.colors.text.prompt.description.error =
                prompt.description.error;
            }
            if (isSetString(prompt.description.submitted)) {
              resolvedConfig.colors.text.prompt.description.submitted =
                prompt.description.submitted;
            }
            if (isSetString(prompt.description.disabled)) {
              resolvedConfig.colors.text.prompt.description.disabled =
                prompt.description.disabled;
            }
          }
        }
      }

      resolvedConfig.colors.border ??= {
        banner: { outline: {}, divider: {} },
        app: { table: {}, divider: {} },
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
            table: {
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
              debug: border,
              warning: border,
              danger: border,
              error: border
            },
            divider: {
              help: border,
              success: border,
              info: border,
              debug: border,
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
          table: {},
          divider: {}
        } as ThemeColorBorderItemsResolvedConfig["app"];
        const app = border.app;

        if (isSetString(app)) {
          resolvedConfig.colors.border.app = {
            table: {
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

          if ("table" in app || "divider" in app) {
            if (isSetString(app.table)) {
              resolvedConfig.colors.border.app.table = {
                primary: app.table,
                secondary: app.table,
                tertiary: app.table
              };
            } else if (isSetObject(app.table)) {
              resolvedConfig.colors.border.app.table = {} as ThemeColorSubItem;
              const table = app.table as ThemeColorSubItem;

              if (isSetString(table.primary)) {
                resolvedConfig.colors.border.app.table.primary = table.primary;
              }
              if (isSetString(table.secondary)) {
                resolvedConfig.colors.border.app.table.secondary =
                  table.secondary;
              }
              if (isSetString(table.tertiary)) {
                resolvedConfig.colors.border.app.table.tertiary =
                  table.tertiary;
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
            resolvedConfig.colors.border.app.table ??= {} as ThemeColorSubItem;
            resolvedConfig.colors.border.app.divider ??=
              {} as ThemeColorSubItem;
            const app = border.app as ThemeColorSubItem;

            if (isSetString(app.primary)) {
              resolvedConfig.colors.border.app.table.primary = app.primary;
              resolvedConfig.colors.border.app.divider.primary = app.primary;
            }
            if (isSetString(app.secondary)) {
              resolvedConfig.colors.border.app.table.secondary = app.secondary;
              resolvedConfig.colors.border.app.divider.secondary =
                app.secondary;
            }
            if (isSetString(app.tertiary)) {
              resolvedConfig.colors.border.app.table.tertiary = app.tertiary;
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
              debug: message,
              warning: message,
              danger: message,
              error: message
            },
            divider: {
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
          resolvedConfig.colors.border.message ??=
            {} as ThemeColorBorderItemsResolvedConfig["message"];

          if ("outline" in message || "divider" in message) {
            if (isSetString(message.outline)) {
              resolvedConfig.colors.border.message.outline = {
                help: message.outline,
                success: message.outline,
                info: message.outline,
                debug: message.outline,
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
              if (isSetString(outline.debug)) {
                resolvedConfig.colors.border.message.outline.debug =
                  outline.debug;
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
                debug: message.divider,
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
              if (isSetString(divider.debug)) {
                resolvedConfig.colors.border.message.divider.debug =
                  divider.debug;
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
            if (isSetString(message.debug)) {
              resolvedConfig.colors.border.message.outline.debug =
                message.debug;
              resolvedConfig.colors.border.message.divider.debug =
                message.debug;
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
      resolvedConfig.colors.text?.banner?.title?.primary
    ) {
      resolvedConfig.colors.text.heading.primary =
        resolvedConfig.colors.text.banner.title.primary;
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
      !resolvedConfig.colors.text?.usage?.dynamic &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.usage.dynamic =
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
      !resolvedConfig.colors.text?.usage?.arguments &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.usage.arguments =
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
      !resolvedConfig.colors.text?.banner?.title?.primary &&
      resolvedConfig.colors.text?.heading?.primary
    ) {
      resolvedConfig.colors.text.banner.title ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.title.primary =
        resolvedConfig.colors.text.heading.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.command?.primary &&
      (resolvedConfig.colors.text?.heading?.secondary ||
        resolvedConfig.colors.text?.heading?.primary)
    ) {
      resolvedConfig.colors.text.banner.command ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.command.primary =
        resolvedConfig.colors.text.heading.secondary ||
        resolvedConfig.colors.text.heading.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.description?.primary &&
      resolvedConfig.colors.text?.body?.primary
    ) {
      resolvedConfig.colors.text.banner.description ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.description.primary =
        resolvedConfig.colors.text.body.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.link?.primary &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.banner.link ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.link.primary =
        resolvedConfig.colors.text.body.link;
    }

    if (
      !resolvedConfig.colors.text?.banner?.title?.secondary &&
      resolvedConfig.colors.text?.banner?.title?.primary
    ) {
      resolvedConfig.colors.text.banner.title ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.title.secondary =
        resolvedConfig.colors.text.banner.title.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.command?.secondary &&
      resolvedConfig.colors.text?.banner?.command?.primary
    ) {
      resolvedConfig.colors.text.banner.command ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.command.secondary =
        resolvedConfig.colors.text.banner.command.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.description?.secondary &&
      resolvedConfig.colors.text?.banner?.description?.primary
    ) {
      resolvedConfig.colors.text.banner.description ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.description.secondary =
        resolvedConfig.colors.text.banner.description.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.link?.secondary &&
      resolvedConfig.colors.text?.banner?.link?.primary
    ) {
      resolvedConfig.colors.text.banner.link ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.link.secondary =
        resolvedConfig.colors.text.banner.link.primary;
    }

    if (
      !resolvedConfig.colors.text?.banner?.title?.tertiary &&
      resolvedConfig.colors.text?.banner?.title?.secondary
    ) {
      resolvedConfig.colors.text.banner.title ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.title.tertiary =
        resolvedConfig.colors.text.banner.title.secondary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.command?.tertiary &&
      resolvedConfig.colors.text?.banner?.command?.secondary
    ) {
      resolvedConfig.colors.text.banner.command ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.command.tertiary =
        resolvedConfig.colors.text.banner.command.secondary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.description?.tertiary &&
      resolvedConfig.colors.text?.banner?.description?.secondary
    ) {
      resolvedConfig.colors.text.banner.description ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.description.tertiary =
        resolvedConfig.colors.text.banner.description.secondary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.link?.tertiary &&
      resolvedConfig.colors.text?.banner?.link?.secondary
    ) {
      resolvedConfig.colors.text.banner.link ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.link.tertiary =
        resolvedConfig.colors.text.banner.link.secondary;
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
      !resolvedConfig.colors.text?.banner?.header?.primary &&
      resolvedConfig.colors.border?.banner?.outline?.primary
    ) {
      resolvedConfig.colors.text.banner.header ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.header.primary =
        resolvedConfig.colors.border.banner.outline.primary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.footer?.primary &&
      resolvedConfig.colors.border?.banner?.outline?.primary
    ) {
      resolvedConfig.colors.text.banner.footer ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.footer.primary =
        resolvedConfig.colors.border.banner.outline.primary;
    }

    if (
      !resolvedConfig.colors.text?.banner?.header?.secondary &&
      resolvedConfig.colors.border?.banner?.outline?.secondary
    ) {
      resolvedConfig.colors.text.banner.header ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.header.secondary =
        resolvedConfig.colors.border.banner.outline.secondary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.footer?.secondary &&
      resolvedConfig.colors.border?.banner?.outline?.secondary
    ) {
      resolvedConfig.colors.text.banner.footer ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.footer.secondary =
        resolvedConfig.colors.border.banner.outline.secondary;
    }

    if (
      !resolvedConfig.colors.text?.banner?.header?.tertiary &&
      resolvedConfig.colors.border?.banner?.outline?.tertiary
    ) {
      resolvedConfig.colors.text.banner.header ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.header.tertiary =
        resolvedConfig.colors.border.banner.outline.tertiary;
    }
    if (
      !resolvedConfig.colors.text?.banner?.footer?.tertiary &&
      resolvedConfig.colors.border?.banner?.outline?.tertiary
    ) {
      resolvedConfig.colors.text.banner.footer ??= {} as ThemeColorSubItem;
      resolvedConfig.colors.text.banner.footer.tertiary =
        resolvedConfig.colors.border.banner.outline.tertiary;
    }

    if (
      !resolvedConfig.colors.border?.banner?.outline?.primary &&
      resolvedConfig.colors.text?.banner?.title?.primary
    ) {
      resolvedConfig.colors.border.banner.outline.primary =
        resolvedConfig.colors.text.banner.title.primary;
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
      !resolvedConfig.colors.border?.app?.table?.primary &&
      (resolvedConfig.colors.border?.app?.table?.secondary ||
        resolvedConfig.colors.border?.app?.table?.tertiary)
    ) {
      resolvedConfig.colors.border.app.table.primary =
        resolvedConfig.colors.border.app.table.secondary ||
        resolvedConfig.colors.border.app.table.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.app?.table?.secondary &&
      (resolvedConfig.colors.border?.app?.table?.primary ||
        resolvedConfig.colors.border?.app?.table?.tertiary)
    ) {
      resolvedConfig.colors.border.app.table.secondary =
        resolvedConfig.colors.border.app.table.primary ||
        resolvedConfig.colors.border.app.table.tertiary;
    }
    if (
      !resolvedConfig.colors.border?.app?.table?.tertiary &&
      (resolvedConfig.colors.border?.app?.table?.primary ||
        resolvedConfig.colors.border?.app?.table?.secondary)
    ) {
      resolvedConfig.colors.border.app.table.tertiary =
        resolvedConfig.colors.border.app.table.primary ||
        resolvedConfig.colors.border.app.table.secondary;
    }

    if (
      !resolvedConfig.colors.border?.message?.divider?.info &&
      resolvedConfig.colors.border?.message?.divider?.debug
    ) {
      resolvedConfig.colors.border.message.divider.info =
        resolvedConfig.colors.border.message.divider.debug;
    }
    if (
      !resolvedConfig.colors.border?.message?.divider?.debug &&
      resolvedConfig.colors.border?.message?.divider?.info
    ) {
      resolvedConfig.colors.border.message.divider.debug =
        resolvedConfig.colors.border.message.divider.info;
    }
    if (
      !resolvedConfig.colors.border?.message?.outline?.info &&
      resolvedConfig.colors.border?.message?.outline?.debug
    ) {
      resolvedConfig.colors.border.message.outline.info =
        resolvedConfig.colors.border.message.outline.debug;
    }
    if (
      !resolvedConfig.colors.border?.message?.outline?.debug &&
      resolvedConfig.colors.border?.message?.outline?.info
    ) {
      resolvedConfig.colors.border.message.outline.debug =
        resolvedConfig.colors.border.message.outline.info;
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
      !resolvedConfig.colors.border?.message?.divider?.debug &&
      resolvedConfig.colors.border?.message?.outline?.debug
    ) {
      resolvedConfig.colors.border.message.divider.debug =
        resolvedConfig.colors.border.message.outline.debug;
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
      !resolvedConfig.colors.text.message?.header?.debug &&
      resolvedConfig.colors.border?.message?.outline?.debug
    ) {
      resolvedConfig.colors.text.message.header.debug =
        resolvedConfig.colors.border.message.outline.debug;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.debug &&
      resolvedConfig.colors.border?.message?.outline?.debug
    ) {
      resolvedConfig.colors.text.message.footer.debug =
        resolvedConfig.colors.border.message.outline.debug;
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
      !resolvedConfig.colors.text.message?.header?.debug &&
      resolvedConfig.colors.text.message?.header?.info
    ) {
      resolvedConfig.colors.text.message.header.debug =
        resolvedConfig.colors.text.message.header.info;
    }
    if (
      !resolvedConfig.colors.text.message?.footer?.debug &&
      resolvedConfig.colors.text.message?.footer?.info
    ) {
      resolvedConfig.colors.text.message.footer.debug =
        resolvedConfig.colors.text.message.footer.info;
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
      !resolvedConfig.colors.text.message?.link?.debug &&
      resolvedConfig.colors.text?.body?.link
    ) {
      resolvedConfig.colors.text.message.link.debug =
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

    if (
      !resolvedConfig.colors.text.prompt.icon?.active &&
      resolvedConfig.colors.text?.banner?.title?.primary
    ) {
      resolvedConfig.colors.text.prompt.icon.active =
        resolvedConfig.colors.text.banner.title.primary;
    }
    if (
      !resolvedConfig.colors.text.prompt.icon?.submitted &&
      resolvedConfig.colors.text?.message?.header?.success
    ) {
      resolvedConfig.colors.text.prompt.icon.submitted =
        resolvedConfig.colors.text.message.header.success;
    }
    if (
      !resolvedConfig.colors.text.prompt.icon?.warning &&
      resolvedConfig.colors.text?.message?.header?.warning
    ) {
      resolvedConfig.colors.text.prompt.icon.warning =
        resolvedConfig.colors.text.message.header.warning;
    }
    if (
      !resolvedConfig.colors.text.prompt.icon?.error &&
      resolvedConfig.colors.text?.message?.header?.error
    ) {
      resolvedConfig.colors.text.prompt.icon.error =
        resolvedConfig.colors.text.message.header.error;
    }
    if (
      !resolvedConfig.colors.text.prompt.icon?.disabled &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.icon.disabled =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.icon?.cancelled &&
      resolvedConfig.colors.text.prompt.icon?.disabled
    ) {
      resolvedConfig.colors.text.prompt.icon.cancelled =
        resolvedConfig.colors.text.prompt.icon.disabled;
    }

    if (
      !resolvedConfig.colors.text.prompt.label?.active &&
      resolvedConfig.colors.text?.body?.primary
    ) {
      resolvedConfig.colors.text.prompt.label.active =
        resolvedConfig.colors.text.body.primary;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.submitted &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.label.submitted =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.warning &&
      resolvedConfig.colors.text.prompt.label?.active
    ) {
      resolvedConfig.colors.text.prompt.label.warning =
        resolvedConfig.colors.text.prompt.label.active;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.error &&
      resolvedConfig.colors.text.prompt.label?.active
    ) {
      resolvedConfig.colors.text.prompt.label.error =
        resolvedConfig.colors.text.prompt.label.active;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.disabled &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.label.disabled =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.cancelled &&
      resolvedConfig.colors.text.prompt.label?.disabled
    ) {
      resolvedConfig.colors.text.prompt.label.cancelled =
        resolvedConfig.colors.text.prompt.label.disabled;
    }

    if (
      !resolvedConfig.colors.text.prompt.input?.active &&
      resolvedConfig.colors.text?.heading?.primary
    ) {
      resolvedConfig.colors.text.prompt.input.active =
        resolvedConfig.colors.text.heading.primary;
    }
    if (
      !resolvedConfig.colors.text.prompt.input?.inactive &&
      resolvedConfig.colors.text?.heading?.secondary
    ) {
      resolvedConfig.colors.text.prompt.input.inactive =
        resolvedConfig.colors.text.heading.secondary;
    }
    if (
      !resolvedConfig.colors.text.prompt.input?.submitted &&
      resolvedConfig.colors.text?.heading?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.label.submitted =
        resolvedConfig.colors.text.heading.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.warning &&
      resolvedConfig.colors.text.prompt.label?.active
    ) {
      resolvedConfig.colors.text.prompt.label.warning =
        resolvedConfig.colors.text.prompt.label.active;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.error &&
      resolvedConfig.colors.text.prompt.label?.active
    ) {
      resolvedConfig.colors.text.prompt.label.error =
        resolvedConfig.colors.text.prompt.label.active;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.disabled &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.label.disabled =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.label?.cancelled &&
      resolvedConfig.colors.text.prompt.label?.disabled
    ) {
      resolvedConfig.colors.text.prompt.label.cancelled =
        resolvedConfig.colors.text.prompt.label.disabled;
    }

    if (
      !resolvedConfig.colors.text.prompt.description?.active &&
      resolvedConfig.colors.text?.heading?.primary
    ) {
      resolvedConfig.colors.text.prompt.description.active =
        resolvedConfig.colors.text.heading.primary;
    }
    if (
      !resolvedConfig.colors.text.prompt.description?.inactive &&
      resolvedConfig.colors.text?.heading?.secondary
    ) {
      resolvedConfig.colors.text.prompt.description.inactive =
        resolvedConfig.colors.text.heading.secondary;
    }
    if (
      !resolvedConfig.colors.text.prompt.description?.submitted &&
      resolvedConfig.colors.text?.heading?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.description.submitted =
        resolvedConfig.colors.text.heading.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.description?.warning &&
      resolvedConfig.colors.text?.body?.secondary
    ) {
      resolvedConfig.colors.text.prompt.description.warning =
        resolvedConfig.colors.text.body.secondary;
    }
    if (
      !resolvedConfig.colors.text.prompt.description?.error &&
      resolvedConfig.colors.text.prompt.icon?.error
    ) {
      resolvedConfig.colors.text.prompt.description.error =
        resolvedConfig.colors.text.prompt.icon.error;
    }
    if (
      !resolvedConfig.colors.text.prompt.description?.disabled &&
      resolvedConfig.colors.text?.body?.tertiary
    ) {
      resolvedConfig.colors.text.prompt.description.disabled =
        resolvedConfig.colors.text.body.tertiary;
    }
    if (
      !resolvedConfig.colors.text.prompt.description?.cancelled &&
      resolvedConfig.colors.text.prompt.description?.disabled
    ) {
      resolvedConfig.colors.text.prompt.description.cancelled =
        resolvedConfig.colors.text.prompt.description.disabled;
    }

    // #endregion Missing token defaulting

    context.theme = resolvedConfig;

    return dictionary;
  }
});
