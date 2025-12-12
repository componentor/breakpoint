/**
 * Type-safe builder API with IntelliSense support for aliases and conditions
 * Uses csstype for comprehensive CSS property autocomplete
 */
import { getAllAliases } from './aliases.js';
/**
 * Builder for creating type-safe style declarations with IntelliSense
 */
export class StyleBuilder {
    constructor() {
        this.declarations = [];
    }
    /**
     * Add a base style (no conditions)
     *
     * @example
     * builder.style('bg', 'blue').style('text', 'white')
     */
    style(property, value) {
        this.declarations.push(`${property}:${value}`);
        return this;
    }
    /**
     * Add a themed style
     *
     * @example
     * builder.themed('dark', 'bg', 'black')
     */
    themed(theme, property, value) {
        this.declarations.push(`${theme}:${property}:${value}`);
        return this;
    }
    /**
     * Add a responsive style (breakpoint)
     *
     * @example
     * builder.responsive('md', 'p', '20px')
     */
    responsive(breakpoint, property, value) {
        this.declarations.push(`${breakpoint}:${property}:${value}`);
        return this;
    }
    /**
     * Add a state-based style (hover, focus, etc.)
     *
     * @example
     * builder.state('hover', 'bg', 'darkblue')
     */
    state(state, property, value) {
        this.declarations.push(`${state}:${property}:${value}`);
        return this;
    }
    /**
     * Add a style with multiple conditions
     *
     * @example
     * builder.conditional({ theme: 'dark', breakpoint: 'md', state: 'hover' }, 'bg', 'purple')
     */
    conditional(conditions, property, value) {
        const parts = [];
        if (conditions.theme)
            parts.push(conditions.theme);
        if (conditions.breakpoint)
            parts.push(conditions.breakpoint);
        if (conditions.state)
            parts.push(conditions.state);
        parts.push(property, value);
        this.declarations.push(parts.join(':'));
        return this;
    }
    /**
     * Build the final style string
     */
    build() {
        return this.declarations.join('; ');
    }
    /**
     * Clear all declarations
     */
    clear() {
        this.declarations = [];
        return this;
    }
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
export function createStyleBuilder() {
    return new StyleBuilder();
}
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
export function styleObject(styles) {
    return Object.entries(styles)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}:${value}`)
        .join('; ');
}
/**
 * Get all available aliases for IntelliSense/autocomplete in external tools
 * Returns both the alias and the full property name
 */
export function getAliasHints() {
    const aliases = getAllAliases();
    const hints = [];
    // Categorize aliases for better IntelliSense
    const categories = {
        'Background': ['bg', 'bg-color', 'bg-image', 'bg-size', 'bg-position', 'bg-repeat', 'bg-attachment', 'bg-clip', 'bg-origin'],
        'Typography': ['text', 'size'],
        'Spacing': ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'ms', 'me', 'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py', 'ps', 'pe'],
        'Sizing': ['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h'],
        'Border': ['border-w', 'border-t', 'border-r', 'border-b', 'border-l'],
        'Layout': ['z', 'inset-x', 'inset-y', 'start', 'end'],
        'Flexbox': ['justify', 'items', 'align', 'grow', 'shrink', 'basis'],
        'Grid': ['grid-cols', 'grid-rows', 'col', 'col-start', 'col-end', 'row', 'row-start', 'row-end', 'gap-x', 'gap-y', 'space-x', 'space-y'],
        'Effects': ['shadow', 'mix-blend', 'bg-blend'],
        'Transforms': ['origin'],
        'Animation': ['duration', 'delay', 'animate'],
        'Overflow': ['overscroll', 'overscroll-x', 'overscroll-y'],
        'Other': []
    };
    for (const [alias, property] of Object.entries(aliases)) {
        let category = 'Other';
        for (const [cat, aliasList] of Object.entries(categories)) {
            if (aliasList.includes(alias)) {
                category = cat;
                break;
            }
        }
        hints.push({ alias, property, category });
    }
    return hints.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.alias.localeCompare(b.alias);
    });
}
//# sourceMappingURL=builder.js.map