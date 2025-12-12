const KNOWN_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const BREAKPOINT_ORDER = {
    'xs': 0,
    'sm': 1,
    'md': 2,
    'lg': 3,
    'xl': 4,
    '2xl': 5,
};
const KNOWN_STATES = ['hover', 'active', 'focus', 'visited', 'focus-visible', 'focus-within', 'disabled', 'enabled', 'checked'];
const KNOWN_THEMES = ['dark', 'light'];
// Common CSS properties (not exhaustive, but covers most cases)
const KNOWN_CSS_PROPERTIES = new Set([
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
    'border-width', 'border-style', 'border-color', 'border-radius',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'display', 'position', 'top', 'right', 'bottom', 'left',
    'flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
    'justify-content', 'align-items', 'align-content', 'align-self',
    'grid', 'grid-template', 'grid-template-columns', 'grid-template-rows', 'grid-gap', 'gap',
    'color', 'background', 'background-color', 'background-image', 'background-size', 'background-position',
    'font', 'font-family', 'font-size', 'font-weight', 'font-style',
    'text', 'text-align', 'text-decoration', 'text-transform',
    'line-height', 'letter-spacing', 'word-spacing',
    'opacity', 'visibility', 'z-index',
    'cursor', 'pointer-events',
    'overflow', 'overflow-x', 'overflow-y',
    'transform', 'transition', 'animation',
    'box-shadow', 'text-shadow',
]);
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
export const parse = (input) => {
    if (!input || typeof input !== 'string') {
        return { styles: [] };
    }
    const styles = [];
    // Split by semicolon to get individual style declarations
    const declarations = input.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const declaration of declarations) {
        // Split by colon to get all parts
        const parts = declaration.split(':').map(p => p.trim());
        if (parts.length < 2)
            continue; // Need at least property:value
        // Strategy: work backwards to find where conditions end and property:value begins
        // We need to find which parts are conditions and which are property:value
        // Try to match known CSS properties by testing different split points
        let property = '';
        let value = '';
        let conditionParts = [];
        let found = false;
        // Try different split points: last 2 parts could be property:value
        // Or could be condition:value (if property is single-word)
        // First, try assuming the last part is value and second-to-last is property
        if (parts.length >= 2) {
            const potentialValue = parts[parts.length - 1];
            const potentialProperty = parts[parts.length - 2];
            // Check if this could be a valid CSS property
            if (KNOWN_CSS_PROPERTIES.has(potentialProperty)) {
                property = potentialProperty;
                value = potentialValue;
                conditionParts = parts.slice(0, -2);
                found = true;
            }
        }
        // If not found, try matching multi-part properties (e.g., font-family from font:family)
        if (!found && parts.length >= 3) {
            for (let i = parts.length - 3; i >= 0 && i < parts.length - 1; i--) {
                const potentialProperty = parts.slice(i, parts.length - 1).join('-');
                if (KNOWN_CSS_PROPERTIES.has(potentialProperty)) {
                    property = potentialProperty;
                    value = parts[parts.length - 1];
                    conditionParts = parts.slice(0, i);
                    found = true;
                    break;
                }
            }
        }
        // Fallback: assume second-to-last part is property, last is value
        if (!found && parts.length >= 2) {
            property = parts[parts.length - 2];
            value = parts[parts.length - 1];
            conditionParts = parts.slice(0, -2);
            found = true;
        }
        if (!property || !value || !found)
            continue;
        const conditions = {};
        for (const condition of conditionParts) {
            // Categorize each condition
            if (KNOWN_BREAKPOINTS.includes(condition)) {
                conditions.breakpoint = condition;
            }
            else if (KNOWN_STATES.includes(condition)) {
                conditions.state = condition;
            }
            else if (KNOWN_THEMES.includes(condition)) {
                conditions.theme = condition;
            }
            else {
                // Unknown condition - try to infer or store as custom
                // For flexibility, we'll assume custom themes, breakpoints, or states
                // Priority: check if it looks like a breakpoint pattern, otherwise theme
                if (condition.match(/^\d+xl$|^[xsml]+$/)) {
                    conditions.breakpoint = condition;
                }
                else {
                    // Default to theme for unknown conditions
                    conditions.theme = condition;
                }
            }
        }
        styles.push({
            property,
            value,
            conditions,
        });
    }
    return { styles };
};
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
export const getStyle = (parsedStyles, options = {}) => {
    const { theme, state, breakpoint, breakpointStrategy = 'exact', themeStrategy = 'strict' } = options;
    const matchingStyles = [];
    // Get breakpoint index for strategy matching
    const currentBreakpointIndex = breakpoint && BREAKPOINT_ORDER[breakpoint] !== undefined
        ? BREAKPOINT_ORDER[breakpoint]
        : -1;
    for (const style of parsedStyles.styles) {
        const { conditions } = style;
        // Check if all conditions match
        let matches = true;
        // Handle theme matching based on strategy
        if (conditions.theme !== undefined) {
            if (themeStrategy === 'strict') {
                // Strict: theme must match exactly
                if (conditions.theme !== theme) {
                    matches = false;
                }
            }
            else if (themeStrategy === 'fallback') {
                // Fallback: if theme is specified, try to match
                // Priority: exact theme match > base > other theme fallback
                // Only fallback to other themes if no base exists for this property
                if (theme !== undefined && conditions.theme !== theme) {
                    // Check if there's an exact theme match for this property
                    const hasExactThemeMatch = parsedStyles.styles.some(s => s.property === style.property &&
                        s.conditions.theme === theme &&
                        s.conditions.breakpoint === conditions.breakpoint &&
                        s.conditions.state === conditions.state);
                    // Determine if we should skip fallback and prefer base instead
                    let skipFallback = false;
                    if (hasExactThemeMatch) {
                        // Always prefer exact theme match
                        skipFallback = true;
                    }
                    else if (state !== undefined && conditions.state === undefined) {
                        // State requested, but fallback style doesn't have it
                        // Prefer base over themed fallback in this case
                        const hasBaseAtSameLevel = parsedStyles.styles.some(s => s.property === style.property &&
                            s.conditions.theme === undefined &&
                            s.conditions.breakpoint === conditions.breakpoint &&
                            s.conditions.state === conditions.state);
                        if (hasBaseAtSameLevel) {
                            skipFallback = true;
                        }
                    }
                    else if (breakpoint !== undefined && conditions.breakpoint === undefined) {
                        // Breakpoint requested, but fallback style doesn't have it
                        // Prefer any base style over themed fallback without the requested breakpoint
                        const hasAnyBase = parsedStyles.styles.some(s => s.property === style.property &&
                            s.conditions.theme === undefined &&
                            s.conditions.state === conditions.state);
                        if (hasAnyBase) {
                            skipFallback = true;
                        }
                    }
                    if (skipFallback) {
                        matches = false;
                    }
                    // Otherwise, allow it as a fallback to other themes
                }
                else if (theme === undefined && conditions.theme !== undefined) {
                    // No theme specified, but style has a theme - skip it even in fallback mode
                    matches = false;
                }
            }
        }
        // If style has a state condition, it must match
        if (conditions.state !== undefined && conditions.state !== state) {
            matches = false;
        }
        // Handle breakpoint matching based on strategy
        if (conditions.breakpoint !== undefined && breakpoint !== undefined) {
            const styleBreakpointIndex = BREAKPOINT_ORDER[conditions.breakpoint];
            if (styleBreakpointIndex !== undefined && currentBreakpointIndex !== -1) {
                // Known breakpoints - apply strategy
                if (breakpointStrategy === 'exact') {
                    // Exact match only
                    if (conditions.breakpoint !== breakpoint) {
                        matches = false;
                    }
                }
                else if (breakpointStrategy === 'mobile-first') {
                    // Include styles from current breakpoint and below
                    if (styleBreakpointIndex > currentBreakpointIndex) {
                        matches = false;
                    }
                }
                else if (breakpointStrategy === 'desktop-first') {
                    // Include styles from current breakpoint and above
                    if (styleBreakpointIndex < currentBreakpointIndex) {
                        matches = false;
                    }
                }
            }
            else {
                // Custom breakpoints - exact match only
                if (conditions.breakpoint !== breakpoint) {
                    matches = false;
                }
            }
        }
        else if (conditions.breakpoint !== undefined && breakpoint === undefined) {
            // Style has breakpoint but no breakpoint provided - don't match
            matches = false;
        }
        // If no conditions specified on the style, it always applies (base styles)
        const hasConditions = conditions.theme !== undefined ||
            conditions.state !== undefined ||
            conditions.breakpoint !== undefined;
        if (!hasConditions) {
            // Base style with no conditions - always include
            matches = true;
        }
        if (matches) {
            matchingStyles.push({
                property: style.property,
                value: style.value,
            });
        }
    }
    // Convert to CSS string format
    // Handle multiple values for the same property by keeping the last one (CSS specificity)
    const propertyMap = new Map();
    for (const style of matchingStyles) {
        propertyMap.set(style.property, style.value);
    }
    const cssEntries = Array.from(propertyMap.entries())
        .map(([property, value]) => `${property}: ${value};`)
        .join(' ');
    return cssEntries;
};
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
export const getThemedStyle = (parsedStyles, options = {}, preferDark = false) => {
    const theme = options.theme || (preferDark ? 'dark' : 'light');
    return getStyle(parsedStyles, {
        ...options,
        theme,
        themeStrategy: 'fallback'
    });
};
//# sourceMappingURL=index.js.map