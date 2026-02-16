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
  | "debug"
  | "warning"
  | "danger"
  | "error";

export type ThemeColorVariant = "primary" | "secondary" | "tertiary";

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
  debug: string;
  warning: string;
  danger: string;
  error: string;
}

export interface ThemeColorPromptLabelState {
  active: string;
  warning: string;
  error: string;
  submitted: string;
  cancelled: string;
  disabled: string;
}

export interface ThemeColorDescriptionPromptState
  extends ThemeColorPromptLabelState {
  inactive: string;
}

export interface ThemeColorInputPromptState
  extends ThemeColorDescriptionPromptState {
  placeholder: string;
}

export interface ThemeColorBannerSubItemUserConfig {
  title: Partial<ThemeColorSubItem> | string;
  link: Partial<ThemeColorSubItem> | string;
  header: Partial<ThemeColorSubItem> | string;
  footer: Partial<ThemeColorSubItem> | string;
  command: Partial<ThemeColorSubItem> | string;
  description: Partial<ThemeColorSubItem> | string;
}

export interface ThemeColorBannerSubItemResolvedConfig {
  title: ThemeColorSubItem;
  link: ThemeColorSubItem;
  header: ThemeColorSubItem;
  footer: ThemeColorSubItem;
  command: ThemeColorSubItem;
  description: ThemeColorSubItem;
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
  dynamic: string;
  options: string;
  arguments: string;
  description: string;
}

export interface ThemeColorPromptSubItemUserConfig {
  icon: Partial<ThemeColorPromptLabelState> | string;
  message: Partial<ThemeColorPromptLabelState> | string;
  input: Partial<ThemeColorInputPromptState> | string;
  description: Partial<ThemeColorDescriptionPromptState> | string;
}

export interface ThemeColorPromptSubItemResolvedConfig {
  icon: ThemeColorPromptLabelState;
  message: ThemeColorPromptLabelState;
  input: ThemeColorInputPromptState;
  description: ThemeColorDescriptionPromptState;
}

export interface ThemeColorTextItemsUserConfig {
  banner: Partial<ThemeColorBannerSubItemUserConfig> | string;
  heading: Partial<ThemeColorSubItem> | string;
  body: Partial<ThemeColorBodySubItem> | string;
  message: Partial<ThemeColorMessageSubItemUserConfig> | string;
  usage: Partial<ThemeColorUsageSubItem> | string;
  prompt: Partial<ThemeColorPromptSubItemUserConfig> | string;
}

export interface ThemeColorTextItemsResolvedConfig {
  banner: ThemeColorBannerSubItemResolvedConfig;
  heading: ThemeColorSubItem;
  body: ThemeColorBodySubItem;
  message: ThemeColorMessageSubItemResolvedConfig;
  usage: ThemeColorUsageSubItem;
  prompt: ThemeColorPromptSubItemResolvedConfig;
}

export interface ThemeColorBorderSubItemUserConfig<TState extends object> {
  outline: Partial<TState> | string;
  divider: Partial<TState> | string;
}

export interface ThemeColorBorderAppSubItemUserConfig<TState extends object> {
  table: Partial<TState> | string;
  divider: Partial<TState> | string;
}

export interface ThemeColorBorderSubItemResolvedConfig<TState extends object> {
  outline: TState;
  divider: TState;
}

export interface ThemeColorBorderAppSubItemResolvedConfig<
  TState extends object
> {
  table: TState;
  divider: TState;
}

export interface ThemeColorBorderItemsUserConfig {
  app:
    | Partial<ThemeColorBorderAppSubItemUserConfig<ThemeColorSubItem>>
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
  app: ThemeColorBorderAppSubItemResolvedConfig<ThemeColorSubItem>;
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
 * - `"diagonal"`: Diagonal line border
 * - `"diagonal-thick"`: Thick diagonal line border
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
  | "diagonal"
  | "diagonal-thick"
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
  debug: ThemeStyleBorderType;
  warning: ThemeStyleBorderType;
  danger: ThemeStyleBorderType;
  error: ThemeStyleBorderType;
}

