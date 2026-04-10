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

export function progress(tag: HtmlNode, _context: RenderContext) {
  const max = Number.parseFloat(getAttribute(tag, "max", "1") || "1");
  const value = Number.parseFloat(getAttribute(tag, "value", "0") || "0");
  const label = getTextContent(tag).trim();
  const percent = Math.round((Math.max(0, value) / Math.max(1, max)) * 100);
  const bar = buildBar(value, max, 10, "=", "-");

  return asInline(
    tag.nodeName,
    bodyText(`${label ? `${label} ` : ""}[${bar}] ${percent}%`)
  );
}
