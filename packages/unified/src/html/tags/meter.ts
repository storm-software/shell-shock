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
import { asInline, bodyText, buildBar, getTextContent } from "./common";

export function meter(tag: HtmlNode, _context: RenderContext) {
  const min = Number.parseFloat(getAttribute(tag, "min", "0") || "0");
  const max = Number.parseFloat(getAttribute(tag, "max", "1") || "1");
  const value = Number.parseFloat(
    getAttribute(tag, "value", String(min)) || String(min)
  );
  const normalizedValue = Math.max(0, value - min);
  const normalizedMax = Math.max(1, max - min);
  const label = getTextContent(tag).trim();
  const percent = Math.round((normalizedValue / normalizedMax) * 100);
  const bar = buildBar(normalizedValue, normalizedMax, 10, "#", "-");

  return asInline(
    tag.nodeName,
    bodyText(`${label ? `${label} ` : ""}[${bar}] ${percent}%`)
  );
}
