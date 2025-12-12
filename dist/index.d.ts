import type { ParsedStyles, GetStyleOptions, Theme } from './types.js';
export type { ParsedStyles, ParsedStyle, GetStyleOptions, StyleConditions, Theme, Breakpoint, State, BreakpointStrategy, ThemeStrategy } from './types.js';
export { registerAlias, registerAliases, clearCustomAliases, getAllAliases, isAlias, DEFAULT_ALIASES } from './aliases.js';
/**
 * Parses an enhanced style string with breakpoint, theme, and state prefixes.
 *
 * Format: ${arg1}:${arg2}:${argn}:${style-property}:${style-value};
 *
 * Args can be:
 * - Theme: dark, light, or custom theme names
 * - Breakpoint: xs, sm, md, lg, xl, 2xl, or custom breakpoints
 * - State: hover, active, focus, etc.
 *
 * @param input - Style string similar to HTML style attribute with optional prefixes
 * @returns Parsed styles object containing all style rules with their conditions
 *
 * @example
 * parse('color:red; dark:color:white; md:padding:20px; hover:dark:background:black')
 */
export declare const parse: (input: string) => ParsedStyles;
/**
 * Extracts CSS styles that match the given context (theme, state, breakpoint).
 *
 * @param parsedStyles - The parsed styles object from parse()
 * @param options - Context options (theme, state, breakpoint, breakpointStrategy, themeStrategy)
 * @returns CSS style string with matching properties
 *
 * @example
 * const parsed = parse('color:red; dark:color:white');
 * getStyle(parsed, { theme: 'dark' }); // Returns: 'color: white;'
 *
 * @example
 * const parsed = parse('font-size:14px; md:font-size:18px; lg:font-size:24px');
 * getStyle(parsed, { breakpoint: 'lg', breakpointStrategy: 'mobile-first' });
 * // Returns: 'font-size: 24px;' (includes base + md + lg)
 *
 * @example
 * const parsed = parse('color:blue; dark:color:white');
 * getStyle(parsed, { theme: 'light', themeStrategy: 'fallback' });
 * // Returns: 'color: blue;' (falls back to dark theme if light doesn't exist)
 */
export declare const getStyle: (parsedStyles: ParsedStyles, options?: GetStyleOptions) => string;
/**
 * Helper function for common dark/light theme pattern with automatic fallback.
 * Convenience wrapper around getStyle with themeStrategy: 'fallback'.
 *
 * @param parsedStyles - The parsed styles object from parse()
 * @param options - Options without themeStrategy (always uses 'fallback')
 * @param preferDark - If true, uses 'dark' theme; if false, uses 'light' theme (default: false)
 * @returns CSS style string with matching properties
 *
 * @example
 * const parsed = parse('color:gray; dark:color:white; light:color:black');
 *
 * // Use light theme with fallback to dark
 * getThemedStyle(parsed, {});
 * // Returns: 'color: black;'
 *
 * // Use dark theme with fallback to light
 * getThemedStyle(parsed, {}, true);
 * // Returns: 'color: white;'
 *
 * @example
 * // With breakpoints and states
 * const styles = parse('bg:blue; dark:bg:black; hover:opacity:0.9');
 *
 * getThemedStyle(styles, {
 *   breakpoint: 'md',
 *   state: 'hover'
 * });
 * // Automatically uses light theme with fallback
 */
export declare const getThemedStyle: (parsedStyles: ParsedStyles, options?: Omit<GetStyleOptions, "theme" | "themeStrategy"> & {
    theme?: Theme;
}, preferDark?: boolean) => string;
//# sourceMappingURL=index.d.ts.map