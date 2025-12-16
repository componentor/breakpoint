# Changelog

## [1.4.4] - 2025-12-16

### Fixed

- **Sourcemap Issue**: Fixed "points to missing source files" errors for npm package consumers
  - Added `inlineSources: true` to TypeScript compiler options
  - Source code is now embedded directly in sourcemap files
  - Users no longer need the `src` folder present in `node_modules` for debugging
  - Sourcemaps work correctly without increasing package size with unnecessary source files

## [1.4.3] - 2025-12-16

### Added

- **Expanded Property Aliases**: Added 20 new built-in aliases (95 total, up from 75)
  - **Border properties**: `border-t-color`, `border-b-color`, `border-l-color`, `border-r-color`
  - **Border styles**: `border-t-style`, `border-b-style`, `border-l-style`, `border-r-style`
  - **Border widths**: `border-t-w`, `border-b-w`, `border-l-w`, `border-r-w`
  - **Position**: `inset` for positioning shorthand
  - **Opacity**: `op` for opacity
  - **Font**: `fw` for font-weight

  ```typescript
  // New border aliases
  parse('border-t-color:red; border-b-w:2px; border-l-style:dashed');
  // → border-top-color: red; border-bottom-width: 2px; border-left-style: dashed;

  // New utility aliases
  parse('op:0.5; fw:600;');
  // → opacity: 0.5; font-weight: 600;
  ```

## [1.4.2] - 2025-12-15

### Added

- **New State: `current`**: Added `current` to the list of known states for navigation highlighting
  ```typescript
  // Useful for indicating the current page/route in navigation
  const navItem = parse('pl:20px; hover:bg:gray; current:bg:blue; current:font-weight:600');

  // When item is current
  getStyle(navItem, { states: ['current'] });
  // Returns: 'padding-left: 20px; background: blue; font-weight: 600;'

  // With theme support
  const themed = parse('current:bg:blue; current:dark:bg:darkblue');
  getStyle(themed, { theme: 'dark', states: ['current'] });
  // Returns: 'background: darkblue;'
  ```

- Added 6 new tests for `current` state functionality (146 total tests)

## [1.4.1] - 2025-12-13

### Fixed

- **Documentation**: Updated all documentation to reflect v1.4.0 API changes
  - Changed `state:` → `states: []` in all examples across:
    - README.md
    - QUICKSTART.md
    - USAGE.md
    - THEME_STRATEGIES.md
    - BREAKPOINT_STRATEGIES.md
  - Added documentation for multiple states feature (`hover:active:bg:red`)
  - Added documentation for camelCase/PascalCase property support
  - Updated test count from 128 to 140

## [1.4.0] - 2025-12-13

### Added

- **Multiple States Support**: Combine multiple states in a single declaration
  ```typescript
  // Parse multiple states like hover:active:bg:red
  const parsed = parse('hover:active:bg:red');
  // Result: { property: 'background', value: 'red', conditions: { states: ['hover', 'active'] } }

  // Match when all required states are present
  getStyle(parsed, { states: ['hover', 'active'] }); // Returns: 'background: red;'
  getStyle(parsed, { states: ['hover'] });            // Returns: '' (partial match fails)
  getStyle(parsed, { states: ['hover', 'active', 'focus'] }); // Returns: 'background: red;' (superset OK)
  ```

- **CamelCase/PascalCase Property Names**: Write properties in any casing style
  ```typescript
  parse('fontSize:16px');            // → font-size: 16px
  parse('BackgroundColor:blue');     // → background-color: blue
  parse('borderTopLeftRadius:10px'); // → border-top-left-radius: 10px
  ```
  - Aliases still take priority over case conversion (`bg:blue` → `background: blue`)

- **New Export**: `toKebabCase()` utility function for case conversion

### Breaking Changes

- **API Change**: `state` option renamed to `states` (array)
  ```typescript
  // Before (1.3.x)
  getStyle(parsed, { state: 'hover' });

  // After (1.4.0)
  getStyle(parsed, { states: ['hover'] });
  ```

- **Type Change**: `StyleConditions.state` → `StyleConditions.states` (State[])
- **Type Change**: `GetStyleOptions.state` → `GetStyleOptions.states` (State[])

### Documentation

- Added 12 new tests for multiple states and case conversion (140 total tests)
- All existing tests updated and passing

## [1.3.3] - 2025-12-12

### Fixed

- **Critical: Package Name Inconsistency**: Fixed incorrect package name throughout all documentation
  - Changed `@componentor/breakpoints` (plural) → `@componentor/breakpoint` (singular)
  - **Impact**: Users can now correctly install the package using `npm install @componentor/breakpoint`
  - **Files updated**: README.md, QUICKSTART.md, USAGE.md, INTELLISENSE.md, PROJECT_SUMMARY.md, example.html

