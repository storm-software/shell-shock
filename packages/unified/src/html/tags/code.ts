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

import type { HtmlNode, RenderContext } from "../helpers/tag-utilities";
import { inlineTag } from "../helpers/tag-utilities";
import {
  asBlock,
  codeBlockText,
  extractLanguage,
  getTextContent,
  inlineCodeText
} from "./common";

export const code = inlineTag(value => inlineCodeText(value));

export function pre(tag: HtmlNode, _context: RenderContext) {
  const codeTag =
    tag.childNodes?.find(childNode => childNode.nodeName === "code") ?? null;
  const contentNode = codeTag ?? tag;
  const value = getTextContent(contentNode).replaceAll(/\n+$/g, "");
  const language = extractLanguage(codeTag ?? tag);

  return asBlock(tag.nodeName, codeBlockText(value, language), 1, 1);
}
