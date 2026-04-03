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
  Association,
  Nodes,
  Parents,
  PhrasingContent,
  TableCell,
  TableRow
} from "mdast";

import type { Point } from "unist";

/**
 * Get an identifier from an association to match it to others.
 *
 * Associations are nodes that match to something else through an ID: https://github.com/syntax-tree/mdast#association.
 *
 * The `label` of an association is the string value: character escapes and
 * references work, and casing is intact.
 * The `identifier` is used to match one association to another:
 * controversially, character escapes and references don’t work in this
 * matching: \`\&copy;
` does not match `©`, and `\+\` does not match \`+\`.
 *
 * But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
 * matches `a b`.
 * So, we do prefer the label when figuring out how we’re going to serialize:
 * it has whitespace, casing, and we can ignore most useless character
 * escapes and all character references.
 */
export type AssociationId = (node: Association) => string;

/**
 * Compile an unsafe pattern to a regex.
 */
export type CompilePattern = (info: Unsafe) => RegExp;

/**
 * Interface of registered constructs.
 *
 * When working on extensions that use new constructs, extend the corresponding
 * interface to register its name:
 *
 * ```ts
 * declare module 'mdast-util-to-markdown' {
 *   interface ConstructNameMap {
 *     // Register a new construct name (value is used, key should match it).
 *     gfmStrikethrough: 'gfmStrikethrough'
 *   }
 * }
 * ```
 */
export interface ConstructNameMap {
  /**
   * Whole autolink.
   *
   * ```markdown
   * > | <https://example.com> and <admin@example.com>
   *     ^^^^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^^
   * ```
   */
  autolink: "autolink";

  /**
   * Whole block quote.
   *
   * ```markdown
   * > | > a
   *     ^^^
   * > | b
   *     ^
   * ```
   */
  blockquote: "blockquote";

  /**
   * Whole code (indented).
   *
   * ```markdown
   * ␠␠␠␠console.log(1)
   * ^^^^^^^^^^^^^^^^^^
   * ```
   */
  codeIndented: "codeIndented";

  /**
   * Whole code (fenced).
   *
   * ```markdown
   * > | ```js
   *     ^^^^^
   * > | console.log(1)
   *     ^^^^^^^^^^^^^^
   * > | ```
   *     ^^^
   * ```
   */
  codeFenced: "codeFenced";

  /**
   * Code (fenced) language, when fenced with grave accents.
   *
   * ```markdown
   * > | ```js
   *        ^^
   *   | console.log(1)
   *   | ```
   * ```
   */
  codeFencedLangGraveAccent: "codeFencedLangGraveAccent";

  /**
   * Code (fenced) language, when fenced with tildes.
   *
   * ```markdown
   * > | ~~~js
   *        ^^
   *   | console.log(1)
   *   | ~~~
   * ```
   */
  codeFencedLangTilde: "codeFencedLangTilde";

  /**
   * Code (fenced) meta string, when fenced with grave accents.
   *
   * ```markdown
   * > | ```js eval
   *           ^^^^
   *   | console.log(1)
   *   | ```
   * ```
   */
  codeFencedMetaGraveAccent: "codeFencedMetaGraveAccent";

  /**
   * Code (fenced) meta string, when fenced with tildes.
   *
   * ```markdown
   * > | ~~~js eval
   *           ^^^^
   *   | console.log(1)
   *   | ~~~
   * ```
   */
  codeFencedMetaTilde: "codeFencedMetaTilde";

  /**
   * Whole definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^^^^^^^^^^
   * ```
   */
  definition: "definition";

  /**
   * Destination (literal) (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a]: <b> "c"
   *          ^^^
   * > | a ![b](<c> "d") e
   *            ^^^
   * ```
   */
  destinationLiteral: "destinationLiteral";

  /**
   * Destination (raw) (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * > | a ![b](c "d") e
   *            ^
   * ```
   */
  destinationRaw: "destinationRaw";

  /**
   * Emphasis.
   *
   * ```markdown
   * > | *a*
   *     ^^^
   * ```
   */
  emphasis: "emphasis";

  /**
   * Whole heading (atx).
   *
   * ```markdown
   * > | # alpha
   *     ^^^^^^^
   * ```
   */
  headingAtx: "headingAtx";

