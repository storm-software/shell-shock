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

import type { MarkdownToHtmlOptions } from "../types";
import {
  createMarkdownRenderer,
  parseMarkdownIt,
  renderMarkdownIt
} from "./markdown-it";

/**
 * Render markdown to HTML
 *
 * @param markdown - Markdown content
 * @param options - Configuration options for rendering the markdown.
 * @returns HTML string
 */
export function markdownToHtml(
  markdown: string,
  options: MarkdownToHtmlOptions = {}
): string {
  const md = createMarkdownRenderer();

  let tokens = parseMarkdownIt(markdown, md);
  if (options.filter) {
    tokens = options.filter(tokens);
  }

  return renderMarkdownIt(tokens, md);
}
