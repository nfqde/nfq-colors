import type {NoThemeConfig, ThemeConfig} from './types/helperTypes';

/**
 * Generates a string of CSS variables based on the key-value pairs in the provided theme object.
 *
 * This function takes an object where the keys are CSS variable names and the values are their corresponding
 * values, and it converts them into a formatted string of CSS variables. These can then be injected into a
 * style block or a CSS-in-JS solution.
 *
 * @param themeObject An object representing theme variables. Each key in the object is converted into a CSS variable name, prefixed with `--`, and each corresponding value becomes the variable's value.
 *
 * @returns A string representing the CSS variables, where each line follows the format `--key: value;`.
 *
 * @example
 * ```ts
 * const themeObject = {
 *   primaryColor: '#ff0000',
 *   secondaryColor: '#00ff00'
 * };
 *
 * const cssVariables = generateCssVariables(themeObject);
 * // Outputs:
 * // --primaryColor: #ff0000;
 * // --secondaryColor: #00ff00;
 * ```
 */
export const generateCssVariables = (themeObject: NoThemeConfig) => Object.entries(themeObject).map(([key, value]) => `--${key}: ${value};`).join('\n');

/**
 * Generates CSS selectors that apply theme-specific CSS variables based on a data attribute.
 *
 * This function takes an object representing different themes, where each key is a theme name and its value is
 * an object of CSS variable definitions. It then generates a CSS string with selectors that target elements based on
 * the `data-theme` attribute, applying the corresponding CSS variables for each theme.
 *
 * @param themeObject An object where the keys are theme names and the values are objects containing theme-specific CSS variables. The function generates CSS selectors that apply these variables when the corresponding theme is active.
 *
 * @returns A string containing CSS rules that can be injected into a stylesheet or a CSS-in-JS solution. Each rule
 * applies a set of CSS variables when a specific `data-theme` is active.
 *
 * @example
 * ```ts
 * const themeObject = {
 *   light: {
 *     primaryColor: '#ffffff',
 *     secondaryColor: '#000000'
 *   },
 *   dark: {
 *     primaryColor: '#000000',
 *     secondaryColor: '#ffffff'
 *   }
 * };
 *
 * const cssSelectors = generateThemeCssSelector(themeObject);
 * // Outputs:
 * // [data-nfq-theme="light"] {
 * //   --primaryColor: #ffffff;
 * //   --secondaryColor: #000000;
 * // }
 * // [data-nfq-theme="dark"] {
 * //   --primaryColor: #000000;
 * //   --secondaryColor: #ffffff;
 * // }
 * ```
 */
export const generateThemeCssSelector = (themeObject: ThemeConfig) => Object.entries(themeObject).map(
    ([theme, themeValues]) => `
        [data-nfq-theme="${theme}"] {
            ${generateCssVariables(themeValues)}
        }
    `
).join('\n');

/**
 * Generates a theme configuration object containing CSS variables, global CSS, and theme-specific properties.
 */
export enum CustomContrastColors {
    /** Background of accented user interface controls. */
    AccentColor = 'AccentColor',
    /** Text of accented user interface controls. */
    AccentColorText = 'AccentColorText',
    /** Text of active links. */
    ActiveText = 'ActiveText',
    /** Base border color of controls. */
    ButtonBorder = 'ButtonBorder',
    /** Background color of controls. */
    ButtonFace = 'ButtonFace',
    /** Text color of controls. */
    ButtonText = 'ButtonText',
    /** Background of application content or documents. */
    Canvas = 'Canvas',
    /** Text color in application content or documents. */
    CanvasText = 'CanvasText',
    /** Background of input fields. */
    Field = 'Field',
    /** Text in input fields. */
    FieldText = 'FieldText',
    /** Text color for disabled items (e.g. A disabled control). */
    GrayText = 'GrayText',
    /** Background of selected items. */
    Highlight = 'Highlight',
    /** Text color of selected items. */
    HighlightText = 'HighlightText',
    /** Text of non-active, non-visited links. */
    LinkText = 'LinkText',
    /** Background of text that has been specially marked (such as by the HTML mark element). */
    Mark = 'Mark',
    /** Text that has been specially marked (such as by the HTML mark element). */
    MarkText = 'MarkText',
    /** Background of selected items, for example, a selected checkbox. */
    SelectedItem = 'SelectedItem',
    /** Text of selected items. */
    SelectedItemText = 'SelectedItemText',
    /** Text of visited links. */
    VisitedText = 'VisitedText'
}