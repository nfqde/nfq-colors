import '@emotion/react';
import type {BaseColorsType, themeColors, themes} from './dummyTheme';

declare module '@emotion/react' {
    export interface Theme {
        colors: typeof themeColors;
    }

    export interface NFQColors {
        themeBaseColors: BaseColorsType;
        themeFullColors: typeof themeColors;
    }
}

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
        // extends React's HTMLAttributes
        'data-nfq-theme'?: typeof themes;
    }
}