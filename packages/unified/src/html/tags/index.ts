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

import { textNode } from "../helpers/tag-utilities";
import { a } from "./a";
import { abbr, acronym, dfn } from "./abbr";
import { address } from "./address";
import { blink, marquee } from "./animations";
import {
  article,
  aside,
  dialog,
  div,
  footer,
  form,
  header,
  hgroup,
  label,
  main,
  nav,
  p,
  picture,
  section
} from "./base-tags";
import { blockquote } from "./blockquote";
import { br } from "./br";
import { center } from "./center";
import { code, pre } from "./code";
import { data } from "./data";
import { dd, dl, dt } from "./definitions";
import { details, summary } from "./details";
import { body, document, html } from "./document";
import { fieldset, legend } from "./fieldset";
import { figcaption, figure } from "./figure";
import { h1, h2, h3, h4, h5, h6 } from "./headers";
import { hr } from "./hr";
import { img } from "./img";
import { button, input, output, textarea } from "./inputs";
import { li, ol, ul } from "./list";
import { menu, menuitem } from "./menu";
import { message } from "./message";
import { meter } from "./meter";
import { progress } from "./progress";
import { rp, rt, ruby } from "./ruby";
import { optgroup, option, select } from "./select";
import { span } from "./span";
import {
  caption,
  col,
  colgroup,
  table,
  tbody,
  td,
  tfoot,
  th,
  thead,
  tr
} from "./table";
import {
  b,
  bdi,
  bdo,
  big,
  bold,
  cite,
  del,
  em,
  font,
  i,
  ins,
  italic,
  kbd,
  mark,
  nobr,
  q,
  s,
  samp,
  small,
  strike,
  strikethrough,
  strong,
  sub,
  sup,
  time,
  tt,
  u,
  underline,
  variableTag
} from "./text-styles";
import {
  applet,
  area,
  audio,
  base,
  basefont,
  bgsound,
  canvas,
  datalist,
  embed,
  frame,
  frameset,
  head,
  iframe,
  keygen,
  link,
  map,
  math,
  meta,
  noframes,
  noscript,
  object,
  param as parameter,
  plaintext,
  portal,
  script,
  slot,
  source,
  style,
  svg,
  template,
  title,
  track,
  video,
  wbr,
  xmp
} from "./void";

export default {
  "#document": document,
  "#text": textNode,
  a,
  abbr,
  acronym,
  address,
  applet,
  area,
  article,
  aside,
  audio,
  b,
  base,
  basefont,
  bdi,
  bdo,
  bgsound,
  big,
  blink,
  blockquote,
  body,
  bold,
  br,
  button,
  canvas,
  caption,
  center,
  cite,
  code,
  col,
  colgroup,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  font,
  footer,
  form,
  frame,
  frameset,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  header,
  hgroup,
  hr,
  html,
  i,
  iframe,
  img,
  input,
  ins,
  italic,
  kbd,
  keygen,
  label,
  legend,
  li,
  link,
  main,
  map,
  mark,
  marquee,
  math,
  menu,
  menuitem,
  message,
  meta,
  meter,
  nav,
  nobr,
  noframes,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  param: parameter,
  picture,
  plaintext,
  portal,
  pre,
  progress,
  q,
  rp,
  rt,
  ruby,
  s,
  samp,
  script,
  section,
  select,
  slot,
  small,
  source,
  span,
  strike,
  strikethrough,
  strong,
  style,
  sub,
  summary,
  sup,
  svg,
  table,
  tbody,
  td,
  template,
  textarea,
  tfoot,
  th,
  thead,
  time,
  title,
  tr,
  track,
  tt,
  u,
  ul,
  underline,
  var: variableTag,
  video,
  wbr,
  xmp
};
