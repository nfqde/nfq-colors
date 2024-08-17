import 'styled-components';

enum Colors {
    testColor = '#000000'
}

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: Colors;
    }

    export interface NFQColors {
        themeBaseColors: Colors;
        themeFullColors: Colors;
    }
}