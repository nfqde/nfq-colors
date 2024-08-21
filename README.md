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
    * [Forcing a Theme](#forcing-a-theme)
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

import type {GetThemeType} from '@nfq/colors';

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

export type BaseColorsType = GetThemeType<typeof BaseColors>;
export const {
    globalCss,
    shadows,
    themeColors,
    themes
} = generateThemes({
    baseColors: BaseColors,
    derivedColors: DerivedColors,
    shadows: Shadows,
    defaultTheme: 'light',
    prefersDarkTheme: 'dark'
});
```
The `generateThemes` function takes one config argument. (Documentation: [Configuration](#configuration)). </br>
The `baseColors` option contains theme colors for any theme you want. The names of the themes are defined by it's respective property name. </br>
The `derivedColors` option contains any additional colors that are derived from the base colors. </br>
The `shadows` option contains the shadow styles for the light and dark themes. </br>
The `defaultTheme` defines the default theme to use if none is explicitely set. If you only need the colors and autocomplete feature, you can skip theme names. You can just add your colors in baseColors, derivedColors, and shadows. If none of your objects use a theme name, you can leave out the other options.

Themes can also only partially override each other. If you want to override the primary color of the light theme you can do so like this:
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
With this definition the secondary color of the dark theme will be the same as in the light theme.

The `BaseColorsType` type is a type that contains the colors of the base colors object. It is used to provide autocompletion and assurance that only these colors are used in the `darken`, `lighten` and `translucify` functions.

The `generateThemes` function returns an object with the following properties:
* `globalCss`: The global CSS styles you need to add to your global css so the css vars are defined.
* `shadowColors`: The shadow styles for the themes remapped to css vars.
* `themeColors`: The full (Base and Derived) theme colors for the themes remapped to css vars.
* `themes`: The default theme name. (Its only used to provide autocompletion in your IDE after you did the step [Typescript Autocompletion](#optional-typescript-autocompletion))

### Using the generated Themes in Styled Components.

```typescript
// in the file in which you create your Theme for the styled components ThemeProvider. (e.g. src/utils/globalStyles.ts)
import {createGlobalStyle} from 'styled-components';
import {globalCss, shadows, themeColors} from 'src/utils/themes.ts';

import type {DefaultTheme} from 'styled-components';

export const theme: DefaultTheme = {
    boxShadows: shadows,
    colors: themeColors
};

export const GlobalStyle = createGlobalStyle`
    ${globalCss}
`;
````
The `globalCss` is the global css used to define your css vars and theme selectors. These have to get injected to your global css. </br>
The `themeColors` include all the available colors across all themes. They get remapped to css vars and can be accessed with the styled components theme object later. </br>
The `shadows` include all the available shadow styles across all themes. They get remapped to css vars and can be accessed with the styled components theme object later.

### (Optional) Typescript Autocompletion
Create a file in your project that overrides the styled components DefaultTheme interface. For example a `styled.d.ts` file in your project folder.
Add the following code to the file:

```typescript
// import the styled components types
import 'styled-components';
// import HTMLAttributes from react
import {HTMLAttributes} from 'react';

import type {BaseColorsType, shadows, themeColors, themes} from 'src/utils/themes.ts';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        boxShadows: typeof shadows;
        colors: typeof themeColors;
    }

    export interface NFQColors {
        themeBaseColors: BaseColorsType;
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
With this configuration you have access to the `theme.colors` object and the `theme.boxShadows` object in your styled components and you have autocompletion for the theme names in your IDE. Also the data-nfq-theme attribute is added to the HTMLAttributes so you can use it in your components to override current theme for this component.

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
These methods are mostly used for theme generation. They create derived colors from your base colors. The `darken` and `lighten` functions take a color and a percentage as arguments. They return a darker or lighter shade of the color. The `translucify` function also takes a color and a percentage as arguments. It returns a translucent version of the color. </br>
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
The `useThemeColors` hook returns the theme colors for the current theme. You can use it to access the theme colors in your components. It's only a shortcut for:
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
It is a span element with a color transition property, which is automatically added. It also provides you with type checking, so you can't use a color in it that's not defined in your theme.

### Forcing a Theme
```typescript
const MyComponent = () => {
    const themeColors = useThemeColors();

    return (
        <div data-nfq-theme="light">
            <p>
                This text has different colors from our theme!
            </p>
        </div>
    );
};
```
With the data-nfq-theme attribute you can force a theme on a html component and all it's children. This is useful if you want to use a theme for a component that is different from the current theme. Or you want to switch themes inbetween the components.

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

| Param  | type                          | required           | Description                       |
| ------ | ----------------------------- | :----------------: | --------------------------------- |
| config | [ConfigObject](#configobject) | :white_check_mark: | The config object for your themes |

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

### ConfigObject
```typescript
type ConfigObject = {
    baseColors: ThemeUnion;
    derivedColors: ThemeUnion;
    shadows: ThemeUnion;
    defaultTheme?: 'Union' | 'of' | 'your' | 'themes'; // Only optional if all color objects dont have an theme name
    prefersDarkTheme?: 'Union' | 'of' | 'your' | 'themes';
    highContrastTheme?: 'Union' | 'of' | 'your' | 'themes';
    lowContrastTheme?: 'Union' | 'of' | 'your' | 'themes';
    customContrastTheme?: 'Union' | 'of' | 'your' | 'themes';
};
```
---

## Utilities

### lighten utility

```typescript
const DemoComponent = styled.div`
    background: ${({theme}) => lighten(theme.colors.header, 50)};
`;
```

The `lighten` function is a utility that lightens a given color by a specified percentage.  </br>
It utilizes the CSS `color-mix` function to mix the provided color with white, achieving the desired lightening effect. </br>
This function is especially beneficial for generating hover or active states for UI elements, ensuring consistent color manipulation across the application.

### darken utility

```typescript
const DemoComponent = styled.div`
    background: ${({theme}) => darken(theme.colors.header, 50)};
`;
```

The `darken` function is a utility that darkens a given color by a specified percentage.  </br>
It leverages the CSS `color-mix` function to mix the provided color with black, achieving the desired darkening effect. </br>
This function is particularly useful for generating hover or active states for UI elements, ensuring consistent color manipulation across the application.

### translucify utility

```typescript
const DemoComponent = styled.div`
    background: ${({theme}) => translucify(theme.colors.header, 50)};
`;
```

The `translucify` function is a utility designed to make a given color translucent by blending it with transparency.  </br>
By leveraging the CSS `color-mix` function, it combines the provided color with a transparent color, resulting in a translucent version of the original color. </br>
This function is particularly useful for creating semi-transparent overlays, backgrounds, or other UI elements that require a touch of transparency.

---

## Configuration

You can define some things about the themes that can be generated. Here all options you can define:

### baseColors

The Base of your theme. You can define the colors for each theme you want to use. The theme names are the property names of the object. The colors are the property values of the theme objects. You can define as many themes as you like. If you dont want to generate themes you can define the color names directly instead of the theme names. The BaseColors is used as base for the DerivedColors.

### derivedColors

The Derived colors of your theme. You can define the colors for each theme you want to use. The theme names are the property names of the object. The colors are the property values of the theme objects. You can define as many themes as you like. The DerivedColors, as the name suggests, are for colors that are derived from the BaseColors through the darken, lighten and tranmslucify utilities. The baseColors and derivedColors are merged to one object for the themes.

### shadows

The shadow styles for the different themes. You can define the shadow styles for each theme you want to use. The theme names are the property names of the object. The shadow styles are the property values of the theme objects. You can define as many themes as you like. If you dont want to generate themes you can define the shadow names directly instead of the theme names.

### defaultTheme

Defines the default theme to use if none is explicitely set. If you dont define themes in any of your objects you must omit this option.

### prefersDarkTheme

Defines the theme to use if the user has `prefers-color-sheme: dark` active. You can omit this option if you dont want your themes css to not react to user preference. If you dont define themes in any of your objects you must omit this option. (This media query can be overridden by the data-nfq-theme attribute)

### highContrastTheme

Defines the theme to use if the user has `prefers-contrast: more` active. You can omit this option if you dont want your themes css to not react to user preference. If you dont define themes in any of your objects you must omit this option. (This media query can't be overridden by the data-nfq-theme attribute)

### lowContrastTheme

Defines the theme to use if the user has `prefers-contrast: less` active. You can omit this option if you dont want your themes css to not react to user preference. If you dont define themes in any of your objects you must omit this option. (This media query can't be overridden by the data-nfq-theme attribute)

### customContrastTheme

Defines the theme to use if the user has `prefers-contrast: custom` active. You can omit this option if you dont want your themes css to not react to user preference. If you dont define themes in any of your objects you must omit this option. (This media query can't be overridden by the data-nfq-theme attribute)

<p align="right">(<a href="#top">back to top</a>)</p>
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
