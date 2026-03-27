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

export interface FormatDescriptionOptions {
  /**
   * If true, replaces newlines in the description with spaces. This is useful for ensuring that descriptions are displayed as a single line in contexts where multiline descriptions may not be supported or may cause formatting issues.
   *
   * @defaultValue false
   */
  replaceNewlines?: boolean;

  /**
   * If true, collapses multiple consecutive spaces in the description into a single space. This helps to ensure that descriptions are concise and do not contain unnecessary whitespace.
   *
   * @defaultValue false
   */
  collapseWhitespace?: boolean;
}

/**
 * Formats a description string by trimming whitespace, replacing newlines with spaces (optionally), collapsing multiple spaces into a single space (optionally), and escaping special characters.
 *
 * @remarks
 * This is useful for ensuring that descriptions are concise and well-formatted when displayed in the CLI or documentation.
 *
 * @param description - The full description string.
 * @returns The formatted description string.
 */
function formatDescriptionWhitespace(
  description: string,
  options: FormatDescriptionOptions = {}
): string {
  let formattedDescription = description.trim();
  if (options.replaceNewlines) {
    formattedDescription = formattedDescription.replace(/\s*\n\s*/g, " ");
  }
  if (options.collapseWhitespace) {
    formattedDescription = formattedDescription.replace(/\s{2,}/g, " ");
  }

  return formattedDescription.trim();
}

/**
 * Formats a description string by trimming whitespace, replacing newlines with spaces (optionally), collapsing multiple spaces into a single space (optionally), and escaping special characters.
 *
 * @remarks
 * This is useful for ensuring that descriptions are concise and well-formatted when displayed in the CLI or documentation.
 *
 * @param description - The full description string.
 * @returns The formatted description string.
 */
function formatDescriptionEscapes(description: string): string {
  return description
    .replaceAll("'", "\\'")
    .replaceAll('"', '\\"')
    .replaceAll("`", "\\`")
    .replace(/\$\{/g, "\\${");
}

/**
 * Formats a description string by trimming whitespace, replacing newlines with spaces (optionally), collapsing multiple spaces into a single space (optionally), and escaping special characters.
 *
 * @remarks
 * This is useful for ensuring that descriptions are concise and well-formatted when displayed in the CLI or documentation.
 *
 * @param description - The full description string.
 * @returns The formatted description string.
 */
export function formatDescription(
  description: string,
  options: FormatDescriptionOptions = {}
): string {
  return formatDescriptionEscapes(
    formatDescriptionWhitespace(description, options)
  );
}

export interface FormatShortDescriptionOptions extends FormatDescriptionOptions {
  /**
   * The maximum length of the short description. If the first sentence exceeds this length, it will be truncated.
   *
   * @defaultValue 62
   */
  length?: number;
}

/**
 * Extracts the short description from a longer description string. The short description is typically the first sentence or the first line of the description.
 *
 * @param description - The full description string.
 * @param options - Options for formatting the short description, including the maximum length.
 * @returns The extracted short description.
 */
export function formatShortDescription(
  description: string,
  options: FormatShortDescriptionOptions = {}
): string {
  const length = options.length ?? 62;
  const formattedDescription = formatDescriptionWhitespace(
    description,
    options
  );

  const firstSentenceMatch =
    formattedDescription.indexOf("\n") < length - 3 ||
    formattedDescription.search(/[.!?\n]\s*\S/) > length - 3
      ? formattedDescription
          .match(/^.*[.!?\n]\s?\S/)?.[0]
          ?.trim()
          ?.slice(0, -1)
          ?.trim()
      : undefined;

  let result = (firstSentenceMatch || formattedDescription).trim();
  if (result.trim().length > length) {
    result = `${result.substring(0, Math.max(0, length - 3)).trim()}...`;
  }

  return formatDescriptionEscapes(result);
}