  /**
   * Whole heading (setext).
   *
   * ```markdown
   * > | alpha
   *     ^^^^^
   * > | =====
   *     ^^^^^
   * ```
   */
  headingSetext: "headingSetext";

  /**
   * Whole image.
   *
   * ```markdown
   * > | ![a](b)
   *     ^^^^^^^
   * > | ![c]
   *     ^^^^
   * ```
   */
  image: "image";

  /**
   * Whole image reference.
   *
   * ```markdown
   * > | ![a]
   *     ^^^^
   * ```
   */
  imageReference: "imageReference";

  /**
   * Label (occurs in definitions, image reference, image, link reference,
   * link).
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^^^
   * > | a [b] c
   *       ^^^
   * > | a ![b][c] d
   *       ^^^^
   * > | a [b](c) d
   *       ^^^
   * ```
   */
  label: "label";

  /**
   * Whole link.
   *
   * ```markdown
   * > | [a](b)
   *     ^^^^^^
   * > | [c]
   *     ^^^
   * ```
   */
  link: "link";

  /**
   * Whole link reference.
   *
   * ```markdown
   * > | [a]
   *     ^^^
   * ```
   */
  linkReference: "linkReference";

  /**
   * List.
   *
   * ```markdown
   * > | * a
   *     ^^^
   * > | 1. b
   *     ^^^^
   * ```
   */
  list: "list";

  /**
   * List item.
   *
   * ```markdown
   * > | * a
   *     ^^^
   * > | 1. b
   *     ^^^^
   * ```
   */
  listItem: "listItem";

  /**
   * Paragraph.
   *
   * ```markdown
   * > | a b
   *     ^^^
   * > | c.
   *     ^^
   * ```
   */
  paragraph: "paragraph";

  /**
   * Phrasing (occurs in headings, paragraphs, etc).
   *
   * ```markdown
   * > | a
   *     ^
   * ```
   */
  phrasing: "phrasing";

  /**
   * Reference (occurs in image, link).
   *
   * ```markdown
   * > | [a][]
   *        ^^
   * ```
   */
  reference: "reference";

  /**
   * Strong.
   *
   * ```markdown
   * > | **a**
   *     ^^^^^
   * ```
   */
  strong: "strong";

  /**
   * Strikethrough.
   *
   * ```markdown
   * > | ~~a~~
   *     ^^^^^
   * ```
   */
  strikethrough: "strikethrough";

  /**
   * Title using single quotes (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a](b 'c')
   *           ^^^
   * ```
   */
  titleApostrophe: "titleApostrophe";

  /**
   * Title using double quotes (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a](b "c")
   *           ^^^
   * ```
   */
  titleQuote: "titleQuote";

  /**
   * Table (whole table).
   *
   * ```markdown
   * > | | a | b |
   *     ^^^^^^^^^^
   * > | | - | - |
   *     ^^^^^^^^^^
   * > | | c | d |
   *     ^^^^^^^^^^
   * ```
   */
  table: "table";

  /**
   * Table row.
   *
   * ```markdown
   * > | a | b |
   *     ^^^^^^
   * ```
   */
  tableRow: "tableRow";

  /**
   * Table cell.
   *
   * ```markdown
   * > | a | b |
   *     ^^^^^^
   * ```
   */
  tableCell: "tableCell";

  /**
   * Delete.
   *
   * ```markdown
   * > | ~~a~~
   *     ^^^^^
   * ```
   */
  delete: "delete";

  /**
   * Footnote definition.
   *
   * ```markdown
   * > | [^1]: a
   *     ^^^^^^^
   * ```
   */
  footnoteDefinition: "footnoteDefinition";

  /**
   * Footnote reference.
   *
   * ```markdown
   * > | [^1]
   *     ^^^
   * ```
   */
  footnoteReference: "footnoteReference";

  /**
   * YAML.
   *
   * ```markdown
   * > | ---
   *     ^^^
   * ```
   */
  yaml: "yaml";
}

/**
 * Construct names for things generated by `mdast-util-to-markdown`.
 *
 * This is an enum of strings, each being a semantic label, useful to know when
 * serializing whether we’re for example in a double (`"`) or single (`'`)
 * quoted title.
 */
export type ConstructName = ConstructNameMap[keyof ConstructNameMap];

/**
 * Serialize the children of a parent that contains flow children.
 *
 * These children will typically be joined by blank lines.
 * What they are joined by exactly is defined by `Join` functions.
 */
