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

import type { Children } from "@alloy-js/core";
import { code, For, Show } from "@alloy-js/core";
import type { FunctionDeclarationProps } from "@alloy-js/typescript";
import {
  ElseClause,
  ElseIfClause,
  FunctionDeclaration,
  IfStatement,
  InterfaceDeclaration,
  InterfaceMember,
  TypeDeclaration,
  VarDeclaration
} from "@alloy-js/typescript";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
import {
  ClassDeclaration,
  ClassField,
  ClassMethod,
  ClassPropertyGet,
  ClassPropertySet
} from "@powerlines/plugin-alloy/typescript";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import { BuiltinFile } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import {
  TSDoc,
  TSDocDefaultValue,
  TSDocExample,
  TSDocParam,
  TSDocRemarks,
  TSDocReturns
} from "@powerlines/plugin-alloy/typescript/components/tsdoc";
import { IsNotDebug, IsNotVerbose } from "@shell-shock/core/components/helpers";
import type {
  ThemeMessageVariant,
  ThemeResolvedConfig
} from "@shell-shock/plugin-theme";
import { useColors, useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import type { AnsiColorWrappers } from "@shell-shock/plugin-theme/helpers/ansi-utils";
import {
  colorKeys,
  modifierKeys
} from "@shell-shock/plugin-theme/helpers/ansi-utils";
import { camelCase, titleCase } from "@stryke/string-format";
import { getIndefiniteArticle } from "@stryke/string-format/vowels";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { defu } from "defu";

export function AnsiHelpersDeclarations() {
  return (
    <>
      <VarDeclaration
        const
        export
        name="beep"
        doc="The ASCII Bell character, which can be used to trigger a beep sound in the console.">
        {code` "\\u0007"; `}
      </VarDeclaration>
      <Spacing />
      <VarDeclaration
        const
        export
        name="cursor"
        doc="An object containing ANSI escape codes for controlling the console cursor.">
        {code` {
          to(x: number, y?: number) {
            if (!y) {
              return \`\\x1B[\${x + 1}G\`;
            }

            return \`\\x1B[\${y + 1};\${x + 1}H\`;
          },
          move(x: number, y: number) {
            let ret = '';

            if (x < 0) {
              ret += \`\\x1B[\${-x}D\`;
            } else if (x > 0) {
              ret += \`\\x1B[\${x}C\`;
            }

            if (y < 0) {
              ret += \`\\x1B[\${-y}A\`;
            } else if (y > 0) {
              ret += \`\\x1B[\${y}B\`;
            }

            return ret;
          },
          up: (count = 1) => \`\\x1B[\${count}A\`,
          down: (count = 1) => \`\\x1B[\${count}B\`,
          forward: (count = 1) => \`\\x1B[\${count}C\`,
          backward: (count = 1) => \`\\x1B[\${count}D\`,
          nextLine: (count = 1) => "\\x1B[E".repeat(count),
          prevLine: (count = 1) => "\\x1B[F".repeat(count),
          left: "\\x1B[G",
          hide: "\\x1B[?25l",
          show: "\\x1B[?25h",
          save: "\\x1B7",
          restore: "\\x1B8"
        } `}
      </VarDeclaration>
      <Spacing />
      <VarDeclaration
        const
        export
        name="erase"
        doc="An object containing ANSI escape codes for erasing parts of the console.">
        {code` {
          screen: "\\x1B[2J",
          up: (count = 1) => "\\x1B[1J".repeat(count),
          down: (count = 1) => "\\x1B[J".repeat(count),
          line: "\\x1B[2K",
          lineEnd: "\\x1B[K",
          lineStart: "\\x1B[1K",
          lines(count: number) {
            let lineClear = "";
            for (let i = 0; i < count; i++) {
              lineClear += this.line + (i < count - 1 ? cursor.up() : "");
            }

            if (count) {
              lineClear += cursor.left;
            }

            return lineClear;
          }
        } `}
      </VarDeclaration>
      <Spacing />
      <VarDeclaration
        const
        export
        name="scroll"
        doc="An object containing ANSI escape codes for scrolling the console.">
        {code` {
          up: (count = 1) => "\\x1B[S".repeat(count),
          down: (count = 1) => "\\x1B[T".repeat(count)
        } `}
      </VarDeclaration>
      <Spacing />
      <FunctionDeclaration
        export
        name="clear"
        doc="A helper function to clear the console based on a count of lines"
        parameters={[
          {
            name: "current",
            type: "string",
            doc: "The current console output to be cleared"
          },
          {
            name: "consoleWidth",
            type: "number",
            doc: "The number of characters per line in the console"
          }
        ]}>
        {code`if (!consoleWidth) {
          return erase.line + cursor.to(0);
        }

        let rows = 0;
        const lines = current.split(/\\r?\\n/);
        for (let line of lines) {
          rows += 1 + Math.floor(Math.max([...stripAnsi(line)].length - 1, 0) / consoleWidth);
        }

        return erase.lines(rows); `}
      </FunctionDeclaration>
      <Spacing />
    </>
  );
}

type ColorFunctionProps = Record<
  "ansi16" | "ansi256" | "ansi16m",
  AnsiColorWrappers
> & {
  skipBackground?: boolean;
};

/**
 * A component to generate a console message function in a Shell Shock project.
 */
function ColorFunction({
  ansi16,
  ansi256,
  ansi16m,
  skipBackground = false
}: ColorFunctionProps) {
  return code` (text: string | number | boolean | null | undefined${
    skipBackground ? "" : `, background = false`
  }): string => {
    try {
      if (text === undefined || text === null || text === "") {
        return "";
      }

      if (!isColorSupported) {
        return String(text);
      }

      if (colorSupportLevels.stdout === 1) {
        return wrapAnsi(String(text), ${
          skipBackground
            ? `"${ansi16.open}", "${ansi16.close}"`
            : `background ? "${
                ansi16.background.open
              }" : "${ansi16.open}", background ? "${
                ansi16.background.close
              }" : "${ansi16.close}"`
        });
      } else if (colorSupportLevels.stdout === 2) {
        return wrapAnsi(String(text), ${
          skipBackground
            ? `"${ansi256.open}", "${ansi256.close}"`
            : `background ? "${
                ansi256.background.open
              }" : "${ansi256.open}", background ? "${
                ansi256.background.close
              }" : "${ansi256.close}"`
        });
      }

      return wrapAnsi(String(text), ${
        skipBackground
          ? `"${ansi16m.open}", "${ansi16m.close}"`
          : `background ? "${ansi16m.background.open}" : "${
              ansi16m.open
            }", background ? "${ansi16m.background.close}" : "${ansi16m.close}"`
      });
    } catch {
      return String(text);
    }
  }
`;
}

interface ThemeColorNode {
  [key: string]: AnsiColorWrappers | ThemeColorNode;
}

interface ThemeColorDefinitionProps {
  type: string;
  subType?: string;
  ansi16: ThemeColorNode;
  ansi256: ThemeColorNode;
  ansi16m: ThemeColorNode;
}

export function ThemeColorTypeDefinition(props: ThemeColorDefinitionProps) {
  const { ansi16, ansi256, ansi16m, type, subType } = props;

  return (
    <For
      each={Object.entries(ansi16)}
      semicolon
      doubleHardline
      enderPunctuation>
      {([color, value]) => (
        <>
          <Show when={isSetObject(value)}>
            <Show
              when={"open" in value && "close" in value}
              fallback={
                <>
                  <TSDoc
                    heading={`An object containing various ${
                      subType ? `${subType} ` : ""
                    }${color}${
                      type ? ` ${type}` : ""
                    } theme coloring functions.`}></TSDoc>
                  {code` ${camelCase(color)}: { `}
                  <hbr />
                  <ThemeColorTypeDefinition
                    ansi16={ansi16[color] as ThemeColorNode}
                    ansi256={ansi256[color] as ThemeColorNode}
                    ansi16m={ansi16m[color] as ThemeColorNode}
                    type={subType || type}
                    subType={color}
                  />
                  <hbr />
                  {code` }`}
                </>
              }>
              <TSDoc
                heading={`A function that applies ${getIndefiniteArticle(color)} ${
                  color
                }${type ? ` ${type}` : ""}${
                  subType ? ` ${subType}` : ""
                } color styling to provided console text.`}>
                <TSDocRemarks>
                  {`This function takes a string and an optional boolean indicating whether to apply the color as a background. It returns the input string wrapped in the appropriate ANSI escape codes for ${
                    color
                  }${type ? ` ${type}` : ""}${
                    subType ? ` ${subType}` : ""
                  } color styling, based on the terminal's color support level. If colors are not supported, it simply returns the input text as a string.`}
                </TSDocRemarks>
                <hbr />
                <TSDocParam name="text">
                  {`The console text to which the ${color}${
                    type ? ` ${type}` : ""
                  }${subType ? ` ${subType}` : ""} color styling should be applied.`}
                </TSDocParam>
                <TSDocParam name="background">
                  {`A boolean indicating whether to apply the color as a background. Defaults to \`false\`.`}
                </TSDocParam>
                <TSDocReturns>
                  {`A string with ANSI escape codes applied for ${color}${
                    type ? ` ${type}` : ""
                  }${
                    subType ? ` ${subType}` : ""
                  } color styling, or the original text if the style is not supported in the current terminal.`}
                </TSDocReturns>
              </TSDoc>
              {code`${camelCase(color)}: (text: string, background?: boolean) => string`}
            </Show>
          </Show>
        </>
      )}
    </For>
  );
}

