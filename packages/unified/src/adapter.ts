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

import type { RenderAdapter } from "./types";

/**
 * Default render adapter that converts markdown nodes into Shell Shock source code strings. This adapter can be customized by providing a different implementation of the `RenderAdapter` interface in the options when using the `outputPlugin`. Each method in the adapter corresponds to a specific markdown construct and defines how it should be rendered in the output string.
 */
export const defaultRenderAdapter: RenderAdapter = {
  /**
   * Heading text.
   */
  heading: (text: string, level = 1) =>
    `bold(textColors.heading.${
      level === 1 ? "primary" : level === 2 ? "secondary" : "tertiary"
    }("${text}"))`,

  /**
   * Body text.
   */
  body: (text: string) => `textColors.body.primary("${text}")`,

  /**
   * Bold text.
   */
  bold: (text: string) => `bold("${text}")`,

  /**
   * Italic text.
   */
  italic: (text: string) => `italic("${text}")`,

  /**
   * Strikethrough text.
   */
  strikethrough: (text: string) => `strikethrough("${text}")`,

  /**
   * Underlined text.
   */
  underline: (text: string) => `underline("${text}")`,

  /**
   * Blockquote text.
   */
  blockquote: (text: string) => `blockquote("${text}")`,

  /**
   * Link text.
   */
  link: (url: string, text?: string) =>
    `link("${url}"${text ? `, "${text}"` : ""})`,

  /**
   * Table.
   */
  table: (cells: string[][]) => `table(${JSON.stringify(cells)})`,

  /**
   * Code block.
   */
  code: (text: string, language?: string) =>
    `code(${JSON.stringify(text)}${language ? `, "${language}"` : ""})`,

  /**
   * Inline code.
   */
  inlineCode: (text: string) => `inlineCode("${text}")`,

  /**
   * Line break.
   */
  break: () => 'writeLine("")',

  /**
   * Horizontal divider.
   */
  divider: () => 'divider({ border: "primary" })'
};