export type ContainerFlow = (parent: FlowParents, info: TrackFields) => string;

/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * These children will be joined flush together.
 */
export type ContainerPhrasing = (parent: PhrasingParents, info: Info) => string;

/**
 * Track positional info in the output.
 *
 * This info isn’t used yet but such functionality will allow line wrapping,
 * source maps, etc.
 */
export type CreateTracker = (info: TrackFields) => Tracker;

/**
 * Whether to encode things — with fields representing the surrounding of a
 * whole.
 */
export interface EncodeSurrounding {
  /**
   * Whether to encode after.
   */
  after: boolean;

  /**
   * Whether to encode before.
   */
  before: boolean;
}

/**
 * Whether to encode things — with fields representing the relationship to a
 * whole.
 */
export interface EncodeSides {
  /**
   * Whether to encode inside.
   */
  inside: boolean;

  /**
   * Whether to encode before.
   */
  outside: boolean;
}

/**
 * Enter something.
 */
export type Enter = (name: ConstructName) => Exit;

/**
 * Exit something.
 */
export type Exit = () => undefined;

/**
 * Children of flow nodes.
 */
export type FlowChildren = FlowParents extends {
  children: Array<infer T>;
}
  ? T
  : never;

/**
 * Parents that are not phrasing, or similar.
 */
export type FlowParents = Exclude<
  Parents,
  PhrasingContent | TableCell | TableRow
>;

/**
 * Handle particular nodes.
 *
 * @remarks
 * Each key is a node type, each value its corresponding handler.
 */
export type Handlers = Record<Nodes["type"], Handle & { peek?: Handle }>;

/**
 * Handle a particular node.
 */
export type Handle = (
  node: any,
  parent: Parents | undefined,
  state: State,
  Info: Info
) => string;

/**
 * Pad serialized markdown.
 */
export type IndentLines = (value: string, map: Map) => string;

/**
 * Info on the surrounding of the node that is serialized.
 */
export interface Info extends SafeFields, TrackFields {}

/**
 * How to join two blocks.
 *
 * “Blocks” are typically joined by one blank line.
 * Sometimes it’s nicer to have them flush next to each other, yet other
 * times they cannot occur together at all.
 *
 * Join functions receive two adjacent siblings and their parent and what
 * they return defines how many blank lines to use between them.
 *
 * ```markdown
 * > Quote 1
 *
 * <!---->
 *
 * > Quote 2
 * ```
 */
export type Join = (
  left: FlowChildren,
  right: FlowChildren,
  parent: FlowParents,
  state: State
) => boolean | number | null | undefined | void;

/**
 * Map function to pad a single line.
 */
export type Map = (value: string, line: number, blank: boolean) => string;

export interface RenderAdapter {
  /**
   * Heading text.
   */
  heading: (text: string, level: number) => string;

  /**
   * Body text.
   */
  body: (text: string) => string;

  /**
   * Bold text.
   */
  bold: (text: string) => string;

  /**
   * Italic text.
   */
  italic: (text: string) => string;

  /**
   * Strikethrough text.
   */
  strikethrough: (text: string) => string;

  /**
   * Underlined text.
   */
  underline: (text: string) => string;

  /**
   * Blockquote text.
   */
  blockquote: (text: string) => string;

  /**
   * Link text.
   */
  link: (url: string, text?: string) => string;

  /**
   * Table.
   */
  table: (cells: string[][]) => string;

  /**
   * Code block.
   */
  code: (text: string, language?: string) => string;

  /**
   * Inline code.
   */
  inlineCode: (text: string) => string;

  /**
   * Line break.
   */
  break: () => string;

  /**
   * Horizontal divider.
   */
  horizontal: () => string;
}

/**
 * Options for {@link toConsole}.
 */
export interface Options {
  /**
   * The rendering components to use for console output.
   */
  adapter: RenderAdapter;
}

/**
 * Parent of phrasing nodes.
 */
export type PhrasingParents = Parents extends {
  children: Array<infer T>;
}
  ? PhrasingContent extends T
    ? Parents
    : never
  : never;

/**
 * Configuration for `safe`
 */
