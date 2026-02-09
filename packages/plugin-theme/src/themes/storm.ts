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
        tertiary: "#868b95",
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
      }
    },
    border: {
      app: {
        primary: "#ffffff",
        secondary: "#cbd5e1",
        tertiary: "#9ca3af"
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
    table: 2
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
      header: "⏺" // 🗲 🗱 ⬤
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