export interface ThemeBorderStyleMessageStateResolvedConfig {
  help: ThemeStyleBorderTypeConfig;
  success: ThemeStyleBorderTypeConfig;
  info: ThemeStyleBorderTypeConfig;
  debug: ThemeStyleBorderTypeConfig;
  warning: ThemeStyleBorderTypeConfig;
  danger: ThemeStyleBorderTypeConfig;
  error: ThemeStyleBorderTypeConfig;
}

export interface ThemeBorderStyleSubItemUserConfig<TState extends object> {
  outline: Partial<TState> | ThemeStyleBorderType;
  divider: Partial<TState> | ThemeStyleBorderType;
}

export interface ThemeBorderStyleAppSubItemUserConfig<TState extends object> {
  table: Partial<TState> | ThemeStyleBorderType;
  divider: Partial<TState> | ThemeStyleBorderType;
}

export interface ThemeBorderStyleSubItemResolvedConfig<TState extends object> {
  outline: TState;
  divider: TState;
}

export interface ThemeBorderStyleAppSubItemResolvedConfig<
  TState extends object
> {
  table: TState;
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
    | ThemeBorderStyleAppSubItemUserConfig<ThemeBorderStyleSectionTypesUserConfig>
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
  app: ThemeBorderStyleAppSubItemResolvedConfig<ThemeBorderStyleSectionTypesResolvedConfig>;
}

export interface ThemePaddingUserConfig {
  app: number;
  banner: number;
  message: number;
  table: number;
}

export interface ThemePaddingResolvedConfig {
  app: number;
  banner: number;
  message: number;
  table: number;
}

export interface ThemeIconMessageStateConfig {
  help: string;
  success: string;
  info: string;
  debug: string;
  warning: string;
  danger: string;
  error: string;
}

export interface ThemeIconSubItemConfig {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface ThemeIconPromptState {
  active: string;
  warning: string;
  error: string;
  submitted: string;
  cancelled: string;
  disabled: string;
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
  prompt: Partial<ThemeIconPromptState> | string;
}

export interface ThemeIconsResolvedConfig {
  message: ThemeIconTypeResolvedConfig<ThemeIconMessageStateConfig>;
  banner: ThemeIconTypeResolvedConfig<ThemeIconSubItemConfig>;
  prompt: ThemeIconPromptState;
}

export interface ThemeLabelMessageStateConfig {
  help: string;
  success: string;
  info: string;
  debug: string;
  warning: string;
  danger: string;
  error: string;
}

export interface ThemeLabelBannerSubItemConfig {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface ThemeLabelTypeUserConfig<TState extends object> {
  header: Partial<TState> | string;
  footer?: Partial<TState> | string;
}

export interface ThemeLabelTypeResolvedConfig<TState extends object> {
  header: TState;
  footer: Partial<TState>;
}

export interface ThemeLabelsUserConfig {
  message: ThemeLabelTypeUserConfig<ThemeLabelMessageStateConfig> | string;
  banner: ThemeLabelTypeUserConfig<ThemeLabelBannerSubItemConfig> | string;
}

export interface ThemeLabelsResolvedConfig {
  message: ThemeLabelTypeResolvedConfig<ThemeLabelMessageStateConfig>;
  banner: ThemeLabelTypeResolvedConfig<ThemeLabelBannerSubItemConfig>;
}

export interface ThemeUserConfig {
  $theme?: string;
  colors?: Partial<ThemeColorTypesUserConfig> | string;
  borderStyles?: Partial<ThemeBorderStylesUserConfig> | ThemeStyleBorderType;
  padding?: Partial<ThemePaddingUserConfig> | number;
  icons?: Partial<ThemeIconsUserConfig> | string;
  labels?: Partial<ThemeLabelsUserConfig> | string;
  settings?: Record<string, unknown>;
}

export interface ThemeResolvedConfig {
  name: string;
  colors: ThemeColorsResolvedConfig;
  borderStyles: ThemeBorderStylesResolvedConfig;
  padding: ThemePaddingResolvedConfig;
  icons: ThemeIconsResolvedConfig;
  labels: ThemeLabelsResolvedConfig;
  settings: Record<string, unknown>;
  [key: string]: unknown;
}
