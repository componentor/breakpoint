# Project Summary: @componentor/breakpoints

## Overview

A TypeScript library for parsing and managing CSS styles with conditional breakpoints, themes, and states using a compact colon-separated syntax.

## Key Features

### Core Functionality

1. **Parse Function** - Converts style strings into structured objects
   - Syntax: `condition:property:value` or `cond1:cond2:property:value`
   - Recognizes common CSS properties automatically
   - Extensible for custom properties

2. **GetStyle Function** - Extracts CSS matching specific contexts
   - Filter by theme, breakpoint, and/or state
   - Base styles (no conditions) always apply
   - Handles property overrides correctly

### Supported Conditions

- **Themes**: `dark`, `light`, and custom themes
- **Breakpoints**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, and custom breakpoints
- **States**: `hover`, `active`, `focus`, `visited`, `disabled`, `checked`, and custom states

### Technical Specifications

- **Language**: TypeScript 5.9+
- **Module System**: ESM (ES2020)
- **Browser Support**: All modern browsers (ESM compatible)
- **Bundle Size**: ~8KB (dist/index.js)
- **Dependencies**: Zero runtime dependencies
- **Testing**: Vitest with 45 comprehensive tests

## Performance Metrics

Based on performance test suite:

- **Simple Parse**: ~0.001ms per operation (10,000 iterations)
- **Complex Parse**: ~0.003ms per operation (5,000 iterations)
- **Style Extraction**: ~0.001ms per operation (50,000 iterations)
- **Full Render Cycle**: ~0.028ms for 5 components with 5 contexts each

These metrics demonstrate the library is highly performant and suitable for real-time rendering scenarios.

## File Structure

```
/Users/steffanhalvorsen/Desktop/lib/breakpoints/
├── src/
│   ├── index.ts              # Main library code
│   ├── types.ts              # TypeScript type definitions
│   ├── index.test.ts         # Unit tests (36 tests)
│   └── performance.test.ts   # Performance tests (9 tests)
├── dist/                     # Compiled output
│   ├── index.js              # Main ESM bundle
│   ├── index.d.ts            # TypeScript declarations
│   ├── types.js              # Types module
│   └── *.map files           # Source maps
├── example.html              # Browser example with live demos
├── README.md                 # Main documentation
├── USAGE.md                  # Comprehensive usage guide
├── QUICKSTART.md             # Quick start guide
├── CHANGELOG.md              # Version history
├── LICENSE.md                # MIT License
├── package.json              # NPM configuration
├── tsconfig.json             # TypeScript configuration
└── vitest.config.ts          # Test configuration
```

## API Reference

### `parse(input: string): ParsedStyles`

Parses a style string into a structured object.

**Example:**
```typescript
parse('color:red; dark:color:white; md:padding:20px')
```

### `getStyle(parsedStyles: ParsedStyles, options?: GetStyleOptions): string`

Extracts CSS styles matching the given context.

**Example:**
```typescript
const parsed = parse('color:red; dark:color:white');
getStyle(parsed, { theme: 'dark' }); // Returns: "color: white;"
```

### Types

- `ParsedStyles` - Container for parsed style rules
- `ParsedStyle` - Individual style rule with conditions
- `GetStyleOptions` - Options for style extraction (theme, breakpoint, state)
- `Theme`, `Breakpoint`, `State` - String unions for condition types

## Usage Examples

### React Integration

```typescript
const STYLES = parse('color:black; dark:color:white');

function Component({ theme }) {
  const css = useMemo(
    () => getStyle(STYLES, { theme }),
    [theme]
  );
  return <div style={cssToObject(css)}>Content</div>;
}
```

### Vue Integration

```vue
<script setup>
const parsed = computed(() => parse(props.styles));
const css = computed(() => getStyle(parsed.value, { theme: props.theme }));
</script>
```

### Vanilla JavaScript

```javascript
const styles = parse('color:blue; dark:color:lightblue');
const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
const css = getStyle(styles, { theme: isDark ? 'dark' : 'light' });
```

## Testing

### Test Coverage

- **Unit Tests**: 36 tests covering all core functionality
- **Performance Tests**: 9 tests measuring speed and efficiency
- **Integration Tests**: Real-world usage scenarios
- **Total**: 45 tests, all passing

### Running Tests

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
```

## Building

```bash
npm run build           # Compile TypeScript to dist/
```

## Key Design Decisions

1. **Colon Separator**: Changed from dash to colon for property:value to avoid ambiguity with CSS properties that contain dashes (e.g., `font-family`)

2. **Known Properties List**: Library maintains a set of common CSS properties for intelligent parsing, but falls back to heuristics for unknown properties

3. **ESM Only**: Modern module system for better tree-shaking and browser compatibility

4. **Zero Dependencies**: Keeps bundle size small and reduces security concerns

5. **Immutable Parsing**: Parse once, use many times pattern for optimal performance

## Best Practices

1. **Parse Once**: Cache parsed styles, don't re-parse on every render
2. **Use Memoization**: In React/Vue, wrap getStyle calls in useMemo/computed
3. **Type Safety**: Leverage TypeScript types for better DX
4. **Batch Updates**: Parse multiple styles together when possible

## Browser Compatibility

Works in all modern browsers that support:
- ES2020 features
- ESM imports
- Performance API (for measurements)

Tested in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements (Possible)

- CSS-in-JS framework adapters (styled-components, emotion)
- Server-side rendering utilities
- Build-time optimizations
- Additional CSS property recognition
- Custom property plugins

## License

MIT License - See LICENSE.md for details

## Version

1.0.0 (Initial Release - December 12, 2025)
