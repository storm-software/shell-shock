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
   * The rendering components to use for console output.
   */
  adapter: RenderAdapter;

  /**
   * Post-process the generated output.
   */
  postProcess?: (output: string) => string;
}
