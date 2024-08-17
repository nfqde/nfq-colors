import type {NFQColors} from 'styled-components';

type ThemeColors = NFQColors['themeBaseColors'][keyof NFQColors['themeBaseColors']];

/**
 * The `darken` function is a utility that darkens a given color by a specified percentage.
 * It leverages the CSS `color-mix` function to mix the provided color with black, achieving the desired darkening effect.
 * This function is particularly useful for generating hover or active states for UI elements, ensuring consistent color manipulation across the application.
 * It's essential to provide a valid color string and a percentage value to get the expected result.
 *
 * @param color      The color value from the theme's color palette that needs to be darkened.
 * @param percentage The percentage by which the color should be darkened. It should be a value between 0 and 100.
 * @returns A string representing the darkened color.
 *
 * @throws Throws an error if the provided color is not of type string.
 *
 * @example
 * ```tsx
 * const darkenedColor = darken(theme.colors.primary, 10);
 * ```
 */
export const darken = <const T extends ThemeColors>(color: T, percentage: number) => {
    if (typeof color !== 'string') throw new Error('Color must be of type string');

    return `color-mix(in srgb, ${color}, black ${percentage}%)` as const;
};

/**
 * The `lighten` function is a utility that lightens a given color by a specified percentage.
 * It utilizes the CSS `color-mix` function to mix the provided color with white, achieving the desired lightening effect.
 * This function is especially beneficial for generating hover or active states for UI elements, ensuring consistent color manipulation across the application.
 * To achieve the desired lightening effect, it's crucial to provide a valid color string and a percentage value.
 *
 * @param color      The color value from the theme's color palette that needs to be lightened.
 * @param percentage The percentage by which the color should be lightened. It should be a value between 0 and 100.
 * @returns A string representing the lightened color.
 *
 * @throws Throws an error if the provided color is not of type string.
 *
 * @example
 * ```tsx
 * const lightenedColor = lighten(theme.colors.primary, 10);
 * ```
 */
export const lighten = <const T extends ThemeColors>(color: T, percentage: number) => {
    if (typeof color !== 'string') throw new Error('Color must be of type string');

    return `color-mix(in srgb, ${color}, white ${percentage}%)` as const;
};

/**
 * The `translucify` function is a utility designed to make a given color translucent by blending it with transparency.
 * By leveraging the CSS `color-mix` function, it combines the provided color with a transparent color, resulting in a translucent version of the original color.
 * This function is particularly useful for creating semi-transparent overlays, backgrounds, or other UI elements that require a touch of transparency.
 * To achieve the desired translucency, it's essential to provide a valid color string and a percentage value.
 *
 * @param color      The color value from the theme's color palette that needs to be made translucent.
 * @param percentage The percentage of translucency desired. It should be a value between 0 (fully transparent) and 100 (fully opaque).
 * @returns A string representing the translucent color.
 *
 * @throws Throws an error if the provided color is not of type string.
 *
 * @example
 * ```tsx
 * const translucentColor = translucify(theme.colors.primary, 50);
 * ```
 */
export const translucify = <const T extends ThemeColors>(color: T, percentage: number) => {
    if (typeof color !== 'string') throw new Error('Color must be of type string');

    return `color-mix(in srgb, ${color} ${percentage}%, transparent)` as const;
};