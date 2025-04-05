import {useTheme} from '@emotion/react';

import type {Theme} from '@emotion/react';

/**
 * Custom hook that provides access to the theme colors defined in the current theme.
 *
 * This hook uses the `useTheme` hook from a theme provider to retrieve the current theme object.
 * It returns the `colors` property from the theme, which contains the color definitions.
 *
 * @returns An object containing the color definitions from the current theme.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const colors = useThemeColors();
 *
 *   // Use the theme colors to style your component
 *   const backgroundColor = colors.background;
 *   const textColor = colors.text;
 *   // ...
 * };
 * ```
 */
export const useThemeColors = (): Theme['colors'] => {
    const theme = useTheme();

    return theme.colors;
};