export function ThemeColorObjectDefinition(props: ThemeColorDefinitionProps) {
  const { ansi16, ansi256, ansi16m, type, subType } = props;

  return (
    <For each={Object.entries(ansi16)} comma doubleHardline enderPunctuation>
      {([color, value]) => (
        <>
          <Show when={isSetObject(value)}>
            <Show
              when={"open" in value && "close" in value}
              fallback={
                <>
                  <TSDoc
                    heading={`An object containing various ${
                      subType ? `${subType} ` : ""
                    }${color}${
                      type ? ` ${type}` : ""
                    } theme coloring functions.`}></TSDoc>
                  {code` ${camelCase(color)}: { `}
                  <hbr />
                  <ThemeColorObjectDefinition
                    ansi16={ansi16[color] as ThemeColorNode}
                    ansi256={ansi256[color] as ThemeColorNode}
                    ansi16m={ansi16m[color] as ThemeColorNode}
                    type={subType || type}
                    subType={color}
                  />
                  <hbr />
                  {code` }`}
                </>
              }>
              <TSDoc
                heading={`A function that applies ${getIndefiniteArticle(color)} ${
                  color
                }${type ? ` ${type}` : ""}${
                  subType ? ` ${subType}` : ""
                } color styling to provided console text.`}>
                <TSDocRemarks>
                  {`This function takes a string and an optional boolean indicating whether to apply the color as a background. It returns the input string wrapped in the appropriate ANSI escape codes for ${
                    color
                  }${type ? ` ${type}` : ""}${
                    subType ? ` ${subType}` : ""
                  } color styling, based on the terminal's color support level. If colors are not supported, it simply returns the input text as a string.`}
                </TSDocRemarks>
                <hbr />
                <TSDocParam name="text">
                  {`The console text to which the ${color}${
                    type ? ` ${type}` : ""
                  }${subType ? ` ${subType}` : ""} color styling should be applied.`}
                </TSDocParam>
                <TSDocParam name="background">
                  {`A boolean indicating whether to apply the color as a background. Defaults to \`false\`.`}
                </TSDocParam>
                <TSDocReturns>
                  {`A string with ANSI escape codes applied for ${color}${
                    type ? ` ${type}` : ""
                  }${
                    subType ? ` ${subType}` : ""
                  } color styling, or the original text if the style is not supported in the current terminal.`}
                </TSDocReturns>
              </TSDoc>
              {code`${camelCase(color)}: `}
              <ColorFunction
                ansi16={ansi16[color] as AnsiColorWrappers}
                ansi256={ansi256[color] as AnsiColorWrappers}
                ansi16m={ansi16m[color] as AnsiColorWrappers}
              />
            </Show>
          </Show>
        </>
      )}
    </For>
  );
}

/**
 * A component to generate an object containing functions for coloring text in a Shell Shock project.
 */
export function AnsiStyleFunctionsDeclaration() {
  const colors = useColors();

  return (
    <>
      <For each={modifierKeys} semicolon doubleHardline enderPunctuation>
        {modifier => (
          <>
            <TSDoc
              heading={`A function that applies ${getIndefiniteArticle(
                titleCase(modifier)
              )} ${titleCase(modifier)} text-style to provided console text.`}>
              <TSDocParam name="text">
                {`The console text to which the ${titleCase(
                  modifier
                )} text-style should be applied.`}
              </TSDocParam>
              <TSDocReturns>
                {`A string with ANSI escape codes applied for ${titleCase(
                  modifier
                )} text-style, or the original text if the style is not supported in the current terminal.`}
              </TSDocReturns>
            </TSDoc>
            <VarDeclaration
              const
              export
              name={camelCase(modifier)}
              initializer={
                <ColorFunction
                  ansi16={
                    colors.ansi16[
                      modifier as keyof typeof colors.ansi16
                    ] as AnsiColorWrappers
                  }
                  ansi256={
                    colors.ansi256[
                      modifier as keyof typeof colors.ansi256
                    ] as AnsiColorWrappers
                  }
                  ansi16m={
                    colors.ansi16m[
                      modifier as keyof typeof colors.ansi16m
                    ] as AnsiColorWrappers
                  }
                  skipBackground={true}
                />
              }
            />
          </>
        )}
      </For>
      <Spacing />
      <For each={colorKeys} semicolon doubleHardline enderPunctuation>
        {color => (
          <>
            <TSDoc
              heading={`A function that applies ${getIndefiniteArticle(
                titleCase(color)
              )} ${titleCase(color)} color styling to provided console text.`}>
              <TSDocRemarks>
                {`This function takes a string and an optional boolean indicating whether to apply the color as a background. It returns the input string wrapped in the appropriate ANSI escape codes for ${getIndefiniteArticle(
                  titleCase(color)
                )} ${titleCase(color)} color styling, based on the terminal's color support level. If colors are not supported, it simply returns the input text as a string.`}
              </TSDocRemarks>
              <hbr />
              <TSDocParam name="text">
                {`The console text to which the ${titleCase(
                  color
                )} color styling should be applied.`}
              </TSDocParam>
              <TSDocParam name="background">
                {`A boolean indicating whether to apply the color as a background. Defaults to \`false\`.`}
              </TSDocParam>
              <TSDocReturns>
                {`A string with ANSI escape codes applied for ${titleCase(
                  color
                )} color styling, or the original text if the style is not supported in the current terminal.`}
              </TSDocReturns>
            </TSDoc>
            <VarDeclaration
              const
              export
              name={camelCase(color)}
              initializer={
                <ColorFunction
                  ansi16={
                    colors.ansi16[
                      color as keyof typeof colors.ansi16
                    ] as AnsiColorWrappers
                  }
                  ansi256={
                    colors.ansi256[
                      color as keyof typeof colors.ansi256
                    ] as AnsiColorWrappers
                  }
                  ansi16m={
                    colors.ansi16m[
                      color as keyof typeof colors.ansi16m
                    ] as AnsiColorWrappers
                  }
                />
              }
            />
          </>
        )}
      </For>
      <Spacing />

      <For
        each={Object.keys(colors.ansi16.theme)}
        semicolon
        doubleHardline
        enderPunctuation>
        {type => (
          <>
            <TSDoc
              heading={`A nested object containing functions for applying ${
                type
              } theme colors to the console.`}
            />
            <VarDeclaration
              export
              name={`${camelCase(type)}Colors`}
              initializer={
                <>
                  {code` {`}
                  <hbr />
                  <ThemeColorObjectDefinition
                    ansi16={
                      colors.ansi16.theme[
                        type as keyof typeof colors.ansi16.theme
                      ]
                    }
                    ansi256={
                      colors.ansi256.theme[
                        type as keyof typeof colors.ansi256.theme
                      ]
                    }
                    ansi16m={
                      colors.ansi16m.theme[
                        type as keyof typeof colors.ansi16m.theme
                      ]
                    }
                    type={type}
                  />
                  <hbr />
                  {code`}`}
                </>
              }
            />
          </>
        )}
      </For>
      <Spacing />
    </>
  );
}

/**
 * A component to generate the `splitText` function in the `shell-shock:console` builtin module.
 */
