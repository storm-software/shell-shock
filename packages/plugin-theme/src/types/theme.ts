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

export type ThemeMessageVariant =
  | "help"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "error";

export interface ThemeColorSubItem {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface ThemeColorBodySubItem extends ThemeColorSubItem {
  link: string;
}

export interface ThemeColorBannerSubItem {
  title: string;
  header: string;
  footer: string;
  command: string;
  description: string;
}

export interface ThemeColorMessageState {
  help: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  error: string;
}

export interface ThemeColorMessageSubItemUserConfig {
  link: Partial<ThemeColorMessageState> | string;
  header: Partial<ThemeColorMessageState> | string;
  footer: Partial<ThemeColorMessageState> | string;
  description: Partial<ThemeColorMessageState> | string;
}

export interface ThemeColorMessageSubItemResolvedConfig {
  link: ThemeColorMessageState;
  header: ThemeColorMessageState;
  footer: ThemeColorMessageState;
  description: ThemeColorMessageState;
}

export interface ThemeColorUsageSubItem {
  bin: string;
  command: string;
  subcommand: string;
  options: string;
  params: string;
  description: string;
}

export interface ThemeColorTextItemsUserConfig {
  banner: Partial<ThemeColorBannerSubItem> | string;
  heading: Partial<ThemeColorSubItem> | string;
  body: Partial<ThemeColorBodySubItem> | string;
  message: Partial<ThemeColorMessageSubItemUserConfig> | string;
  usage: Partial<ThemeColorUsageSubItem> | string;
}

export interface ThemeColorTextItemsResolvedConfig {
  banner: ThemeColorBannerSubItem;
  heading: ThemeColorSubItem;
  body: ThemeColorBodySubItem;
  message: ThemeColorMessageSubItemResolvedConfig;
  usage: ThemeColorUsageSubItem;
}

export interface ThemeColorBorderSubItemUserConfig<TState extends object> {
  outline: Partial<TState> | string;
  divider: Partial<TState> | string;
}

export interface ThemeColorBorderSubItemResolvedConfig<TState extends object> {
  outline: TState;
  divider: TState;
}

export interface ThemeColorBorderItemsUserConfig {
  app:
    | Partial<ThemeColorBorderSubItemUserConfig<ThemeColorSubItem>>
    | Partial<ThemeColorSubItem>
    | string;
  banner:
    | Partial<ThemeColorBorderSubItemUserConfig<ThemeColorSubItem>>
    | Partial<ThemeColorSubItem>
    | string;
  message:
    | Partial<ThemeColorBorderSubItemUserConfig<ThemeColorMessageState>>
    | Partial<ThemeColorMessageState>
    | string;
}

export interface ThemeColorBorderItemsResolvedConfig {
  app: ThemeColorBorderSubItemResolvedConfig<ThemeColorSubItem>;
  banner: ThemeColorBorderSubItemResolvedConfig<ThemeColorSubItem>;
  message: ThemeColorBorderSubItemResolvedConfig<ThemeColorMessageState>;
}

export interface ThemeColorTypesUserConfig {
  text: Partial<ThemeColorTextItemsUserConfig> | string;
  border: Partial<ThemeColorBorderItemsUserConfig> | string;
}

export interface ThemeColorsResolvedConfig {
  text: ThemeColorTextItemsResolvedConfig;
  border: ThemeColorBorderItemsResolvedConfig;
}

export interface ThemeStyleBorderTypeConfig {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  top: string;
  bottom: string;
  left: string;
  right: string;
}

/**
 * The identifiers of border styles to use in the theme.
 *
 * @remarks
 * The available border styles are:
 * - `"single"`: Single line border (default)
 * - `"double"`: Double line border
 * - `"bold"`: Bold line border
 * - `"round"`: Rounded corner border
 * - `"single-double"`: Single line on top and bottom, double line on sides
 * - `"double-single"`: Double line on top and bottom, single line on sides
 * - `"classic"`: Classic ASCII style border
 * - `"pointer"`: Pointer style border
 * - `"arrow"`: Arrow style border
 * - `"outward-arrow"`: Outward arrow style border
 * - `"inward-arrow"`: Inward arrow style border (alias for `"arrow"`)
 * - `"double-arrow"`: Double arrow style border
 * - `"outward-double-arrow"`: Outward double arrow style border
 * - `"inward-double-arrow"`: Inward double arrow style border (alias for `"double-arrow"`)
 * - `"none"`: No border
 *
 * @see {@link https://www.npmjs.com/package/boxen | Boxen documentation}
 */
export type ThemeStyleBorderIdentifiers =
  | "single"
  | "double"
  | "bold"
  | "round"
  | "single-double"
  | "double-single"
  | "classic"
  | "pointer"
  | "arrow"
  | "outward-arrow"
  | "inward-arrow"
  | "double-arrow"
  | "outward-double-arrow"
  | "inward-double-arrow"
  | "none";

export type ThemeStyleBorderType =
  | ThemeStyleBorderIdentifiers
  | ThemeStyleBorderTypeConfig;

export interface ThemeBorderStyleMessageStateUserConfig {
  help: ThemeStyleBorderType;
  success: ThemeStyleBorderType;
  info: ThemeStyleBorderType;
  warning: ThemeStyleBorderType;
  danger: ThemeStyleBorderType;
  error: ThemeStyleBorderType;
}

export interface ThemeBorderStyleMessageStateResolvedConfig {
  help: ThemeStyleBorderTypeConfig;
  success: ThemeStyleBorderTypeConfig;
  info: ThemeStyleBorderTypeConfig;
  warning: ThemeStyleBorderTypeConfig;
  danger: ThemeStyleBorderTypeConfig;
  error: ThemeStyleBorderTypeConfig;
}

export interface ThemeBorderStyleSubItemUserConfig<TState extends object> {
  outline: Partial<TState> | ThemeStyleBorderType;
  divider: Partial<TState> | ThemeStyleBorderType;
}

export interface ThemeBorderStyleSubItemResolvedConfig<TState extends object> {
  outline: TState;
  divider: TState;
}

export interface ThemeBorderStyleSectionTypesUserConfig {
  primary: ThemeStyleBorderType;
  secondary: ThemeStyleBorderType;
  tertiary: ThemeStyleBorderType;
}

export interface ThemeBorderStyleSectionTypesResolvedConfig {
  primary: ThemeStyleBorderTypeConfig;
  secondary: ThemeStyleBorderTypeConfig;
  tertiary: ThemeStyleBorderTypeConfig;
}

export interface ThemeBorderStylesUserConfig {
  app:
    | ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
    | ThemeStyleBorderType;
  banner:
    | ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
    | ThemeStyleBorderType;
  message:
    | ThemeBorderStyleSubItemUserConfig<ThemeBorderStyleMessageStateUserConfig>
    | ThemeStyleBorderType;
}

export interface ThemeBorderStylesResolvedConfig {
  banner: ThemeBorderStyleSubItemResolvedConfig<ThemeBorderStyleSectionTypesResolvedConfig>;
  message: ThemeBorderStyleSubItemResolvedConfig<ThemeBorderStyleMessageStateResolvedConfig>;
  app: ThemeBorderStyleSubItemResolvedConfig<ThemeBorderStyleSectionTypesResolvedConfig>;
}

export interface ThemePaddingUserConfig {
  app: number;
  banner: number;
  message: number;
}

export interface ThemePaddingResolvedConfig {
  app: number;
  banner: number;
  message: number;
}

export interface ThemeIconMessageStateConfig {
  help: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  error: string;
}

export interface ThemeIconSubItemConfig {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface ThemeIconTypeUserConfig<TState extends object> {
  header: Partial<TState> | string;
}

export interface ThemeIconTypeResolvedConfig<TState extends object> {
  header: TState;
}

export interface ThemeIconsUserConfig {
  message: ThemeIconTypeUserConfig<ThemeIconMessageStateConfig> | string;
  banner: ThemeIconTypeUserConfig<ThemeIconSubItemConfig> | string;
}

export interface ThemeIconsResolvedConfig {
  message: ThemeIconTypeResolvedConfig<ThemeIconMessageStateConfig>;
  banner: ThemeIconTypeResolvedConfig<ThemeIconSubItemConfig>;
}

export interface ThemeLabelMessageStateConfig {
  help: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  error: string;
}

export interface ThemeLabelTypeUserConfig {
  header: Partial<ThemeLabelMessageStateConfig> | string;
}

export interface ThemeLabelTypeResolvedConfig {
  header: ThemeLabelMessageStateConfig;
}

export interface ThemeLabelsUserConfig {
  message: ThemeLabelTypeUserConfig | string;
}

export interface ThemeLabelsResolvedConfig {
  message: ThemeLabelTypeResolvedConfig;
}

export interface ThemeUserConfig {
  $theme?: string;
  colors?: Partial<ThemeColorTypesUserConfig> | string;
  borderStyles?: Partial<ThemeBorderStylesUserConfig> | ThemeStyleBorderType;
  padding?: Partial<ThemePaddingUserConfig> | number;
  icons?: Partial<ThemeIconsUserConfig> | string;
  labels?: Partial<ThemeLabelsUserConfig> | string;
}

export interface ThemeResolvedConfig {
  name: string;
  colors: ThemeColorsResolvedConfig;
  borderStyles: ThemeBorderStylesResolvedConfig;
  padding: ThemePaddingResolvedConfig;
  icons: ThemeIconsResolvedConfig;
  labels: ThemeLabelsResolvedConfig;
}
