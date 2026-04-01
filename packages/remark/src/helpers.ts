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

import { isString } from "@stryke/type-checks/is-string";
import type { Code, Heading, Link } from "mdast";
import { toString } from "mdast-util-to-string";
import { classifyCharacter } from "micromark-util-classify-character";
import { EXIT, visit } from "unist-util-visit";
import type {
  ConstructName,
  FlowChildren,
  FlowParents,
  SafeConfig,
  State,
  Unsafe
} from "./types";

export function checkRuleRepetition(state: State) {
  const repetition = state.options.ruleRepetition ?? 3;

  if (repetition < 3) {
    throw new Error(
      `Cannot serialize rules with repetition \`${
        repetition
      }\` for \`options.ruleRepetition\`, expected \`3\` or more`
    );
  }

  return repetition;
}

export function checkRule(state: State) {
  const marker = state.options.rule ?? "*";

  if (marker !== "*" && marker !== "-" && marker !== "_") {
    throw new Error(
      `Cannot serialize rules with \`${String(
        marker
      )}\` for \`options.rule\`, expected \`*\`, \`-\`, or \`_\``
    );
  }

  return marker;
}

export function checkStrong(state: State) {
  const marker = state.options.strong || "*";

  if (marker !== "*" && marker !== "_") {
    throw new Error(
      `Cannot serialize strong with \`${String(
        marker
      )}\` for \`options.strong\`, expected \`*\`, or \`_\``
    );
  }

  return marker;
}

/**
 * Encode a code point as a character reference.
 */
export function encodeCharacterReference(code: number) {
  return `&#x${code.toString(16).toUpperCase()};`;
}

/**
 * Check whether to encode (as a character reference) the characters surrounding an attention run. Which characters are around an attention run influence whether it works or not.
 *
 * @see https://github.com/orgs/syntax-tree/discussions/60
 *
 * @remarks
 * See this markdown in a particular renderer to see what works:
 *
 * ```markdown
 * |                         | A (letter inside) | B (punctuation inside) | C (whitespace inside) | D (nothing inside) |
 * | ----------------------- | ----------------- | ---------------------- | --------------------- | ------------------ |
 * | 1 (letter outside)      | x*y*z             | x*.*z                  | x* *z                 | x**z               |
 * | 2 (punctuation outside) | .*y*.             | .*.*.                  | .* *.                 | .**.               |
 * | 3 (whitespace outside)  | x *y* z           | x *.* z                | x * * z               | x ** z             |
 * | 4 (nothing outside)     | *x*               | *.*                    | * *                   | **                 |
 * ```
 */
export function encodeInfo(outside: number, inside: number, marker: "*" | "_") {
  const outsideKind = classifyCharacter(outside);
  const insideKind = classifyCharacter(inside);

  // Letter outside:
  if (outsideKind === undefined) {
    return insideKind === undefined
      ? // Letter inside:
        // we have to encode *both* letters for `_` as it is looser.
        // it already forms for `*` (and GFMs `~`).
        marker === "_"
        ? { inside: true, outside: true }
        : { inside: false, outside: false }
      : insideKind === 1
        ? // Whitespace inside: encode both (letter, whitespace).
          { inside: true, outside: true }
        : // Punctuation inside: encode outer (letter)
          { inside: false, outside: true };
  }

  // Whitespace outside:
  if (outsideKind === 1) {
    return insideKind === undefined
      ? // Letter inside: already forms.
        { inside: false, outside: false }
      : insideKind === 1
        ? // Whitespace inside: encode both (whitespace).
          { inside: true, outside: true }
        : // Punctuation inside: already forms.
          { inside: false, outside: false };
  }

  // Punctuation outside:
  return insideKind === undefined
    ? // Letter inside: already forms.
      { inside: false, outside: false }
    : insideKind === 1
      ? // Whitespace inside: encode inner (whitespace).
        { inside: true, outside: false }
      : // Punctuation inside: already forms.
        { inside: false, outside: false };
}

export function checkBullet(state: State) {
  const marker = state.options.bullet || "*";

  if (marker !== "*" && marker !== "+" && marker !== "-") {
    throw new Error(
      `Cannot serialize items with \`${String(
        marker
      )}\` for \`options.bullet\`, expected \`*\`, \`+\`, or \`-\``
    );
  }

  return marker;
}

