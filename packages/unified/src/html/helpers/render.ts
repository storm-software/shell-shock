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

import tags from "../tags";

const MAX_DEPTH = 100;
const CACHE_ENABLED = process.env.CACHE_RENDER !== "false";

/**
 * Cache for rendered subtrees (WeakMap for automatic garbage collection)
 * Key: node object, Value: Map of context hash -\> rendered result
 */
const renderCache = new WeakMap();

/**
 * Get cached render result
 *
 * @param node - HTML node
 * @param context - Rendering context
 * @returns - Cached result or undefined
 */
const getCachedRender = (node, context) => {
  if (!CACHE_ENABLED || !node || typeof node !== "object") {
    return;
  }

  const nodeCache = renderCache.get(node);
  if (!nodeCache) {
    return;
  }

  return nodeCache.get(
    JSON.stringify({
      lineWidth: context.lineWidth,
      pre: context.pre,
      listDepth: context.listDepth,
      listType: context.listType,
      depth: context.depth
    })
  );
};

/**
 * Cache render result
 *
 * @param node - HTML node
 * @param context - Rendering context
 * @param result - Render result
 */
const setCachedRender = (node, context, result) => {
  if (!CACHE_ENABLED || !node || typeof node !== "object") {
    return;
  }

  let nodeCache = renderCache.get(node);
  if (!nodeCache) {
    nodeCache = new Map();
    renderCache.set(node, nodeCache);
  }

  nodeCache.set(
    JSON.stringify({
      lineWidth: context.lineWidth,
      pre: context.pre,
      listDepth: context.listDepth,
      listType: context.listType,
      depth: context.depth
    }),
    result
  );

  // Limit cache size per node to prevent memory bloat
  if (nodeCache.size > 10) {
    const firstKey = nodeCache.keys().next().value;
    nodeCache.delete(firstKey);
  }
};

/**
 * Render HTML tag with optimizations for deep nesting
 *
 * @param node - HTML node
 * @param context - Rendering context
 * @param defaultTag - Default tag function
 * @returns - Render result
 */
export const renderTag = (node, context, defaultTag = tags.div) => {
  // Validate inputs
  if (!node) {
    return null;
  }

  // Initialize depth on first call
  const currentDepth = context.depth === undefined ? 0 : context.depth;

  // Check if we've exceeded maximum nesting depth
  if (currentDepth >= MAX_DEPTH) {
    return null;
  }

  // Create new context with incremented depth
  const newContext = { ...context, depth: currentDepth + 1 };

  // Check cache with new context (includes updated depth)
  const cached = getCachedRender(node, newContext);
  if (cached !== undefined) {
    return cached;
  }

  let result = null;

  try {
    const tagFunction = tags[node.nodeName || "#text"] || defaultTag;

    // Render tag
    result = tagFunction(node, newContext);

    // Cache result with new context (includes updated depth)
    setCachedRender(node, newContext, result);
  } catch {
    // Return null on error to skip this tag
    result = null;
  }

  return result;
};

/**
 * Batch render multiple nodes
 * Optimized for rendering lists and repeated structures
 * @param nodes - Array of HTML nodes
 * @param context - Rendering context
 * @param defaultTag - Default tag function
 * @returns - Array of render results
 */
export const renderNodes = (nodes, context, defaultTag = tags.div) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return [];
  }

  const results = [];

  for (const node of nodes) {
    const result = renderTag(node, context, defaultTag);

    if (result !== null && result !== undefined) {
      results.push(result);
    }
  }

  return results;
};
