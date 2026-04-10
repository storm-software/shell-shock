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
import { blockTag, inlineTag } from "../helpers/tag-utilities";
import {
  asBlock,
  bodyText,
  getTextContent,
  normalizeText,
  quoted
} from "./common";

export const option = inlineTag(value => bodyText(value));

export const optgroup = blockTag(value => `bold(${quoted(value)})`);

function getOptionLines(tag: HtmlNode, prefix = ""): string[] {
  const lines: string[] = [];

  for (const childNode of tag.childNodes ?? []) {
    if (childNode.nodeName === "optgroup") {
      const label =
        getAttribute(childNode, "label", "") ||
        normalizeText(getTextContent(childNode));
      lines.push(`${prefix}${label}:`);
      lines.push(...getOptionLines(childNode, `${prefix}  `));
      continue;
    }

    if (childNode.nodeName === "option") {
      const selected = getAttribute(childNode, "selected", null) !== null;
      lines.push(
        `${prefix}${selected ? "*" : "-"} ${normalizeText(getTextContent(childNode))}`
      );
    }
  }

  return lines;
}

export function select(tag: HtmlNode, _context: RenderContext) {
  const lines = getOptionLines(tag);

  return asBlock(tag.nodeName, bodyText(lines.join("\n")), 1, 1);
}
