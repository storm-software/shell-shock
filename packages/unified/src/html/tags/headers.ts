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

import { blockTag } from "../helpers/tag-utilities";
import { quoted } from "./common";

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) =>
  blockTag(
    value =>
      `bold(textColors.heading.${
        level === 1 ? "primary" : level === 2 ? "secondary" : "tertiary"
      }(${quoted(value)}))`,
    { marginTop: 1, marginBottom: 1 }
  );

export const h1 = createHeading(1);
export const h2 = createHeading(2);
export const h3 = createHeading(3);
export const h4 = createHeading(4);
export const h5 = createHeading(5);
export const h6 = createHeading(6);
