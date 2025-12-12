/**
 * Type-safe builder API with IntelliSense support for aliases and conditions
 * Uses csstype for comprehensive CSS property autocomplete
 */
import type * as CSS from 'csstype';
import type { Theme, Breakpoint, State } from './types.js';
import { DEFAULT_ALIASES } from './aliases.js';
/**
 * All available property aliases
 */
export type PropertyAlias = keyof typeof DEFAULT_ALIASES;
/**
 * All CSS properties (from csstype) + our property aliases
 * Provides full IntelliSense for both standard CSS properties and aliases
 */
export type CSSProperty = keyof CSS.Properties | PropertyAlias | (string & {});
/**
 * Builder for creating type-safe style declarations with IntelliSense
 */
export declare class StyleBuilder {
    private declarations;
    /**
     * Add a base style (no conditions)
     *
     * @example
     * builder.style('bg', 'blue').style('text', 'white')
     */
    style(property: CSSProperty, value: string): this;
    /**
     * Add a themed style
     *
     * @example
     * builder.themed('dark', 'bg', 'black')
     */
    themed(theme: Theme, property: CSSProperty, value: string): this;
    /**
     * Add a responsive style (breakpoint)
     *
     * @example
     * builder.responsive('md', 'p', '20px')
     */
    responsive(breakpoint: Breakpoint, property: CSSProperty, value: string): this;
    /**
     * Add a state-based style (hover, focus, etc.)
     *
     * @example
     * builder.state('hover', 'bg', 'darkblue')
     */
    state(state: State, property: CSSProperty, value: string): this;
    /**
     * Add a style with multiple conditions
     *
     * @example
     * builder.conditional({ theme: 'dark', breakpoint: 'md', state: 'hover' }, 'bg', 'purple')
     */
    conditional(conditions: {
        theme?: Theme;
        breakpoint?: Breakpoint;
        state?: State;
    }, property: CSSProperty, value: string): this;
    /**
     * Build the final style string
     */
    build(): string;
    /**
     * Clear all declarations
     */
    clear(): this;
}
/**
 * Create a new style builder instance with IntelliSense support
 *
 * @example
 * const styles = createStyleBuilder()
 *   .style('bg', 'blue')
 *   .style('text', 'white')
 *   .style('p', '10px 20px')
 *   .themed('dark', 'bg', 'black')
 *   .responsive('md', 'p', '20px 40px')
 *   .state('hover', 'opacity', '0.8')
 *   .build();
 *
 * parse(styles);
 */
export declare function createStyleBuilder(): StyleBuilder;
/**
 * Utility type for style object with IntelliSense
 * Provides autocomplete for CSS properties and property aliases
 */
export type StyleObject = Partial<CSS.Properties> & Partial<Record<PropertyAlias, string>> & {
    [key: string]: string | undefined;
};
/**
 * Convert a style object to string format with IntelliSense for properties
 * Supports standard CSS properties, aliases, and conditional styles
 *
 * @example
 * const styles = styleObject({
 *   background: 'blue',  // Standard CSS with IntelliSense
 *   bg: 'blue',          // Alias with IntelliSense
 *   text: 'white',
 *   padding: '10px 20px',
 *   'dark:bg': 'black',  // Conditional styles
 *   'md:p': '20px 40px',
 *   'hover:opacity': '0.8'
 * });
 */
export declare function styleObject(styles: StyleObject): string;
/**
 * Get all available aliases for IntelliSense/autocomplete in external tools
 * Returns both the alias and the full property name
 */
export declare function getAliasHints(): Array<{
    alias: string;
    property: string;
    category: string;
}>;
//# sourceMappingURL=builder.d.ts.map