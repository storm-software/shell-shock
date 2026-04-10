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
import type {
  BlockTagValue,
  HtmlNode,
  InlineTagValue,
  WrapValue
} from "../helpers/tag-utilities";

export function bodyText(value: WrapValue): string {
  return `textColors.body.primary(${JSON.stringify(String(value ?? ""))})`;
}

export function quoted(value: WrapValue): string {
  return JSON.stringify(String(value ?? ""));
}

export function inlineCodeText(value: WrapValue): string {
  return `inlineCode(${quoted(value)})`;
}

export function codeBlockText(value: string, language?: string | null): string {
  return `code(${JSON.stringify(value)}${
    language ? `, ${JSON.stringify(language)}` : ""
  })`;
}

export function getTextContent(node: HtmlNode | null | undefined): string {
  if (!node) {
    return "";
  }

  if (typeof node.value === "string") {
    return node.value;
  }

  if (!node.childNodes || node.childNodes.length === 0) {
    return "";
  }

  return node.childNodes.map(childNode => getTextContent(childNode)).join("");
}

export function normalizeText(value: string): string {
  return value.replaceAll(/\s+/g, " ").trim();
}

export function asInline(
  nodeName: string | undefined,
  value: string | null,
  pre: string | null = null,
  post: string | null = null
): InlineTagValue {
  return {
    pre,
    value,
    post,
    type: "inline",
    nodeName
  };
}

export function asBlock(
  nodeName: string | undefined,
  value: string | null,
  marginTop = 0,
  marginBottom = 0
): BlockTagValue {
  return {
    marginTop,
    value,
    marginBottom,
    type: "block",
    nodeName
  };
}

export function extractLanguage(
  node: HtmlNode | null | undefined
): string | null {
  if (!node) {
    return null;
  }

  const classNames =
    getAttribute(node, "class", "")
      ?.split(/\s+/)
      .map(className => className.trim())
      .filter(Boolean) ?? [];

  for (const className of classNames) {
    if (className.startsWith("language-")) {
      return className.slice("language-".length) || null;
    }

    if (className.startsWith("lang-")) {
      return className.slice("lang-".length) || null;
    }
  }

  return null;
}

export function findFirstDescendant(
  node: HtmlNode | null | undefined,
  nodeName: string
): HtmlNode | null {
  if (!node?.childNodes) {
    return null;
  }

  for (const childNode of node.childNodes) {
    if (childNode.nodeName === nodeName) {
      return childNode;
    }

    const nested = findFirstDescendant(childNode, nodeName);

    if (nested) {
      return nested;
    }
  }

  return null;
}

export function findDescendants(
  node: HtmlNode | null | undefined,
  nodeName: string
): HtmlNode[] {
  if (!node?.childNodes) {
    return [];
  }

  const matches: HtmlNode[] = [];

  for (const childNode of node.childNodes) {
    if (childNode.nodeName === nodeName) {
      matches.push(childNode);
    }

    matches.push(...findDescendants(childNode, nodeName));
  }

  return matches;
}

export function buildBar(
  value: number,
  max: number,
  width = 10,
  filled = "#",
  empty = "-"
): string {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return empty.repeat(width);
  }

  const ratio = Math.max(0, Math.min(1, value / max));
  const fillCount = Math.round(ratio * width);

  return (
    filled.repeat(fillCount) + empty.repeat(Math.max(width - fillCount, 0))
  );
}
