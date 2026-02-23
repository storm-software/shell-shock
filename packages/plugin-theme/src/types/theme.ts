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

import type { SpinnerPreset } from "../helpers/spinners";

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

export interface ThemeColorSpinnerState {
  active: string;
  error: string;
  success: string;
  help: string;
  info: string;
  warning: string;
}

export interface ThemeColorDescriptionPromptState extends ThemeColorPromptLabelState {
  inactive: string;
}

export interface ThemeColorInputPromptState extends ThemeColorDescriptionPromptState {
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

export interface ThemeColorSpinnerSubItemUserConfig {
  icon: Partial<ThemeColorSpinnerState> | string;
  message: Partial<ThemeColorSpinnerState> | string;
}

export interface ThemeColorSpinnerSubItemResolvedConfig {
  icon: ThemeColorSpinnerState;
  message: ThemeColorSpinnerState;
}

export interface ThemeColorTextItemsUserConfig {
  banner: Partial<ThemeColorBannerSubItemUserConfig> | string;
  heading: Partial<ThemeColorSubItem> | string;
  body: Partial<ThemeColorBodySubItem> | string;
  message: Partial<ThemeColorMessageSubItemUserConfig> | string;
  usage: Partial<ThemeColorUsageSubItem> | string;
  prompt: Partial<ThemeColorPromptSubItemUserConfig> | string;
  spinner: Partial<ThemeColorSpinnerSubItemUserConfig> | string;
}

export interface ThemeColorTextItemsResolvedConfig {
  banner: ThemeColorBannerSubItemResolvedConfig;
  heading: ThemeColorSubItem;
  body: ThemeColorBodySubItem;
  message: ThemeColorMessageSubItemResolvedConfig;
  usage: ThemeColorUsageSubItem;
  prompt: ThemeColorPromptSubItemResolvedConfig;
  spinner: ThemeColorSpinnerSubItemResolvedConfig;
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
  meta?: Record<string, any>;
}

export type ThemeStyleBorderBaseIdentifiers =
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
  | "inward-double-arrow";

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
 * - `"single-corners"`: Single line border with single line corners
 * - `"double-corners"`: Double line border with double line corners
 * - `"bold-corners"`: Bold line border with bold line corners
 * - `"round-corners"`: Rounded corner border with rounded corners
 * - `"diagonal-corners"`: Diagonal line border with diagonal corners
 * - `"diagonal-thick-corners"`: Thick diagonal line border with diagonal corners
 * - `"single-double-corners"`: Single line on top and bottom, double line on sides, with corners
 * - `"double-single-corners"`: Double line on top and bottom, single line on sides, with corners
 * - `"classic-corners"`: Classic ASCII style border with corners
 * - `"pointer-corners"`: Pointer style border with corners
 * - `"arrow-corners"`: Arrow style border with corners
 * - `"outward-arrow-corners"`: Outward arrow style border with corners
 * - `"inward-arrow-corners"`: Inward arrow style border with corners (alias for `"arrow-corners"`)
 * - `"double-arrow-corners"`: Double arrow style border with corners
 * - `"outward-double-arrow-corners"`: Outward double arrow style border with corners
 * - `"inward-double-arrow-corners"`: Inward double arrow style border with corners (alias for `"double-arrow-corners"`)
 * - `"none"`: No border
 *
 * @see {@link https://www.npmjs.com/package/boxen | Boxen documentation}
 */
export type ThemeStyleBorderIdentifiers =
  | ThemeStyleBorderBaseIdentifiers
  | `${ThemeStyleBorderBaseIdentifiers}-corners`
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

export interface ThemeIconPromptStateConfig {
  active: string;
  warning: string;
  error: string;
  submitted: string;
  cancelled: string;
  disabled: string;
}

export interface ThemeIconSpinnerStateConfig {
  help: string;
  success: string;
  info: string;
  warning: string;
  error: string;
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
  prompt: Partial<ThemeIconPromptStateConfig> | string;
  spinner: Partial<ThemeIconSpinnerStateConfig> | string;
}

export interface ThemeIconsResolvedConfig {
  message: ThemeIconTypeResolvedConfig<ThemeIconMessageStateConfig>;
  banner: ThemeIconTypeResolvedConfig<ThemeIconSubItemConfig>;
  prompt: ThemeIconPromptStateConfig;
  spinner: ThemeIconSpinnerStateConfig;
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

export interface ThemeSpinnerUserConfig {
  /**
   * The interval in milliseconds between each frame of the spinner animation.
   *
   * @defaultValue 80
   */
  interval?: number;

  /**
   * An array of strings representing the frames of the spinner animation. Each string is a frame that will be displayed in sequence to create the animation effect.
   */
  frames: string[];
}

export type ThemeSpinnerResolvedConfig = Required<ThemeSpinnerUserConfig>;

export interface ThemeUserConfig {
  $theme?: string;
  colors?: Partial<ThemeColorTypesUserConfig> | string;
  borderStyles?: Partial<ThemeBorderStylesUserConfig> | ThemeStyleBorderType;
  padding?: Partial<ThemePaddingUserConfig> | number;
  icons?: Partial<ThemeIconsUserConfig> | string;
  labels?: Partial<ThemeLabelsUserConfig> | string;
  spinner?: ThemeSpinnerUserConfig | SpinnerPreset;
  settings?: Record<string, unknown>;
}

export interface ThemeResolvedConfig {
  name: string;
  colors: ThemeColorsResolvedConfig;
  borderStyles: ThemeBorderStylesResolvedConfig;
  padding: ThemePaddingResolvedConfig;
  icons: ThemeIconsResolvedConfig;
  labels: ThemeLabelsResolvedConfig;
  spinner: ThemeSpinnerResolvedConfig;
  settings: Record<string, unknown>;
  [key: string]: unknown;
}
