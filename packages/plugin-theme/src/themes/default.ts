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
        title: "#f9fbfb",
        command: "#9ca8ab",
        description: "#67787c"
      },
      heading: {
        primary: "#f9fbfb",
        secondary: "#9ca8ab",
        tertiary: "#67787c"
      },
      body: {
        primary: "#9ca8ab",
        secondary: "#67787c",
        tertiary: "#394447",
        link: "#3fa6ff"
      },
      message: {
        description: "#f9fbfb"
      },
      usage: {
        bin: "#67787c",
        command: "#f9fbfb",
        dynamic: "#9ca8ab",
        options: "#9ca8ab",
        args: "#9ca8ab",
        description: "#67787c"
      },
      prompt: {
        icon: {
          active: "#3b82f6",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#45b27e",
          cancelled: "#d8314a",
          disabled: "#22292b"
        },
        message: {
          active: "#f9fbfb",
          warning: "#f9fbfb",
          error: "#f9fbfb",
          submitted: "#67787c",
          cancelled: "#67787c",
          disabled: "#22292b"
        },
        input: {
          active: "#3b82f6",
          inactive: "#394447",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#f9fbfb",
          cancelled: "#d8314a",
          placeholder: "#394447",
          disabled: "#22292b"
        },
        description: {
          active: "#67787c",
          inactive: "#22292b",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#22292b",
          cancelled: "#d8314a",
          disabled: "#22292b"
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
          active: "#f9fbfb",
          error: "#d8314a",
          success: "#67787c",
          help: "#67787c",
          info: "#67787c",
          warning: "#67787c"
        }
      }
    },
    border: {
      app: {
        primary: "#f9fbfb",
        secondary: "#67787c",
        tertiary: "#22292b"
      },
      banner: "#f9fbfb",
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
