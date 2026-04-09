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
import { inlineTag } from "../helpers/tag-utilities";

export const a = inlineTag((_, tag, __) => {
  const rawHref = getAttribute(tag, "href", null);
  const rawTitle = getAttribute(tag, "title", null);

  const href =
    !rawHref ||
    [
      "file://",
      "http://",
      "https://",
      "mailto:",
      "ftp://",
      "ftps://",
      "sftp://",
      "ssh://",
      "dav://",
      "tel:",
      "git://"
    ].some(url => rawHref.startsWith(url))
      ? rawHref
      : null;

  return href
    ? `link("${href}", ${rawTitle ? `"${rawTitle}", ` : ""}${
        href && (href.startsWith("http://") || href.startsWith("https://"))
          ? "true"
          : "false"
      })`
    : rawTitle
      ? `"${rawTitle}"`
      : "";
});
