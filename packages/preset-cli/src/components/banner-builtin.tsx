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

import { code, computed, Show, splitProps } from "@alloy-js/core";
import { Spacing } from "@powerlines/plugin-alloy/core/components/spacing";
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
import { render } from "cfonts";
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

  const titleLines = computed(() => {
    const result = render(getAppTitle(context, true), {
      font: "tiny",
      align: "left",
      background: "transparent",
      letterSpacing: 1,
      lineHeight: 1,
      gradient: false,
      transitionGradient: false,
      env: "node"
    });
    if (!result) {
      return [`${getAppTitle(context, true)} Command-Line Interface`];
    }

    return result.array;
  });

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
      command={command}
      insertNewlineAfterDescription>
      {code`const titleLines = [${titleLines.value
        .map(line => JSON.stringify(line.trim()))
        .join(", ")}];
      const title = Math.max(...titleLines.map(line => stripAnsi(line).length)) > Math.max(process.stdout.columns + ${
        totalPadding.value
      }, 20) ? "${title.value}" : \`\\n\${titleLines.join("\\n")}\\n\`;

      splitText(title,
        Math.max(process.stdout.columns - ${totalPadding.value}, 20)
      ).forEach((line) => {
        writeLine(borderColors.banner.outline.${variant}("${
          theme.borderStyles.banner.outline[variant].left
        }") + " ".repeat(Math.max(Math.floor((process.stdout.columns - (stripAnsi(line).length + ${
          bannerPadding.value
        })) / 2), 0)) + bold(textColors.banner.title.${variant}(line)) + " ".repeat(Math.max(Math.ceil((process.stdout.columns - (stripAnsi(line).length + ${
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

  return (
    <BaseBannerBuiltin {...rest} command={command}>
      <BannerFunctionDeclarationWrapper command={command}>
        <BannerFunctionBodyDeclaration command={command} />
        <Spacing />
        <Show when={Boolean(children)}>{children}</Show>
      </BannerFunctionDeclarationWrapper>
    </BaseBannerBuiltin>
  );
}
