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

import { parse } from "parse5";

/**
 * Renders HTML content as source code for displaying in the terminal.
 *
 * @param input - The HTML string to render.
 * @returns A string of source code that can be executed to display the rendered HTML in the terminal.
 */
const html = (input: string) => {
  const document = parse(input);

  return `${document.nodeName}\n`;
};

export default html;
