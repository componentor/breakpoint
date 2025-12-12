# Changelog

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
