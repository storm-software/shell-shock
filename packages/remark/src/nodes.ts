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

import { longestStreak } from "longest-streak";
import type {
  Blockquote,
  Break,
  Code,
  Definition,
  Delete,
  Emphasis,
  FootnoteDefinition,
  FootnoteReference,
  Heading,
  Html,
  Image,
  ImageReference,
  InlineCode,
  Link,
  LinkReference,
  List,
  ListItem,
  Paragraph,
  Parents,
  Root,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
  ThematicBreak,
  Yaml
} from "mdast";
import { phrasing } from "mdast-util-phrasing";
import {
  checkBullet,
  checkBulletOrdered,
  checkBulletOther,
  checkEmphasis,
  checkFence,
  checkListItemIndent,
  checkQuote,
  checkRule,
  checkRuleRepetition,
  checkStrong,
  encodeCharacterReference,
  encodeInfo,
  formatCodeAsIndented,
  formatHeadingAsSetext,
  formatLinkAsAutolink,
  patternInScope
} from "./helpers";
import type { Info, State } from "./types";

export function root(
  node: Root,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  // Note: `html` nodes are ambiguous.
  const hasPhrasing = node.children.some(d => {
    return phrasing(d);
  });

  const container = hasPhrasing ? state.containerPhrasing : state.containerFlow;

  return container.call(state, node, info);
}

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
  const value = (
    checkRule(state) + (state.options.ruleSpaces ? " " : "")
  ).repeat(checkRuleRepetition(state));

  return state.options.ruleSpaces ? value.slice(0, -1) : value;
}

export function strong(
  node: Strong,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const marker = checkStrong(state);
  const exit = state.enter("strong");
  const tracker = state.createTracker(info);
  const before = tracker.move(marker + marker);

  let between = tracker.move(
    state.containerPhrasing(node, {
      after: marker,
      before,
      ...tracker.current()
    })
  );
  const betweenHead = between.charCodeAt(0);
  const open = encodeInfo(
    info.before.charCodeAt(info.before.length - 1),
    betweenHead,
    marker
  );

  if (open.inside) {
    between = encodeCharacterReference(betweenHead) + between.slice(1);
  }

  const betweenTail = between.charCodeAt(between.length - 1);
  const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);

  if (close.inside) {
    between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
  }

  const after = tracker.move(marker + marker);

  exit();

  state.attentionEncodeSurroundingInfo = {
    after: close.outside,
    before: open.outside
  };
  return before + between + after;
}

export function paragraph(
  node: Paragraph,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("paragraph");
  const subexit = state.enter("phrasing");
  const value = state.containerPhrasing(node, info);
  subexit();
  exit();
  return value;
}

export function list(
  node: List,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("list");
  const bulletCurrent = state.bulletCurrent;

  let bullet = node.ordered ? checkBulletOrdered(state) : checkBullet(state);
  const bulletOther = node.ordered
    ? bullet === "."
      ? ")"
      : "."
    : checkBulletOther(state);
  let useDifferentMarker =
    parent && state.bulletLastUsed ? bullet === state.bulletLastUsed : false;

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
      (bullet === "*" || bullet === "-") &&
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

    // If there’s a thematic break at the start of the first list item,
    // we have to use a different bullet:
    //
    // ```markdown
    // * ---
    // ```
    //
    // …because otherwise it would become one big thematic break.
    if (checkRule(state) === bullet && firstListItem) {
      let index = -1;

      while (++index < node.children.length) {
        const item = node.children[index];

        if (
          item &&
          item.type === "listItem" &&
          item.children &&
          item.children[0] &&
          item.children[0].type === "thematicBreak"
        ) {
          useDifferentMarker = true;
          break;
        }
      }
    }
  }

  if (useDifferentMarker) {
    bullet = bulletOther;
  }

  state.bulletCurrent = bullet;
  const value = state.containerFlow(node, info);
  state.bulletLastUsed = bullet;
  state.bulletCurrent = bulletCurrent;
  exit();
  return value;
}

