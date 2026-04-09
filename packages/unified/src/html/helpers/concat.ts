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

const toMarginNumber = value => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const concatTwoBlockTags = (first, second) => {
  if (first == null && second == null) {
    return null;
  }

  if (first == null) {
    return second;
  }

  if (second == null) {
    return first;
  }

  const firstMarginTop = toMarginNumber(first.marginTop);
  const firstMarginBottom = toMarginNumber(first.marginBottom);
  const secondMarginTop = toMarginNumber(second.marginTop);
  const secondMarginBottom = toMarginNumber(second.marginBottom);

  if (second.value == null) {
    return {
      marginTop: firstMarginTop,
      value: first.value,
      marginBottom: Math.max(
        firstMarginBottom,
        secondMarginTop,
        secondMarginBottom
      )
    };
  }

  if (first.value == null) {
    return {
      marginTop: Math.max(firstMarginTop, firstMarginBottom, secondMarginTop),
      value: second.value,
      marginBottom: secondMarginBottom
    };
  }

  const separatorLines = Math.max(firstMarginBottom, secondMarginTop);

  return {
    marginTop: firstMarginTop,
    value: `${first.value}${"\n".repeat(separatorLines)}${second.value}`,
    marginBottom: secondMarginBottom
  };
};

export const concatTwoInlineTags = (first, second) => {
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
      post:
        first.post == null
          ? second.pre == null
            ? second.post == null
              ? ""
              : second.post
            : second.pre
          : first.post
    };
  }

  if (first.value == null) {
    return {
      pre:
        first.pre == null
          ? first.post == null
            ? second.pre == null
              ? ""
              : second.pre
            : first.post
          : first.pre,
      value: second.value,
      post: second.post
    };
  }

  if (first.post != null) {
    return {
      pre: first.pre,
      value: `${first.value}${first.post}${second.value}`,
      post: second.post
    };
  }

  if (second.pre != null) {
    return {
      pre: first.pre,
      value: `${first.value}${second.pre}${second.value}`,
      post: second.post
    };
  }

  return {
    pre: first.pre,
    value: `${first.value}${second.value}`,
    post: second.post
  };
};