### Verified

- All 128 tests passing
- Build successful with no errors or warnings
- All TypeScript types properly exported

## [1.3.2] - 2025-12-12

### Fixed

- **CSS Syntax Errors**: Fixed invalid CSS syntax throughout documentation and tests
  - Fixed multi-value properties using dashes instead of spaces (e.g., `10px-20px` → `10px 20px`)
  - Fixed grid template columns (e.g., `1fr-1fr` → `1fr 1fr`)
  - Fixed border shorthand (e.g., `3px-solid-black` → `3px solid black`)
  - Fixed missing colon in property:value pairs (e.g., `sm:font-size-16px` → `sm:font-size:16px`)

## [1.3.1] - 2025-12-12

### Added

- **IntelliSense Support**: Full TypeScript autocomplete powered by `csstype`
  - Added `StyleBuilder` class for fluent, type-safe style building
  - Added `createStyleBuilder()` function to create builder instances
  - Added `styleObject()` function to convert style objects to strings with IntelliSense
  - Added `getAliasHints()` for external tool integration
  - New types: `CSSProperty`, `PropertyAlias`, `StyleObject`

- **Integration Utilities**: Helper APIs for other libraries
  - Added `BreakpointIntegration` class with utilities for parsing, validation, and extraction
  - Added `createIntegration()` factory function
  - Added `integrationUtils` for quick access to common operations
  - Methods: `resolveAlias()`, `getAliases()`, `parseStyles()`, `extractProperties()`, `extractThemes()`, `extractBreakpoints()`, `extractStates()`, `filterByCondition()`, `toObject()`, `validate()`

### Documentation

- Added [INTELLISENSE.md](INTELLISENSE.md) - Comprehensive IntelliSense guide
- Updated all documentation with IntelliSense examples
- Added integration examples for styled-components, emotion, vanilla-extract

### Dependencies

- Added `csstype` ^3.2.3 for CSS property type definitions

## [1.3.0] - 2025-12-12

### Added

- **CSS Property Aliases**: Shorthand aliases for common CSS properties
  - **75+ built-in aliases** for concise styling
  - Use `bg` instead of `background`, `text` instead of `color`, `w` instead of `width`, etc.
  - Full list includes spacing (`m`, `p`, `mt`, `px`), sizing (`w`, `h`, `min-w`), flexbox (`justify`, `items`, `align`), grid (`grid-cols`, `col`), and more
  - Only meaningful property-to-property aliases are included (no value or function aliases)

- **Custom Alias Registration**: Register your own property aliases
  ```typescript
  registerAlias('bgc', 'background-color');
  registerAliases({
    'txt': 'color',
    'fw': 'font-weight'
  });
  ```

- **Alias Management Functions**:
  - `registerAlias(alias, property)` - Register a single alias
  - `registerAliases(object)` - Register multiple aliases at once
  - `clearCustomAliases()` - Clear all custom aliases
  - `getAllAliases()` - Get all registered aliases (built-in + custom)
  - `isAlias(property)` - Check if a property name is an alias
  - `DEFAULT_ALIASES` - Access the complete built-in alias map

### Examples

```typescript
// Use property aliases for concise styling
const styles = parse(`
  bg:blue;
  text:white;
  p:10px 20px;
  shadow:0 2px 4px rgba(0,0,0,0.1);
  hover:bg:darkblue;
  dark:bg:black;
  md:p:30px
`);

// Resolves to full CSS properties:
// background: blue;
// color: white;
// padding: 10px 20px;
// box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// etc.
```

### Fixed

- **Removed broken filter function aliases**: Removed `blur`, `brightness`, `contrast`, `grayscale`, `hue-rotate`, `invert`, `saturate`, `sepia` which incorrectly mapped filter functions to the `filter` property (e.g., `blur:5px` would become `filter: 5px` instead of `filter: blur(5px)`)
- **Removed broken transform function aliases**: Removed `scale-x`, `scale-y`, `translate-x`, `translate-y`, `skew-x`, `skew-y` which incorrectly mapped transform functions to properties
- **Removed CSS value aliases**: Removed `flex-row` and `flex-col` which mapped to CSS values rather than properties
- **Improved `align` alias**: Changed from `align: vertical-align` to `align: align-self` for better modern layout support (flexbox/grid)

### Documentation

- Added 25 comprehensive tests for alias system (128 total tests)
- Custom aliases can override built-in ones
- Aliases work seamlessly with themes, breakpoints, and states
- All aliases now properly map property names to property names (no value or function aliases)

