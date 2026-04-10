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
import { asBlock, normalizeText, quoted } from "./common";

export const summary = (tag: HtmlNode, _context: RenderContext) => {
  const text = normalizeText(
    tag.childNodes?.map(childNode => childNode.value ?? "").join("") ?? ""
  );

  return {
    pre: null,
    value: `bold(${quoted(text)})`,
    post: null,
    type: "inline" as const,
    nodeName: tag.nodeName
  };
};

export function details(tag: HtmlNode, _context: RenderContext) {
  const summaryTag =
    tag.childNodes?.find(childNode => childNode.nodeName === "summary") ?? null;
  const summaryText = normalizeText(
    summaryTag?.childNodes?.map(childNode => childNode.value ?? "").join("") ??
      "Details"
  );
  const content = normalizeText(
    (tag.childNodes ?? [])
      .filter(childNode => childNode.nodeName !== "summary")
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
  const prefix = getAttribute(tag, "open", null) !== null ? "[-]" : "[+]";
  const value = content
    ? `${prefix} ${summaryText}\n${content}`
    : `${prefix} ${summaryText}`;

  return asBlock(tag.nodeName, `blockquote(${quoted(value)})`, 1, 1);
}
