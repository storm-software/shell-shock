/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import { code, computed, Show, splitProps } from "@alloy-js/core";
import { VarDeclaration } from "@alloy-js/typescript";
import { Spacing } from "@power-plant/alloy-js/core/components/spacing";
import { usePowerlines } from "@powerlines/plugin-alloy/core/contexts/context";
import type { BuiltinFileProps } from "@powerlines/plugin-alloy/typescript/components/builtin-file";
import type { CommandTree } from "@shell-shock/core";
import { getAppDescription, getAppTitle } from "@shell-shock/core/plugin-utils";
import { BannerBuiltin as BaseBannerBuiltin } from "@shell-shock/plugin-banner/components/banner-builtin";
import type { BannerFunctionBodyDeclarationProps } from "@shell-shock/plugin-banner/components/banner-function-declaration";
import {
  BannerFunctionDeclarationWrapper,
  BannerFunctionBodyDeclaration as BaseBannerFunctionBodyDeclaration
} from "@shell-shock/plugin-banner/components/banner-function-declaration";
import { useTheme } from "@shell-shock/plugin-theme/contexts/theme";
import { isSetObject } from "@stryke/type-checks/is-set-object";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import figlet from "figlet";
import stripAnsi from "strip-ansi";
import type { CLIPresetContext } from "../types/plugin";

/**
 * A component to generate the `banner` function in the `shell-shock:console` builtin module.
 */
export function BannerFunctionBodyDeclaration(
  props: Omit<
    BannerFunctionBodyDeclarationProps,
    "header" | "description" | "footer"
  >
) {
  const { consoleFnName = "log", variant = "primary", command } = props;

  const theme = useTheme();
  const context = usePowerlines<CLIPresetContext>();

  const header = computed(
    () =>
      `${theme.labels.banner.header[variant] || getAppTitle(context)} v${
        context.packageJson.version || "1.0.0"
      }`
  );
  const footer = computed(() => theme.labels.banner.footer[variant]);
  const title = computed(() =>
    getAppTitle(context, true).replace(
      `v${context.packageJson.version || "1.0.0"}`,
      ""
    )
  );
  const description = computed(
    () => command?.description || getAppDescription(context)
  );

  const bannerPadding = computed(
    () =>
      Math.max(theme.padding.app, 0) * 2 +
      (theme.borderStyles.banner.outline[variant]?.left.length ?? 0) +
      (theme.borderStyles.banner.outline[variant]?.right.length ?? 0)
  );
  const totalPadding = computed(
    () => Math.max(theme.padding.banner, 0) * 2 + bannerPadding.value
  );

  return (
    <BaseBannerFunctionBodyDeclaration
      header={header.value}
      description={description.value}
      footer={footer.value}
      variant={variant}
      consoleFnName={consoleFnName}
      command={
        {
          ...command,
          title: command?.path ? command.title : ""
        } as CommandTree
      }
      insertNewlineAfterDescription>
      {code`
      const title = Math.max(...TITLE_LINES.map(line => stripAnsi(line).length)) > Math.max(getTerminalSize().columns + ${
        totalPadding.value
      }, 20) ? "${title.value}" : \`\\n\${TITLE_LINES\.join("\\n")}\\n\`;

      splitText(title,
        Math.max(getTerminalSize().columns - ${totalPadding.value}, 20)
      ).forEach((line) => {
        writeLine(borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].left
        }") + " ".repeat(Math.max(Math.floor((getTerminalSize().columns - (stripAnsi(line).length + ${
          bannerPadding.value
        })) / 2), 0)) + bold(textColors.banner.title.${variant}(line)) + " ".repeat(Math.max(Math.ceil((getTerminalSize().columns - (stripAnsi(line).length + ${
          bannerPadding.value
        })) / 2), 0)) + borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].right
        }"), { consoleFn: console.${consoleFnName} });
      }); `}
    </BaseBannerFunctionBodyDeclaration>
  );
}

export type BannerBuiltinProps = Omit<
  BuiltinFileProps,
  "id" | "description"
> & {
  /**
   * The command to generate the `banner` function declaration for.
   */
  command: CommandTree;
};

/**
 * A built-in banner module for Shell Shock.
 */
export function BannerBuiltin(props: BannerBuiltinProps) {
  const [{ command, children }, rest] = splitProps(props, [
    "command",
    "children"
  ]);

  const context = usePowerlines<CLIPresetContext>();

  const titleLines = computed(() => {
    const result = figlet.textSync(
      isSetObject(context.config.banner) &&
        isSetString(context.config.banner.override)
        ? context.config.banner.override
        : isSetString(context.config.banner)
          ? context.config.banner
          : isSetObject(context.config.banner) &&
              isSetString(context.config.banner.text)
            ? context.config.banner.text
            : getAppTitle(context, true),
      defu(isSetObject(context.config.banner) ? context.config.banner : {}, {
        font: "ANSI Compact"
      })
    );
    if (!result) {
      return [`${getAppTitle(context, true)} Command-Line Interface`];
    }

    const lines = result.trim().split("\n");
    const maxLength = Math.max(...lines.map(line => stripAnsi(line).length));
    const paddedLines = lines.map(line => {
      const paddingNeeded = maxLength - stripAnsi(line).length;
      const leftPadding = Math.floor(paddingNeeded / 2);
      const rightPadding = Math.ceil(paddingNeeded / 2);

      return " ".repeat(leftPadding) + line + " ".repeat(rightPadding);
    });

    return paddedLines;
  });

  return (
    <BaseBannerBuiltin
      {...rest}
      builtinImports={
        command?.path
          ? defu(rest.builtinImports ?? {}, {
              banner: ["TITLE_LINES"]
            })
          : rest.builtinImports
      }
      command={command}>
      <Show when={!command?.path}>
        <VarDeclaration
          const
          export
          name="TITLE_LINES"
          initializer={code` [${titleLines.value
            .map(line => JSON.stringify(line))
            .join(", ")}];`}
        />
        <Spacing />
      </Show>
      <BannerFunctionDeclarationWrapper command={command}>
        <BannerFunctionBodyDeclaration command={command} />
        <Spacing />
        <Show when={Boolean(children)}>{children}</Show>
      </BannerFunctionDeclarationWrapper>
    </BaseBannerBuiltin>
  );
}
