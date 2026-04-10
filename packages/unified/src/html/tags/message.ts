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

import { THEME_MESSAGE_VARIANTS } from "@shell-shock/plugin-theme/helpers/constants";
import { escapeText } from "../helpers/escape-text";
import { getClassNames } from "../helpers/get-attribute";
import { inlineTag } from "../helpers/tag-utilities";

export const message = inlineTag((value, tag) => {
  let type = getClassNames(tag)
    .find(className => className.startsWith("message-type-"))
    ?.replace("message-type-", "");
  if (!type || !THEME_MESSAGE_VARIANTS.includes(type as any)) {
    type = "info";
  }

  const header = tag.childNodes?.find(
    child => child.type === "message-header" || child.type === "message-title"
  )?.value;

  return `${type}(${value ? `\`${escapeText(value)}\`` : "''"}${
    header ? `, \`${escapeText(header)}\`` : ""
  })`;
});
