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

import { isSet } from "@stryke/type-checks";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import { parse } from "parse5";
import type { Options } from "../types";
import { getOptions } from "./helpers/options";
import { renderTag } from "./helpers/render";

/**
 * Renders HTML content as source code for displaying in the terminal.
 *
 * @param html - HTML content
 * @param options - Configuration options for rendering the HTML.
 * @return A string of source code that can be executed to display the rendered HTML in the terminal.
 */
export function renderHtml(html: string, options: Options = {}): string {
  const result = renderTag(
    parse(html, { sourceCodeLocationInfo: true }),
    getOptions(options)
  );

  return (
    isSetObject(result)
      ? isSetString((result as { value: string }).value)
        ? (result as { value: string }).value
        : isSet((result as { value: string }).value)
          ? String((result as { value: string }).value)
          : JSON.stringify(result)
      : isSetString(result)
        ? result
        : isSet(result)
          ? String(result)
          : ""
  )
    .split("\n")
    .map(line => `console.log(${line || '""'})`)
    .join("\n");
}
