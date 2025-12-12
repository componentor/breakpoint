# IntelliSense Support & Integration Guide

This library provides comprehensive TypeScript IntelliSense support for CSS properties, aliases, and integration with other libraries.

## IntelliSense Features

### 1. Type-Safe Builder API

The builder API provides full autocomplete for CSS properties and aliases:

```typescript
import { createStyleBuilder, parse } from '@componentor/breakpoint';

// Create a builder with IntelliSense
const styles = createStyleBuilder()
  .style('background', 'blue')      // Standard CSS - autocomplete works!
  .style('bg', 'blue')              // Alias - autocomplete works!
  .style('padding', '10px 20px')    // Full CSS IntelliSense
  .style('p', '10px 20px')          // Alias IntelliSense
  .themed('dark', 'bg', 'black')    // Themed styles
  .responsive('md', 'p', '20px')    // Responsive styles
  .state('hover', 'opacity', '0.8') // State styles
  .build();

const parsed = parse(styles);
```

### 2. Style Object with IntelliSense

Use a typed object for defining styles:

```typescript
import { styleObject, parse } from '@componentor/breakpoint';

const styles = styleObject({
  // Full CSS property autocomplete
  background: 'blue',
  color: 'white',
  padding: '10px 20px',

  // Alias autocomplete
  bg: 'blue',
  text: 'white',
  p: '10px 20px',

  // Conditional styles
  'dark:bg': 'black',
  'md:p': '20px 40px',
  'hover:opacity': '0.8'
});

const parsed = parse(styles);
```

### 3. CSS Property Types

Access comprehensive CSS types powered by `csstype`:

```typescript
import type { CSSProperty, PropertyAlias, StyleObject } from '@componentor/breakpoint';

// CSSProperty includes all CSS properties + our aliases
const prop1: CSSProperty = 'background';  // ✓
const prop2: CSSProperty = 'bg';          // ✓ (alias)
const prop3: CSSProperty = 'padding';     // ✓

// PropertyAlias for just our aliases
const alias1: PropertyAlias = 'bg';       // ✓
const alias2: PropertyAlias = 'text';     // ✓

// StyleObject for typed style objects
const styles: StyleObject = {
  background: 'blue',  // Full autocomplete
  padding: '10px',     // Full autocomplete
  bg: 'red'            // Alias autocomplete
};
```

## Integration with Other Libraries

### For Library Authors

Use the `BreakpointIntegration` class to integrate breakpoint parsing into your library:

```typescript
import { createIntegration } from '@componentor/breakpoint';

// Create an integration instance
const integration = createIntegration();

// Add custom aliases for your library
integration.addAlias('primary', 'background-color');
integration.addAliases({
  'secondary': 'color',
  'spacing': 'padding'
});

// Parse user input
const parsed = integration.parseStyles('primary:blue; dark:primary:navy');

// Extract metadata
const properties = integration.extractProperties('bg:blue; text:white');
// ['background', 'color']

const themes = integration.extractThemes('bg:blue; dark:bg:black; light:bg:white');
// ['dark', 'light']

const breakpoints = integration.extractBreakpoints('p:10px; md:p:20px; lg:p:30px');
// ['md', 'lg']

// Convert to CSS object
const cssObj = integration.toObject('bg:blue; text:white; p:10px');
// { background: 'blue', color: 'white', padding: '10px' }

// Validate input
const errors = integration.validate('bg:blue; invalid-syntax');
// Array of validation errors
```

### Quick Utilities

For one-off operations:

```typescript
import { integrationUtils } from '@componentor/breakpoint';

// Resolve alias
const property = integrationUtils.resolveAlias('bg');
// 'background'

// Get all aliases
const aliases = integrationUtils.getAllAliases();
// { bg: 'background', text: 'color', ... }

// Extract properties
const props = integrationUtils.extractProperties('bg:blue; text:white');
// ['background', 'color']

// Convert to object
const obj = integrationUtils.toObject('bg:blue; p:10px');
// { background: 'blue', padding: '10px' }

// Validate
const errors = integrationUtils.validate('bg:blue; p:10px');
// []
```

### Get Alias Hints for IDEs/Tools

Generate autocomplete hints for your IDE extension or developer tool:

```typescript
import { getAliasHints } from '@componentor/breakpoint';

const hints = getAliasHints();
// [
//   { alias: 'bg', property: 'background', category: 'Background' },
//   { alias: 'bg-color', property: 'background-color', category: 'Background' },
//   { alias: 'text', property: 'color', category: 'Typography' },
//   { alias: 'size', property: 'font-size', category: 'Typography' },
//   { alias: 'p', property: 'padding', category: 'Spacing' },
//   { alias: 'm', property: 'margin', category: 'Spacing' },
//   ...
// ]
```

## CSS-in-JS Integration Examples

### Styled-Components

```typescript
import styled from 'styled-components';
import { createStyleBuilder } from '@componentor/breakpoint';

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  ${props => {
    const styles = createStyleBuilder()
      .style('padding', '10px 20px')
      .style('border-radius', '4px')
      .style('border', 'none')
      .style('cursor', 'pointer');

    if (props.$variant === 'primary') {
      styles
        .style('background', 'blue')
        .style('color', 'white');
    } else {
      styles
        .style('background', 'gray')
        .style('color', 'black');
    }

    return styles.build();
  }}
`;
```

### Emotion

```typescript
import { css } from '@emotion/react';
import { styleObject } from '@componentor/breakpoint';

const buttonStyles = css(styleObject({
  background: 'blue',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer'
}));
```

### Vanilla Extract

```typescript
import { style } from '@vanilla-extract/css';
import { integrationUtils } from '@componentor/breakpoint';

const buttonClass = style(
  integrationUtils.toObject('bg:blue; text:white; p:10px 20px; rounded:4px')
);
```

## Benefits

### Full IntelliSense Support
- ✅ **All CSS properties** - Powered by `csstype`, the industry standard
- ✅ **All property aliases** - Your custom shortcuts
- ✅ **Type safety** - Catch errors at compile time
- ✅ **IDE autocomplete** - Works in VS Code, WebStorm, etc.

### Flexible Integration
- ✅ **Builder API** - Fluent interface with IntelliSense
- ✅ **Object API** - Type-safe object syntax
- ✅ **String API** - Keep using simple strings if preferred
- ✅ **Integration utilities** - Easy to integrate into any library

### Developer Experience
- ✅ **No learning curve** - Standard CSS property names
- ✅ **Autocomplete everywhere** - Properties, aliases, values
- ✅ **Type-safe** - TypeScript catches mistakes
- ✅ **Flexible** - Use the API that fits your needs
