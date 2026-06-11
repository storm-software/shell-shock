/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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
import type { Token } from "markdown-it/dist/markdown-it.min.js";

/**
 * A type representing a markdown token, which is a fundamental unit of parsed markdown content. This type is based on the Token type from the markdown-it library, and includes properties such as type, tag, content, and children that describe the structure and content of the markdown element represented by the token. Markdown tokens are used during the parsing and rendering process to convert markdown text into HTML or other formats.
 */
export type MarkdownToken = Token;

export interface MarkdownToHtmlOptions {
  /**
   * A function that takes an array of markdown-it tokens and returns a modified array of tokens. This allows for custom processing or filtering of the tokens before they are rendered to HTML. For example, you could use this function to remove certain types of tokens, modify token content, or add new tokens based on specific criteria.
   *
   * @param tokens - An array of markdown-it tokens to be processed.
   * @returns A modified array of markdown-it tokens.
   */
  filter?: (tokens: MarkdownToken[]) => MarkdownToken[];
}

/**
 * Options for rendering HTML or Markdown content in the terminal. This interface extends the MarkdownToHtmlOptions, allowing for additional configuration options specific to rendering in the terminal, such as line wrapping, font attributes, and ASCII mode.
 */
export interface Options extends MarkdownToHtmlOptions {
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

export type ResolvedOptions = PartialKeys<
  Required<Options>,
  "filter" | "postProcess"
>;