export function SplitTextFunctionDeclaration() {
  return (
    <>
      <FunctionDeclaration
        name="adjustIndex"
        parameters={[
          {
            name: "line",
            type: "string"
          },
          {
            name: "index",
            type: "number"
          }
        ]}
        returnType="number">
        {code`let adjustedIndex = 0;

        const segments = line.match(/\\x1b\\[(\\d|;)+m.*\\x1b\\[(\\d|;)+m/gi);
        if (segments && segments.length > 0) {
          segments.reduce((count, matched) => {
            if (count < index) {
              const stripped = stripAnsi(matched);
              if (count + stripped.length < index) {
                count += stripped.length;
                adjustedIndex += matched.length;
              } else {
                adjustedIndex += index - count + (matched.slice(0, index - count).match(/\\x1b\\[(\\d|;)+m/g)?.join("")?.length ?? 0);
                count = index;
              }
            }

            return count;
          }, 0);
        } else {
          adjustedIndex = index;
        }

        return adjustedIndex - (line.slice(0, adjustedIndex).match(/\\x1b\\[/g)?.length ?? 0); `}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="breakLine"
        parameters={[
          {
            name: "line",
            type: "string"
          },
          {
            name: "index",
            type: "number"
          }
        ]}
        returnType="[string, string]">
        {code`const first = line.slice(0, index);
        const second = line.slice(index);

        // Match all ANSI escape sequences in the first string
        const ansiRegex = /[\\x1b\\u009b][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007))|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))/g;

        const openCodes: string[] = [];
        const closeCodes: string[] = [];
        let match: RegExpExecArray | null;

        while ((match = ansiRegex.exec(first)) !== null) {
          const code = match[0];
          // Check if this is a reset/close code (e.g., \\x1b[0m, \\x1b[39m, \\x1b[49m, etc.)
          if (/\\x1b\\[(?:0|22|23|24|27|28|29|39|49)m/.test(code)) {
            // A close/reset code cancels the last open code
            openCodes.pop();
            closeCodes.pop();
          } else {
            openCodes.push(code);
            // Derive a close code: map SGR open codes to their reset counterparts
            const sgrMatch = code.match(/\\x1b\\[(\\d+)m/);
            if (sgrMatch) {
              const n = parseInt(sgrMatch[1]!, 10);
              let closeCode: string;
              if (n >= 30 && n <= 37) closeCode = "\\x1b[39m";
              else if (n >= 40 && n <= 47) closeCode = "\\x1b[49m";
              else if (n >= 90 && n <= 97) closeCode = "\\x1b[39m";
              else if (n >= 100 && n <= 107) closeCode = "\\x1b[49m";
              else if (n === 1) closeCode = "\\x1b[22m";
              else if (n === 2) closeCode = "\\x1b[22m";
              else if (n === 3) closeCode = "\\x1b[23m";
              else if (n === 4) closeCode = "\\x1b[24m";
              else if (n === 7) closeCode = "\\x1b[27m";
              else if (n === 8) closeCode = "\\x1b[28m";
              else if (n === 9) closeCode = "\\x1b[29m";
              else closeCode = "\\x1b[0m";
              closeCodes.push(closeCode);
            } else {
              closeCodes.push("\\x1b[0m");
            }
          }
        }

        // Append close codes to the end of "first" (in reverse order)
        const closeSequence = closeCodes.slice().reverse().join("");
        // Prepend open codes to the start of "second"
        const openSequence = openCodes.join("");

        return [first.replace(/^\\s+/, "").replace(/\\s+$/, "") + closeSequence, openSequence + second.replace(/^\\s+/, "").replace(/\\s+$/, "")]; `}
      </FunctionDeclaration>
      <Spacing />
      <FunctionDeclaration
        name="innerSplitText"
        parameters={[
          {
            name: "text",
            type: "string"
          },
          {
            name: "maxLength",
            type: "number | SizeToken"
          }
        ]}>
        {code`let line = text;
        let result = [] as string[];

        const calculatedMaxLength = isSizeToken(maxLength) ? calculateWidth(maxLength) : maxLength;
        while (stripAnsi(line).length > calculatedMaxLength || line.indexOf("\\n") !== -1) {
          if (line.indexOf("\\n") !== -1) {
            result.push(...innerSplitText(line.slice(0, line.indexOf("\\n")).replace(/(\\r)?\\n/, ""), calculatedMaxLength));
            line = line.indexOf("\\n") + 1 < line.length
              ? line.slice(line.indexOf("\\n") + 1)
              : "";
          } else {
            const index = [" ", "/", ".", ",", "-", ":", "|", "@", "+"].reduce((ret, split) => {
              let current = ret;
              while (stripAnsi(line).indexOf(split, current + 1) !== -1 && stripAnsi(line).indexOf(split, current + 1) <= calculatedMaxLength) {
                current = line.indexOf(split, adjustIndex(line, current + 1));
              }

              return current;
            }, -1);
            if (index === -1) {
              break;
            }

            const lines = breakLine(line, index);
            result.push(lines[0]);
            line = lines[1];
          }
        }

        while (stripAnsi(line).length > calculatedMaxLength) {
          const lines = breakLine(line, calculatedMaxLength);
          result.push(lines[0]);
          line = lines[1];
        }

        result.push(line);
        return result; `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Split text into multiple lines based on a maximum length.">
        <TSDocRemarks>
          {`This function splits the provided text into multiple lines based on the specified maximum length, ensuring that words are not broken in the middle.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="text">
          {`The text to split into multiple lines.`}
        </TSDocParam>
        <TSDocParam name="maxLength">
          {`The maximum length of each line.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="splitText"
        parameters={[
          {
            name: "text",
            type: "string"
          },
          {
            name: "maxLength",
            type: "number | SizeToken"
          }
        ]}>
        {code`const timeout = setTimeout(() => {
          throw new Error("Text splitting took too long, likely due to a very long line without spaces or a very small maxLength. Please ensure that the input text contains reasonable break points and that maxLength is set to a reasonable value.");
        }, 1000);

        try {
          return innerSplitText(text, maxLength);
        } finally {
          clearTimeout(timeout);
        }
         `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `write` function in the `shell-shock:console` builtin module.
 */
export function WriteFunctionDeclaration() {
  return (
    <>
      <InterfaceDeclaration
        export
        name="WriteOptions"
        doc="Options for writing to the console.">
        <TSDoc heading="Console function to use for writing to the console">
          <TSDocRemarks>
            {`The console function to use for writing to the console. If not specified, the default console function \`console.log\` will be used.`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.method}
            defaultValue={`\`console.log\``}
          />
        </TSDoc>
        <InterfaceMember
          name="consoleFn"
          optional
          type="(text: string) => void"
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Write to the console.">
        <TSDocRemarks>
          {`This function writes to the console, applying the appropriate padding as defined in the current theme configuration and wrapping as needed.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="text">
          {`The text to write to the console.`}
        </TSDocParam>
        <TSDocParam name="options">{`The options to apply when writing to the console.`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="write"
        parameters={[
          {
            name: "text",
            type: "string | number | boolean | null",
            optional: true
          },
          {
            name: "options",
            type: "WriteOptions",
            default: "{}"
          }
        ]}>
        {code`const consoleFn = options.consoleFn ?? console.log;
        if (text === undefined || text === null || text === "") {
          consoleFn("");
          return;
        }

        consoleFn(String(text)); `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `writeLine` function in the `shell-shock:console` builtin module.
 */
export function WriteLineFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <InterfaceDeclaration
        export
        name="WriteLineOptions"
        doc="Options for writing a line to the console."
        extends={["WriteOptions"]}>
        <TSDoc heading="Padding to apply to the line">
          <TSDocRemarks>
            {`The amount of padding (in spaces) to apply to the line when writing to the console. This value is applied to both the left and right sides of the line. If not specified, the default padding defined in the current theme configuration will be used.`}
          </TSDocRemarks>
        </TSDoc>
        <InterfaceMember name="padding" optional type="number" />
        <hbr />
        <TSDoc heading="Color of the line text">
          <TSDocRemarks>
            {`The color to apply to the line text when writing to the console. This can be one of the predefined color themes: "primary", "secondary", or "tertiary". If not specified, no specific coloring will be applied to the text (the default/system terminal text color will likely be used).`}
          </TSDocRemarks>
          <hbr />
        </TSDoc>
        <InterfaceMember
          name="color"
          optional
          type='"primary" | "secondary" | "tertiary"'
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Write a line to the console.">
        <TSDocRemarks>
          {`This function writes a line to the console, applying the appropriate padding as defined in the current theme configuration and wrapping as needed.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="text">
          {`The line text to write to the console.`}
        </TSDocParam>
        <TSDocParam name="options">{`The options to apply when writing the line to the console.`}</TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="writeLine"
        parameters={[
          {
            name: "text",
            type: "string | number | boolean | null",
            optional: true
          },
          {
            name: "options",
            type: "WriteLineOptions",
            default: "{}"
          }
        ]}>
        {code`const color = options.color;
        if (text === undefined || text === null || text === "") {
          write("", options);
          return;
        }

        write(\`\${" ".repeat(Math.max(options.padding ?? ${
          theme.padding.app
        }, 0))}\${color ? textColors.body[color](String(text)) : String(text)}\`, options); `}
      </FunctionDeclaration>
    </>
  );
}

export type MessageFunctionDeclarationProps = Partial<
  Pick<FunctionDeclarationProps, "parameters">
> & {
  type:
    | "success"
    | "help"
    | "info"
    | "debug"
    | "verbose"
    | "warn"
    | "danger"
    | "error";
  variant: ThemeMessageVariant;
  color?: ThemeMessageVariant;
  consoleFnName: "log" | "info" | "warn" | "error" | "debug";
  description: string;
  prefix?: Children;
  timestamp?: boolean;
};

/**
 * A component to generate the message functions in the `shell-shock:console` builtin module.
 */
export function MessageFunctionDeclaration(
  props: MessageFunctionDeclarationProps
) {
  const {
    type,
    variant,
    consoleFnName,
    description,
    prefix,
    parameters,
    timestamp,
    color = variant
  } = props;

  const theme = useTheme();

  return (
    <>
      <TSDoc
        heading={`Write ${getIndefiniteArticle(
          description
        )} ${description} message to the console.`}>
        <TSDocRemarks>
          {`This function initializes the Powerlines environment configuration object.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="message">
          {`The message to write to the console.`}
        </TSDocParam>
        <TSDocParam name="header">
          {`An optional header to display above the message. If not provided, a default header based on the message type and variant will be used if defined in the theme configuration; otherwise, no header will be displayed.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name={type}
        parameters={
          parameters ?? [
            {
              name: "message",
              type: "string",
              optional: false
            },
            {
              name: "header",
              type: "string",
              optional: true
            }
          ]
        }>
        <Show when={Boolean(prefix)}>
          {prefix}
          <hbr />
          <hbr />
        </Show>
        {code`
        if (!message) {
          return;
        }

        ${
          !theme.labels.message.footer[variant] && timestamp
            ? `const timestamp = \`\${textColors.message.footer.${
                color
              }(new Date().toLocaleDateString())} \${borderColors.message.outline.${
                color
              }("${
                theme.borderStyles.message.outline[variant].bottom
              }")} \${textColors.message.footer.${
                color
              }(new Date().toLocaleTimeString())}\`; `
            : ""
        }

        writeLine(borderColors.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].topLeft
        }") + ${
          theme.labels.message.header[variant] ||
          theme.icons.message.header[variant]
            ? `borderColors.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(4)) + " " + ${
                theme.icons.message.header[variant]
                  ? `borderColors.message.outline.${color}("${
                      theme.icons.message.header[variant]
                    }") + " " +`
                  : ""
              } bold(textColors.message.header.${color}(header || "${
                theme.labels.message.header[variant]
              }")) + " " + borderColors.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(Math.max(getTerminalSize().columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].topLeft.length +
                4 +
                (theme.icons.message.header[variant]
                  ? 2 + (theme.labels.message.header[variant] ? 0 : 1)
                  : 0) +
                (theme.labels.message.header[variant]
                  ? theme.labels.message.header[variant].length + 2
                  : 0) +
                theme.borderStyles.message.outline[variant].topRight.length
              }, 0)))`
            : `borderColors.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].top
              }".repeat(Math.max(getTerminalSize().columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].topLeft.length +
                theme.borderStyles.message.outline[variant].topRight.length
              }, 0)))`
        } + borderColors.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].topRight
        }"), { consoleFn: console.${consoleFnName} });
        splitText(
          message,
          Math.max(getTerminalSize().columns - ${
            (Math.max(theme.padding.app, 0) +
              Math.max(theme.padding.message, 0)) *
              2 +
            theme.borderStyles.message.outline[variant].left.length +
            theme.borderStyles.message.outline[variant].right.length
          }, 0)
        ).forEach((line) => {
          writeLine(borderColors.message.outline.${color}("${
            theme.borderStyles.message.outline[variant].left +
            " ".repeat(Math.max(theme.padding.message, 0))
          }") + textColors.message.description.${color}(line) + " ".repeat(Math.max(getTerminalSize().columns - (stripAnsi(line).length + ${
            Math.max(theme.padding.app, 0) * 2 +
            Math.max(theme.padding.message, 0) +
            theme.borderStyles.message.outline[variant].left.length +
            theme.borderStyles.message.outline[variant].right.length
          }), 0)) + borderColors.message.outline.${color}("${
            theme.borderStyles.message.outline[variant].right
          }"), { consoleFn: console.${consoleFnName} });
        });
        writeLine(borderColors.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].bottomLeft
        }") + ${
          theme.labels.message.footer[variant] || timestamp
            ? `borderColors.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(Math.max(getTerminalSize().columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                4 +
                (theme.labels.message.footer[variant]
                  ? theme.labels.message.footer[variant].length + 2
                  : 0) +
                theme.borderStyles.message.outline[variant].bottomLeft.length +
                theme.borderStyles.message.outline[variant].bottomRight.length
              }${
                !theme.labels.message.footer[variant] && timestamp
                  ? " - (stripAnsi(timestamp).length + 2)"
                  : ""
              }, 0))) + " " + ${`bold(textColors.message.footer.${color}(${
                theme.labels.message.footer[variant]
                  ? `"${theme.labels.message.footer[variant]}"`
                  : timestamp && "timestamp"
              }))`} + " " + borderColors.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(4))`
            : `borderColors.message.outline.${color}("${
                theme.borderStyles.message.outline[variant].bottom
              }".repeat(Math.max(getTerminalSize().columns - ${
                Math.max(theme.padding.app, 0) * 2 +
                theme.borderStyles.message.outline[variant].bottomLeft.length +
                theme.borderStyles.message.outline[variant].bottomRight.length
              }, 0)))`
        } + borderColors.message.outline.${color}("${
          theme.borderStyles.message.outline[variant].bottomRight
        }"), { consoleFn: console.${consoleFnName} });
`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `wrapAnsi` function in the `shell-shock:console` builtin module.
 */
