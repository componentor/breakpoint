import type { ParsedStyles, GetStyleOptions } from './types.js';
export type { ParsedStyles, ParsedStyle, GetStyleOptions, StyleConditions, Theme, Breakpoint, State } from './types.js';
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
 * @param options - Context options (theme, state, breakpoint)
 * @returns CSS style string with matching properties
 *
 * @example
 * const parsed = parse('color:red; dark:color:white');
 * getStyle(parsed, { theme: 'dark' }); // Returns: 'color: white;'
 */
export declare const getStyle: (parsedStyles: ParsedStyles, options?: GetStyleOptions) => string;
//# sourceMappingURL=index.d.ts.map