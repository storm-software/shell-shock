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
import type { ThemeMessageVariant } from "@shell-shock/plugin-theme";
import { THEME_MESSAGE_VARIANTS } from "@shell-shock/plugin-theme/helpers/constants";
import { titleCase } from "@stryke/string-format";
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

        let messageType: ThemeMessageVariant = "info";
        if (
          THEME_MESSAGE_VARIANTS.includes(token?.markup as ThemeMessageVariant)
        ) {
          messageType = token?.markup as ThemeMessageVariant;
        }

        return `<message class="message-type-${messageType}">`;
      },

      closeRender() {
        return "</message>";
      },

      titleRender(tokens, index) {
        const token = tokens[index];

        return `<message-header>${titleCase(
          token?.content || ""
        )}</message-header>`;
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
