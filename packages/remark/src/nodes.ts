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

import type {
  Blockquote,
  Break,
  Code,
  Delete,
  Emphasis,
  Heading,
  Html,
  InlineCode,
  Link,
  LinkReference,
  List,
  ListItem,
  Paragraph,
  Parents,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
  ThematicBreak,
  Yaml
} from "mdast";
import { toString } from "mdast-util-to-string";
import { formatCodeAsIndented, patternInScope } from "./helpers";
import type { Info, State } from "./types";

export function text(
  node: Text,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  return state.safe(node.value, info);
}

export function thematicBreak(
  node: ThematicBreak,
  _: Parents | undefined,
  state: State
) {
  return state.adapter.horizontal();
}

export function strong(
  node: Strong,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("strong");

  const result = state.adapter.bold(
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );

  exit();

  return result;
}

export function paragraph(
  node: Paragraph,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("paragraph");

  const result = state.adapter.body(
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );

  exit();
  return result;
}

export function list(
  node: List,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("list");
  const listMarkerCurrent = state.listMarkerCurrent;

  let listMarker = node.ordered ? "." : "-";
  const listMarkerOther = node.ordered ? ")" : "*";

  let useDifferentMarker =
    parent && state.listMarkerLastUsed
      ? listMarker === state.listMarkerLastUsed
      : false;

  if (!node.ordered) {
    const firstListItem = node.children ? node.children[0] : undefined;

    // If there’s an empty first list item directly in two list items,
    // we have to use a different bullet:
    //
    // ```markdown
    // * - *
    // ```
    //
    // …because otherwise it would become one big thematic break.
    if (
      // Bullet could be used as a thematic break marker:
      (listMarker === "*" || listMarker === "-") &&
      // Empty first list item:
      firstListItem &&
      (!firstListItem.children || !firstListItem.children[0]) &&
      // Directly in two other list items:
      state.stack[state.stack.length - 1] === "list" &&
      state.stack[state.stack.length - 2] === "listItem" &&
      state.stack[state.stack.length - 3] === "list" &&
      state.stack[state.stack.length - 4] === "listItem" &&
      // That are each the first child.
      state.indexStack[state.indexStack.length - 1] === 0 &&
      state.indexStack[state.indexStack.length - 2] === 0 &&
      state.indexStack[state.indexStack.length - 3] === 0
    ) {
      useDifferentMarker = true;
    }
  }

  if (useDifferentMarker) {
    listMarker = listMarkerOther;
  }

  state.listMarkerCurrent = listMarker;

  const result = node.children
    .map(child => state.handle(child, node, state, info))
    .join("");

  state.listMarkerLastUsed = listMarker;
  state.listMarkerCurrent = listMarkerCurrent;
  exit();

  return result;
}

export function listItem(
  node: ListItem,
  parent: Parents | undefined,
  state: State,
  info: Info
) {
  let listMarker = state.listMarkerCurrent || "-";

  // Add the marker value for ordered lists.
  if (parent && parent.type === "list" && parent.ordered) {
    listMarker =
      (typeof parent.start === "number" && parent.start > -1
        ? parent.start
        : 1) +
      parent.children.indexOf(node) +
      listMarker;
  }

  const size = listMarker.length + 1;

  const exit = state.enter("listItem");

  const value = state.indentLines(
    node.children.map(child => state.handle(child, node, state, info)).join(""),
    (line, index, blank) => {
      if (index) {
        return (blank ? "" : " ".repeat(size)) + line;
      }

      return (
        (blank
          ? listMarker
          : listMarker + " ".repeat(size - listMarker.length)) + line
      );
    }
  );

  exit();

  return value;
}

