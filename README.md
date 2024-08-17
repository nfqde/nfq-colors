<div id="top"></div>

# @nfq/colors

[![npm version](https://badge.fury.io/js/%40nfq%2Fcolors.svg)](https://badge.fury.io/js/%40nfq%2Fcolors)
[![npm downloads](https://img.shields.io/npm/dm/%40nfq%2Fcolors.svg)](https://www.npmjs.com/package/%40nfq%2Fcolors)
[![BundlePhobia](https://img.shields.io/bundlephobia/min/@nfq/colors)](https://bundlephobia.com/result?p=%40nfq%2Fcolors)
[![GitHub issues](https://img.shields.io/github/issues/nfqde/nfq-colors.svg)](https://www.npmjs.com/package/%40nfq%2Fcolors)
![GitHub contributors](https://img.shields.io/github/contributors/nfqde/nfq-colors.svg)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/license/mit/)
[![EsLint](https://github.com/nfqde/nfq-colors/actions/workflows/eslint.yml/badge.svg)](https://github.com/nfqde/nfq-colors/actions/workflows/eslint.yml)
[![Horusec](https://github.com/nfqde/nfq-colors/actions/workflows/horusec.yml/badge.svg)](https://github.com/nfqde/nfq-colors/actions/workflows/horusec.yml)
[![Cypress](https://github.com/nfqde/nfq-colors/actions/workflows/cypress.yml/badge.svg)](https://github.com/nfqde/nfq-colors/actions/workflows/cypress.yml)

---

* [About the project](#about-the-project)
  * [Installation](#installation)
  * [PeerDependencies](#peerdependencies)
* [Usage](#usage)
    * [Generating Themes](#generating-themes)
    * [Using the generated Themes in Styled Components](#using-the-generated-themes-in-styled-components)
    * [(Optional) Typescript Autocompletion](#optional-typescript-autocompletion)
    * [Personal Recommendation](#personal-recommendation)
    * [Usage in Styled components](#usage-in-styled-components)
    * [Color Manipulation](#color-manipulation)
    * [Using Theme Colors in Components](#using-theme-colors-in-components)
    * [The Color component](#the-color-component)
* [Props/Params](#propsparams)
    * [Color Component](#color-component)
    * [lighten](#lighten)
    * [darken](#darken)
    * [translucify](#translucify)
    * [generateThemes](#generatethemes)
* [Types](#types)
    * [BaseColor](#basecolor)
    * [ThemeColor](#themecolor)
    * [ThemeUnion](#themeunion)
* [Utilities](#utilities)
    * [lighten utility](#lighten-utility)
    * [darken utility](#darken-utility)
    * [translucify utility](#translucify-utility)
* [Contributions](#contributions)
* [License](#license)
* [Questions](#questions)

---

## About the project: [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

@nfq/colors is a comprehensive theming solution for React applications. It provides utilities for generating theme configurations, manipulating colors, and applying theme-specific styles.

### Installation

To install the package run

```sh
npm install @nfq/colors
```

if you are in yarn

```sh
yarn add @nfq/colors
```

or on pnpm

```sh
pnpm install @nfq/colors
```

### PeerDependencies

The following PeerDependencies are needed so the component does work:

* react >= 18
* react-dom >= 18
* styled-components >= 5

<p align="right">(<a href="#top">back to top</a>)</p>

---

## Usage

```javascript
import {
    Color,
    darken,
    generateThemes,
    lighten,
    translucify,
    useThemeColors
} from '@nfq/color';
```

### Generating Themes

```typescript
// Any global config file in your project. (e.g. src/utils/themes.ts)
import {generateThemes, lighten} from '@nfq/colors';

const BaseColors = {
    light: {
        primary: '#ffffff',
        secondary: '#cccccc'
    } as const,
    dark: {
        primary: '#000000',
        secondary: '#333333'
    } as const
} as const;

const DerivedColors = {
    light: {
        primaryLight: lighten(BaseColors.light.primary, 0.1)
    } as const,
    dark: {
        primaryLight: lighten(BaseColors.dark.primary, 0.1)
    } as const
} as const;

const Shadows = {
    light: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
    } as const,
    dark: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)'
    } as const
};

const {
    baseColors,
    globalCss,
    shadowColors,
    themeColors,
    themes
} = generateThemes(BaseColors, DerivedColors, Shadows, 'light', 'dark');
```
The `generateThemes` function takes three to five arguments: `BaseColors`, `DerivedColors`, `Shadows`, `default theme` and `prefers dark theme`. The `BaseColors` object contains theme colors for any theme you like. The names of the themes are defined by its respective property Name. The `DerivedColors` object contains any additional colors that are derived from the base colors. The `Shadows` object contains the shadow styles for the light and dark themes. The `default theme` defines the default theme to use if none is explicitely set and `prefers dark theme` arguments specify the name of the theme used if the user has set the prefers-color-scheme media query to dark (if you dont want to react to the user preference you can specify `false` here). If you only want to use the colors and auto complete functionallity you can also remove the theme names and specify your colors directly in the `BaseColors`, `DerivedColors` and `Shadows` object. If you do so and none of your objects use an theme name you can omit the last two arguments.

Themes can also only partially override each other. If you only want to override the primary color of the light theme you can do so like this:
```typescript
const BaseColors = {
    light: {
        primary: '#ffffff',
        secondary: '#cccccc'
    } as const,
    dark: {
        primary: '#000000'
    } as const
} as const;
```
With this definition the secondary color of the dark theme will be the same as the light theme.

The `generateThemes` function returns an object with the following properties:
* `baseColors`: The base colors for the themes remapped to css vars.
* `globalCss`: The global CSS styles you need to add to your global css so the css vars are defined.
* `shadowColors`: The shadow styles for the themes remapped to css vars.
* `themeColors`: The full (Base and Derived) theme colors for the themes remapped to css vars.
* `themes`: The default theme name. (Its only used to provide autocompletion in your IDE after you did the step [Typescript Autocompletion](#optional-typescript-autocompletion))

### Using the generated Themes in Styled Components.

```typescript
// in the file in which you create your Theme for the styled components ThemeProvider. (e.g. src/utils/globalStyles.ts)
import {createGlobalStyle} from 'styled-components';
import {globalCss, shadowColors, themeColors} from 'src/utils/themes.ts';

import type {DefaultTheme} from 'styled-components';

export const theme: DefaultTheme = {
    boxShadows: shadowColors,
    colors: themeColors
};

export const GlobalStyle = createGlobalStyle`
    ${globalCss}
`;
````
The `globalCss` is the global css used to define your css vars and theme selectors these have to get injected to your global css. The `themeColors` are the available colors over all themes defined remapped to css vars and can be accessed with the styled components theme object later. The `shadowColors` are the available shadow styles over all themes defined remapped to css vars and can be accessed with the styled components theme object later.

### (Optional) Typescript Autocompletion
Create a file in your project that overrides the styled components DefaultTheme interface. For example an `styled.d.ts` file in your project folder.
Add the following code to the file:

```typescript
// import the styled components types
import 'styled-components';
// import HTMLAttributes from react
import {HTMLAttributes} from 'react';

import type {baseColors, shadowColors, themeColors, themes} from 'src/utils/themes.ts';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        boxShadows: typeof shadowColors;
        colors: typeof themeColors;
    }

    export interface NFQColors {
        themeBaseColors: typeof baseColors;
        themeFullColors: typeof themeColors;
    }
}

declare module 'react' {
    interface HTMLAttributes<T> {
      // extends React's HTMLAttributes
      'data-nfq-theme'?: typeof themes;
    }
}
```
With this configuration you have access to the `theme.colors` object and the `theme.boxShadows` object in your styled components and you have autocompletion for the theme names in your IDE. Also the data-nfq-theme attribute is added to the HTMLAttributes so you can use it in your components to override the used theme for this component.

After that you can add the file to your includes in the tsconfig.json file like this:
```json
{
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/styled.d.ts"
    ]
}
```

### Personal Recommendation

To get the most out of the autocompletion you can also add comments like this to your color definition Objects:

```typescript
const BaseColors = {
    light: {
        /** Primary color for light theme. ![#ffffff](https://via.placeholder.com/12/ffffff/ffffff.png) `#ffffff`. */
        primary: '#ffffff',
        /** Secondary color for light theme. ![#cccccc](https://via.placeholder.com/12/cccccc/cccccc.png) `#cccccc`. */
        secondary: '#cccccc'
    } as const,
    dark: {
        /** Primary color for dark theme. ![#000000](https://via.placeholder.com/12/000000/000000.png) `#000000`. */
        primary: '#000000',
        /** Secondary color for dark theme. ![#333333](https://via.placeholder.com/12/333333/333333.png) `#333333`. */
        secondary: '#333333'
    } as const
} as const;
```
With this you can see the color in your IDE and also the hex code of the color. Also Intellisense and Typescript do merge the comments for the different themes so you can see the colors for all themes in one place.

### Usage in Styled components

```typescript
import styled from 'styled-components';

const StyledComponent = styled.div`
    background-color: ${({theme}) => theme.colors.primary};
    box-shadow: ${({theme}) => theme.boxShadows.boxShadow};
`;
```

As we added the keys color and boxShadows to the styled components theme used in the ThemeProvider we can access them in the styled components theme object.

### Color Manipulation

```typescript
import { darken, lighten, translucify } from '@nfq/colors';

const primaryColor = '#ff0000';

const darkerColor = darken(primaryColor, 20);
const lighterColor = lighten(primaryColor, 20);
const translucentColor = translucify(primaryColor, 50);
```
These methods are mainly for use in your theme generation. They are used to generate derived colors from your base colors. The `darken` and `lighten` functions take a color and a percentage as arguments and return a darker or lighter shade of the color. The `translucify` function takes a color and a percentage as arguments and returns a translucent version of the color.
More on that in the [Utilities](#utilities) section.

### Using Theme Colors in Components

```typescript
import { useThemeColors } from '@nfq/colors';

const MyComponent = () => {
  const themeColors = useThemeColors();

  return (
    <div style={{ backgroundColor: themeColors.primary }}>
      This div uses the primary theme color!
    </div>
  );
};
```
The `useThemeColors` hook returns the theme colors for the current theme. You can use it to access the theme colors in your components. Its only an shortcut for:
```typescript
import {useTheme} from 'styled-components';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <div style={{ backgroundColor: theme.colors.primary }}>
      This div uses the primary theme color!
    </div>
  );
};
```

### The Color component

```typescript
import {Color, useThemeColors} from '@nfq/colors';

const MyComponent = () => {
    const themeColors = useThemeColors();

    return (
        <div>
            <p>
                <Color $color={themeColors.primary}>This text has different</Color>{' '}
                <Color $color={themeColors.primary}>colors from our theme!</Color>
            </p>
        </div>
    );
};
```

The `Color` component is a styled component that takes a color prop and applies the color to the text. It is used to apply colors to text in your components.
Its an span with a color transition property automatically added. Also it provides you with type checking so you cant use an color in it thats not defined in your theme.

<p align="right">(<a href="#top">back to top</a>)</p>

---

## Props/Params

### Color Component

| Prop   | type                      | required           | Description                                        |
| ------ | ------------------------- | :----------------: | -------------------------------------------------- |
| $color | [ThemeColor](#themecolor) | :white_check_mark: | The color that should be used for its text content |

### lighten

| Param   | type                   | required           | Description                           |
| ------ | ----------------------- | :----------------: | ------------------------------------- |
| color  | [BaseColor](#basecolor) | :white_check_mark: | The color that should be made lighter |
| amount | number                  | :white_check_mark: | The amount of lightening in percent   |

### darken

| Param   | type                   | required           | Description                          |
| ------ | ----------------------- | :----------------: | ------------------------------------ |
| color  | [BaseColor](#basecolor) | :white_check_mark: | The color that should be made darker |
| amount | number                  | :white_check_mark: | The amount of darkening in percent   |

### translucify

| Param   | type                   | required           | Description                                             |
| ------ | ----------------------- | :----------------: | ------------------------------------------------------- |
| color  | [BaseColor](#basecolor) | :white_check_mark: | The color that should be made more translucent          |
| amount | number                  | :white_check_mark: | The amount of opacity in percent that should be removed |

### generateThemes

| Param            | type                                                 | required           | Description                                              |
| ---------------- | ---------------------------------------------------- | :----------------: | -------------------------------------------------------- |
| baseColors       | [ThemeUnion](#themeunion)                            | :white_check_mark: | The base colors for the themes                           |
| derivedColors    | [ThemeUnion](#themeunion)                            | :white_check_mark: | The derived colors for the themes                        |
| shadows          | [ThemeUnion](#themeunion)                            | :white_check_mark: | The shadow styles for the themes                         |
| defaultTheme     | string (dynamically derived from your themes)        |                    | The default theme to use if none is explicitely set      |
| prefersDarkTheme | string (dynamically derived from your themes)\|false |                    | The theme to use if the user prefers dark theme          |

<p align="right">(<a href="#top">back to top</a>)</p>

---

## Types

### BaseColor

All values of colors in your BaseColors object.

### ThemeColor

All values of colors in your BaseColors and DerivedColors object.

### ThemeUnion

```typescript
type ThemeConfig = {[key: string]: {[key: string]: string}};
type NoThemeConfig = {[key: string]: string};
type ThemeUnion = NoThemeConfig | ThemeConfig;
```
---

## Utilities

### lighten utility

```javascript
const DemoComponent = styled.div`
    background: ${({theme}) => lighten(theme.colors.header, 50)};
`;
```

The `lighten` function is a utility that lightens a given color by a specified percentage.  
It utilizes the CSS `color-mix` function to mix the provided color with white, achieving the desired lightening effect.
This function is especially beneficial for generating hover or active states for UI elements, ensuring consistent color manipulation across the application.

### darken utility

```javascript
const DemoComponent = styled.div`
    background: ${({theme}) => darken(theme.colors.header, 50)};
`;
```

The `darken` function is a utility that darkens a given color by a specified percentage.  
It leverages the CSS `color-mix` function to mix the provided color with black, achieving the desired darkening effect.
This function is particularly useful for generating hover or active states for UI elements, ensuring consistent color manipulation across the application.

### translucify utility

```javascript
const DemoComponent = styled.div`
    background: ${({theme}) => translucify(theme.colors.header, 50)};
`;
```

The `translucify` function is a utility designed to make a given color translucent by blending it with transparency.  
By leveraging the CSS `color-mix` function, it combines the provided color with a transparent color, resulting in a translucent version of the original color.
This function is particularly useful for creating semi-transparent overlays, backgrounds, or other UI elements that require a touch of transparency.

---

## Contributions

[Christoph Kruppe](https://github.com/ckruppe) - c.kruppe@nfq.de  

<p align="right">(<a href="#top">back to top</a>)</p>

---

## License

The licence used is: [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/license/mit/)  
Click on licence badge for licence details.

<p align="right">(<a href="#top">back to top</a>)</p>

---

## Questions

If you have any furter questions please contact me.

<p align="right">(<a href="#top">back to top</a>)</p>