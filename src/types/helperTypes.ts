/* eslint-disable @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-unused-vars */
type AllKeys<T> = T extends any ? keyof T : never;
type PickType<T, K extends AllKeys<T>> = T extends {[k in K]?: any} ? T[K] : never;
type Merge<T extends object> = {[k in AllKeys<T>]: PickType<T, k>};
type MapToCssVars<T extends {[key: string]: string}> = {[Key in keyof T]: T[Key] | `var(--${string & Key})`};
type MappedThemeVars<T extends {[key: string]: string}> = Merge<MapToCssVars<T>>;

export type ThemeConfig = {[key: string]: {[key: string]: string}};
export type NoThemeConfig = {[key: string]: string};
export type ThemeUnion = NoThemeConfig | ThemeConfig;

export type GetThemeType<T extends ThemeUnion> = T extends Record<string, never>
? T
: T extends ThemeConfig
? MappedThemeVars<T[keyof T]>
: T extends NoThemeConfig
    ? MappedThemeVars<T>
    : never;

type CheckSEmpty<S extends ThemeUnion> = S extends Record<string, never>
? undefined
: S extends ThemeConfig
    ? keyof S
    : undefined;
type CheckDEmpty<D extends ThemeUnion, S extends ThemeUnion> = D extends Record<string, never>
? CheckSEmpty<S>
: D extends ThemeConfig
    ? keyof D
    : CheckSEmpty<S>;
type ThemeList<T extends ThemeUnion, D extends ThemeUnion, S extends ThemeUnion>
= T extends Record<string, never>
    ? CheckDEmpty<D, S>
    : T extends ThemeConfig
        ? keyof T
        : CheckDEmpty<D, S>;

type UndefinedToNever<T> = [T] extends [undefined] ? [] : [defaultTheme: T, prefersDarkTheme?: T | false];
export type ThemeArgs<T extends ThemeUnion, D extends ThemeUnion, S extends ThemeUnion> = UndefinedToNever<ThemeList<T, D, S>>;

