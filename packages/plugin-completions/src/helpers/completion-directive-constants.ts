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

export const CompletionDirective = {
  CompletionDirectiveError: 1 << 0,
  CompletionDirectiveNoSpace: 1 << 1,
  CompletionDirectiveNoFileComp: 1 << 2,
  CompletionDirectiveFilterFileExt: 1 << 3,
  CompletionDirectiveFilterDirs: 1 << 4,
  CompletionDirectiveKeepOrder: 1 << 5,
  CompletionDirectiveMaxValue: 1 << 6,
  CompletionDirectiveDefault: 0
};
