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

import type { ThemeColorsResolvedConfig } from "@shell-shock/plugin-theme/types/theme";

const ANSI_BACKGROUND_OFFSET = 10;

export const modifiers = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  overline: [53, 55],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29]
};

export const colors = {
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],

  // Bright color
  blackBright: [90, 39],
  gray: [90, 39],
  grey: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39]
};

export const bgColors = {
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // Bright color
  bgBlackBright: [100, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49]
};

export interface AnsiWrappers {
  open: string;
  close: string;
}

type WrapAnsiFn = (offset?: number) => (code: number) => string;
type WrapAnsi16mFn = (offset?: number) => (code: string) => string;

const wrapAnsi16: WrapAnsiFn =
  (offset = 0) =>
  (code: number) =>
    `\\u001b[${code + offset}m`;

const wrapAnsi256: WrapAnsiFn =
  (offset = 0) =>
  (code: number) =>
    `\\u001b[${38 + offset};5;${code}m`;

const wrapAnsi16m: WrapAnsi16mFn =
  (offset = 0) =>
  (code: string) => {
    const [red, green, blue] = hexToRgb(code);

    return `\\u001b[${38 + offset};2;${red};${green};${blue}m`;
  };

export type BaseAnsiStylesKeys =
  | keyof typeof modifiers
  | keyof typeof colors
  | keyof typeof bgColors;

export type BaseAnsiStyles = Record<
  "ansi16" | "ansi256" | "ansi16m",
  Record<BaseAnsiStylesKeys, AnsiWrappers>
>;

type ThemeAnsiStylesFormat<T> = T extends object
  ? {
      [K in keyof T]: ThemeAnsiStylesFormat<T[K]>;
    }
  : AnsiWrappers;

export type ThemeAnsiStyles = Record<
  "ansi16" | "ansi256" | "ansi16m",
  { theme: ThemeAnsiStylesFormat<ThemeColorsResolvedConfig> }
>;

export type AnsiStyles = BaseAnsiStyles & ThemeAnsiStyles;

function rgbToAnsi256(red: number, green: number, blue: number): number {
  if (red === green && green === blue) {
    if (red < 8) {
      return 16;
    }

    if (red > 248) {
      return 231;
    }

    return Math.round(((red - 8) / 247) * 24) + 232;
  }

  return (
    16 +
    36 * Math.round((red / 255) * 5) +
    6 * Math.round((green / 255) * 5) +
    Math.round((blue / 255) * 5)
  );
}

function hexToRgb(hex: string | number): [number, number, number] {
  const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
  if (!matches) {
    return [0, 0, 0];
  }

  let [colorString] = matches;

  if (colorString.length === 3) {
    colorString = [...colorString]
      .map(character => character + character)
      .join("");
  }

  const integer = Number.parseInt(colorString, 16);

  return [(integer >> 16) & 0xff, (integer >> 8) & 0xff, integer & 0xff];
}

function hexToAnsi256(hex: string | number): number {
  return rgbToAnsi256(...hexToRgb(hex));
}

function ansi256ToAnsi(code: number): number {
  if (code < 8) {
    return 30 + code;
  }

  if (code < 16) {
    return 90 + (code - 8);
  }

  let red;
  let green;
  let blue;

  if (code >= 232) {
    red = ((code - 232) * 10 + 8) / 255;
    green = red;
    blue = red;
  } else {
    code -= 16;

    const remainder = code % 36;

    red = Math.floor(code / 36) / 5;
    green = Math.floor(remainder / 6) / 5;
    blue = (remainder % 6) / 5;
  }

  const value = Math.max(red, green, blue) * 2;

  if (value === 0) {
    return 30;
  }

  let result =
    30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

  if (value === 2) {
    result += 60;
  }

  return result;
}

// function rgbToAnsi(red: number, green: number, blue: number): number {
//   return ansi256ToAnsi(rgbToAnsi256(red, green, blue));
// }

function hexToAnsi(hex: string | number): number {
  return ansi256ToAnsi(hexToAnsi256(hex));
}

