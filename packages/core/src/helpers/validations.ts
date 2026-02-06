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

import {
  getDynamicPathSegmentName,
  isDynamicPathSegment
} from "../plugin-utils/context-helpers";
import type { CommandTree } from "../types";

export interface ValidationFailure {
  code: string;
  details: string;
}

export function validateDynamicPathSegments(
  command: CommandTree
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!command.isVirtual && command.path.segments.length > 0) {
    const dynamicPathSegmentNames = new Set<string>();
    for (const segment of command.path.segments.filter(isDynamicPathSegment) ??
      []) {
      if (dynamicPathSegmentNames.has(segment)) {
        failures.push({
          code: "DUPLICATE_DYNAMIC_PATH_SEGMENT_NAME",
          details: `Duplicate dynamic path segment name "${getDynamicPathSegmentName(segment)}" found in command.`
        });
      }
      dynamicPathSegmentNames.add(getDynamicPathSegmentName(segment));
    }

    if (
      command.path.segments.filter(isDynamicPathSegment).length !==
      Object.keys(command.path.dynamics ?? {}).length
    ) {
      failures.push({
        code: "DYNAMIC_PATH_SEGMENT_MISMATCH",
        details: `Mismatch between dynamic path segments and defined dynamic path segments in command (found ${
          command.path.segments.filter(isDynamicPathSegment).length
        } dynamic path segments in the command folder path "${command.path.segments.join("/")}", but ${
          Object.keys(command.path.dynamics ?? {}).length
        } potential dynamic path segment(s) could be determined from the command's function signature).`
      });
    }

    const missing = command.path.segments
      .filter(isDynamicPathSegment)
      .filter(
        segment =>
          Object.prototype.hasOwnProperty.call(
            command.path.dynamics ?? {},
            getDynamicPathSegmentName(segment)
          ) === false
      );
    if (missing.length > 0) {
      failures.push({
        code: "MISSING_DYNAMIC_PATH_SEGMENT_DEFINITION",
        details: `${missing.length} dynamic path segment${missing.length > 1 ? "s" : ""} in the command folder path "${command.path.segments.join(
          "/"
        )}" do${missing.length > 1 ? "" : "es"} not have corresponding entr${
          missing.length > 1 ? "ies" : "y"
        } in the command's path dynamic segments: \n- ${missing
          .map(segment => `"${getDynamicPathSegmentName(segment)}"`)
          .join("\n- ")}`
      });
    } else {
      for (const varName of Object.keys(command.path.dynamics ?? {})) {
        if (
          !command.path.segments
            .filter(isDynamicPathSegment)
            .find(segment => getDynamicPathSegmentName(segment) === varName)
        ) {
          failures.push({
            code: "UNUSED_DYNAMIC_PATH_SEGMENT",
            details: `The dynamic path segment name "${
              varName
            }" defined in the command's path dynamic segments is not used in the command folder path "${command.path.segments.join(
              "/"
            )}".`
          });
        }
      }

      command.path.segments.forEach((segment, index) => {
        if (
          isDynamicPathSegment(segment) &&
          command.path.dynamics[getDynamicPathSegmentName(segment)]
            ?.catchAll === true &&
          index + 1 < command.path.segments.length &&
          command.path.segments[index + 1] &&
          command.path.dynamics[
            getDynamicPathSegmentName(command.path.segments[index + 1]!)
          ]?.catchAll === true
        ) {
          failures.push({
            code: "MULTIPLE_CATCH_ALL_PATH_SEGMENTS",
            details: `The catch-all path segment "${getDynamicPathSegmentName(
              segment
            )}" in the command at path "${command.path.segments.join(
              "/"
            )}" is marked as catch-all, and it is followed by another catch-all dynamic path segment "${getDynamicPathSegmentName(
              command.path.segments[index + 1]!
            )}". Only one catch-all path segment is allowed per command, and it must be the final path segment.`
          });
        }
      });
    }
  }

  return failures;
}

export function validateCommandOptions(
  command: CommandTree
): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  const optionNames = new Set<string>();
  for (const option of Object.values(command.options ?? {})) {
    if (optionNames.has(option.name)) {
      failures.push({
        code: "DUPLICATE_OPTION_NAME",
        details: `Duplicate option name "${option.name}" found in command.`
      });
    }
    optionNames.add(option.name);

    for (const alias of option.alias) {
      if (optionNames.has(alias)) {
        failures.push({
          code: "DUPLICATE_OPTION_ALIAS",
          details: `Duplicate option name "${alias}" (an alias of "${
            option.name
          }") found in command.`
        });
      }
      optionNames.add(alias);
    }
  }

  return failures;
}

export function validateCommand(command: CommandTree): ValidationFailure[] {
  const results: ValidationFailure[] = [];

  let failures = validateDynamicPathSegments(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  failures = validateCommandOptions(command);
  if (failures.length > 0) {
    results.push(...failures);
  }

  return results;
}