export interface SafeConfig extends SafeFields {
  /**
   * Extra characters that *must* be encoded (as character references) instead
   * of escaped (character escapes) (optional).
   *
   * Only ASCII punctuation will use character escapes, so you never need to
   * pass non-ASCII-punctuation here.
   */
  encode?: string[];
}

/**
 * Info on the characters that are around the current thing we are generating.
 */
export interface SafeFields {
  /**
   * Characters after this (guaranteed to be one, can be more).
   */
  after: string;

  /**
   * Characters before this (guaranteed to be one, can be more).
   */
  before: string;
}

/**
 * Make a string safe for embedding in markdown constructs.
 *
 * In markdown, almost all punctuation characters can, in certain cases,
 * result in something.
 * Whether they do is highly subjective to where they happen and in what
 * they happen.
 *
 * To solve this, `mdast-util-to-markdown` tracks:
 *
 * Characters before and after something;

 * What “constructs” we are in.
 *
 * This information is then used by this function to escape or encode
 * special characters.
 */
export type Safe = (
  input: string | null | undefined,
  config: SafeConfig
) => string;

/**
 * Info passed around about the current state.
 */
export interface State {
  /**
   * The rendering components to use for console output.
   */
  adapter: RenderAdapter;

  /**
   * Get an identifier from an association to match it to others.
   */
  associationId: AssociationId;

  /**
   * List marker currently in use.
   */
  listMarkerCurrent?: string;

  /**
   * List marker previously in use.
   */
  listMarkerLastUsed?: string;

  /**
   * Compile an unsafe pattern to a regex.
   */
  compilePattern: CompilePattern;

  /**
   * Enter a construct (returns a corresponding exit function).
   */
  enter: Enter;

  /**
   * Applied handlers.
   */
  handlers: Partial<Handlers>;

  /**
   * Call the configured handler for the given node.
   */
  handle: Handle;

  /**
   * Pad serialized markdown.
   */
  indentLines: IndentLines;

  /**
   * Positions of child nodes in their parents.
   */
  indexStack: number[];

  /**
   * Applied join handlers.
   */
  join: Join[];

  /**
   * Applied user configuration.
   */
  options: Options;

  /**
   * Serialize the children of a parent that contains flow children.
   */
  safe: Safe;

  /**
   * Stack of constructs we’re in.
   */
  stack: ConstructName[];

  /**
   * Applied unsafe patterns.
   */
  unsafe: Unsafe[];
}

/**
 * Get current tracked info.
 *
 * @returns
 *   Current tracked info.
 */
export type TrackCurrent = () => TrackFields;

/**
 * Info on where we are in the document we are generating.
 */
export interface TrackFields {
  /**
   * Number of columns each line will be shifted by wrapping nodes.
   */
  lineShift: number;

  /**
   * Current point.
   */
  now: Point;
}

/**
 * Move past some generated markdown.
 */
export type TrackMove = (value: string | null | undefined) => string;

/**
 * Define a relative increased line shift (the typical indent for lines).
 */
export type TrackShift = (value: number) => undefined;

/**
 * Track positional info in the output.
 *
 * This info isn’t used yet but such functionality will allow line wrapping,
 * source maps, etc.
 */
export interface Tracker {
  /**
   * Get the current tracked info.
   */
  current: TrackCurrent;

  /**
   * Move past some generated markdown.
   */
  move: TrackMove;

  /**
   * Define an increased line shift (the typical indent for lines).
   */
  shift: TrackShift;
}

/**
 * Schema that defines when a character cannot occur.
 */
export interface Unsafe {
  /**
   * The unsafe pattern (this whole object) compiled as a regex (do not use).
   *
   * This is internal and must not be defined.
   */
  _compiled?: RegExp | null | undefined;

  /**
   * `character` is bad when this is after it (optional).
   */
  after?: string | null | undefined;

  /**
   * `character` is bad at a break (cannot be used together with `before`) (optional).
   */
  atBreak?: boolean | null | undefined;

  /**
   * `character` is bad when this is before it (cannot be used together with
   * `atBreak`) (optional).
   */
  before?: string | null | undefined;

  /**
   * Single unsafe character.
   */
  character: string;

  /**
   * Constructs where this is bad (optional).
   */
  inConstruct?: Array<ConstructName> | ConstructName | null | undefined;

  /**
   * Constructs where this is fine again (optional).
   */
  notInConstruct?: Array<ConstructName> | ConstructName | null | undefined;
}