export function listItem(
  node: ListItem,
  parent: Parents | undefined,
  state: State,
  info: Info
) {
  const listItemIndent = checkListItemIndent(state);
  let bullet = state.bulletCurrent || checkBullet(state);

  // Add the marker value for ordered lists.
  if (parent && parent.type === "list" && parent.ordered) {
    bullet =
      (typeof parent.start === "number" && parent.start > -1
        ? parent.start
        : 1) +
      (state.options.incrementListMarker === false
        ? 0
        : parent.children.indexOf(node)) +
      bullet;
  }

  let size = bullet.length + 1;

  if (
    listItemIndent === "tab" ||
    (listItemIndent === "mixed" &&
      ((parent && parent.type === "list" && parent.spread) || node.spread))
  ) {
    size = Math.ceil(size / 4) * 4;
  }

  const tracker = state.createTracker(info);
  tracker.move(bullet + " ".repeat(size - bullet.length));
  tracker.shift(size);
  const exit = state.enter("listItem");
  const value = state.indentLines(
    state.containerFlow(node, tracker.current()),
    (line, index, blank) => {
      if (index) {
        return (blank ? "" : " ".repeat(size)) + line;
      }

      return (
        (blank ? bullet : bullet + " ".repeat(size - bullet.length)) + line
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
  const quote = checkQuote(state);
  const suffix = quote === '"' ? "Quote" : "Apostrophe";
  const tracker = state.createTracker(info);

  let exit;
  let subexit;

  if (formatLinkAsAutolink(node, state)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = state.stack;
    state.stack = [];
    exit = state.enter("autolink");
    let value = tracker.move("<");
    value += tracker.move(
      state.containerPhrasing(node, {
        before: value,
        after: ">",
        ...tracker.current()
      })
    );
    value += tracker.move(">");
    exit();
    state.stack = stack;
    return value;
  }

  exit = state.enter("link");
  subexit = state.enter("label");
  let value = tracker.move("[");
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: "](",
      ...tracker.current()
    })
  );
  value += tracker.move("](");
  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    // eslint-disable-next-line regexp/no-obscure-range
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter("destinationLiteral");
    value += tracker.move("<");
    value += tracker.move(
      state.safe(node.url, { before: value, after: ">", ...tracker.current() })
    );
    value += tracker.move(">");
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter("destinationRaw");
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? " " : ")",
        ...tracker.current()
      })
    );
  }

  subexit();

  if (node.title) {
    subexit = state.enter(`title${suffix}`);
    value += tracker.move(` ${quote}`);
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    );
    value += tracker.move(quote);
    subexit();
  }

  value += tracker.move(")");

  exit();
  return value;
}

export function linkReference(
  node: LinkReference,
  parent: Parents | undefined,
  state: State,
  info: Info
) {
  const type = node.referenceType;
  const exit = state.enter("linkReference");
  let subexit = state.enter("label");
  const tracker = state.createTracker(info);
  let value = tracker.move("[");
  const text = state.containerPhrasing(node, {
    before: value,
    after: "]",
    ...tracker.current()
  });
  value += tracker.move(`${text}][`);

  subexit();
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = state.stack;
  state.stack = [];
  subexit = state.enter("reference");
  // Note: for proper tracking, we should reset the output positions when we end
  // up making a `shortcut` reference, because then there is no brace output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  const reference = state.safe(state.associationId(node), {
    before: value,
    after: "]",
    ...tracker.current()
  });
  subexit();
  state.stack = stack;
  exit();

  if (type === "full" || !text || text !== reference) {
    value += tracker.move(`${reference}]`);
  } else if (type === "shortcut") {
    // Remove the unwanted `[`.
    value = value.slice(0, -1);
  } else {
    value += tracker.move("]");
  }

  return value;
}

export function inlineCode(
  node: InlineCode,
  _: Parents | undefined,
  state: State
) {
  let value = node.value || "";
  let sequence = "`";
  let index = -1;

  // If there is a single grave accent on its own in the code, use a fence of
  // two.
  // If there are two in a row, use one.
  while (new RegExp(`(^|[^\`])${sequence}([^\`]|$)`).test(value)) {
    sequence += "`";
  }

  // If this is not just spaces or eols (tabs don’t count), and either the
  // first or last character are a space, eol, or tick, then pad with spaces.
  if (
    /[^ \r\n]/.test(value) &&
    ((/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value)) || /^`|`$/.test(value))
  ) {
    value = ` ${value} `;
  }

  // We have a potential problem: certain characters after eols could result in
  // blocks being seen.
  // For example, if someone injected the string `'\n# b'`, then that would
  // result in an ATX heading.
  // We can’t escape characters in `inlineCode`, but because eols are
  // transformed to spaces when going from markdown to HTML anyway, we can swap
  // them out.
  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index];
    const expression = state.compilePattern(pattern!);

    let match;
    if (!pattern?.atBreak) continue;

    while ((match = expression.exec(value))) {
      let position = match.index;

      // Support CRLF (patterns only look for one of the characters).
      if (
        value.charCodeAt(position) === 10 /* `\n` */ &&
        value.charCodeAt(position - 1) === 13 /* `\r` */
      ) {
        position--;
      }

      value = `${value.slice(0, position)} ${value.slice(match.index + 1)}`;
    }
  }

  return sequence + value + sequence;
}

