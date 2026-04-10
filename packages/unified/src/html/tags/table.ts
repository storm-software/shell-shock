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
import { blockTag } from "../helpers/tag-utilities";
import {
  asBlock,
  bodyText,
  getTextContent,
  normalizeText,
  quoted
} from "./common";

function getRows(node: HtmlNode | null | undefined): HtmlNode[] {
  if (!node?.childNodes) {
    return [];
  }

  const rows: HtmlNode[] = [];

  for (const childNode of node.childNodes) {
    if (childNode.nodeName === "tr") {
      rows.push(childNode);
      continue;
    }

    if (["thead", "tbody", "tfoot"].includes(childNode.nodeName ?? "")) {
      rows.push(...getRows(childNode));
    }
  }

  return rows;
}

function getCells(row: HtmlNode): string[] {
  return (row.childNodes ?? [])
    .filter(childNode => ["td", "th"].includes(childNode.nodeName ?? ""))
    .map(cell => normalizeText(getTextContent(cell)));
}

export const caption = blockTag(value => `italic(${quoted(value)})`);
export const tr = blockTag();
export const thead = blockTag();
export const tbody = blockTag();
export const tfoot = blockTag();
export const col = blockTag();
export const colgroup = blockTag();
export const td = blockTag(value => bodyText(value));
export const th = blockTag(value => `bold(${quoted(value)})`);

export function table(tag: HtmlNode, _context: RenderContext) {
  const rows = getRows(tag)
    .map(getCells)
    .filter(row => row.length > 0);

  return asBlock(tag.nodeName, `table(${JSON.stringify(rows)})`, 1, 1);
}
