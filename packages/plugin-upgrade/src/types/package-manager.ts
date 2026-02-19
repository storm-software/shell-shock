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

export type PackageManager = "npm" | "yarn" | "pnpm" | "deno" | "bun";

export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "npm",
  "yarn",
  "pnpm",
  "deno",
  "bun"
] as const;

export const PACKAGE_MANAGER_LOCKFILE_MAP: Record<string, PackageManager> = {
  "package-lock": "npm",
  yarn: "yarn",
  "pnpm-lock": "pnpm",
  deno: "deno",
  bun: "bun"
} as const;
