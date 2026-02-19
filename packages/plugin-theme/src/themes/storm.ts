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
  $theme: "storm",
  colors: {
    text: {
      banner: {
        title: "#3be4be",
        command: "#ffffff",
        description: "#9ca3af"
      },
      heading: {
        primary: "#3be4be",
        secondary: "#ffffff",
        tertiary: "#cbd5e1"
      },
      body: {
        primary: "#cbd5e1",
        secondary: "#9ca3af",
        tertiary: "#65676d",
        link: "#3fa6ff"
      },
      message: {
        description: "#ffffff"
      },
      usage: {
        bin: "#9ca3af",
        command: "#4ee0a1",
        dynamic: "#8c82e3",
        options: "#ec5050",
        arguments: "#3bcde4",
        description: "#9ca3af"
      },
      prompt: {
        icon: {
          active: "#3be4be",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#45b27e",
          cancelled: "#d8314a",
          disabled: "#4f4f50"
        },
        message: {
          active: "#ffffff",
          warning: "#ffffff",
          error: "#ffffff",
          submitted: "#9ca3af",
          cancelled: "#9ca3af",
          disabled: "#4f4f50"
        },
        input: {
          active: "#3be4be",
          inactive: "#65676d",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#ffffff",
          cancelled: "#d8314a",
          placeholder: "#65676d",
          disabled: "#4f4f50"
        },
        description: {
          active: "#9ca3af",
          inactive: "#4f4f50",
          warning: "#f3d371",
          error: "#d8314a",
          submitted: "#4f4f50",
          cancelled: "#d8314a",
          disabled: "#4f4f50"
        }
      }
    },
    border: {
      app: {
        primary: "#ffffff",
        secondary: "#9ca3af",
        tertiary: "#4f4f50"
      },
      banner: "#3be4be",
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
      header: "⬤" // 🗲 🗱 ⏺ ⬤
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
  }
} as const;
