/**
 * CSS property aliases for more concise syntax
 */
/**
 * Converts camelCase or PascalCase to kebab-case
 * @param str - The string to convert
 * @returns kebab-case string
 *
 * @example
 * toKebabCase('fontSize'); // Returns: 'font-size'
 * toKebabCase('BackgroundColor'); // Returns: 'background-color'
 * toKebabCase('borderTopLeftRadius'); // Returns: 'border-top-left-radius'
 */
export function toKebabCase(str) {
    // If already kebab-case or lowercase, return as-is
    if (str === str.toLowerCase() && !str.match(/[A-Z]/)) {
        return str;
    }
    return str
        // Insert hyphen before uppercase letters
        .replace(/([A-Z])/g, '-$1')
        // Convert to lowercase
        .toLowerCase()
        // Remove leading hyphen if PascalCase
        .replace(/^-/, '');
}
/**
 * Built-in property aliases
 * These common aliases are available by default
 */
export const DEFAULT_ALIASES = {
    // Background
    'bg': 'background',
    'bg-color': 'background-color',
    'bg-image': 'background-image',
    'bg-size': 'background-size',
    'bg-position': 'background-position',
    'bg-repeat': 'background-repeat',
    'bg-attachment': 'background-attachment',
    'bg-clip': 'background-clip',
    'bg-origin': 'background-origin',
    // Text & Typography
    'text': 'color',
    'op': 'opacity',
    // Layout & Sizing
    'w': 'width',
    'h': 'height',
    'min-w': 'min-width',
    'max-w': 'max-width',
    'min-h': 'min-height',
    'max-h': 'max-height',
    // Spacing - Margin
    'm': 'margin',
    'mt': 'margin-top',
    'mr': 'margin-right',
    'mb': 'margin-bottom',
    'ml': 'margin-left',
    'mx': 'margin-inline',
    'my': 'margin-block',
    'ms': 'margin-inline-start',
    'me': 'margin-inline-end',
    // Spacing - Padding
    'p': 'padding',
    'pt': 'padding-top',
    'pr': 'padding-right',
    'pb': 'padding-bottom',
    'pl': 'padding-left',
    'px': 'padding-inline',
    'py': 'padding-block',
    'ps': 'padding-inline-start',
    'pe': 'padding-inline-end',
    // Space Between
    'space-x': 'column-gap',
    'space-y': 'row-gap',
    // Border
    'border-w': 'border-width',
    'border-t': 'border-top',
    'border-r': 'border-right',
    'border-b': 'border-bottom',
    'border-l': 'border-left',
    'border-t-color': 'border-top-color',
    'border-b-color': 'border-bottom-color',
    'border-l-color': 'border-left-color',
    'border-r-color': 'border-right-color',
    'border-t-style': 'border-top-style',
    'border-b-style': 'border-bottom-style',
    'border-l-style': 'border-left-style',
    'border-r-style': 'border-right-style',
    'border-t-w': 'border-top-width',
    'border-b-w': 'border-bottom-width',
    'border-l-w': 'border-left-width',
    'border-r-w': 'border-right-width',
    'rounded': 'border-radius',
    'rounded-tl': 'border-top-left-radius',
    'rounded-tr': 'border-top-right-radius',
    'rounded-bl': 'border-bottom-left-radius',
    'rounded-br': 'border-bottom-right-radius',
    // Z-Index
    'z': 'z-index',
    // Flexbox
    'justify': 'justify-content',
    'items': 'align-items',
    'align': 'align-self',
    'grow': 'flex-grow',
    'shrink': 'flex-shrink',
    'basis': 'flex-basis',
    // Grid
    'grid-cols': 'grid-template-columns',
    'grid-rows': 'grid-template-rows',
    'col': 'grid-column',
    'col-start': 'grid-column-start',
    'col-end': 'grid-column-end',
    'row': 'grid-row',
    'row-start': 'grid-row-start',
    'row-end': 'grid-row-end',
    'gap-x': 'column-gap',
    'gap-y': 'row-gap',
    // Effects
    'shadow': 'box-shadow',
    'mix-blend': 'mix-blend-mode',
    'bg-blend': 'background-blend-mode',
    // Transforms
    'origin': 'transform-origin',
    // Transitions & Animation
    'duration': 'transition-duration',
    'delay': 'transition-delay',
    'animate': 'animation',
    // Overflow
    'overscroll': 'overscroll-behavior',
    'overscroll-x': 'overscroll-behavior-x',
    'overscroll-y': 'overscroll-behavior-y',
    // Outline & Ring
    'outline-w': 'outline-width',
    // Aspect Ratio
    'aspect': 'aspect-ratio',
    // Object Fit
    'object': 'object-fit',
    // Lists
    'list': 'list-style-type',
    // Break
    'break': 'word-break',
    'break-words': 'overflow-wrap',
    // Whitespace
    'whitespace': 'white-space',
    // SVG
    'stroke-w': 'stroke-width',
    // Fonts
    'size': 'font-size',
    'fw': 'font-weight'
};
/**
 * User-registered custom aliases
 * These override DEFAULT_ALIASES if there's a conflict
 */
let customAliases = {};
/**
 * Register a single custom alias
 *
 * @param alias - The short alias name
 * @param property - The full CSS property name
 *
 * @example
 * registerAlias('txt', 'color');
 * registerAlias('bgc', 'background-color');
 */
export function registerAlias(alias, property) {
    customAliases[alias] = property;
}
/**
 * Register multiple custom aliases at once
 *
 * @param aliases - Object mapping alias names to CSS properties
 *
 * @example
 * registerAliases({
 *   'txt': 'color',
 *   'bgc': 'background-color',
 *   'fw': 'font-weight'
 * });
 */
export function registerAliases(aliases) {
    Object.assign(customAliases, aliases);
}
/**
 * Clear all custom aliases
 */
export function clearCustomAliases() {
    customAliases = {};
}
/**
 * Get all currently registered aliases (built-in + custom)
 * Custom aliases override built-in ones
 *
 * @returns Combined object of all aliases
 */
export function getAllAliases() {
    return { ...DEFAULT_ALIASES, ...customAliases };
}
/**
 * Resolve a property name, converting alias to full property if applicable.
 * Handles camelCase/PascalCase conversion to kebab-case.
 * Priority: custom aliases > built-in aliases > kebab-case conversion
 *
 * @param property - Property name (could be an alias, camelCase, or PascalCase)
 * @returns Full CSS property name in kebab-case
 *
 * @example
 * resolveProperty('bg'); // Returns: 'background'
 * resolveProperty('background'); // Returns: 'background'
 * resolveProperty('fontSize'); // Returns: 'font-size'
 * resolveProperty('BackgroundColor'); // Returns: 'background-color'
 */
export function resolveProperty(property) {
    // Check custom aliases first (highest priority)
    if (customAliases[property]) {
        return customAliases[property];
    }
    // Check built-in aliases
    if (DEFAULT_ALIASES[property]) {
        return DEFAULT_ALIASES[property];
    }
    // Convert camelCase/PascalCase to kebab-case
    return toKebabCase(property);
}
/**
 * Check if a property name is a registered alias
 *
 * @param property - Property name to check
 * @returns True if it's a registered alias
 */
export function isAlias(property) {
    return property in customAliases || property in DEFAULT_ALIASES;
}
//# sourceMappingURL=aliases.js.map