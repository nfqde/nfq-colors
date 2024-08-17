import {convertToThemeVars, generateThemeCss} from './themeColorHelpers';

import type {ThemeArgs, ThemeUnion} from './types/helperTypes';

export {Color} from './components/Color';
export {useThemeColors} from './hooks/useThemeColors';
export {darken, lighten, translucify} from './colorManip';
export {convertToThemeVars, generateThemeCss} from './themeColorHelpers';
export type {GetThemeType} from './types/helperTypes';

/**
 * Generates a theme configuration object containing CSS variables, global CSS, and theme-specific properties.
 *
 * This function is designed to streamline the process of creating a comprehensive theming setup. It converts color,
 * derived color, and shadow configurations into CSS variables, generates the corresponding global CSS for the themes,
 * and returns an object that can be used to apply and manage themes in an application.
 *
 * @param colors                An object representing the base color definitions, which could be either flat or organized by theme.
 * @param derivedColors         An object representing derived color definitions, either flat or organized by theme.
 * @param shadows               An object representing shadow definitions, either flat or organized by theme.
 * @param args                  An array containing additional arguments, such as the default theme and dark theme preferences.
 * @param args.defaultTheme     An string representing the default theme to be applied. If not exiting in the color objects and therefore not provided, the CSS will apply colors, derived colors, and shadows globally.
 * @param args.prefersDarkTheme A boolean or a theme name indicating whether to generate dark mode styles. If `false`, no dark mode styles are generated.
 *
 * @returns An object containing:
 * - `baseColors`: CSS variables for the base colors.
 * - `globalCss`: Global CSS block that includes the generated CSS variables and theme-specific styles.
 * - `shadowColors`: CSS variables for the shadow definitions.
 * - `themeColors`: Combined CSS variables for both the base and derived colors.
 * - `themes`: The default theme that is used to generate the global CSS.
 *
 * @example
 * ```ts
 * const colors = {
 *   light: { primary: '#ffffff', secondary: '#cccccc' },
 *   dark: { primary: '#000000', secondary: '#333333' }
 * };
 *
 * const derivedColors = {
 *   light: { primaryLight: '#f0f0f0' },
 *   dark: { primaryLight: '#1a1a1a' }
 * };
 *
 * const shadows = {
 *   light: { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
 *   dark: { boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)' }
 * };
 *
 * const themeConfig = generateThemes(colors, derivedColors, shadows, 'light', 'dark');
 *
 * console.log(themeConfig.baseColors); // CSS variables for base colors
 * console.log(themeConfig.globalCss); // Global CSS including theme and dark mode styles
 * console.log(themeConfig.shadowColors); // CSS variables for shadows
 * console.log(themeConfig.themeColors); // CSS variables for both base and derived colors
 * console.log(themeConfig.themes); // The theme that was used ('light')
 * ```
 */
export const generateThemes = <T extends ThemeUnion, D extends ThemeUnion, S extends ThemeUnion>(
    colors: T,
    derivedColors: D,
    shadows: S,
    ...args: ThemeArgs<T, D, S>
) => ({
        baseColors: convertToThemeVars(colors),
        globalCss: generateThemeCss(colors, derivedColors, shadows, ...args),
        shadowColors: convertToThemeVars(shadows),
        themeColors: convertToThemeVars(colors, derivedColors),
        themes: args[0]
    });