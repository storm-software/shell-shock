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
  asInline,
  bodyText,
  buildBar,
  codeBlockText,
  getTextContent
} from "./common";

export function input(tag: HtmlNode, _context: RenderContext) {
  const type = (getAttribute(tag, "type", "text") || "text").toLowerCase();
  const value = getAttribute(tag, "value", "") || "";
  const placeholder = getAttribute(tag, "placeholder", "") || "";
  const checked = getAttribute(tag, "checked", null) !== null;

  if (type === "hidden") {
    return null;
  }

  if (type === "checkbox") {
    return asInline(tag.nodeName, bodyText(checked ? "[x]" : "[ ]"));
  }

  if (type === "radio") {
    return asInline(tag.nodeName, bodyText(checked ? "(o)" : "( )"));
  }

  if (["submit", "button", "reset"].includes(type)) {
    return asInline(
      tag.nodeName,
      `bold(${JSON.stringify(`[ ${value || type} ]`)})`
    );
  }

  if (type === "range") {
    const max = Number.parseFloat(getAttribute(tag, "max", "100") || "100");
    const current = Number.parseFloat(getAttribute(tag, "value", "0") || "0");
    const bar = buildBar(current, max, 10, "=", "-");

    return asInline(
      tag.nodeName,
      bodyText(`[${bar}] ${Math.round(current)}/${Math.round(max)}`)
    );
  }

  return asInline(tag.nodeName, bodyText(`[${value || placeholder}]`));
}

export const button = inlineTag(
  value => `bold(${JSON.stringify(`[ ${String(value ?? "button")} ]`)})`
);

export const output = inlineTag(value => bodyText(value));

export const textarea = blockTag((value, tag) => {
  const rows = Number.parseInt(getAttribute(tag, "rows", "0") || "0", 10);
  const content = getTextContent(tag);

  const rendered =
    content && (rows > 1 || content.includes("\n"))
      ? codeBlockText(content)
      : bodyText(value);

  return rendered;
});