export function image(
  node: Image,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const quote = checkQuote(state);
  const suffix = quote === '"' ? "Quote" : "Apostrophe";
  const exit = state.enter("image");
  let subexit = state.enter("label");
  const tracker = state.createTracker(info);
  let value = tracker.move("![");
  value += tracker.move(
    state.safe(node.alt, { before: value, after: "]", ...tracker.current() })
  );
  value += tracker.move("](");

  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    // eslint-disable-next-line regexp/no-obscure-range
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter("destinationLiteral");
    value += tracker.move("<");
    value += tracker.move(
      state.safe(node.url, { before: value, after: ">", ...tracker.current() })
    );
    value += tracker.move(">");
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter("destinationRaw");
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? " " : ")",
        ...tracker.current()
      })
    );
  }

  subexit();

  if (node.title) {
    subexit = state.enter(`title${suffix}`);
    value += tracker.move(` ${quote}`);
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    );
    value += tracker.move(quote);
    subexit();
  }

  value += tracker.move(")");
  exit();

  return value;
}

export function imageReference(
  node: ImageReference,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const type = node.referenceType;
  const exit = state.enter("imageReference");
  let subexit = state.enter("label");
  const tracker = state.createTracker(info);
  let value = tracker.move("![");
  const alt = state.safe(node.alt, {
    before: value,
    after: "]",
    ...tracker.current()
  });
  value += tracker.move(`${alt}][`);

  subexit();
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = state.stack;
  state.stack = [];
  subexit = state.enter("reference");
  // Note: for proper tracking, we should reset the output positions when we end
  // up making a `shortcut` reference, because then there is no brace output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  const reference = state.safe(state.associationId(node), {
    before: value,
    after: "]",
    ...tracker.current()
  });
  subexit();
  state.stack = stack;
  exit();

  if (type === "full" || !alt || alt !== reference) {
    value += tracker.move(`${reference}]`);
  } else if (type === "shortcut") {
    // Remove the unwanted `[`.
    value = value.slice(0, -1);
  } else {
    value += tracker.move("]");
  }

  return value;
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
  const tracker = state.createTracker(info);

  if (formatHeadingAsSetext(node, state)) {
    const exit = state.enter("headingSetext");
    const subexit = state.enter("phrasing");
    const value = state.containerPhrasing(node, {
      ...tracker.current(),
      before: "\n",
      after: "\n"
    });
    subexit();
    exit();

    return `${value}\n${(rank === 1 ? "=" : "-").repeat(
      // The whole size…
      value.length -
        // Minus the position of the character after the last EOL (or
        // 0 if there is none)…
        (Math.max(value.lastIndexOf("\r"), value.lastIndexOf("\n")) + 1)
    )}`;
  }

  const sequence = "#".repeat(rank);
  const exit = state.enter("headingAtx");
  const subexit = state.enter("phrasing");

  // Note: for proper tracking, we should reset the output positions when there
  // is no content returned, because then the space is not output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  tracker.move(`${sequence} `);

  let value = state.containerPhrasing(node, {
    before: "# ",
    after: "\n",
    ...tracker.current()
  });

  if (/^[\t ]/.test(value)) {
    // To do: what effect has the character reference on tracking?
    value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
  }

  value = value ? `${sequence} ${value}` : sequence;

  if (state.options.closeAtx) {
    value += ` ${sequence}`;
  }

  subexit();
  exit();

  return value;
}

export function emphasis(
  node: Emphasis,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const marker = checkEmphasis(state);
  const exit = state.enter("emphasis");
  const tracker = state.createTracker(info);
  const before = tracker.move(marker);

  let between = tracker.move(
    state.containerPhrasing(node, {
      after: marker,
      before,
      ...tracker.current()
    })
  );
  const betweenHead = between.charCodeAt(0);
  const open = encodeInfo(
    info.before.charCodeAt(info.before.length - 1),
    betweenHead,
    marker
  );

  if (open.inside) {
    between = encodeCharacterReference(betweenHead) + between.slice(1);
  }

  const betweenTail = between.charCodeAt(between.length - 1);
  const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);

  if (close.inside) {
    between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
  }

  const after = tracker.move(marker);

  exit();

  state.attentionEncodeSurroundingInfo = {
    after: close.outside,
    before: open.outside
  };
  return before + between + after;
}

