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

import { alert } from "@mdit/plugin-alert";
import { upperCaseFirst } from "@stryke/string-format";
import markdownit from "markdown-it";
import markdownItAbbr from "markdown-it-abbr";
import markdownItContainer from "markdown-it-container";
import markdownItDeflist from "markdown-it-deflist";
import markdownItFootnote from "markdown-it-footnote";
import markdownItIns from "markdown-it-ins";
import markdownItMark from "markdown-it-mark";
import markdownItSub from "markdown-it-sub";
import markdownItSup from "markdown-it-sup";
import markdownItTaskList from "markdown-it-task-lists";

/**
 * Create a configured markdown-it instance with GFM support
 */
export const createMarkdownRenderer = () => {
  const md = markdownit({
    html: true,
    langPrefix: "language-",
    linkify: true
  })
    .use(markdownItFootnote)
    .use(markdownItIns)
    .use(markdownItMark)
    .use(markdownItDeflist)
    .use(markdownItAbbr)
    .use(markdownItContainer)
    .use(markdownItSup)
    .use(markdownItSub)
    .use(markdownItTaskList)
    .use(alert, {
      deep: false,

      openRender(tokens, index) {
        const token = tokens[index];

        let color = null;

        // Map alert types to colors
        switch (token?.markup) {
          case "important": {
            color = "red";
            break;
          }
          case "note": {
            color = "blue";
            break;
          }
          case "tip": {
            color = "green";
            break;
          }
          case "warning": {
            color = "yellow";
            break;
          }
          case "caution": {
            color = "magenta";
            break;
          }
          default: {
            color = "blue";
          }
        }

        return `<blockquote data-cli-color="${color}">`;
      },

      closeRender() {
        return "</blockquote>";
      },

      titleRender(tokens, index) {
        const token = tokens[index];

        let color = null;

        switch (token?.markup) {
          case "important": {
            color = "red";
            break;
          }
          case "note": {
            color = "blue";
            break;
          }
          case "tip": {
            color = "green";
            break;
          }
          case "warning": {
            color = "yellow";
            break;
          }
          case "caution": {
            color = "magenta";
            break;
          }
          default: {
            color = "blue";
          }
        }

        return `<p><span data-cli-color="${color}"><b>${upperCaseFirst(token?.content || "")}
        }</b></span></p>`;
      }
    });

  // Remove footnote anchors
  md.renderer.rules.footnote_anchor = () => "";

  return md;
};

/**
 * Render markdown to HTML
 *
 * @param markdown - Markdown content
 * @returns HTML string
 */
export const markdownToHtml = (markdown: string): string => {
  const md = createMarkdownRenderer();

  return md.render(markdown);
};