export function link(
  node: Link,
  parent: Parents | undefined,
  state: State,
  info: Info
) {
  let exit;

  const raw = toString(node);
  if (
    node.url &&
    !node.title &&
    node.children &&
    node.children.length === 1 &&
    node.children[0]?.type === "text" &&
    (raw === node.url || `mailto:${raw}` === node.url) &&
    /^[a-z][a-z+.-]+:/i.test(node.url) &&
    // eslint-disable-next-line regexp/no-obscure-range
    !/[\0- <>\u007F]/.test(node.url)
  ) {
    exit = state.enter("link");
    const result = state.adapter.link(node.url);
    exit();

    return result;
  }

  if (node.title) {
    if (
      // If there’s no url but there is a title…
      !node.url ||
      // If there are control characters or whitespace.
      // eslint-disable-next-line regexp/no-obscure-range
      /[\0- \u007F]/.test(node.url)
    ) {
      return node.title;
    } else {
      exit = state.enter("link");
      const result = state.adapter.link(node.url, node.title);
      exit();

      return result;
    }
  }

  if (!node.url) {
    return node.children
      .map(child => state.handle(child, node, state, info))
      .join("");
  }

  exit = state.enter("link");
  const result = state.adapter.link(
    node.url,
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );
  exit();

  return result;
}

export function linkReference(
  node: LinkReference,
  parent: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("linkReference");

  const result = state.adapter.link(
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );

  exit();

  return result;
}

export function inlineCode(
  node: InlineCode,
  _: Parents | undefined,
  state: State
) {
  return state.adapter.inlineCode(node.value);
}

export function html(node: Html) {
  return node.value || "";
}

export function heading(
  node: Heading,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const rank = Math.max(Math.min(6, node.depth || 1), 1);

  return state.adapter.heading(
    node.children.map(child => state.handle(child, node, state, info)).join(""),
    rank
  );
}

export function emphasis(
  node: Emphasis,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("emphasis");

  const result = state.adapter.italic(
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );

  exit();

  return result;
}

export function code(node: Code, _: Parents | undefined, state: State) {
  const raw = node.value || "";

  if (formatCodeAsIndented(node)) {
    const exit = state.enter("codeIndented");
    const result = state.indentLines(raw, (line, _, blank) => {
      return (blank ? "" : "    ") + line;
    });
    exit();
    return result;
  }

  const exit = state.enter("codeFenced");
  const result = state.adapter.code(raw, node.lang || undefined);
  exit();

  return result;
}

export function hardBreak(
  node: Break,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  let index = -1;

  while (++index < state.unsafe.length) {
    if (
      state.unsafe[index]?.character === "\n" &&
      state.unsafe[index] &&
      patternInScope(state.stack, state.unsafe[index]!)
    ) {
      return /[ \t]/.test(info.before) ? "" : " ";
    }
  }

  return state.adapter.break();
}

export function blockquote(
  node: Blockquote,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("blockquote");
  const result = state.adapter.blockquote(
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );
  exit();

  return result;
}

export function table(
  node: Table,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("table");

  const cells = node.children.map(row => {
    if (row.type === "tableRow") {
      return row.children.map(cell => {
        if (cell.type === "tableCell") {
          return state.handle(cell, node, state, info);
        }

        return "";
      });
    }

    return [];
  });

  const result = state.adapter.table(cells);

  exit();

  return result;
}

export function tableRow(
  node: TableRow,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("tableRow");
  const value = node.children
    .map(child => state.handle(child, node, state, info))
    .join("");
  exit();

  return value;
}

export function tableCell(
  node: TableCell,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("tableCell");
  const value = node.children
    .map(child => state.handle(child, node, state, info))
    .join("");
  exit();

  return value;
}

export function deleteNode(
  node: Delete,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("delete");
  const result = state.adapter.strikethrough(
    node.children.map(child => state.handle(child, node, state, info)).join("")
  );
  exit();

  return result;
}

export function yaml(node: Yaml, _: Parents | undefined, state: State) {
  const exit = state.enter("yaml");
  const value = `---\n${node.value || ""}\n---`;
  exit();
  return value;
}
