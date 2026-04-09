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

import he from "he";
import normalizeWhitespace from "normalize-html-whitespace";
import tags from "../tags";
import { concatTwoBlockTags, concatTwoInlineTags } from "./concat";
import { getAttribute } from "./get-attribute";
import { renderTag } from "./render";
import { wrapLineWidth } from "./wrap-line-width";

export const inlineToBlockTag = value => {
  if (!value) {
    return null;
  }

  return {
    ...value,
    marginTop: 0,
    marginBottom: 0,
    type: "block",
    nodeName: "#blockTag"
  };
};

export const textNode = (tag, context) => {
  if (context.pre) {
    return {
      pre: null,
      value: he.decode(tag.value),
      post: null,
      type: "inline",
      nodeName: "#text"
    };
  }

  const normalized = [
    ...(normalizeWhitespace(tag.value) || "").replaceAll("\n", " ")
  ];

  const pre = [" ", "\n"].includes(normalized[0]) ? normalized.shift() : null;
  const post = [" ", "\n"].includes(normalized.at(-1))
    ? normalized.pop()
    : null;

  return {
    pre,
    value: normalized.length > 0 ? `${he.decode(normalized.join(""))}` : null,
    post,
    type: "inline",
    nodeName: "#text"
  };
};

/**
 * A helper function to render block-level HTML tags, processing their child nodes and applying appropriate margins and formatting based on the provided context and wrapper function. The function handles both block and inline child nodes, concatenating their rendered output while managing whitespace and line breaks to ensure proper display in terminal environments.
 *
 * @param wrapper - A function that takes the rendered content of the block tag and returns a potentially modified version of it. This allows for custom processing or styling to be applied to the content of the block tag.
 * @param localContext - An optional context object that can be used to provide additional information or configuration for rendering the block tag. This context can include properties such as margin settings, theme information, or any other relevant data that may influence how the block tag is rendered.
 * @returns A function that renders a block-level HTML tag, processing its child nodes and applying appropriate margins and formatting based on the provided context and wrapper function. The function handles both block and inline child nodes, concatenating their rendered output while managing whitespace and line breaks to ensure proper display in terminal environments.
 */
export function blockTag(wrapper, localContext) {
  return (tag, context) => {
    const wrapFunction = wrapper || (argument => argument);

    if (!tag || !tag.childNodes) {
      return null;
    }

    let liItemNumber = Number.parseInt(getAttribute(tag, "start", "1"), 10);
    const value = tag.childNodes.reduce(
      (accumulator, node) => {
        const nodeTag = renderTag(node, { ...context, liItemNumber });

        if (!nodeTag) {
          return accumulator;
        }

        if (nodeTag.nodeName === "li") {
          liItemNumber += 1;
        }

        if (nodeTag.type === "inline") {
          return {
            block: accumulator.block,
            inline: concatTwoInlineTags(accumulator.inline, nodeTag)
          };
        }

        if (accumulator.inline && accumulator.inline.value != null) {
          accumulator.inline.value = wrapLineWidth(
            accumulator.inline.value,
            context
          );
        }

        accumulator.block = concatTwoBlockTags(
          accumulator.block,
          inlineToBlockTag(accumulator.inline)
        );

        accumulator.block = concatTwoBlockTags(accumulator.block, nodeTag);

        return {
          block: accumulator.block,
          inline: null
        };
      },
      {
        block: null,
        inline: null
      }
    );

    if (value.inline != null && value.inline.value != null) {
      value.inline.value = wrapLineWidth(value.inline.value, context);
    }

    value.block = concatTwoBlockTags(
      value.block,
      inlineToBlockTag(value.inline)
    );

    let topBlock = localContext?.marginTop || 0;

    topBlock = !context || !context.pre ? topBlock + 1 : topBlock;

    let bottomBlock = localContext?.marginBottom || 0;

    bottomBlock = !context || !context.pre ? bottomBlock + 1 : bottomBlock;

    // Handle empty content - return empty string with margins instead of null
    if (!value.block || !value.block.value) {
      return {
        marginTop: topBlock,
        value: "",
        marginBottom: bottomBlock,
        type: "block",
        nodeName: tag.nodeName
      };
    }

    return {
      marginTop:
        value.block.marginTop && value.block.marginTop > topBlock
          ? value.block.marginTop
          : topBlock,
      value: wrapFunction(value.block.value, tag, context),
      marginBottom:
        value.block.marginBottom && value.block.marginBottom > bottomBlock
          ? value.block.marginBottom
          : bottomBlock,
      type: "block",
      nodeName: tag.nodeName
    };
  };
}

export const inlineTag = wrapper => (tag, context) => {
  const wrapFunction = wrapper || (argument => argument);

  if (!tag || !tag.childNodes) {
    return null;
  }

  const value = tag.childNodes.reduce((accumulator, node) => {
    const nodeTag = renderTag(node, context, tags.span);

    if (!nodeTag) {
      return accumulator;
    }

    return {
      ...concatTwoInlineTags(accumulator, nodeTag),
      type: "inline",
      nodeName: tag.nodeName
    };
  }, null);

  return {
    pre: value?.pre ? wrapFunction(value.pre, tag, context) : null,
    value: wrapFunction(value?.value, tag, context),
    post: value?.post ? wrapFunction(value.post, tag, context) : null,
    type: "inline",
    nodeName: tag.nodeName
  };
};

export const voidTag = () => null;
