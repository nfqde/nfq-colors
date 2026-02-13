import {generateThemes} from '../src/index';

import type {GetThemeType} from '../src/types/helperTypes';

export const BaseColors = {
    /** Error color. ![#000000](https://dummyimage.com/12/000000/000000.png) `#000000`. */
    testColor: '#000000'
} as const;

export const DerivedColors = {} as const;

export const BoxShadows = {} as const;

export type BaseColorsType = GetThemeType<typeof BaseColors>;
export const {
    globalCss,
    shadows,
    themeColors,
    themes
} = generateThemes({
    baseColors: BaseColors,
    derivedColors: DerivedColors,
    shadows: BoxShadows
});