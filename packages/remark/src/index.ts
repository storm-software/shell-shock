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

import type { Node } from "mdast";
import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";
import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import remarkParse from "remark-parse";
import type { Compiler, CompileResults, Processor } from "unified";
import { unified } from "unified";
import { toConsole } from "./to-console";
import type { Options } from "./types";

export type * from "./types";

/**
 * A unified plugin that compiles a markdown syntax tree into a [Shell Shock](https://github.com/storm-software/shell-shock) source code string.
 *
 * @param this - The unified processor instance, which provides access to the processor's data and settings.
 * @param options - Configuration options for the compilation process. See {@link Options} type for details.
 */
export function plugin(this: Processor, options: Options = {}) {
  this.compiler = ((tree: Node) => {
    return toConsole(tree, {
      ...this.data("settings"),
      ...options
    });
  }) as Compiler<Node, CompileResults>;
}

const processor = unified()
  .use(remarkParse, {
    extensions: [gfmStrikethrough()],
    mdastExtensions: [gfmStrikethroughFromMarkdown()]
  })
  .use(plugin)
  .freeze();

export default processor;
