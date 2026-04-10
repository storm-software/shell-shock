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

import { escapeText } from "../helpers/escape-text";
import { blockTag, inlineTag } from "../helpers/tag-utilities";

// Helper to create colored block element
const createBlock = (_: string) =>
  blockTag(value => {
    return `textColors.body.primary(\`${escapeText(value)}\`)`;
  });

// Helper to create colored inline element
const createInline = (_: string) =>
  inlineTag(value => {
    return `textColors.body.primary(\`${escapeText(value)}\`)`;
  });

// Paragraph with margins
export const p = blockTag(
  value => {
    return `textColors.body.primary(\`${escapeText(value)}\`)`;
  },
  { marginTop: 1, marginBottom: 1 }
);

// Inline elements - each uses its own theme
export const label = createInline("label");
export const blink = createInline("blink");

// Block container elements - each uses its own theme
export const div = createBlock("div");
export const header = createBlock("header");
export const article = createBlock("article");
export const footer = createBlock("footer");
export const section = createBlock("section");
export const main = createBlock("main");
export const nav = createBlock("nav");
export const aside = createBlock("aside");
export const form = createBlock("form");
export const picture = createBlock("picture");
export const hgroup = createBlock("hgroup");
export const dialog = createBlock("dialog");

// figcaption is now handled internally by figure.js (similar to table/caption)
// export moved to lib/tags/figure.js
