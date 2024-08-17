import {type NFQColors, styled} from 'styled-components';

import type {darken, lighten, translucify} from '../colorManip';

type ThemeBaseColors = NFQColors['themeBaseColors'][keyof NFQColors['themeBaseColors']];
type ThemeFullColors = NFQColors['themeFullColors'][keyof NFQColors['themeFullColors']];

export type ThemeColor = ReturnType<typeof darken<ThemeBaseColors>>
| ReturnType<typeof lighten<ThemeBaseColors>>
| ReturnType<typeof translucify<ThemeBaseColors>>
| ThemeFullColors[keyof ThemeFullColors];

export interface ColorProps {
    /**
     * The color value to be applied to the text content.
     * The possible colors are determined by the pallette defined in the theme.
     */
    $color: ThemeColor;
}

/**
 * The Color component is a styled `<span>` component.
 *
 * @param props        The props of the component.
 * @param props.$color The color value to be applied to the text content.
 * @returns            A React component.
 *
 * @example
 * ```tsx
 * const App = () => {
 *     const colors = useThemeColors();
 *
 *     return <Color $color={colors.primaryFontColor}>Hello, World!</Color>;
 * };
 * ```
 */
export const Color = styled.span<ColorProps>`
    color: ${({$color}) => $color};
    transition: color 0.2s ease-in-out;
`;