export function WrapAnsiFunction() {
  return (
    <>
      <TSDoc heading="Applies ANSI escape codes to a string.">
        <TSDocRemarks>
          {`Split text by /\\\\x1b[\\[|\\]][0-9;]*m/ and wrap non-ANSI parts with open/closing tags.`}
        </TSDocRemarks>

        <TSDocExample>
          {`const result = wrapAnsi("Hello\\\\x1b[31mWorld\\\\x1b[0mAgain", "\\\\x1b[36m", "\\\\x1b[39");\nconsole.log(result); // "\\\\x1b[36mHello\\\\x1b[39\\\\x1b[31mWorld\\\\x1b[0m\\\\x1b[36mAgain\\\\x1b[39"`}
        </TSDocExample>

        <TSDocParam name="text">
          {`The text to apply ANSI codes to.`}
        </TSDocParam>
        <TSDocParam name="open">{`The opening ANSI code.`}</TSDocParam>
        <TSDocParam name="close">{`The closing ANSI code.`}</TSDocParam>
        <TSDocReturns>{`The text with ANSI codes applied.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        name="wrapAnsi"
        parameters={[
          {
            name: "text",
            type: "string | number",
            optional: false
          },
          {
            name: "open",
            type: "string",
            optional: false
          },
          { name: "close", type: "string", optional: false }
        ]}>
        {code`const str = String(text);
        const tokens = [] as string[];

        let last = 0;
        let match: RegExpExecArray | null;
        while ((match = /\\\\x1b[\\[|\\]][0-9;]*m/g.exec(str)) !== null) {
          if (match.index > last) tokens.push(str.slice(last, match.index));
          tokens.push(match[0]);
          last = match.index + match[0].length;
        }

        if (last < str.length) {
          tokens.push(str.slice(last));
        }

        let result = "";
        for (let i = 0; i < tokens.length; i++) {
          const seg = tokens[i]!;
          if (/^\\\\x1b[\\[|\\]][0-9;]*m$/.test(seg)) {
            result += seg;
            continue;
          }

          if (!seg) {
            continue;
          }

          result += i > 0 && /^\\\\x1b[\\[|\\]][0-9;]*m$/.test(tokens[i - 1]!) && i + 1 < tokens.length && /^\\\\x1b[\\[|\\]][0-9;]*m$/.test(tokens[i + 1]!)
            ? seg
            : \`\${open}\${seg}\${close}\`;
        }

        return result;
`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `stripAnsi` function in the `shell-shock:console` builtin module.
 */
export function StripAnsiFunctionDeclaration() {
  return (
    <>
      <TSDoc heading="Removes ANSI escape codes from a string.">
        <TSDocExample>
          {`const result = stripAnsi("Hello\\\\x1b[31mWorld\\\\x1b[0mAgain"); // "HelloWorldAgain"`}
        </TSDocExample>

        <TSDocParam name="text">
          {`The text to strip ANSI codes from.`}
        </TSDocParam>
        <TSDocReturns>{`The text with ANSI codes removed.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="stripAnsi"
        parameters={[
          {
            name: "text",
            type: "string | number",
            optional: false
          }
        ]}>
        {code`return String(text).replace(new RegExp([
          String.raw\`[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)\`,
          String.raw\`(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))\`
        ].join("|"), "g"), "");`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `stripAnsi` function in the `shell-shock:console` builtin module.
 */
export function DividerFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <InterfaceDeclaration
        export
        name="DividerOptions"
        doc="Options for formatting the divider line written to console.">
        <InterfaceMember
          name="width"
          optional
          type="number"
          doc="The width of the divider line. If not specified, the divider will span the full width of the console, minus the padding."
        />
        <hbr />
        <TSDoc heading="The border of the divider line. Can be 'primary', 'secondary', 'tertiary', or 'none'. If not specified, the default border style will be used.">
          <TSDocRemarks>
            {`The value provided will determine the border style and color based on the current theme configuration.`}
          </TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.string}
            defaultValue="primary"
          />
        </TSDoc>
        <InterfaceMember
          name="border"
          optional
          type='"primary" | "secondary" | "tertiary"'
          doc="The border style/color of the divider line. Can be 'primary', 'secondary', 'tertiary', or 'none'. If not specified, the default border style will be used."
        />
        <hbr />
        <TSDoc heading="Padding to apply to the line">
          <TSDocRemarks>
            {`The amount of padding (in spaces) to apply to the line when writing to the console. This value is applied to both the left and right sides of the line. If not specified, the default padding defined in the current theme configuration will be used.`}
          </TSDocRemarks>
          <TSDocDefaultValue
            type={ReflectionKind.number}
            defaultValue={theme.padding.app * 4}
          />
        </TSDoc>
        <InterfaceMember name="padding" optional type="number" />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Write a horizontal divider line to the console.">
        <TSDocExample>
          {`divider({ width: 50, border: "primary" }); // Writes a horizontal divider line of width 50 with primary border.`}
        </TSDocExample>
        <TSDocParam name="options">
          {`Options for formatting the divider line.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        name="divider"
        parameters={[
          {
            name: "options",
            type: "DividerOptions",
            optional: false
          }
        ]}>
        {code`const padding = options.padding ?? ${Math.max(theme.padding.app, 1) * 4};
        const width = options.width ?? (getTerminalSize().columns - (Math.max(padding, 0) * 2));
        const border = options.border === "tertiary" ? borderColors.app.divider.tertiary("${
          theme.borderStyles.app.divider.tertiary.top
        }") : options.border === "secondary" ? borderColors.app.divider.secondary("${
          theme.borderStyles.app.divider.secondary.top
        }") : borderColors.app.divider.primary("${
          theme.borderStyles.app.divider.primary.top
        }");

        writeLine(" ".repeat(Math.max(padding - ${theme.padding.app}, 0)) + border.repeat(Math.max(width / ${
          theme.borderStyles.app.divider.primary.top.length ?? 1
        }, 0)));
        `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `link` function in the `shell-shock:console` builtin module.
 */
export function LinkFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <InterfaceDeclaration
        export
        name="LinkOptions"
        doc="Options for formatting a hyperlink in the console.">
        <InterfaceMember
          name="external"
          optional
          type="boolean"
          doc="Whether the link is external. If true, an external link icon will be displayed next to the link text (if supported by the terminal) and the link may be styled differently based on the current theme configuration."
        />
        <Spacing />
        <InterfaceMember
          name="text"
          optional
          type="string"
          doc="The text to display for the link. If not provided, the URL will be used as the text."
        />
        <Spacing />
        <InterfaceMember
          name="useTextWhenUnsupported"
          optional
          type="boolean"
          doc="Whether to use the text when the hyperlink is not supported. If true, the text will be displayed even if the terminal does not support hyperlinks."
        />
      </InterfaceDeclaration>
      <Spacing />
      <TSDoc heading="Render a hyperlink in the console.">
        <TSDocParam name="url">
          {`The URL to render as a hyperlink.`}
        </TSDocParam>
        <TSDocParam name="options">
          {`Options for formatting the hyperlink.`}
        </TSDocParam>
        <TSDocReturns>{`The formatted hyperlink string for display in the console.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="link"
        parameters={[
          {
            name: "url",
            type: "string",
            optional: false
          },
          { name: "options", type: "LinkOptions", default: "{}" }
        ]}>
        <IfStatement condition={code`isHyperlinkSupported()`}>
          {code`return \`\\x1b]8;;\${url}\\u0007\${options.text ? options.text : url}\\x1b]8;;\\u0007\${options.external === true ? "${
            theme.icons.link.external
          }" : ""}\`;`}
        </IfStatement>
        <hbr />
        <IfStatement condition={code`isColorSupported`}>
          {code`return \`\${underline(textColors.body.link(\`\${options.useTextWhenUnsupported && options.text ? options.text : url}\`))}\${options.external === true ? "${
            theme.icons.link.external
          }" : ""}\`;`}
        </IfStatement>
        <hbr />
        {code`return \`\${options.useTextWhenUnsupported && options.text ? options.text : url}\${options.external === true ? "${
          theme.icons.link.external
        }" : ""}\`;`}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `blockquote` function declaration
 */
export function BlockquoteFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <Spacing />
      <TSDoc
        heading={`Format a string with blockquote styling for display in console.`}>
        <TSDocParam name="text">
          {`The text to format with blockquote styling.`}
        </TSDocParam>
        <TSDocReturns>{`The formatted string with blockquote styling.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="blockquote"
        parameters={[
          {
            name: "text",
            type: "string | number | boolean | null",
            optional: true
          }
        ]}
        returnType="string">
        {code`if (text === undefined || text === null || text === "") {
          return "";
        }

        const lines = splitText(
          String(text),
          Math.max(getTerminalSize().columns, 20) - 6
        );

        return lines.map(line => \`\${borderColors.app.blockquote.primary(isUnicodeSupported() ? "${
          theme.borderStyles.app.blockquote.primary.left
        }"  : "|")}   \${italic(line)} \`).join("\\n"); `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `code` function declaration
 */
export function CodeFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <Spacing />
      <TSDoc heading={`Format a source code string for display in console.`}>
        <TSDocParam name="text">
          {`The source code text to format with code styling.`}
        </TSDocParam>
        <TSDocReturns>{`The formatted string with code styling.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="code"
        parameters={[
          {
            name: "text",
            type: "string | number | boolean | null",
            optional: true
          },
          {
            name: "language",
            type: "string",
            optional: true
          }
        ]}
        returnType="string">
        {code`if (text === undefined || text === null || text === "") {
          return "";
        }

        const lines = splitText(
          String(text),
          Math.max(getTerminalSize().columns, 20)
        );

        return \` \${borderColors.app.divider.primary("${
          theme.borderStyles.app.divider.primary.top
        }".repeat(4))}\${language ? \` \${borderColors.app.divider.primary(language)} \` : ""}\${borderColors.app.divider.primary("${
          theme.borderStyles.app.divider.primary.top
        }".repeat(getTerminalSize().columns - (language ? language.length + 2 : 0) - 5))} \\n\${lines.map((line, index) => \` \${" ".repeat(String(lines.length).length - String(index + 1).length)}\${textColors.body.tertiary(index + 1)} \${textColors.body.primary(line)}\`).join("\\n")}\`; `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `inlineCode` function declaration
 */
export function InlineCodeFunctionDeclaration() {
  return (
    <>
      <Spacing />
      <TSDoc
        heading={`Format a string with inline code styling for display in console.`}>
        <TSDocParam name="text">
          {`The text to format with inline code styling.`}
        </TSDocParam>
        <TSDocReturns>{`The formatted string with inline code styling.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="inlineCode"
        parameters={[
          {
            name: "text",
            type: "string | number | boolean | null",
            optional: true
          }
        ]}
        returnType="string">
        {code`if (text === undefined || text === null || text === "") {
          return "";
        }

        return textColors.body.primary(inverse(\` \${text} \`), true); `}
      </FunctionDeclaration>
    </>
  );
}

/**
 * A component to generate the `spinner` function in the `shell-shock:console` builtin module.
 */
export function SpinnerFunctionDeclaration() {
  const theme = useTheme();

  return (
    <>
      <TypeDeclaration name="WriteStream">
        {`NodeJS.WriteStream;`}
      </TypeDeclaration>
      <Spacing />
      <VarDeclaration
        const
        name="activeHooksPerStream"
        initializer="new Set();"
      />
      <Spacing />
      <InterfaceDeclaration
        export
        name="SpinnerOptions"
        doc="Options for configuring the spinner.">
        <InterfaceMember
          name="message"
          optional
          type="string"
          doc="The message text to display next to the spinner. Defaults to an empty string."
        />
        <hbr />
        <InterfaceMember
          name="stream"
          optional
          type="WriteStream"
          doc="The output stream to write the spinner to. Defaults to process.stderr."
        />
        <hbr />
        <InterfaceMember
          name="spinner"
          optional
          type="ThemeSpinnerResolvedConfig | SpinnerPreset"
          doc="The spinner animation to use. Should be an object with a 'frames' property (an array of strings representing each frame of the animation) and an 'interval' property (the time in milliseconds between each frame). If not specified, a default spinner animation will be used."
        />
      </InterfaceDeclaration>

      <Spacing />
      <ClassDeclaration name="Spinner">
        <ClassField name="frames" isPrivateMember type="string[]" />
        <hbr />
        <ClassField name="interval" isPrivateMember type="number" />
        <hbr />
        <ClassField name="currentFrame" isPrivateMember type="number">
          {code`-1`}
        </ClassField>
        <hbr />
        <ClassField
          name="timer"
          isPrivateMember
          optional
          type="NodeJS.Timeout"
        />
        <hbr />
        <ClassField name="message" isPrivateMember type="string">
          {code`""`}
        </ClassField>
        <hbr />
        <ClassField name="stream" isPrivateMember type="WriteStream">
          {code`process.stderr`}
        </ClassField>
        <hbr />
        <ClassField name="lines" isPrivateMember type="number">
          {code`0`}
        </ClassField>
        <hbr />
        <ClassField
          name="exitHandlerBound"
          isPrivateMember
          type="(signal: any) => void">
          {code`() => {}`}
        </ClassField>
        <hbr />
        <ClassField name="lastSpinnerFrameTime" isPrivateMember type="number">
          {code`0`}
        </ClassField>
        <hbr />
        <ClassField name="isSpinning" isPrivateMember type="boolean">
          {code`false`}
        </ClassField>
        <hbr />
        <ClassField
          name="hookedStreams"
          isPrivateMember
          type='Map<WriteStream, { write?: WriteStream["write"]; originalWrite: WriteStream["write"]; hookedWrite: WriteStream["write"] }>'>
          {code`new Map()`}
        </ClassField>
        <hbr />
        <ClassField name="isInternalWrite" isPrivateMember type="boolean">
          {code`false`}
        </ClassField>
        <hbr />
        <ClassField name="isDeferringRender" isPrivateMember type="boolean">
          {code`false`}
        </ClassField>
        <Spacing />
        {code`constructor(options: SpinnerOptions = {}) {
          const spinner = (typeof options.spinner === "string" ? resolveSpinner(options.spinner as SpinnerPreset) : options.spinner) ?? ${JSON.stringify(
            theme.spinner
          )};
          this.#frames = spinner.frames;
          this.#interval = spinner.interval;

          if (options.message) {
            this.#message = options.message;
          }
          if (options.stream) {
            this.#stream = options.stream;
          }

          this.#exitHandlerBound = this.#exitHandler.bind(this);
        }

        #internalWrite(action: () => unknown) {
          this.#isInternalWrite = true;
          try {
            return action();
          } finally {
            this.#isInternalWrite = false;
          }
        }

        #stringifyChunk(chunk: string | Uint8Array<ArrayBufferLike> | ArrayBufferLike) {
          if (chunk === undefined || chunk === null) {
            return "";
          }

          if (typeof chunk === "string") {
            return chunk;
          }

          if (Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)) {
            return Buffer.from(chunk).toString("utf8");
          }

          return String(chunk);
        }

        #withSynchronizedOutput(action: () => unknown) {
          if (!isInteractive) {
            return action();
          }

          try {
            this.#write("\\u001B[?2026h");
            return action();
          } finally {
            this.#write("\\u001B[?2026l");
          }
        }

        #hookStream(stream: WriteStream) {
          if (!stream || this.#hookedStreams.has(stream) || typeof stream.write !== "function") {
            return;
          }

          if (activeHooksPerStream.has(stream)) {
            return;
          }

          const originalWrite = stream.write;
          const hookedWrite = ((...writeArguments: Parameters<WriteStream["write"]>) => this.#hookedWrite(stream, originalWrite, writeArguments)) as WriteStream["write"];

          this.#hookedStreams.set(stream, {originalWrite, hookedWrite});
          activeHooksPerStream.add(stream);
          stream.write = hookedWrite;
        }

        #installHook() {
          if (!isInteractive || this.#hookedStreams.size > 0) {
            return;
          }

          const streamsToHook = new Set([this.#stream]);
          if (isInteractive && (this.#stream === process.stdout || this.#stream === process.stderr)) {
            streamsToHook.add(process.stdout);
            streamsToHook.add(process.stderr);
          }

          for (const stream of streamsToHook) {
            this.#hookStream(stream);
          }
        }

        #uninstallHook() {
          for (const [stream, hookInfo] of this.#hookedStreams) {
            if (stream.write === hookInfo.hookedWrite) {
              stream.write = hookInfo.originalWrite;
            }

            activeHooksPerStream.delete(stream);
          }

          this.#hookedStreams.clear();
        }

        #hookedWrite(stream: WriteStream, originalWrite: typeof stream.write, writeArguments: Parameters<typeof stream.write>) {
          const [chunk, callback] = writeArguments;

          if (this.#isInternalWrite || !this.isSpinning) {
            return originalWrite.call(stream, chunk);
          }

          if (this.#lines > 0) {
            this.clear();
          }

          const chunkString = this.#stringifyChunk(chunk);
          const chunkTerminatesLine = chunkString.at(-1) === "\\n";
          const writeResult = originalWrite.call(stream, chunk);

          if (chunkTerminatesLine) {
            this.#isDeferringRender = false;
          } else if (chunkString !== "") {
            this.#isDeferringRender = true;
          }

          if (this.isSpinning && !this.#isDeferringRender) {
            this.#render();
          }

          return writeResult;
        }

        #stopWithIcon(icon: string, message: string) {
          return this.stop(\` \${icon}  \${message ?? this.#message}\`);
        }

        #render() {
          if (this.#isDeferringRender) {
            return;
          }

          if (this.#currentFrame === -1 || Date.now() - this.#lastSpinnerFrameTime >= this.#interval) {
            this.#currentFrame = ++this.#currentFrame % this.#frames.length;
            this.#lastSpinnerFrameTime = Date.now();
          }

          let display = \`\${textColors.spinner.icon.active(this.#frames[this.#currentFrame])} \${textColors.spinner.message.active(this.#message)}\`;
          if (!isInteractive) {
            display += "\\n";
          }

          if (isInteractive) {
            this.#withSynchronizedOutput(() => {
              this.clear();
              this.#write(display);
            });
          } else {
            this.#write(display);
          }

          if (isInteractive) {
            this.#lines = this.#lineCount(display);
          }
        }

        #write(message: string) {
          this.#internalWrite(() => {
            this.#stream.write(message);
          });
        }

        #lineCount(message: string) {
          const width = this.#stream.columns ?? 80;
          const lines = stripVTControlCharacters(message).split("\\n");

          let lineCount = 0;
          for (const line of lines) {
            lineCount += Math.max(1, Math.ceil(line.length / width));
          }

          return lineCount;
        }

        #hideCursor() {
          if (isInteractive) {
            this.#write("\\u001B[?25l");
          }
        }

        #showCursor() {
          if (isInteractive) {
            this.#write("\\u001B[?25h");
          }
        }

        #subscribeToProcessEvents() {
          process.once("SIGINT", this.#exitHandlerBound);
          process.once("SIGTERM", this.#exitHandlerBound);
        }

        #unsubscribeFromProcessEvents() {
          process.off("SIGINT", this.#exitHandlerBound);
          process.off("SIGTERM", this.#exitHandlerBound);
        }

        #exitHandler(signal: any) {
          if (this.isSpinning) {
            this.stop();
          }

          process.exit(signal === "SIGINT" ? 130 : (signal === "SIGTERM" ? 143 : 1));
        } `}
        <ClassPropertyGet
          public
          name="isSpinning"
          type="boolean"
          doc="Whether the spinner is currently active and spinning.">
          {code`return this.#isSpinning;`}
        </ClassPropertyGet>
        <Spacing />
        <ClassPropertySet
          public
          name="message"
          type="string"
          doc="Set the message displayed by the spinner.">
          {code`this.#message = value;`}
        </ClassPropertySet>
        <Spacing />
        <ClassPropertyGet
          public
          name="message"
          type="string"
          doc="Get the message displayed by the spinner.">
          {code`return this.#message;`}
        </ClassPropertyGet>
        <Spacing />
        <ClassMethod
          name="start"
          doc="Start the spinner animation."
          parameters={[{ name: "message", type: "string" }]}>
          <IfStatement condition={code`message !== undefined`}>
            {code`this.#message = message;`}
          </IfStatement>
          <IfStatement condition={code`this.isSpinning`}>
            {code`return this;`}
          </IfStatement>
          {code`this.#isSpinning = true;
          this.#hideCursor();
          this.#installHook();
          this.#render();
          this.#subscribeToProcessEvents();

          if (isInteractive) {
            this.#timer = setInterval(() => {
              this.#render();
            }, this.#interval);
          }

          return this;
          `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="stop"
          doc="Stop the spinner animation."
          parameters={[
            { name: "finalMessage", optional: true, type: "string" }
          ]}>
          {code`if (!this.isSpinning) {
            return this;
          }

          const shouldWriteNewline = this.#isDeferringRender;
          this.#isSpinning = false;
          if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = undefined;
          }

          this.#isDeferringRender = false;
          this.#uninstallHook();
          this.#showCursor();
          this.clear();
          this.#unsubscribeFromProcessEvents();

          if (finalMessage) {
            const prefix = shouldWriteNewline ? "\\n" : "";
            this.#stream.write(\`\${prefix}\${finalMessage}\\n\`);
          }

          return this;

          `}
        </ClassMethod>
        <Spacing />
        <ClassMethod name="clear" doc="Clear the spinner animation.">
          {code`if (!isInteractive) {
            return this;
          }

          if (this.#lines === 0) {
            return this;
          }

          this.#internalWrite(() => {
            this.#stream.cursorTo(0);

            for (let index = 0; index < this.#lines; index++) {
              if (index > 0) {
                this.#stream.moveCursor(0, -1);
              }

              this.#stream.clearLine(1);
            }
          });

          this.#lines = 0;
          return this; `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="success"
          doc="Mark the spinner as successful."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(textColors.spinner.icon.success("${
            theme.icons.spinner.success
          }"), textColors.spinner.message.success(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="error"
          doc="Mark the spinner as failed."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(textColors.spinner.icon.error("${
            theme.icons.spinner.error
          }"), textColors.spinner.message.error(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="warning"
          doc="Mark the spinner as warning."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(textColors.spinner.icon.warning("${
            theme.icons.spinner.warning
          }"), textColors.spinner.message.warning(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="info"
          doc="Mark the spinner as informational."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(textColors.spinner.icon.info("${
            theme.icons.spinner.info
          }"), textColors.spinner.message.info(message)); `}
        </ClassMethod>
        <Spacing />
        <ClassMethod
          name="help"
          doc="Mark the spinner as help."
          parameters={[{ name: "message", type: "string" }]}>
          {code`return this.#stopWithIcon(textColors.spinner.icon.help("${
            theme.icons.spinner.help
          }"), textColors.spinner.message.help(message)); `}
        </ClassMethod>
        <Spacing />
      </ClassDeclaration>
      <Spacing />
      <TSDoc heading="Render a spinner in the console.">
        <TSDocParam name="options">
          {`Options for configuring the spinner, including the message to display, the output stream to write to, and the spinner animation to use.`}
        </TSDocParam>
        <TSDocReturns>{`An instance of the Spinner class, which can be used to control the spinner animation (e.g., start, stop, mark as success/error, etc.).`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="createSpinner"
        parameters={[
          {
            name: "options",
            type: "SpinnerOptions",
            optional: true
          }
        ]}>
        {code`return new Spinner(options);`}
      </FunctionDeclaration>
    </>
  );
}

function extractBorderOptionsObject(
  direction:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight",
  theme: ThemeResolvedConfig
): string {
  return `borderOptions.${
    direction
  } === "primary" ? borderColors.app.table.primary("${
    theme.borderStyles.app.table.primary[direction]
  }") : borderOptions.${
    direction
  } === "secondary" ? borderColors.app.table.secondary("${
    theme.borderStyles.app.table.secondary[direction]
  }") : borderOptions.${
    direction
  } === "tertiary" ? borderColors.app.table.tertiary("${
    theme.borderStyles.app.table.tertiary[direction]
  }") : !borderOptions.${direction} || borderOptions.${
    direction
  } === "none" ? "" : borderOptions.${direction}`;
}

function extractBorderOptionsString(
  direction:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight",
  theme: ThemeResolvedConfig
): string {
  return `borderOptions === "primary" ? borderColors.app.table.primary("${
    theme.borderStyles.app.table.primary[direction]
  }") : borderOptions === "secondary" ? borderColors.app.table.secondary("${
    theme.borderStyles.app.table.secondary[direction]
  }") : borderOptions === "tertiary" ? borderColors.app.table.tertiary("${
    theme.borderStyles.app.table.tertiary[direction]
  }") : !borderOptions || borderOptions === "none" ? "" : borderOptions`;
}

/**
 * Props for the TableFunctionDeclaration component.
 */
export type TableFunctionDeclarationProps = Omit<
  FunctionDeclarationProps,
  "parameters" | "name"
>;

/**
 * A component to generate the table functions in the `shell-shock:console` builtin module.
 */
export function TableFunctionDeclaration(props: TableFunctionDeclarationProps) {
  const theme = useTheme();

  return (
    <>
      <TypeDeclaration
        export
        name="SizeToken"
        doc="A type representing the width size of an item in the console.">
        {code`"full" | "1/1" | "1/2" | "1/3" | "1/4" | "1/5" | "1/6" | "1/12" | "1/24" | "100%" | "50%" | "33.33%" | "25%" | "20%" | "10%" | "5%" | "2.5%"`}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="Determine if a value is a valid size token.">
        <TSDocRemarks>
          {`This function checks if the provided value is a valid size token, which can be one of the predefined strings representing common width sizes (e.g., "full", "1/2", "1/3", etc.) or percentage strings (e.g., "50%").`}
        </TSDocRemarks>
        <TSDocParam name="value">{`The value to check for being a valid size token.`}</TSDocParam>
        <TSDocReturns>{`True if the value is a valid size token, false otherwise.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        doc="Determines if the provided value is a valid size token."
        name="isSizeToken"
        parameters={[
          {
            name: "value",
            type: "any"
          }
        ]}
        returnType="value is SizeToken">
        <IfStatement
          condition={code`["full", "1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/12", "1/24", "100%", "50%", "33.33%", "25%", "20%", "10%", "5%", "2.5%"].includes(value)`}>
          {code`return true; `}
        </IfStatement>
        {code`return false; `}
      </FunctionDeclaration>
      <Spacing />
      <TSDoc heading="Calculate the width in characters based on the provided width size.">
        <TSDocRemarks>
          {`This function calculates the width in characters based on the provided width size, which can be a predefined string (e.g., "full", "1/2", "1/3", etc.) or a percentage string (e.g., "50%"). The calculation is based on the current width of the console (getTerminalSize().columns).`}
        </TSDocRemarks>
        <TSDocParam name="size">
          {`The width size to calculate. This can be a predefined string (e.g., "full", "1/2", "1/3", etc.) or a percentage string (e.g., "50%").`}
        </TSDocParam>
        <TSDocReturns>{`The calculated width in characters.`}</TSDocReturns>
      </TSDoc>
      <FunctionDeclaration
        export
        name="calculateWidth"
        parameters={[
          {
            name: "size",
            type: "SizeToken",
            optional: false
          }
        ]}
        returnType="number">
        <IfStatement condition={code`["full", "100%", "1/1"]. includes(size)`}>
          {code`return getTerminalSize().columns;`}
        </IfStatement>
        <ElseIfClause condition={code`["1/2", "50%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 2);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/3", "33.33%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 3);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/4", "25%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 4);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/5", "20%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 5);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/6", "10%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 6);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/12", "5%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 12);`}
        </ElseIfClause>
        <ElseIfClause condition={code`["1/24", "2.5%"].includes(size)`}>
          {code`return Math.round(getTerminalSize().columns / 24);`}
        </ElseIfClause>
        <ElseClause>
          {code`
            const match = size.match(/(\\d+(\\.\\d+)?)%/);
            if (match) {
              return Math.round((getTerminalSize().columns * parseFloat(match[1])) / 100);
            }

            throw new Error(\`Invalid width size: \${size}\`);
          `}
        </ElseClause>
        <Spacing />
      </FunctionDeclaration>

      <TypeDeclaration
        export
        name="BorderOption"
        doc="The border options applied to table cells.">
        {code`"primary" | "secondary" | "tertiary" | "none" | string; `}
      </TypeDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableOutputOptions"
        doc="Options to customize the output of the {@link table} function.">
        <TSDoc heading="Border variant for the table cell.">
          <TSDocRemarks>
            {`The border variant to use for the table cell. This determines the color and style of the border around the cell.`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.property}
            defaultValue="primary"
          />
        </TSDoc>
        <InterfaceMember
          name="border"
          optional
          type="BorderOption | { top?: BorderOption; right?: BorderOption; bottom?: BorderOption; left?: BorderOption; topLeft?: BorderOption; topRight?: BorderOption; bottomLeft?: BorderOption; bottomRight?: BorderOption; }"
        />
        <hbr />
        <TSDoc heading="Padding for the table cell.">
          <TSDocRemarks>
            {`The amount of padding (in spaces) to apply to the table cell. This value is applied to both the left and right sides of the cell. If not specified, the default table padding defined in the current theme configuration will be used.`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.property}
            defaultValue={`\`${theme.padding.table}\``}
          />
        </TSDoc>
        <InterfaceMember name="padding" optional type="number" />
        <hbr />
        <TSDoc heading="Alignment for the table cell.">
          <TSDocRemarks>
            {`The alignment for the table cell. This determines how the text within the cell is aligned. If not specified, the default alignment is "left".`}
          </TSDocRemarks>
          <hbr />
          <TSDocDefaultValue
            type={ReflectionKind.property}
            defaultValue="left"
          />
        </TSDoc>
        <InterfaceMember
          name="align"
          optional
          type='"left" | "right" | "center"'
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableCellOptions"
        extends="TableOutputOptions"
        doc="Options for a specific table cell provided to the {@link table} function.">
        <InterfaceMember
          name="value"
          optional
          type="string"
          doc="The actual string value of the table cell."
        />
        <hbr />
        <TSDoc heading="Width of the table cell.">
          <TSDocRemarks>
            {`The width of the table cell (where 1 is a single character in the terminal). If not specified, the width will be determined based on the content of the cell and the available space in the console.`}
          </TSDocRemarks>
        </TSDoc>
        <InterfaceMember
          name="maxWidth"
          type="number | SizeToken | undefined"
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableRowOptions"
        extends="TableOutputOptions"
        doc="Options for a specific table row provided to the {@link table} function.">
        <InterfaceMember
          name="values"
          optional
          type="(string | TableCellOptions)[]"
          doc="The actual string values of the table row's cells."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        export
        name="TableOptions"
        extends="TableOutputOptions"
        doc="Options for a specific table cell provided to the {@link table} function.">
        <InterfaceMember
          name="values"
          optional
          type="(string | TableCellOptions)[][]"
          doc="The actual string values of the table's rows' cells."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="Dimensions"
        doc="The height and width for a specific table/cell used internally in the {@link table} function.">
        <InterfaceMember
          name="height"
          type="number"
          doc="The height of the row/cell (where 1 is a single line in the terminal)."
        />
        <hbr />
        <InterfaceMember
          name="width"
          type="number"
          doc="The width of the row/cell (where 1 is a single character in the terminal)."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <InterfaceDeclaration
        name="TableCellBorder"
        doc="The resolved complete border styles for a table cell.">
        <InterfaceMember
          name="top"
          type="string"
          doc="The top border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="bottom"
          type="string"
          doc="The bottom border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="right"
          type="string"
          doc="The right border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="left"
          type="string"
          doc="The left border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="topLeft"
          type="string"
          doc="The top-left border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="topRight"
          type="string"
          doc="The top-right border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="bottomLeft"
          type="string"
          doc="The bottom-left border style of the table cell."
        />
        <hbr />
        <InterfaceMember
          name="bottomRight"
          type="string"
          doc="The bottom-right border style of the table cell."
        />
        <hbr />
      </InterfaceDeclaration>
      <Spacing />
      <TypeDeclaration
        name="TableCell"
        doc="The internal state of a formatted table cell in the {@link table} function.">
        {code`Required<Omit<TableCellOptions, "maxWidth" | "border">> & Dimensions & {
          border: TableCellBorder;
          maxWidth?: number;
        };
        `}
      </TypeDeclaration>
      <Spacing />
      <TSDoc heading="Write a table to the console.">
        <TSDocRemarks>
          {`This function writes a table to the console, applying the appropriate padding as defined in the current theme configuration and wrapping as needed.`}
        </TSDocRemarks>
        <hbr />
        <TSDocParam name="options">
          {`Options to customize the table output.`}
        </TSDocParam>
      </TSDoc>
      <FunctionDeclaration
        export
        {...props}
        name="table"
        parameters={[
          {
            name: "options",
            type: "TableOptions | TableRowOptions[] | TableCellOptions[][] | string[] | string[][]",
            optional: false
          }
        ]}>
        <IfStatement
          condition={code`!options ||
            (!Array.isArray(options) && (typeof options !== "object" || !options.values || !Array.isArray(options.values) || options.values.length === 0)) ||
            (Array.isArray(options) && !options.every(item => typeof item === "object" || typeof item === "string" || Array.isArray(item))) `}>
          {code`return;`}
        </IfStatement>
        <Spacing />
        <VarDeclaration
          let
          name="cells"
          type={`TableCell[][]`}
          initializer={code`[];`}
        />
        <hbr />
        {code`
        const extractTableCell = (cell: string | TableCellOptions, columnIndex: number, rowLength: number, opts?: TableOutputOptions): TableCell => {
          if (typeof cell === "string") {
            const borderOptions = opts?.border || "primary";

            let border = {} as TableCellBorder;
            if (typeof borderOptions === "object") {
              border = {
                top: ${extractBorderOptionsObject("top", theme)},
                bottom: ${extractBorderOptionsObject("bottom", theme)},
                left: ${extractBorderOptionsObject("left", theme)},
                right: ${extractBorderOptionsObject("right", theme)},
                topLeft: ${extractBorderOptionsObject("topLeft", theme)},
                topRight: ${extractBorderOptionsObject("topRight", theme)},
                bottomLeft: ${extractBorderOptionsObject("bottomLeft", theme)},
                bottomRight: ${extractBorderOptionsObject("bottomRight", theme)},
              };
            } else {
              border.top = ${extractBorderOptionsString("top", theme)};
              border.bottom = ${extractBorderOptionsString("bottom", theme)};
              border.left = ${extractBorderOptionsString("left", theme)};
              border.right = ${extractBorderOptionsString("right", theme)};
              border.topLeft = ${extractBorderOptionsString("topLeft", theme)};
              border.topRight = ${extractBorderOptionsString("topRight", theme)};
              border.bottomLeft = ${extractBorderOptionsString("bottomLeft", theme)};
              border.bottomRight = ${extractBorderOptionsString("bottomRight", theme)};
            }

            const padding = Math.max(0, opts?.padding ?? ${theme.padding.table}) * (columnIndex === 0 || columnIndex === rowLength - 1 ? 2 : 1);
            const value = cell ?? "";
            const width = stripAnsi(value).length + padding * 2;

            return {
              value,
              height: 1,
              width,
              border,
              padding,
              align: opts?.align || "left",
            };
          } else {
            const borderOptions = cell.border || opts?.border || "primary";

            let border = {} as TableCellBorder;
            if (typeof borderOptions === "object") {
              border = {
                top: ${extractBorderOptionsObject("top", theme)},
                bottom: ${extractBorderOptionsObject("bottom", theme)},
                left: ${extractBorderOptionsObject("left", theme)},
                right: ${extractBorderOptionsObject("right", theme)},
                topLeft: ${extractBorderOptionsObject("topLeft", theme)},
                topRight: ${extractBorderOptionsObject("topRight", theme)},
                bottomLeft: ${extractBorderOptionsObject("bottomLeft", theme)},
                bottomRight: ${extractBorderOptionsObject("bottomRight", theme)},
              };
            } else {
              border.top = ${extractBorderOptionsString("top", theme)};
              border.bottom = ${extractBorderOptionsString("bottom", theme)};
              border.left = ${extractBorderOptionsString("left", theme)};
              border.right = ${extractBorderOptionsString("right", theme)};
              border.topLeft = ${extractBorderOptionsString("topLeft", theme)};
              border.topRight = ${extractBorderOptionsString("topRight", theme)};
              border.bottomLeft = ${extractBorderOptionsString("bottomLeft", theme)};
              border.bottomRight = ${extractBorderOptionsString("bottomRight", theme)};
            }

            const padding = Math.max(0, cell.padding ?? opts?.padding ?? ${
              theme.padding.table
            });
            const value = cell.value ?? "";
            const width = stripAnsi(value).length + padding * 2;
            const maxWidth = cell.maxWidth ? typeof cell.maxWidth === "number" ? cell.maxWidth : calculateWidth(cell.maxWidth) : undefined;

            return {
              value,
              height: 1,
              width,
              maxWidth,
              border,
              padding,
              align: cell.align || opts?.align || "left",
            };
          }
        };

        let colMaxWidths = [] as (number | undefined)[];
    `}
        <hbr />
        <IfStatement condition={code`Array.isArray(options)`}>
          <IfStatement
            condition={code`options.every(row => typeof row === "string" || (typeof row === "object" && !Array.isArray(row) && !("values" in row)))`}>
            {code`cells.push(options.map((cell, index) => extractTableCell(cell as string | TableCellOptions, index, options.length)));`}
          </IfStatement>
          <ElseClause>
            {code`
          cells.push(
            ...options.map(row => Array.isArray(row)
              ? row.reduce((cellRow, cell, index) => {
                if (colMaxWidths.length <= index) {
                  colMaxWidths.push(undefined);
                }
                const newCell = extractTableCell(cell, index, row.length);
                if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                  colMaxWidths[index] = newCell.maxWidth;
                }
                cellRow.push(newCell);
                return cellRow;
              }, [] as TableCell[])
              : (row as TableRowOptions).values?.reduce((cellRow, cell, index) => {
                if (colMaxWidths.length <= index) {
                  colMaxWidths.push(undefined);
                }
                const newCell = extractTableCell(cell, index, (row as TableRowOptions).values?.length ?? 1, row as TableRowOptions);
                if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                  colMaxWidths[index] = newCell.maxWidth;
                }
                cellRow.push(newCell);
                return cellRow;
              }, [] as TableCell[]) ?? []
            )
          );
            `}
          </ElseClause>
        </IfStatement>
        <ElseClause>
          {code`
        cells.push(
          ...options.values!.map(row => Array.isArray(row)
            ? row.reduce((cellRow, cell, index) => {
              if (colMaxWidths.length <= index) {
                colMaxWidths.push(undefined);
              }
              const newCell = extractTableCell(cell, index, row.length);
              if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                colMaxWidths[index] = newCell.maxWidth;
              }
              cellRow.push(newCell);
              return cellRow;
            }, [] as TableCell[])
            : (row as TableRowOptions).values?.reduce((cellRow, cell, index) => {
              if (colMaxWidths.length <= index) {
                colMaxWidths.push(undefined);
              }
              const newCell = extractTableCell(cell, index, (row as TableRowOptions).values?.length ?? 1, options);
              if (newCell.maxWidth && (!colMaxWidths[index] || newCell.maxWidth < colMaxWidths[index]!)) {
                colMaxWidths[index] = newCell.maxWidth;
              }
              cellRow.push(newCell);
              return cellRow;
            }, [] as TableCell[]) ?? []
          )
        );

          `}
        </ElseClause>
        <hbr />
        {code`
cells = cells.filter(row => row.length > 0);
if (cells.length === 0) {
  return;
}

cells.forEach(row => row.forEach((cell, index) => {
  if (colMaxWidths[index] && cell.maxWidth !== colMaxWidths[index]!) {
    cell.maxWidth = colMaxWidths[index]!;
  }
}));

// Calculate table dimensions
let colWidths = [] as number[];
let rowDims = [] as Dimensions[];

const calculateRowDimensions = () => {
  colWidths = [];
  return cells.reduce((dims, row) => {
    dims.push(row.reduce((dim, cell, index) => {
      dim.width += cell.width;
      if (cell.height > dim.height) {
        dim.height = cell.height;
      }
      if (!colWidths[index] || cell.width > colWidths[index]!) {
        colWidths[index] = cell.width;
      }

      return dim;
    }, { width: 0, height: 0 } as Dimensions));

    return dims;
  }, [] as Dimensions[]);
}

let recalculate!: boolean;
do {
  recalculate = false;
  rowDims = calculateRowDimensions();

  if (!recalculate && colWidths.some((colWidth, index) => colMaxWidths[index] && colWidth > colMaxWidths[index]!)) {
    (colWidths.map((colWidth, index) => colMaxWidths[index] && colWidth > colMaxWidths[index]! ? index : undefined).filter(colWidth => colWidth !== undefined) as number[]).forEach(index => {
      cells.forEach(row => {
        const cell = row[index]!;
        if (colMaxWidths[index] && cell.width > colMaxWidths[index]) {
          const lines = splitText(
            cell.value,
            colMaxWidths[index] - cell.padding * 2,
          );

          cell.value = lines.join("\\n");
          cell.height = lines.length;
          cell.width = Math.max(...lines.map(line => stripAnsi(line).length)) + cell.padding * 2;

          recalculate = true;
        }
      });
    });
  }

  rowDims.forEach((row, rowIndex) => {
    if (!recalculate && row.width > Math.max(getTerminalSize().columns - ${
      Math.max(theme.padding.app, 0) * 2
    }, 0)) {
      const cell = cells[rowIndex]!.reduce((largestCell, cell) => {
        if (cell.width > largestCell.width) {
          return cell;
        }
        return largestCell;
      }, cells[rowIndex]![0]!);

      const lines = splitText(
        cell.value,
        Math.min(Math.max(getTerminalSize().columns - ${
          Math.max(theme.padding.app, 0) * 2
        } - (row.width - (cell.width - cell.padding * 2)), 0),
        cell.maxWidth ?? Number.POSITIVE_INFINITY)
      );

      cell.value = lines.join("\\n");
      cell.height = lines.length;
      cell.width = Math.max(...lines.map(line => stripAnsi(line).length)) + cell.padding * 2;

      recalculate = true;
    }
  });

  if (!recalculate && colWidths.reduce((a, b) => a + b, 0) > Math.max(getTerminalSize().columns - ${
    Math.max(theme.padding.app, 0) * 2
  }, 0)) {
    let colIndex = 0;
    const cell = cells.reduce((ret, row) => {
      return row.reduce((largest, current, index) => {
        if (largest.width < current.width) {
          colIndex = index;
          return current;
        }
        return largest;
      }, ret);
    }, cells[0]![0]!);

    const lines = splitText(
      cell.value,
      Math.min(Math.max(getTerminalSize().columns - ${
        Math.max(theme.padding.app, 0) * 2
      } - (colWidths.filter((_, i) => i !== colIndex).reduce((a, b) => a + b, 0)) - cell.padding * 2, 0),
      cell.maxWidth ?? Number.POSITIVE_INFINITY)
    );

    cell.value = lines.join("\\n");
    cell.height = lines.length;
    cell.width = Math.max(...lines.map(line => stripAnsi(line).length)) + cell.padding * 2;

    recalculate = true;
  }
} while (recalculate);

// Render table
cells.forEach((row, rowIndex) => {
  const outputs = [] as string[][];
  row.forEach((cell, colIndex) => {
    const lines = cell.value.split("\\n");
    while (lines.length < rowDims[rowIndex]!.height) {
      lines.push("");
    }

    outputs.push(lines.map(line => {
      let paddedContent = "";
      switch (cell.align) {
        case "right":
          paddedContent = " ".repeat(Math.max(colWidths[colIndex] - stripAnsi(line).length - cell.padding, 0)) + line + " ".repeat(cell.padding);
          break;
        case "center":
          const leftPadding = Math.floor((colWidths[colIndex] - stripAnsi(line).length - cell.padding) / 2);
          const rightPadding = colWidths[colIndex] - stripAnsi(line).length - leftPadding;
          paddedContent = " ".repeat(leftPadding) + line + " ".repeat(rightPadding);
          break;
        case "left":
        default:
          paddedContent = " ".repeat(cell.padding) + line + " ".repeat(Math.max(colWidths[colIndex] - stripAnsi(line).length - cell.padding, 0));
          break;
      }

      if (colIndex === row.length - 1) {
        return cell.border.left + paddedContent + cell.border.right;
      } else {
        return cell.border.left + paddedContent;
      }
    }));
  });

  for (let index = 0; index < rowDims[rowIndex]!.height; index++) {
    writeLine(outputs.map(output => output[index] ?? "").join(""));
  }
});
`}
      </FunctionDeclaration>
    </>
  );
}

export type ConsoleBuiltinProps = Pick<
  BuiltinFileProps,
  "children" | "imports" | "builtinImports"
>;

/**
 * A built-in console utilities module for Shell Shock.
 */
export function ConsoleBuiltin(props: ConsoleBuiltinProps) {
  const { children, imports, builtinImports } = props;

  return (
    <BuiltinFile
      id="console"
      description="A collection of helper utilities to assist in generating content meant for display in the console."
      imports={defu(imports, {
        "@shell-shock/plugin-theme/types/theme": ["ThemeSpinnerResolvedConfig"],
        "@shell-shock/plugin-theme/helpers/spinners": [
          "SpinnerPreset",
          "resolveSpinner"
        ],
        "node:util": ["stripVTControlCharacters"]
      })}
      builtinImports={defu(builtinImports, {
        utils: [
          "isInteractive",
          "isColorSupported",
          "colorSupportLevels",
          "isUnicodeSupported",
          "isHyperlinkSupported",
          "getTerminalSize"
        ],
        env: ["env", "isDevelopment", "isDebug"],
        state: ["hasFlag"]
      })}>
      <AnsiHelpersDeclarations />
      <Spacing />
      <StripAnsiFunctionDeclaration />
      <Spacing />
      <WrapAnsiFunction />
      <Spacing />
      <AnsiStyleFunctionsDeclaration />
      <Spacing />
      <WriteFunctionDeclaration />
      <Spacing />
      <WriteLineFunctionDeclaration />
      <Spacing />
      <SplitTextFunctionDeclaration />
      <Spacing />
      <LinkFunctionDeclaration />
      <Spacing />
      <DividerFunctionDeclaration />
      <Spacing />
      <SpinnerFunctionDeclaration />
      <Spacing />
      <MessageFunctionDeclaration
        type="help"
        variant="help"
        consoleFnName="log"
        description="help"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="success"
        variant="success"
        consoleFnName="info"
        description="success"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="info"
        variant="info"
        consoleFnName="info"
        description="informational"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="debug"
        variant="debug"
        consoleFnName="debug"
        description="debug"
        timestamp
        prefix={
          <IfStatement condition={<IsNotDebug />}>{code`return; `}</IfStatement>
        }
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="verbose"
        variant="info"
        color="debug"
        consoleFnName="debug"
        description="verbose"
        timestamp
        prefix={
          <IfStatement
            condition={<IsNotVerbose />}>{code`return; `}</IfStatement>
        }
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="warn"
        variant="warning"
        consoleFnName="warn"
        description="warning"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="danger"
        variant="danger"
        consoleFnName="error"
        description="destructive/danger"
      />
      <Spacing />
      <MessageFunctionDeclaration
        type="error"
        variant="error"
        consoleFnName="error"
        description="error"
        timestamp
        parameters={[
          {
            name: "err",
            type: "string | { message: string; stack?: string }",
            optional: false
          },
          {
            name: "header",
            type: "string",
            optional: true
          }
        ]}
        prefix={
          <>
            <VarDeclaration let name="message" type="string | undefined" />
            <Spacing />
            <IfStatement
              condition={code`(err as { message: string; stack?: string })?.message`}>
              {code`message = (err as { message: string; stack?: string }).message;`}
            </IfStatement>
            <ElseClause>{code`message = String(err);`}</ElseClause>
            <Spacing />
            <IfStatement
              condition={code`env.STACKTRACE && typeof err === "object" && (err as { stack?: string })?.stack`}>
              {code`message += " \\n\\n" + (err as { stack?: string })?.stack
                .split("\\n")
                .slice(1)
                .map(line => {
                  const match = line.match(/at (?:(.+?)\\s+\\()?(?:(.+?):(\\d+)(?::(\\d+))?|([^)]+))\\)?/);
                  if (match) {
                    const filePath = match[2] || match[5] || "<unknown>";
                    return \`at \${match[1] || "<anonymous>"} (\${filePath === "<anonymous>" || filePath === "<unknown>" ? filePath : link(filePath, { text: \`\${filePath.replace(/^.*file:\\/\\//, "")}\${match[3] ? \`:\${match[3]}\${match[4] ? \`:\${match[4]}\` : ""}\` : ""}\`, useTextWhenUnsupported: true })})\`;
                  }

                  return line.trim();
                })
                .join("\\n"); `}
            </IfStatement>
          </>
        }
      />
      <Spacing />
      <TableFunctionDeclaration />
      <Spacing />
      <BlockquoteFunctionDeclaration />
      <Spacing />
      <CodeFunctionDeclaration />
      <Spacing />
      <InlineCodeFunctionDeclaration />
      <Spacing />
      {children}
      <Spacing />
    </BuiltinFile>
  );
}