export function definition(
  node: Definition,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const quote = checkQuote(state);
  const suffix = quote === '"' ? "Quote" : "Apostrophe";
  const exit = state.enter("definition");
  let subexit = state.enter("label");
  const tracker = state.createTracker(info);
  let value = tracker.move("[");
  value += tracker.move(
    state.safe(state.associationId(node), {
      before: value,
      after: "]",
      ...tracker.current()
    })
  );
  value += tracker.move("]: ");

  subexit();

  if (
    !node.url ||
    // eslint-disable-next-line regexp/no-obscure-range
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter("destinationLiteral");
    value += tracker.move("<");
    value += tracker.move(
      state.safe(node.url, { before: value, after: ">", ...tracker.current() })
    );
    value += tracker.move(">");
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter("destinationRaw");
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? " " : "\n",
        ...tracker.current()
      })
    );
  }

  subexit();

  if (node.title) {
    subexit = state.enter(`title${suffix}`);
    value += tracker.move(` ${quote}`);
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    );
    value += tracker.move(quote);
    subexit();
  }

  exit();

  return value;
}

export function code(
  node: Code,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const marker = checkFence(state);
  const raw = node.value || "";
  const suffix = marker === "`" ? "GraveAccent" : "Tilde";

  if (formatCodeAsIndented(node, state)) {
    const exit = state.enter("codeIndented");
    const value = state.indentLines(raw, (line, _, blank) => {
      return (blank ? "" : "    ") + line;
    });
    exit();
    return value;
  }

  const tracker = state.createTracker(info);
  const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
  const exit = state.enter("codeFenced");
  let value = tracker.move(sequence);

  if (node.lang) {
    const subexit = state.enter(`codeFencedLang${suffix}`);
    value += tracker.move(
      state.safe(node.lang, {
        before: value,
        after: " ",
        encode: ["`"],
        ...tracker.current()
      })
    );
    subexit();
  }

  if (node.lang && node.meta) {
    const subexit = state.enter(`codeFencedMeta${suffix}`);
    value += tracker.move(" ");
    value += tracker.move(
      state.safe(node.meta, {
        before: value,
        after: "\n",
        encode: ["`"],
        ...tracker.current()
      })
    );
    subexit();
  }

  value += tracker.move("\n");

  if (raw) {
    value += tracker.move(`${raw}\n`);
  }

  value += tracker.move(sequence);
  exit();
  return value;
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

  return "\\\n";
}

export function blockquote(
  node: Blockquote,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("blockquote");
  const tracker = state.createTracker(info);
  tracker.move("> ");
  tracker.shift(2);
  const value = state.indentLines(
    state.containerFlow(node, tracker.current()),
    (line, _, blank) => {
      return `>${blank ? "" : " "}${line}`;
    }
  );
  exit();
  return value;
}

export function table(
  node: Table,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("table");
  const value = state.containerFlow(node, info);
  exit();
  return value;
}

export function tableRow(
  node: TableRow,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("tableRow");
  const value = state.containerFlow(node as unknown as Table, info);
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
  const value = state.containerPhrasing(node, info);
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
  const value = state.containerPhrasing(node, info);

  exit();
  return value;
}

export function footnoteDefinition(
  node: FootnoteDefinition,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("footnoteDefinition");
  const value = state.containerFlow(node, info);
  exit();
  return value;
}

export function footnoteReference(
  node: FootnoteReference,
  _: Parents | undefined,
  state: State,
  info: Info
) {
  const exit = state.enter("footnoteReference");
  const tracker = state.createTracker(info);
  let value = tracker.move("[^");
  value += tracker.move(
    state.safe(node.label, {
      before: value,
      after: "]",
      ...tracker.current()
    })
  );
  value += tracker.move("]");
  exit();
  return value;
}

export function yaml(node: Yaml, _: Parents | undefined, state: State) {
  const exit = state.enter("yaml");
  const value = `---\n${node.value || ""}\n---`;
  exit();
  return value;
}
