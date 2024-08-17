/* eslint-disable security/detect-object-injection */
import {css} from 'styled-components';

import {generateCssVariables, generateThemeCssSelector} from './utils';

import type {GetThemeType, NoThemeConfig, ThemeArgs, ThemeConfig, ThemeUnion} from './types/helperTypes';

/**
 * Converts a set of color definitions into CSS variable references.
 *
 * This function takes in two objects: `colors` and `derivedColors`, which represent the theme's primary colors and derived
 * colors (e.g., shades, tints), respectively. It converts the keys of these objects into CSS variable references, prefixed with `var(--key)`.
 *
 * The function first checks whether the first value in each of these objects is itself an object (i.e., whether the colors are grouped by themes).
 * If so, it extracts the values to create a unified object of color mappings. It then generates an object where each key is mapped to a corresponding
 * CSS variable reference.
 *
 * @param colors        An object or nested object representing the primary color definitions for a theme. The keys are the color names, and the values are the color values.
 * @param derivedColors An optional object or nested object representing additional or derived color definitions (e.g., shades or tints).
 *
 * @returns An object where each key from `colors` and `derivedColors` is mapped to a corresponding CSS variable reference.
 *
 * @example
 * ```ts
 * const colors = {
 *   primary: '#ff0000',
 *   secondary: '#00ff00'
 * };
 *
 * const derivedColors = {
 *   lightPrimary: '#ffcccc',
 *   darkPrimary: '#cc0000'
 * };
 *
 * const themeVars = convertToThemeVars(colors, derivedColors);
 * console.log(themeVars);
 * // Outputs:
 * // {
 * //   primary: 'var(--primary)',
 * //   secondary: 'var(--secondary)',
 * //   lightPrimary: 'var(--lightPrimary)',
 * //   darkPrimary: 'var(--darkPrimary)'
 * // }
 * ```
 */
export const convertToThemeVars = <T extends ThemeUnion, D extends ThemeUnion>(
    colors: T,
    derivedColors: D = {} as D
) => {
    const isFirstColorKeyObject = typeof Object.values(colors)[0] === 'object'
        && !Array.isArray(Object.values(colors)[0]);
    const isFirstDerivedKeyObject = typeof Object.values(derivedColors)[0] === 'object'
        && !Array.isArray(Object.values(derivedColors)[0]);

    const ColorsToMap: NoThemeConfig = {
        ...(isFirstColorKeyObject ? Object.values(colors)[0] : colors),
        ...(isFirstDerivedKeyObject ? Object.values(derivedColors)[0] : derivedColors)
    } as NoThemeConfig;

    return Object.entries(ColorsToMap).reduce((acc, [key]) => {
        acc[key as keyof typeof ColorsToMap] = `var(--${key})` as const;
        return acc;
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as GetThemeType<T> & GetThemeType<D>);
};

/**
 * Generates CSS for theming based on the provided color, derived color, and shadow configurations.
 *
 * This function creates CSS styles that define variables for different themes. It generates the CSS variables for the
 * root theme, optionally creates a dark mode version using media queries, and can handle multiple theme variations
 * based on the provided themes.
 *
 * @param colors                An object representing the base color definitions, which could be either flat or organized by theme.
 * @param derivedColors         An object representing derived color definitions (e.g., lighter or darker shades), either flat or organized by theme.
 * @param shadows               An object representing shadow definitions, either flat or organized by theme.
 * @param args                  An array containing additional arguments, such as the default theme and dark theme preferences.
 * @param args.defaultTheme     An string representing the default theme to be applied. If not exiting in the color objects and therefore not provided, the CSS will apply colors, derived colors, and shadows globally.
 * @param args.prefersDarkTheme A boolean or a theme name indicating whether to generate dark mode styles. If `false`, no dark mode styles are generated.
 *
 * @returns A CSS block with variables for root theme, dark theme, and additional theme selectors if applicable.
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
 * const css = generateThemeCss(colors, derivedColors, shadows, 'light', 'dark');
 * ```
 */
export const generateThemeCss = <T extends ThemeUnion, D extends ThemeUnion, S extends ThemeUnion>(
    colors: T,
    derivedColors: D,
    shadows: S,
    ...args: ThemeArgs<T, D, S>
) => {
    const defaultTheme = args[0] ? args[0] : undefined;
    const prefersDarkTheme = args[1] ? args[1] : false;

    if (!defaultTheme) {
        const themeColors = {
            ...colors,
            ...derivedColors,
            ...shadows
        };

        return css`
            :root {
                ${generateCssVariables(themeColors as NoThemeConfig)}
            }
        `;
    }

    const colorHasThemes = defaultTheme in colors;
    const derivedHasThemes = defaultTheme in derivedColors;
    const shadowHasThemes = defaultTheme in shadows;
    const defaultThemeColors = {
        ...(colorHasThemes ? (colors as ThemeConfig)[defaultTheme] : colors),
        ...(derivedHasThemes ? (derivedColors as ThemeConfig)[defaultTheme] : derivedColors),
        ...(shadowHasThemes ? (shadows as ThemeConfig)[defaultTheme] : shadows)
    };

    const rootCss = css`
        :root {
            ${generateCssVariables(defaultThemeColors as NoThemeConfig)}
        }
    `;

    let darkCss = css``;
    let colorThemes = '';
    let derivedThemes = '';
    let shadowThemes = '';

    if (prefersDarkTheme) {
        const darkThemeColors = {
            ...(colorHasThemes ? (colors as ThemeConfig)[prefersDarkTheme] : {}),
            ...(derivedHasThemes ? (derivedColors as ThemeConfig)[prefersDarkTheme] : {}),
            ...(shadowHasThemes ? (shadows as ThemeConfig)[prefersDarkTheme] : {})
        };

        darkCss = css`
            @media (prefers-color-scheme: dark) {
                :root {
                    ${generateCssVariables(darkThemeColors as NoThemeConfig)}
                }
            }
        `;
    }

    if (colorHasThemes) {
        colorThemes = generateThemeCssSelector(colors as ThemeConfig);
    }
    if (derivedHasThemes) {
        derivedThemes = generateThemeCssSelector(derivedColors as ThemeConfig);
    }
    if (shadowHasThemes) {
        shadowThemes = generateThemeCssSelector(shadows as ThemeConfig);
    }

    return css`
        ${rootCss}
        ${darkCss}
        ${colorThemes}
        ${derivedThemes}
        ${shadowThemes}
    `;
};