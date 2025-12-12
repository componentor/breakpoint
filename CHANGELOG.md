# Changelog

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