function buildThemeAnsiStyles(
  theme: ThemeColorsResolvedConfig,
  wrapFn: (offset?: number) => (code: any) => string,
  convertFn: (code: string) => any
): ThemeAnsiStylesFormat<ThemeColorsResolvedConfig> {
  return {
    text: {
      banner: {
        title: {
          open: wrapFn()(convertFn(theme.text.banner.title)),
          close: wrapAnsi16()(39)
        },
        command: {
          open: wrapFn()(convertFn(theme.text.banner.command)),
          close: wrapAnsi16()(39)
        },
        description: {
          open: wrapFn()(convertFn(theme.text.banner.description)),
          close: wrapAnsi16()(39)
        },
        header: {
          open: wrapFn()(convertFn(theme.text.banner.header)),
          close: wrapAnsi16()(39)
        },
        footer: {
          open: wrapFn()(convertFn(theme.text.banner.footer)),
          close: wrapAnsi16()(39)
        }
      },
      heading: {
        primary: {
          open: wrapFn()(convertFn(theme.text.heading.primary)),
          close: wrapAnsi16()(39)
        },
        secondary: {
          open: wrapFn()(convertFn(theme.text.heading.secondary)),
          close: wrapAnsi16()(39)
        },
        tertiary: {
          open: wrapFn()(convertFn(theme.text.heading.tertiary)),
          close: wrapAnsi16()(39)
        }
      },
      body: {
        primary: {
          open: wrapFn()(convertFn(theme.text.body.primary)),
          close: wrapAnsi16()(39)
        },
        secondary: {
          open: wrapFn()(convertFn(theme.text.body.secondary)),
          close: wrapAnsi16()(39)
        },
        tertiary: {
          open: wrapFn()(convertFn(theme.text.body.tertiary)),
          close: wrapAnsi16()(39)
        },
        link: {
          open: wrapFn()(convertFn(theme.text.body.link)),
          close: wrapAnsi16()(39)
        }
      },
      message: {
        description: {
          help: {
            open: wrapFn()(convertFn(theme.text.message.description.help)),
            close: wrapAnsi16()(39)
          },
          success: {
            open: wrapFn()(convertFn(theme.text.message.description.success)),
            close: wrapAnsi16()(39)
          },
          info: {
            open: wrapFn()(convertFn(theme.text.message.description.info)),
            close: wrapAnsi16()(39)
          },
          debug: {
            open: wrapFn()(convertFn(theme.text.message.description.debug)),
            close: wrapAnsi16()(39)
          },
          warning: {
            open: wrapFn()(convertFn(theme.text.message.description.warning)),
            close: wrapAnsi16()(39)
          },
          danger: {
            open: wrapFn()(convertFn(theme.text.message.description.danger)),
            close: wrapAnsi16()(39)
          },
          error: {
            open: wrapFn()(convertFn(theme.text.message.description.error)),
            close: wrapAnsi16()(39)
          }
        },
        link: {
          help: {
            open: wrapFn()(convertFn(theme.text.message.link.help)),
            close: wrapAnsi16()(39)
          },
          success: {
            open: wrapFn()(convertFn(theme.text.message.link.success)),
            close: wrapAnsi16()(39)
          },
          info: {
            open: wrapFn()(convertFn(theme.text.message.link.info)),
            close: wrapAnsi16()(39)
          },
          debug: {
            open: wrapFn()(convertFn(theme.text.message.link.debug)),
            close: wrapAnsi16()(39)
          },
          warning: {
            open: wrapFn()(convertFn(theme.text.message.link.warning)),
            close: wrapAnsi16()(39)
          },
          danger: {
            open: wrapFn()(convertFn(theme.text.message.link.danger)),
            close: wrapAnsi16()(39)
          },
          error: {
            open: wrapFn()(convertFn(theme.text.message.link.error)),
            close: wrapAnsi16()(39)
          }
        },
        header: {
          help: {
            open: wrapFn()(convertFn(theme.text.message.header.help)),
            close: wrapAnsi16()(39)
          },
          success: {
            open: wrapFn()(convertFn(theme.text.message.header.success)),
            close: wrapAnsi16()(39)
          },
          info: {
            open: wrapFn()(convertFn(theme.text.message.header.info)),
            close: wrapAnsi16()(39)
          },
          debug: {
            open: wrapFn()(convertFn(theme.text.message.header.debug)),
            close: wrapAnsi16()(39)
          },
          warning: {
            open: wrapFn()(convertFn(theme.text.message.header.warning)),
            close: wrapAnsi16()(39)
          },
          danger: {
            open: wrapFn()(convertFn(theme.text.message.header.danger)),
            close: wrapAnsi16()(39)
          },
          error: {
            open: wrapFn()(convertFn(theme.text.message.header.error)),
            close: wrapAnsi16()(39)
          }
        },
        footer: {
          help: {
            open: wrapFn()(convertFn(theme.text.message.footer.help)),
            close: wrapAnsi16()(39)
          },
          success: {
            open: wrapFn()(convertFn(theme.text.message.footer.success)),
            close: wrapAnsi16()(39)
          },
          info: {
            open: wrapFn()(convertFn(theme.text.message.footer.info)),
            close: wrapAnsi16()(39)
          },
          debug: {
            open: wrapFn()(convertFn(theme.text.message.footer.debug)),
            close: wrapAnsi16()(39)
          },
          warning: {
            open: wrapFn()(convertFn(theme.text.message.footer.warning)),
            close: wrapAnsi16()(39)
          },
          danger: {
            open: wrapFn()(convertFn(theme.text.message.footer.danger)),
            close: wrapAnsi16()(39)
          },
          error: {
            open: wrapFn()(convertFn(theme.text.message.footer.error)),
            close: wrapAnsi16()(39)
          }
        }
      },
      usage: {
        bin: {
          open: wrapFn()(convertFn(theme.text.usage.bin)),
          close: wrapAnsi16()(39)
        },
        command: {
          open: wrapFn()(convertFn(theme.text.usage.command)),
          close: wrapAnsi16()(39)
        },
        subcommand: {
          open: wrapFn()(convertFn(theme.text.usage.subcommand)),
          close: wrapAnsi16()(39)
        },
        options: {
          open: wrapFn()(convertFn(theme.text.usage.options)),
          close: wrapAnsi16()(39)
        },
        params: {
          open: wrapFn()(convertFn(theme.text.usage.params)),
          close: wrapAnsi16()(39)
        },
        description: {
          open: wrapFn()(convertFn(theme.text.usage.description)),
          close: wrapAnsi16()(39)
        }
      }
    },
    border: {
      banner: {
        divider: {
          primary: {
            open: wrapFn()(convertFn(theme.border.banner.divider.primary)),
            close: wrapAnsi16()(39)
          },
          secondary: {
            open: wrapFn()(convertFn(theme.border.banner.divider.secondary)),
            close: wrapAnsi16()(39)
          },
          tertiary: {
            open: wrapFn()(convertFn(theme.border.banner.divider.tertiary)),
            close: wrapAnsi16()(39)
          }
        },
        outline: {
          primary: {
            open: wrapFn()(convertFn(theme.border.banner.outline.primary)),
            close: wrapAnsi16()(39)
          },
          secondary: {
            open: wrapFn()(convertFn(theme.border.banner.outline.secondary)),
            close: wrapAnsi16()(39)
          },
          tertiary: {
            open: wrapFn()(convertFn(theme.border.banner.outline.tertiary)),
            close: wrapAnsi16()(39)
          }
        }
      },
      app: {
        divider: {
          primary: {
            open: wrapFn()(convertFn(theme.border.app.divider.primary)),
            close: wrapAnsi16()(39)
          },
          secondary: {
            open: wrapFn()(convertFn(theme.border.app.divider.secondary)),
            close: wrapAnsi16()(39)
          },
          tertiary: {
            open: wrapFn()(convertFn(theme.border.app.divider.tertiary)),
            close: wrapAnsi16()(39)
          }
        },
        table: {
          primary: {
            open: wrapFn()(convertFn(theme.border.app.table.primary)),
            close: wrapAnsi16()(39)
          },
          secondary: {
            open: wrapFn()(convertFn(theme.border.app.table.secondary)),
            close: wrapAnsi16()(39)
          },
          tertiary: {
            open: wrapFn()(convertFn(theme.border.app.table.tertiary)),
            close: wrapAnsi16()(39)
          }
        }
      },
      message: {
        divider: {
          help: {
            open: wrapFn()(convertFn(theme.border.message.divider.help)),
            close: wrapAnsi16()(39)
          },
          success: {
            open: wrapFn()(convertFn(theme.border.message.divider.success)),
            close: wrapAnsi16()(39)
          },
          info: {
            open: wrapFn()(convertFn(theme.border.message.divider.info)),
            close: wrapAnsi16()(39)
          },
          debug: {
            open: wrapFn()(convertFn(theme.border.message.divider.debug)),
            close: wrapAnsi16()(39)
          },
          warning: {
            open: wrapFn()(convertFn(theme.border.message.divider.warning)),
            close: wrapAnsi16()(39)
          },
          danger: {
            open: wrapFn()(convertFn(theme.border.message.divider.danger)),
            close: wrapAnsi16()(39)
          },
          error: {
            open: wrapFn()(convertFn(theme.border.message.divider.error)),
            close: wrapAnsi16()(39)
          }
        },
        outline: {
          help: {
            open: wrapFn()(convertFn(theme.border.message.outline.help)),
            close: wrapAnsi16()(39)
          },
          success: {
            open: wrapFn()(convertFn(theme.border.message.outline.success)),
            close: wrapAnsi16()(39)
          },
          info: {
            open: wrapFn()(convertFn(theme.border.message.outline.info)),
            close: wrapAnsi16()(39)
          },
          debug: {
            open: wrapFn()(convertFn(theme.border.message.outline.debug)),
            close: wrapAnsi16()(39)
          },
          warning: {
            open: wrapFn()(convertFn(theme.border.message.outline.warning)),
            close: wrapAnsi16()(39)
          },
          danger: {
            open: wrapFn()(convertFn(theme.border.message.outline.danger)),
            close: wrapAnsi16()(39)
          },
          error: {
            open: wrapFn()(convertFn(theme.border.message.outline.error)),
            close: wrapAnsi16()(39)
          }
        }
      }
    }
  };
}

