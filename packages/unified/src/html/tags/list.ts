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

import { getAttribute } from "../helpers/get-attribute";
import type { HtmlNode, RenderContext } from "../helpers/tag-utilities";
import { asBlock, bodyText, getTextContent, normalizeText } from "./common";

function getListItems(tag: HtmlNode): HtmlNode[] {
  return (tag.childNodes ?? []).filter(
    childNode => childNode.nodeName === "li"
  );
}

function renderList(
  tag: HtmlNode,
  markerFactory: (index: number) => string
): ReturnType<typeof asBlock> {
  const items = getListItems(tag);
  const lines = items.map((item, index) => {
    const text = normalizeText(getTextContent(item));

    return `${markerFactory(index)} ${text}`.trimEnd();
  });

  return asBlock(tag.nodeName, bodyText(lines.join("\n")), 1, 1);
}

export function ul(tag: HtmlNode, _context: RenderContext) {
  const type = getAttribute(tag, "type", "disc") || "disc";
  const marker = type === "square" ? "▪" : type === "circle" ? "◦" : "•";

  return renderList(tag, () => marker);
}

export function ol(tag: HtmlNode, _context: RenderContext) {
  const start = Number.parseInt(getAttribute(tag, "start", "1") || "1", 10);

  return renderList(tag, index => `${start + index}.`);
}

export function li(tag: HtmlNode, _context: RenderContext) {
  const text = normalizeText(getTextContent(tag));

  return asBlock(tag.nodeName, bodyText(text));
}
