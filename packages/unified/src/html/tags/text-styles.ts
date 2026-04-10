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

import { inlineTag } from "../helpers/tag-utilities";
import { bodyText, inlineCodeText, quoted } from "./common";

const plain = inlineTag(value => bodyText(value));
const boldText = inlineTag(value => `bold(${quoted(value)})`);
const italicText = inlineTag(value => `italic(${quoted(value)})`);
const underlineText = inlineTag(value => `underline(${quoted(value)})`);
const strikeText = inlineTag(value => `strikethrough(${quoted(value)})`);
const codeText = inlineTag(value => inlineCodeText(value));

export const b = boldText;
export const bdi = plain;
export const bdo = plain;
export const big = plain;
export const bold = boldText;
export const cite = italicText;
export const del = strikeText;
export const em = italicText;
export const font = plain;
export const i = italicText;
export const ins = underlineText;
export const italic = italicText;
export const kbd = codeText;
export const mark = inlineTag(value => `underline(bold(${quoted(value)}))`);
export const nobr = plain;
export const q = inlineTag(value => bodyText(`"${String(value ?? "")}"`));
export const s = strikeText;
export const samp = codeText;
export const small = plain;
export const strike = strikeText;
export const strikethrough = strikeText;
export const strong = boldText;
export const sub = plain;
export const sup = plain;
export const time = plain;
export const tt = codeText;
export const u = underlineText;
export const underline = underlineText;
export const variableTag = codeText;
