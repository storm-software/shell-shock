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

import { isSetString } from "@stryke/type-checks/is-set-string";
import type { Association, Node } from "mdast";
import { decodeString } from "micromark-util-decode-string";
import { zwitch } from "zwitch";
import {
  between,
  encodeCharacterReference,
  indentLines,
  join,
  safe
} from "./helpers";
import {
  blockquote,
  code,
  definition,
  deleteNode,
  emphasis,
  footnoteDefinition,
  footnoteReference,
  hardBreak,
  heading,
  html,
  image,
  imageReference,
  inlineCode,
  link,
  linkReference,
  list,
  listItem,
  paragraph,
  root,
  strong,
  table,
  tableCell,
  tableRow,
  text,
  thematicBreak,
  yaml
} from "./nodes";
import type {
  CompilePattern,
  ConstructName,
  FlowParents,
  Info,
  Join,
  Options,
  PhrasingParents,
  RenderAdapter,
  SafeConfig,
  State,
  TrackFields,
  Unsafe
} from "./types";

function invalid(value: any) {
  throw new Error(`Cannot handle value \`${value}\`, expected node`);
}

function unknown(value: any) {
  throw new Error(`Cannot handle unknown node \`${value.type}\``);
}

const handlers = {
  blockquote,
  break: hardBreak,
  code,
  definition,
  emphasis,
  hardBreak,
  heading,
  html,
  image,
  imageReference,
  inlineCode,
  link,
  linkReference,
  list,
  listItem,
  paragraph,
  root,
  strong,
  text,
  thematicBreak,
  table,
  tableRow,
  tableCell,
  delete: deleteNode,
  footnoteDefinition,
  footnoteReference,
  yaml
};

const fullPhrasingSpans = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];

