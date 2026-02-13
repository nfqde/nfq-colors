import styled from '@emotion/styled';

import type {darken, lighten, translucify} from '../colorManip';
import type {NFQColors} from '@emotion/react';

type ThemeBaseColors = NFQColors['themeBaseColors'][keyof NFQColors['themeBaseColors']];
type ThemeFullColors = NFQColors['themeFullColors'][keyof NFQColors['themeFullColors']];

export type ThemeColor = ReturnType<typeof darken<ThemeBaseColors>>
| ReturnType<typeof lighten<ThemeBaseColors>>
| ReturnType<typeof translucify<ThemeBaseColors>>
| ThemeFullColors;

export interface ColorProps {
    /**
     * The color value to be applied to the text content.
     * The possible colors are determined by the pallette defined in the theme.
     */
    $color: ThemeColor;
    /**
     * Optional transition duration for the color change. This can be used to specify how long the color transition should take when the color changes.
     * The value should be a valid CSS time value (e.g., '0.2s', '200ms').
     * If not provided, the default transition duration will be 0.2 seconds.
     *
     * @default '0.2s'
     */
    $transitionDuration?: string;
}

/**
 * A styled span component that renders text with a specified theme color and smooth color transitions.
 * This component is designed to work with the NFQ color system and provides consistent theming across the application.
 * It automatically applies transition animations when the color changes, making color updates visually smooth.
 *
 * @param props                     The properties for the Color component, including the color to be applied and an optional transition duration.
 * @param props.$color              The color value to be applied to the text content. This should be a valid color from the theme's color palette.
 * @param props.$transitionDuration An optional string that specifies the duration of the color transition. It should be a valid CSS time value (e.g., '0.2s', '200ms'). If not provided, it defaults to '0.2s'.
 * @returns A styled span element with color and transition properties applied.
 *
 * @example
 * ```tsx
 * <Color $color="primary.500">This text will be colored</Color>
 * <Color $color="secondary.300" $transitionDuration="0.5s">Slower transition</Color>
 * ```
 */
export const Color = styled.span<ColorProps>`
    color: ${({$color}) => $color};
    transition: color ${({$transitionDuration}) => $transitionDuration ?? '0.2s'} ease-in-out;
`;