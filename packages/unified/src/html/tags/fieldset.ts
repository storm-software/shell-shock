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

import {
  inlineTag,
  type HtmlNode,
  type RenderContext
} from "../helpers/tag-utilities";
import { asBlock, normalizeText, quoted } from "./common";

export const legend = inlineTag(value => `bold(${quoted(value)})`);

export function fieldset(tag: HtmlNode, _context: RenderContext) {
  const legendTag =
    tag.childNodes?.find(childNode => childNode.nodeName === "legend") ?? null;
  const legendText = normalizeText(
    legendTag?.childNodes?.map(childNode => childNode.value ?? "").join("") ??
      ""
  );
  const content = normalizeText(
    (tag.childNodes ?? [])
      .filter(childNode => childNode.nodeName !== "legend")
      .map(childNode => {
        if (typeof childNode.value === "string") {
          return childNode.value;
        }

        return (
          childNode.childNodes
            ?.map(grandchildNode => grandchildNode.value ?? "")
            .join("") ?? ""
        );
      })
      .join("\n")
  );
  const value = legendText ? `${legendText}\n${content}`.trim() : content;

  return asBlock(tag.nodeName, `blockquote(${quoted(value)})`, 1, 1);
}