### Technical Details

- Alias resolution happens during parsing
- Zero performance impact (resolved once during parse)
- Type-safe alias registration
- Custom aliases have priority over built-in ones

## [1.2.0] - 2025-12-12

### Added

- **Theme Strategy System**: Two strategies for theme fallback behavior
  - `'strict'` (default): Only match the exact theme specified
  - `'fallback'`: Use other available themes when the requested theme doesn't exist

- **New Type**: `ThemeStrategy` exported for TypeScript users

- **Enhanced getStyle API**: New `themeStrategy` option in `GetStyleOptions`
  ```typescript
  getStyle(parsed, {
    theme: 'light',
    themeStrategy: 'fallback' // or 'strict'
  });
  ```

### Theme Fallback Behavior

When using `themeStrategy: 'fallback'`:
- **Priority**: exact theme match > base styles > other theme fallback
- **Smart fallback**: When a breakpoint or state is requested but the fallback theme doesn't have it, base styles are preferred
- **Example**: `color:blue; dark:color:white` with `theme: 'light'` → uses `dark:color:white` as fallback
- **Context-aware**: Breakpoint/state context influences fallback behavior

### New Helper Function

- **`getThemedStyle()`**: Convenience helper for dark/light theming with automatic fallback
  ```typescript
  getThemedStyle(styles, {});           // Light theme
  getThemedStyle(styles, {}, true);     // Dark theme
  ```

### Documentation

- Added [THEME_STRATEGIES.md](THEME_STRATEGIES.md) with comprehensive guide
  - Detailed fallback behavior explanation
  - Custom theme naming conventions
  - Real-world examples (system theme detection, multi-brand theming)
  - Best practices and performance tips
- Updated README with theme strategy examples
- Clarified unlimited custom theme support and naming rules
- Added 38 new tests (24 for theme strategies + 14 for helper function = 103 total tests)
- All existing tests pass with backwards compatibility
- Comprehensive test coverage for theme + breakpoint + state combinations

### Technical Details

- Default strategy is 'strict' for backwards compatibility
- Fallback logic respects breakpoint and state specificity
- Base styles at specific breakpoints take precedence over themed fallbacks without those breakpoints

## [1.1.0] - 2025-12-12

### Added

- **Breakpoint Strategy System**: Three new strategies for responsive design
  - `'exact'` (default): Match only the exact breakpoint specified
  - `'mobile-first'`: Include styles from base up to current breakpoint
  - `'desktop-first'`: Include styles from current breakpoint and larger

- **New Type**: `BreakpointStrategy` exported for TypeScript users

- **Enhanced getStyle API**: New `breakpointStrategy` option in `GetStyleOptions`
  ```typescript
  getStyle(parsed, {
    breakpoint: 'md',
    breakpointStrategy: 'mobile-first' // or 'desktop-first' or 'exact'
  });
  ```

### Documentation

- Added [BREAKPOINT_STRATEGIES.md](BREAKPOINT_STRATEGIES.md) with comprehensive guide
- Added 20 new tests for breakpoint strategies (65 total tests)
- All existing tests pass with backwards compatibility

### Technical Details

- Breakpoint order system: xs (0) → sm (1) → md (2) → lg (3) → xl (4) → 2xl (5)
- Custom breakpoints always use exact matching regardless of strategy
- Default strategy is 'exact' for backwards compatibility

## [1.0.0] - 2025-12-12

### Initial Release

#### Features

- **Parse Function**: Parse enhanced style strings with conditional prefixes
  - Syntax: `condition1:condition2:property:value;`
  - Support for themes (dark, light, custom)
  - Support for breakpoints (xs, sm, md, lg, xl, 2xl, custom)
  - Support for states (hover, active, focus, etc.)

- **GetStyle Function**: Extract CSS styles matching specific contexts
  - Filter by theme, breakpoint, and state
  - Base styles always apply
  - Later declarations override earlier ones

- **TypeScript Support**
  - Full type definitions
  - Exported types for all interfaces
  - IntelliSense support

- **Performance**
  - Parse simple styles: ~0.001ms per operation
  - Parse complex styles: ~0.003ms per operation
  - Extract styles: ~0.001ms per operation
  - Full render cycle (5 components): ~0.026ms

- **Browser Compatibility**
  - ESM modules work directly in browsers
  - No dependencies
  - Example HTML file included

#### Documentation

- Comprehensive README with examples
- Detailed USAGE guide with framework integrations
- Performance testing suite
- MIT License

#### Technical Details

- Built with TypeScript 5.9+
- Compiles to ES2020
- Includes source maps
- Comprehensive test coverage (45 tests)
- Vitest for testing