/**
 * Generates ANSI styles based on the provided context.
 *
 * @param theme - The theme colors configuration.
 * @returns The generated ANSI styles.
 */
export function getAnsiStyles(theme: ThemeColorsResolvedConfig): AnsiStyles {
  const output = { ansi16: {}, ansi256: {}, ansi16m: {} } as AnsiStyles;

  for (const [key, value] of Object.entries(modifiers) as [
    BaseAnsiStylesKeys,
    [number, number]
  ][]) {
    output.ansi16[key] = {
      open: wrapAnsi16()(value[0]),
      close: wrapAnsi16()(value[1])
    };

    output.ansi256[key] = {
      open: wrapAnsi16()(value[0]),
      close: wrapAnsi16()(value[1])
    };

    output.ansi16m[key] = {
      open: wrapAnsi16()(value[0]),
      close: wrapAnsi16()(value[1])
    };
  }

  for (const [key, value] of Object.entries(colors) as [
    BaseAnsiStylesKeys,
    [number, number]
  ][]) {
    output.ansi16[key] = {
      open: wrapAnsi16()(value[0]),
      close: wrapAnsi16()(value[1])
    };

    output.ansi256[key] = {
      open: wrapAnsi16()(value[0]),
      close: wrapAnsi16()(value[1])
    };

    output.ansi16m[key] = {
      open: wrapAnsi16()(value[0]),
      close: wrapAnsi16()(value[1])
    };
  }

  for (const [key, value] of Object.entries(bgColors) as [
    BaseAnsiStylesKeys,
    [number, number]
  ][]) {
    output.ansi16[key] = {
      open: wrapAnsi16(ANSI_BACKGROUND_OFFSET)(value[0]),
      close: wrapAnsi16(ANSI_BACKGROUND_OFFSET)(value[1])
    };

    output.ansi256[key] = {
      open: wrapAnsi16(ANSI_BACKGROUND_OFFSET)(value[0]),
      close: wrapAnsi16(ANSI_BACKGROUND_OFFSET)(value[1])
    };

    output.ansi16m[key] = {
      open: wrapAnsi16(ANSI_BACKGROUND_OFFSET)(value[0]),
      close: wrapAnsi16(ANSI_BACKGROUND_OFFSET)(value[1])
    };
  }

  output.ansi16.theme = buildThemeAnsiStyles(theme, wrapAnsi16, hexToAnsi);
  output.ansi256.theme = buildThemeAnsiStyles(theme, wrapAnsi256, hexToAnsi256);
  output.ansi16m.theme = buildThemeAnsiStyles(
    theme,
    wrapAnsi16m,
    (code: string) => code
  );

  return output;
}
