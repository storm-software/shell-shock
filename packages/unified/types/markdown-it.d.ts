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

declare module "markdown-it-abbr" {
  import type MarkdownIt from "markdown-it";

  function markdownItAbbr(md: MarkdownIt): void;

  export = markdownItAbbr;
}

declare module "markdown-it-attrs" {
  import type MarkdownIt from "markdown-it";

  function markdownItAttrs(md: MarkdownIt): void;

  export = markdownItAttrs;
}

declare module "markdown-it-footnote" {
  import type MarkdownIt from "markdown-it";

  function markdownItFootnote(md: MarkdownIt): void;

  export = markdownItFootnote;
}

declare module "markdown-it-deflist" {
  import type MarkdownIt from "markdown-it";

  function markdownItDeflist(md: MarkdownIt): void;

  export = markdownItDeflist;
}

declare module "markdown-it-sub" {
  import type MarkdownIt from "markdown-it";

  function markdownItSub(md: MarkdownIt): void;

  export = markdownItSub;
}

declare module "markdown-it-sup" {
  import type MarkdownIt from "markdown-it";

  function markdownItSup(md: MarkdownIt): void;

  export = markdownItSup;
}

declare module "markdown-it-ins" {
  import type MarkdownIt from "markdown-it";

  function markdownItIns(md: MarkdownIt): void;

  export = markdownItIns;
}

declare module "markdown-it-mark" {
  import type MarkdownIt from "markdown-it";

  function markdownItMark(md: MarkdownIt): void;

  export = markdownItMark;
}

declare module "markdown-it-task-lists" {
  import type MarkdownIt from "markdown-it";

  function markdownItTaskLists(md: MarkdownIt): void;

  export = markdownItTaskLists;
}

declare module "markdown-it-container" {
  import type MarkdownIt from "markdown-it";

  function markdownItContainer(md: MarkdownIt, name: string): void;

  export = markdownItContainer;
}

declare module "normalize-html-whitespace" {
  function normalizeHtmlWhitespace(html: string): string;

  export = normalizeHtmlWhitespace;
}