export function checkBulletOther(state: State) {
  const bullet = checkBullet(state);
  const bulletOther = state.options.bulletOther;

  if (!bulletOther) {
    return bullet === "*" ? "-" : "*";
  }

  if (bulletOther !== "*" && bulletOther !== "+" && bulletOther !== "-") {
    throw new Error(
      `Cannot serialize items with \`${String(
        bulletOther
      )}\` for \`options.bulletOther\`, expected \`*\`, \`+\`, or \`-\``
    );
  }

  if (bulletOther === bullet) {
    throw new Error(
      `Expected \`bullet\` (\`${bullet}\`) and \`bulletOther\` (\`${
        bulletOther
      }\` for \`options.bulletOther\`, expected \`*\`, \`+\`, or \`-\``
    );
  }

  return bulletOther;
}

export function checkBulletOrdered(state: State) {
  const marker = state.options.bulletOrdered || ".";

  if (marker !== "." && marker !== ")") {
    throw new Error(
      `Cannot serialize items with \`${String(
        marker
      )}\` for \`options.bulletOrdered\`, expected \`.\` or \`)\``
    );
  }

  return marker;
}

export function checkListItemIndent(state: State) {
  const style = state.options.listItemIndent || "one";

  if (style !== "tab" && style !== "one" && style !== "mixed") {
    throw new Error(
      `Cannot serialize items with \`${String(
        style
      )}\` for \`options.listItemIndent\`, expected \`tab\`, \`one\`, or \`mixed\``
    );
  }

  return style;
}

export function checkQuote(state: State) {
  const marker = state.options.quote || '"';

  if (marker !== '"' && marker !== "'") {
    throw new Error(
      `Cannot serialize title with \`${String(
        marker
      )}\` for \`options.quote\`, expected \`"\`, or \`'\``
    );
  }

  return marker;
}

export function formatLinkAsAutolink(node: Link, state: State) {
  const raw = toString(node);

  return Boolean(
    !state.options.resourceLink &&
    node.url &&
    !node.title &&
    node.children &&
    node.children.length === 1 &&
    node.children[0]?.type === "text" &&
    (raw === node.url || `mailto:${raw}` === node.url) &&
    /^[a-z][a-z+.-]+:/i.test(node.url) &&
    // eslint-disable-next-line regexp/no-obscure-range
    !/[\0- <>\u007F]/.test(node.url)
  );
}

export function formatHeadingAsSetext(node: Heading, state: State) {
  let literalWithBreak = false;
  visit(node, node => {
    if (
      ("value" in node && /\r?\n|\r/.test(node.value)) ||
      node.type === "break"
    ) {
      literalWithBreak = true;
      return EXIT;
    }
    return undefined;
  });

  return Boolean(
    (!node.depth || node.depth < 3) &&
    toString(node) &&
    (state.options.setext ?? literalWithBreak)
  );
}

export function checkEmphasis(state: State) {
  const marker = state.options.emphasis || "*";

  if (marker !== "*" && marker !== "_") {
    throw new Error(
      `Cannot serialize emphasis with \`${String(
        marker
      )}\` for \`options.emphasis\`, expected \`*\`, or \`_\``
    );
  }

  return marker;
}

export function checkFence(state: State) {
  const marker = state.options.fence || "`";

  if (marker !== "`" && marker !== "~") {
    throw new Error(
      `Cannot serialize code with \`${String(
        marker
      )}\` for \`options.fence\`, expected \`\` \` \`\` or \`~\``
    );
  }

  return marker;
}

export function formatCodeAsIndented(node: Code, state: State) {
  return Boolean(
    state.options.fences === false &&
    node.value &&
    // If there’s no info…
    !node.lang &&
    // And there’s a non-whitespace character…
    /[^ \r\n]/.test(node.value) &&
    // And the value doesn’t start or end in a blank…
    !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value)
  );
}

function listInScope(
  stack: ConstructName[],
  list: Unsafe["inConstruct"] | Unsafe["notInConstruct"] | string[] | undefined,
  none: boolean
) {
  if (isString(list)) {
    list = [list];
  }

  if (!list || list.length === 0) {
    return none;
  }

  let index = -1;

  while (++index < list.length) {
    if (list[index] && stack.includes(list[index] as ConstructName)) {
      return true;
    }
  }

  return false;
}

export function patternInScope(stack: ConstructName[], pattern: Unsafe) {
  return (
    listInScope(stack, pattern.inConstruct, true) &&
    !listInScope(stack, pattern.notInConstruct, false)
  );
}

const eol = /\r?\n|\r/g;

export function indentLines(
  value: string,
  map: (value: string, line: number, empty: boolean) => string
) {
  const result: string[] = [];
  let start = 0;
  let line = 0;

  let match: RegExpExecArray | null;

  while ((match = eol.exec(value))) {
    one(value.slice(start, match.index));
    result.push(match[0]);
    start = match.index + match[0].length;
    line++;
  }

  one(value.slice(start));

  return result.join("");

  function one(value: string) {
    result.push(map(value, line, !value));
  }
}

