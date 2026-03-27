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

import type { ThemeUserConfig } from "../types/theme";

export const theme: ThemeUserConfig = {
  $theme: "default",
  colors: {
    text: {
      banner: {
        title: "#ffffff",
        command: "#e3e7e8",
        description: "#9ca8ab"
      },
      heading: {
        primary: "#ffffff",
        secondary: "#e3e7e8",
        tertiary: "#9ca8ab"
      },
      body: {
        primary: "#9ca8ab",
        secondary: "#9ca8ab",
        tertiary: "#67787c",
        link: "#3fa6ff"
      },
      message: {
        description: "#e3e7e8"
      },
      usage: {
        bin: "#67787c",
        command: "#e3e7e8",
        dynamic: "#e3e7e8",
        options: "#67787c",
        args: "#67787c",
        description: "#67787c"
      },
      prompt: {
        icon: {
          active: "#3b82f6",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#45b27e",
          cancelled: "#d8314a",
          disabled: "#4b585b"
        },
        message: {
          active: "#e3e7e8",
          warning: "#e3e7e8",
          error: "#e3e7e8",
          submitted: "#67787c",
          cancelled: "#67787c",
          disabled: "#4b585b"
        },
        input: {
          active: "#3b82f6",
          inactive: "#9ca8ab",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#e3e7e8",
          cancelled: "#d8314a",
          placeholder: "#4b585b",
          disabled: "#4b585b"
        },
        description: {
          active: "#67787c",
          inactive: "#4b585b",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#67787c",
          cancelled: "#d8314a",
          disabled: "#4b585b"
        }
      },
      spinner: {
        icon: {
          active: "#3b82f6",
          error: "#d8314a",
          success: "#45b27e",
          help: "#818cf8",
          info: "#38bdf8",
          warning: "#f3d371"
        },
        message: {
          active: "#e3e7e8",
          error: "#d8314a",
          success: "#67787c",
          help: "#67787c",
          info: "#67787c",
          warning: "#67787c"
        }
      },
      tags: {
        utility: "#94a3b8",
        deprecated: "#f87171",
        experimental: "#818cf8",
        $default: "#e3e7e8"
      }
    },
    border: {
      app: {
        primary: "#e3e7e8",
        secondary: "#67787c",
        tertiary: "#4b585b"
      },
      banner: "#ffffff",
      message: {
        help: "#818cf8",
        success: "#45b27e",
        info: "#38bdf8",
        debug: "#8afafc",
        warning: "#f3d371",
        danger: "#d8314a"
      }
    }
  },
  borderStyles: {
    app: "single",
    banner: "bold",
    message: "round"
  },
  padding: {
    app: 0,
    banner: 14,
    message: 8,
    table: 1
  },
  icons: {
    message: {
      header: {
        help: "✱",
        success: "✔",
        info: "🛈",
        debug: "🛠",
        warning: "🛆",
        danger: "🛇",
        error: "✘"
      }
    },
    banner: {
      header: "⏺"
    },
    prompt: {
      active: "✱",
      error: "✘",
      warning: "🛆",
      submitted: "✔",
      cancelled: "🛇",
      disabled: "🛇"
    }
  },
  labels: {
    message: {
      header: {
        help: "Useful Tip",
        success: "Success",
        info: "Info",
        debug: "Debug",
        warning: "Warning",
        danger: "Danger",
        error: "Error"
      }
    }
  },
  spinner: "dots"
} as const;