const unsafe = [
  { character: "\t", after: "[\\r\\n]", inConstruct: "phrasing" },
  { character: "\t", before: "[\\r\\n]", inConstruct: "phrasing" },
  {
    character: "\t",
    inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
  },
  {
    character: "\r",
    inConstruct: [
      "codeFencedLangGraveAccent",
      "codeFencedLangTilde",
      "codeFencedMetaGraveAccent",
      "codeFencedMetaTilde",
      "destinationLiteral",
      "headingAtx"
    ]
  },
  {
    character: "\n",
    inConstruct: [
      "codeFencedLangGraveAccent",
      "codeFencedLangTilde",
      "codeFencedMetaGraveAccent",
      "codeFencedMetaTilde",
      "destinationLiteral",
      "headingAtx"
    ]
  },
  { character: " ", after: "[\\r\\n]", inConstruct: "phrasing" },
  { character: " ", before: "[\\r\\n]", inConstruct: "phrasing" },
  {
    character: " ",
    inConstruct: ["codeFencedLangGraveAccent", "codeFencedLangTilde"]
  },
  // An exclamation mark can start an image, if it is followed by a link or
  // a link reference.
  {
    character: "!",
    after: "\\[",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  // A quote can break out of a title.
  { character: '"', inConstruct: "titleQuote" },
  // A number sign could start an ATX heading if it starts a line.
  { atBreak: true, character: "#" },
  { character: "#", inConstruct: "headingAtx", after: "(?:[\r\n]|$)" },
  // Dollar sign and percentage are not used in markdown.
  // An ampersand could start a character reference.
  { character: "&", after: "[#A-Za-z]", inConstruct: "phrasing" },
  // An apostrophe can break out of a title.
  { character: "'", inConstruct: "titleApostrophe" },
  // A left paren could break out of a destination raw.
  { character: "(", inConstruct: "destinationRaw" },
  // A left paren followed by `]` could make something into a link or image.
  {
    before: "\\]",
    character: "(",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  // A right paren could start a list item or break out of a destination
  // raw.
  { atBreak: true, before: "\\d+", character: ")" },
  { character: ")", inConstruct: "destinationRaw" },
  // An asterisk can start thematic breaks, list items, emphasis, strong.
  { atBreak: true, character: "*", after: "(?:[ \t\r\n*])" },
  {
    character: "*",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  // A plus sign could start a list item.
  { atBreak: true, character: "+", after: "(?:[ \t\r\n])" },
  // A dash can start thematic breaks, list items, and setext heading
  // underlines.
  { atBreak: true, character: "-", after: "(?:[ \t\r\n-])" },
  // A dot could start a list item.
  {
    atBreak: true,
    before: "\\d+",
    character: ".",
    after: "(?:[ \t\r\n]|$)"
  },
  // Slash, colon, and semicolon are not used in markdown for constructs.
  // A less than can start html (flow or text) or an autolink.
  // HTML could start with an exclamation mark (declaration, cdata, comment),
  // slash (closing tag), question mark (instruction), or a letter (tag).
  // An autolink also starts with a letter.
  // Finally, it could break out of a destination literal.
  { atBreak: true, character: "<", after: "[!/?A-Za-z]" },
  {
    character: "<",
    after: "[!/?A-Za-z]",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  { character: "<", inConstruct: "destinationLiteral" },
  // An equals to can start setext heading underlines.
  { atBreak: true, character: "=" },
  // A greater than can start block quotes and it can break out of a
  // destination literal.
  { atBreak: true, character: ">" },
  { character: ">", inConstruct: "destinationLiteral" },
  // Question mark and at sign are not used in markdown for constructs.
  // A left bracket can start definitions, references, labels,
  { atBreak: true, character: "[" },
  {
    character: "[",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  { character: "[", inConstruct: ["label", "reference"] },
  // A backslash can start an escape (when followed by punctuation) or a
  // hard break (when followed by an eol).
  // Note: typical escapes are handled in `safe`!
  { character: "\\", after: "[\\r\\n]", inConstruct: "phrasing" },
  // A right bracket can exit labels.
  { character: "]", inConstruct: ["label", "reference"] },
  // Caret is not used in markdown for constructs.
  // An underscore can start emphasis, strong, or a thematic break.
  { atBreak: true, character: "_" },
  {
    character: "_",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  // A grave accent can start code (fenced or text), or it can break out of
  // a grave accent code fence.
  { atBreak: true, character: "`" },
  {
    character: "`",
    inConstruct: ["codeFencedLangGraveAccent", "codeFencedMetaGraveAccent"]
  },
  {
    character: "`",
    inConstruct: "phrasing",
    notInConstruct: fullPhrasingSpans
  },
  // Left brace, vertical bar, right brace are not used in markdown for
  // constructs.
  // A tilde can start code (fenced).
  { atBreak: true, character: "~" }
];

/**
 * Compile a markdown syntax tree into a [Shell Shock](https://github.com/storm-software/shell-shock) source code string.
 *
 * @param tree - The markdown syntax tree to compile.
 * @param options - Configuration options for the compilation process. See {@link Options} type for details.
 * @returns A string representation of the compiled markdown syntax tree, suitable for generating console output in a [Shell Shock](https://github.com/storm-software/shell-shock) application.
 */
export function toConsole(tree: Node, options: Options): string {
  const state = {
    adapter: Object.fromEntries(
      Object.entries(options.adapter).map(([key, value]) => [
        key,
        isSetString(value) ? { before: `${value}(\``, after: `\`); ` } : value
      ])
    ) as RenderAdapter,
    associationId: (node: Association) => {
      if (node.label || !node.identifier) {
        return node.label || "";
      }

      return decodeString(node.identifier);
    },
    containerPhrasing: (parent: PhrasingParents, info: Info) => {
      const indexStack = state.indexStack;
      const children = parent.children || [];

      const results = [] as Array<string | undefined>;
      let index = -1;
      let before = info.before;

      let encodeAfter;

      indexStack.push(-1);
      let tracker = state.createTracker(info);

      while (++index < children.length) {
        const child = children[index];
        let after;

        indexStack[indexStack.length - 1] = index;

        if (index + 1 < children.length && children[index + 1]) {
          let handle = state.handlers[children[index + 1]!.type];
          if (handle && handle.peek) handle = handle.peek;
          after = handle
            ? handle(children[index + 1], parent, state, {
                before: "",
                after: "",
                ...tracker.current()
              }).charAt(0)
            : "";
        } else {
          after = info.after;
        }

        if (
          results.length > 0 &&
          (before === "\r" || before === "\n") &&
          child?.type === "html"
        ) {
          results[results.length - 1] = results[results.length - 1]?.replace(
            /(?:\r?\n|\r)$/,
            " "
          );
          before = " ";

          // To do: does this work to reset tracker?
          tracker = state.createTracker(info);
          tracker.move(results.join(""));
        }

        let value = state.handle(child, parent, state, {
          ...tracker.current(),
          after,
          before
        });

        if (encodeAfter && encodeAfter === value.slice(0, 1)) {
          value =
            encodeCharacterReference(encodeAfter.charCodeAt(0)) +
            value.slice(1);
        }

        const encodingInfo = state.attentionEncodeSurroundingInfo;
        state.attentionEncodeSurroundingInfo = undefined;
        encodeAfter = undefined;

        if (encodingInfo) {
          if (
            results.length > 0 &&
            encodingInfo.before &&
            results[results.length - 1] &&
            before === results[results.length - 1]?.slice(-1)
          ) {
            results[results.length - 1] =
              results[results.length - 1]!.slice(0, -1) +
              encodeCharacterReference(before.charCodeAt(0));
          }

          if (encodingInfo.after) encodeAfter = after;
        }

        tracker.move(value);
        results.push(value);
        before = value.slice(-1);
      }

      indexStack.pop();

      return results.join("");
    },
    containerFlow: (parent: FlowParents, info: TrackFields) => {
      const indexStack = state.indexStack;
      const children = parent.children || [];
      const tracker = state.createTracker(info);

      const results = [];
      let index = -1;

      indexStack.push(-1);

      while (++index < children.length) {
        const child = children[index];

        indexStack[indexStack.length - 1] = index;

        results.push(
          tracker.move(
            state.handle(child, parent, state, {
              before: "\n",
              after: "\n",
              ...tracker.current()
            })
          )
        );

        if (child?.type !== "list") {
          state.listMarkerLastUsed = undefined;
        }

        if (child && index < children.length - 1 && children[index + 1]) {
          results.push(
            tracker.move(between(child, children[index + 1]!, parent, state))
          );
        }
      }

      indexStack.pop();

      return results.join("");
    },
    createTracker: (config: any) => {
      const options = config || {};
      const now = options.now || {};
      let lineShift = options.lineShift || 0;
      let line = now.line || 1;
      let column = now.column || 1;

      function current() {
        return { now: { line, column }, lineShift };
      }

      function shift(value: any) {
        lineShift += value;
      }

      function move(input: string) {
        const value = input || "";
        const chunks = value.split(/\r?\n|\r/);
        const tail = chunks[chunks.length - 1];
        if (tail) {
          line += chunks.length - 1;
          column =
            chunks.length === 1
              ? column + tail.length
              : 1 + tail.length + lineShift;
        }

        return value;
      }

      return { move, current, shift };
    },
    compilePattern: ((pattern: Unsafe) => {
      if (!pattern._compiled) {
        const before =
          (pattern.atBreak ? "[\\r\\n][\\t ]*" : "") +
          (pattern.before ? `(?:${pattern.before})` : "");

        pattern._compiled = new RegExp(
          (before ? `(${before})` : "") +
            (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? "\\" : "") +
            pattern.character +
            (pattern.after ? `(?:${pattern.after})` : ""),
          "g"
        );
      }

      return pattern._compiled;
    }) as CompilePattern,
    enter: (name: ConstructName) => {
      state.stack.push(name);

      return () => {
        state.stack.pop();
      };
    },
    handlers: { ...handlers },
    handle: undefined as any,
    indentLines,
    indexStack: [] as number[],
    join: [join] as Join[],
    options,
    safe: (value: string, config: SafeConfig) => {
      return safe(state, value, config);
    },
    stack: [] as ConstructName[],
    unsafe
  } as State;

  state.handle = zwitch("type", {
    invalid,
    unknown,
    handlers
  });

  let result = state.handle(tree, undefined, state, {
    before: "\n",
    after: "\n",
    now: { line: 1, column: 1 },
    lineShift: 0
  });

  if (
    result &&
    result.charCodeAt(result.length - 1) !== 10 &&
    result.charCodeAt(result.length - 1) !== 13
  ) {
    result += "\n";
  }

  return result;
}
