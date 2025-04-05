import '@emotion/react';

enum Colors {
    testColor = '#000000'
}

declare module '@emotion/react' {
    export interface Theme {
        colors: Colors;
    }

    export interface NFQColors {
        themeBaseColors: Colors;
        themeFullColors: Colors;
    }
}