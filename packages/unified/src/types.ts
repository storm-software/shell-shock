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

import type { PartialKeys } from "@stryke/types/base";

export interface RenderAdapter {
  /**
   * Heading text.
   */
  heading: (text: string, level: number) => string;

  /**
   * Body text.
   */
  body: (text: string) => string;

  /**
   * Bold text.
   */
  bold: (text: string) => string;

  /**
   * Italic text.
   */
  italic: (text: string) => string;

  /**
   * Strikethrough text.
   */
  strikethrough: (text: string) => string;

  /**
   * Underlined text.
   */
  underline: (text: string) => string;

  /**
   * Blockquote text.
   */
  blockquote: (text: string) => string;

  /**
   * Link text.
   */
  link: (url: string, text?: string) => string;

  /**
   * Table.
   */
  table: (cells: string[][]) => string;

  /**
   * Code block.
   */
  code: (text: string, language?: string) => string;

  /**
   * Inline code.
   */
  inlineCode: (text: string) => string;

  /**
   * Line break.
   */
  break: () => string;

  /**
   * Horizontal divider.
   */
  divider: () => string;
}

/**
 * Options for {@link toConsole}.
 */
export interface Options {
  /**
   * Whether to wrap lines at a certain width.
   */
  pre?: boolean;

  /**
   * The maximum line width for wrapping text. Defaults to the terminal width minus 2, with a maximum of 120 characters.
   */
  lineWidth?: number;

  /**
   * Whether to include font attributes (e.g., bold, italic) in the output. If false, all text will be rendered without font attributes. Defaults to true.
   */
  fontAttrs?: boolean;

  /**
   * The depth of the current rendering context, used for managing nested elements and indentation levels. Defaults to 0.
   */
  depth?: number;

  /**
   * Whether to use ASCII characters for rendering elements such as borders and dividers, instead of Unicode characters. Defaults to false.
   */
  asciiMode?: boolean;

  /**
   * Post-process the generated output.
   */
  postProcess?: (output: string) => string;
}

export type ResolvedOptions = PartialKeys<Required<Options>, "postProcess">;
