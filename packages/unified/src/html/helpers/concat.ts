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
  BlockTagInput,
  BlockTagValue,
  InlineTagValue
} from "./tag-utilities";

const toMarginNumber = (value: string | number | undefined) => {
  if (value == null) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const concatTwoBlockTags = (
  first: BlockTagInput | null,
  second: BlockTagInput | null
): BlockTagValue | null => {
  if (!first && !second) {
    return null;
  }

  if (first) {
    const secondMarginTop = toMarginNumber(second!.marginTop);
    const secondMarginBottom = toMarginNumber(second!.marginBottom);

    return {
      ...second,
      marginTop: secondMarginTop,
      marginBottom: secondMarginBottom
    } as BlockTagValue;
  }

  if (second) {
    const firstMarginTop = toMarginNumber(first!.marginTop);
    const firstMarginBottom = toMarginNumber(first!.marginBottom);

    return {
      ...first!,
      marginTop: firstMarginTop,
      marginBottom: firstMarginBottom
    } as BlockTagValue;
  }

  const firstMarginTop = toMarginNumber(first!.marginTop);
  const firstMarginBottom = toMarginNumber(first!.marginBottom);
  const secondMarginTop = toMarginNumber(second!.marginTop);
  const secondMarginBottom = toMarginNumber(second!.marginBottom);

  if (!(second as unknown as BlockTagInput).value) {
    return {
      marginTop: firstMarginTop,
      value: first!.value,
      marginBottom: Math.max(
        firstMarginBottom,
        secondMarginTop,
        secondMarginBottom
      )
    } as BlockTagValue;
  }

  if (!(first as unknown as BlockTagInput).value) {
    return {
      marginTop: Math.max(firstMarginTop, firstMarginBottom, secondMarginTop),
      value: second!.value,
      marginBottom: secondMarginBottom
    } as BlockTagValue;
  }

  const separatorLines = Math.max(firstMarginBottom, secondMarginTop);

  return {
    marginTop: firstMarginTop,
    value: `${first!.value}${"\n".repeat(separatorLines)}${second!.value}`,
    marginBottom: secondMarginBottom
  } as BlockTagValue;
};

export const concatTwoInlineTags = (
  first: InlineTagValue | null,
  second: InlineTagValue | null
): InlineTagValue | null => {
  if (first == null && second == null) {
    return null;
  }

  if (first == null) {
    return second;
  }

  if (second == null) {
    return first;
  }

  if (second.value == null) {
    return {
      pre: first.pre,
      value: first.value,
      post: first.post ?? second.pre ?? second.post ?? "",
      type: "inline",
      nodeName: first.nodeName
    };
  }

  if (first.value == null) {
    return {
      pre: first.pre ?? first.post ?? second.pre ?? "",
      value: second.value,
      post: second.post,
      type: "inline",
      nodeName: second.nodeName
    };
  }

  if (first.post != null) {
    return {
      pre: first.pre,
      value: `${first.value}${first.post}${second.value}`,
      post: second.post,
      type: "inline",
      nodeName: second.nodeName
    };
  }

  if (second.pre != null) {
    return {
      pre: first.pre,
      value: `${first.value}${second.pre}${second.value}`,
      post: second.post,
      type: "inline",
      nodeName: second.nodeName
    };
  }

  return {
    pre: first.pre,
    value: `${first.value}${second.value}`,
    post: second.post,
    type: "inline",
    nodeName: second.nodeName
  };
};
