/**
 * Integration utilities for other libraries to use the alias and parsing system
 */
import type { ParsedStyles, ParsedStyle } from './types.js';
/**
 * Integration helper for external libraries
 * Provides utilities to integrate with the breakpoint parsing and alias system
 */
export declare class BreakpointIntegration {
    /**
     * Resolve a property alias to its full CSS property name
     *
     * @example
     * const integration = new BreakpointIntegration();
     * integration.resolveAlias('bg'); // Returns: 'background'
     * integration.resolveAlias('unknown'); // Returns: 'unknown'
     */
    resolveAlias(alias: string): string;
    /**
     * Get all registered aliases (built-in + custom)
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const aliases = integration.getAliases();
     * // { bg: 'background', text: 'color', ... }
     */
    getAliases(): Record<string, string>;
    /**
     * Register custom aliases for your library
     *
     * @example
     * const integration = new BreakpointIntegration();
     * integration.addAlias('bgc', 'background-color');
     * integration.addAliases({
     *   'txt': 'color',
     *   'fw': 'font-weight'
     * });
     */
    addAlias(alias: string, property: string): this;
    addAliases(aliases: Record<string, string>): this;
    /**
     * Parse a style string and extract structured data
     * Returns the parsed styles with resolved aliases
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const parsed = integration.parseStyles('bg:blue; dark:text:white');
     * // Returns: ParsedStyles with resolved properties
     */
    parseStyles(input: string): ParsedStyles;
    /**
     * Extract all properties from a style string (with aliases resolved)
     * Useful for analysis, validation, or generating CSS
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const properties = integration.extractProperties('bg:blue; text:white; dark:bg:black');
     * // Returns: ['background', 'color']
     */
    extractProperties(input: string): string[];
    /**
     * Extract all themes used in a style string
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const themes = integration.extractThemes('bg:blue; dark:bg:black; light:bg:white');
     * // Returns: ['dark', 'light']
     */
    extractThemes(input: string): string[];
    /**
     * Extract all breakpoints used in a style string
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const breakpoints = integration.extractBreakpoints('p:10px; md:p:20px; lg:p:30px');
     * // Returns: ['md', 'lg']
     */
    extractBreakpoints(input: string): string[];
    /**
     * Extract all states used in a style string
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const states = integration.extractStates('bg:blue; hover:bg:darkblue; active:bg:navy');
     * // Returns: ['active', 'hover']
     */
    extractStates(input: string): string[];
    /**
     * Filter styles by condition
     * Useful for analyzing what styles apply under specific conditions
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const darkStyles = integration.filterByCondition(
     *   'bg:blue; text:white; dark:bg:black; dark:text:gray',
     *   { theme: 'dark' }
     * );
     * // Returns: ParsedStyles containing only dark theme styles
     */
    filterByCondition(input: string, conditions: {
        theme?: string;
        breakpoint?: string;
        state?: string;
    }): ParsedStyle[];
    /**
     * Convert parsed styles to a plain object
     * Useful for integrating with CSS-in-JS libraries
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const cssObject = integration.toObject('bg:blue; text:white; p:10px');
     * // Returns: { background: 'blue', color: 'white', padding: '10px' }
     */
    toObject(input: string): Record<string, string>;
    /**
     * Validate a style string
     * Returns validation errors if any
     *
     * @example
     * const integration = new BreakpointIntegration();
     * const errors = integration.validate('bg:blue; invalid-syntax');
     * // Returns: Array of validation error messages
     */
    validate(input: string): string[];
}
/**
 * Create a new integration instance
 *
 * @example
 * import { createIntegration } from '@componentor/breakpoint';
 *
 * const integration = createIntegration();
 * integration.addAlias('primary', 'background-color');
 * const properties = integration.extractProperties('primary:blue; dark:primary:black');
 */
export declare function createIntegration(): BreakpointIntegration;
/**
 * Quick utilities for common integration tasks
 */
export declare const integrationUtils: {
    /**
     * Quickly resolve an alias
     */
    resolveAlias: (alias: string) => string;
    /**
     * Quickly get all aliases
     */
    getAllAliases: () => Record<string, string>;
    /**
     * Quickly parse and extract properties
     */
    extractProperties: (input: string) => string[];
    /**
     * Quickly convert to CSS object
     */
    toObject: (input: string) => Record<string, string>;
    /**
     * Quickly validate input
     */
    validate: (input: string) => string[];
};
//# sourceMappingURL=integration.d.ts.map