function numerical(a: number, b: number) {
  return a - b;
}

function escapeBackslashes(value: string, after: string) {
  // eslint-disable-next-line regexp/no-obscure-range
  const expression = /\\(?=[!-/:-@[-`{-~])/g;

  const positions: number[] = [];

  const results = [] as string[];
  const whole = value + after;
  let index = -1;
  let start = 0;

  let match;

  while ((match = expression.exec(whole))) {
    positions.push(match.index);
  }

  while (++index < positions.length) {
    if (start !== positions[index]) {
      results.push(value.slice(start, positions[index]));
    }

    results.push("\\");
    start = positions[index]!;
  }

  results.push(value.slice(start));

  return results.join("");
}

export function safe(state: State, input: string, config: SafeConfig) {
  const value = (config.before || "") + (input || "") + (config.after || "");
  const positions = [] as number[];
  const result = [] as string[];

  const infos = {} as Record<number, { before: boolean; after: boolean }>;
  let index = -1;

  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index];

    if (!pattern || !patternInScope(state.stack, pattern)) {
      continue;
    }

    const expression = state.compilePattern(pattern);
    let match;

    while ((match = expression.exec(value))) {
      const hasBefore: boolean = Boolean(
        "before" in pattern || pattern.atBreak
      );
      const hasAfter: boolean = Boolean("after" in pattern);

      const position =
        match.index + (hasBefore && match[1]?.length ? match[1].length : 0);
      if (positions.includes(position)) {
        if (infos[position]?.before && !hasBefore) {
          infos[position].before = false;
        }

        if (infos[position]?.after && !hasAfter) {
          infos[position].after = false;
        }
      } else {
        positions.push(position);
        infos[position] = { before: hasBefore, after: hasAfter };
      }
    }
  }

  positions.sort(numerical);

  let start = config.before ? config.before.length : 0;
  const end = value.length - (config.after ? config.after.length : 0);
  index = -1;

  while (++index < positions.length) {
    const position = positions[index];

    // Character before or after matched:
    if (!position || position < start || position >= end) {
      continue;
    }

    // If this character is supposed to be escaped because it has a condition on
    // the next character, and the next character is definitely being escaped,
    // then skip this escape.
    if (
      (position + 1 < end &&
        positions[index + 1] === position + 1 &&
        infos[position]?.after &&
        !infos[position + 1]?.before &&
        !infos[position + 1]?.after) ||
      (positions[index - 1] === position - 1 &&
        infos[position]?.before &&
        !infos[position - 1]?.before &&
        !infos[position - 1]?.after)
    ) {
      continue;
    }

    if (start !== position) {
      // If we have to use a character reference, an ampersand would be more
      // correct, but as backslashes only care about punctuation, either will
      // do the trick
      result.push(escapeBackslashes(value.slice(start, position), "\\"));
    }

    start = position;

    if (
      // eslint-disable-next-line regexp/no-obscure-range
      /[!-/:-@[-`{-~]/.test(value.charAt(position)) &&
      (!config.encode || !config.encode.includes(value.charAt(position)))
    ) {
      // Character escape.
      result.push("\\");
    } else {
      // Character reference.
      result.push(encodeCharacterReference(value.charCodeAt(position)));
      start++;
    }
  }

  result.push(escapeBackslashes(value.slice(start, end), config.after));

  return result.join("");
}

export function join(
  left: FlowChildren,
  right: FlowChildren,
  parent: FlowParents,
  state: State
) {
  // Indented code after list or another indented code.
  if (
    right.type === "code" &&
    formatCodeAsIndented(right, state) &&
    (left.type === "list" ||
      (left.type === right.type && formatCodeAsIndented(left, state)))
  ) {
    return false;
  }

  // Join children of a list or an item.
  // In which case, `parent` has a `spread` field.
  if ("spread" in parent && typeof parent.spread === "boolean") {
    if (
      left.type === "paragraph" &&
      // Two paragraphs.
      (left.type === right.type ||
        right.type === "definition" ||
        // Paragraph followed by a setext heading.
        (right.type === "heading" && formatHeadingAsSetext(right, state)))
    ) {
      return;
    }

    return parent.spread ? 1 : 0;
  }

  return undefined;
}

export function between(
  left: FlowChildren,
  right: FlowChildren,
  parent: FlowParents,
  state: State
): string {
  let index = state.join.length;

  while (index--) {
    const result = state.join[index]?.(left, right, parent, state);

    if (result === true || result === 1) {
      break;
    }

    if (typeof result === "number") {
      return "\n".repeat(1 + result);
    }

    if (result === false) {
      return "\n\n<!---->\n\n";
    }
  }

  return "\n\n";
}
