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

import type { HtmlNode } from "./tag-utilities";

const attributeCache = new WeakMap<HtmlNode, Map<string, string | null>>();

/**
 * Get attribute value from tag with validation and caching
 * @param tag - HTML tag object
 * @param attributeName - Name of attribute to get
 * @param defaultValue - Default value if attribute not found
 * @returns Attribute value or default
 */
export const getAttribute = (
  tag: HtmlNode,
  attributeName: string | unknown,
  defaultValue: string | null = null
): string | null => {
  // Validate inputs
  if (!tag || typeof tag !== "object") {
    return defaultValue;
  }

  if (!attributeName || typeof attributeName !== "string") {
    return defaultValue;
  }

  // Check cache first
  let tagCache = attributeCache.get(tag);
  if (tagCache) {
    const cachedValue = tagCache.get(attributeName);
    if (cachedValue !== undefined) {
      return cachedValue ?? defaultValue;
    }
  }

  // Not in cache, compute value
  if (!tag.attrs || !Array.isArray(tag.attrs) || tag.attrs.length === 0) {
    // Cache the miss
    if (!tagCache) {
      tagCache = new Map();
      attributeCache.set(tag, tagCache);
    }
    tagCache.set(attributeName, null);
    return defaultValue;
  }

  const attribute = tag.attrs.find(
    attr => attr && typeof attr === "object" && attr.name === attributeName
  );

  // Cache the result
  if (!tagCache) {
    tagCache = new Map();
    attributeCache.set(tag, tagCache);
  }

  if (!attribute || attribute.value === undefined) {
    tagCache.set(attributeName, null);
    return defaultValue;
  }

  const value = attribute.value;
  tagCache.set(attributeName, value);
  return value;
};

export function getClassNames(tag: HtmlNode): string[] {
  const classAttr = getAttribute(tag, "class", null);
  if (!classAttr) {
    return [];
  }

  return classAttr
    .split(/\s+/)
    .map(className => className.trim())
    .filter(className => className.length > 0);
}
