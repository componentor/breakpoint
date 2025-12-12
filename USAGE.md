# Usage Guide

Complete guide for using `@componentor/breakpoints` in your projects.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Syntax Guide](#syntax-guide)
- [Common Patterns](#common-patterns)
- [Framework Integration](#framework-integration)
- [Best Practices](#best-practices)
- [Performance Tips](#performance-tips)
- [Troubleshooting](#troubleshooting)

## Installation

### NPM

```bash
npm install @componentor/breakpoints
```

### Yarn

```bash
yarn add @componentor/breakpoints
```

### PNPM

```bash
pnpm add @componentor/breakpoints
```

## Quick Start

```typescript
import { parse, getStyle } from '@componentor/breakpoints';

// 1. Define your styles with conditions
const styles = 'color:blue; dark:color:lightblue; md:font-size:18px';

// 2. Parse once (cache this!)
const parsed = parse(styles);

// 3. Get CSS for different contexts
const css = getStyle(parsed, { theme: 'dark', breakpoint: 'md' });
// Result: "color: lightblue; font-size: 18px;"
```

## Syntax Guide

### Basic Syntax

The format is: `property:value`

```typescript
parse('color:red')
// { property: 'color', value: 'red' }

parse('padding:20px')
// { property: 'padding', value: '20px' }

parse('font-size:16px')
// { property: 'font-size', value: '16px' }
```

### Multiple Styles

Separate multiple styles with semicolons (`;`):

```typescript
parse('color:red; padding:10px; margin:20px')
```

### Conditional Prefixes

Add conditions before the property using colon (`:`) separator:

```typescript
// Theme condition
parse('dark:color:white')

// Breakpoint condition
parse('md:padding:20px')

// State condition
parse('hover:opacity:0.8')

// Multiple conditions (order doesn't matter)
parse('dark:md:hover:background:blue')
parse('md:dark:hover:background:blue') // Same result
```

### Supported Conditions

#### Themes

Built-in: `dark`, `light`

Custom themes are also supported:

```typescript
parse('midnight:color:purple')
parse('highcontrast:border:3px-solid-black')
```

#### Breakpoints

Built-in: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

Custom breakpoints are supported:

```typescript
parse('3xl:padding:50px')
parse('mobile:font-size:14px')
```

#### States

Built-in: `hover`, `active`, `focus`, `visited`, `focus-visible`, `focus-within`, `disabled`, `enabled`, `checked`

Custom states are supported:

```typescript
parse('loading:opacity:0.5')
parse('error:border:red')
```

## Common Patterns

### Theme Switching

```typescript
const styles = parse(`
  background:white;
  color:black;
  border:1px solid gray;
  dark:background:black;
  dark:color:white;
  dark:border:1px solid lightgray
`);

// Light theme
const lightCSS = getStyle(styles, { theme: 'light' });

// Dark theme
const darkCSS = getStyle(styles, { theme: 'dark' });

// No theme specified - returns base styles
const baseCSS = getStyle(styles);
```

### Responsive Design

```typescript
const styles = parse(`
  font-size:14px;
  padding:10px;
  sm:font-size:16px;
  md:font-size:18px;
  md:padding:20px;
  lg:font-size:24px;
  lg:padding:30px
`);

// Mobile (base)
getStyle(styles);
// "font-size: 14px; padding: 10px;"

// Tablet
getStyle(styles, { breakpoint: 'md' });
// "font-size: 18px; padding: 20px;"

// Desktop
getStyle(styles, { breakpoint: 'lg' });
// "font-size: 24px; padding: 30px;"
```

### Interactive States

```typescript
const buttonStyles = parse(`
  background:blue;
  color:white;
  opacity:1;
  transform:scale(1);
  hover:background:darkblue;
  hover:opacity:0.9;
  active:transform:scale(0.95);
  disabled:opacity:0.5;
  disabled:cursor:not-allowed
`);

// Normal state
getStyle(buttonStyles);

// Hover state
getStyle(buttonStyles, { state: 'hover' });

// Active state
getStyle(buttonStyles, { state: 'active' });

// Disabled state
getStyle(buttonStyles, { state: 'disabled' });
```

### Complex Combinations

```typescript
const cardStyles = parse(`
  display:flex;
  flex-direction:column;
  padding:16px;
  background:white;
  border:1px solid gray;
  border:radius:8px;

  hover:shadow:0:4px:12px-rgba(0,0,0,0.1);

  dark:background:gray900;
  dark:border:1px solid gray700;
  dark:color:white;

  dark:hover:shadow:0:4px:12px-rgba(0,0,0,0.5);

  md:flex-direction:row;
  md:padding:24px;

  lg:padding:32px;

  dark:md:hover:border:2px-solid-blue
`);

// Light theme, mobile, normal
getStyle(cardStyles);

// Dark theme, tablet, hover
getStyle(cardStyles, { theme: 'dark', breakpoint: 'md', state: 'hover' });
```

## Framework Integration

### React

```typescript
import { parse, getStyle } from '@componentor/breakpoints';
import { useMemo } from 'react';

function Button({ styleString, theme, breakpoint, state }) {
  // Parse once and memoize
  const parsed = useMemo(() => parse(styleString), [styleString]);

  // Get CSS for current context
  const css = getStyle(parsed, { theme, breakpoint, state });

  return <button style={cssToObject(css)}>Click me</button>;
}

// Helper to convert CSS string to React style object
function cssToObject(cssString) {
  const obj = {};
  cssString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      obj[camelProperty] = value;
    }
  });
  return obj;
}
```

### React with Context

```typescript
import { createContext, useContext, useMemo } from 'react';
import { parse, getStyle, type ParsedStyles } from '@componentor/breakpoints';

// Create context for theme and breakpoint
const StyleContext = createContext({ theme: 'light', breakpoint: 'md' });

function useStyles(styleString: string) {
  const { theme, breakpoint } = useContext(StyleContext);

  const parsed = useMemo(() => parse(styleString), [styleString]);
  const css = useMemo(
    () => getStyle(parsed, { theme, breakpoint }),
    [parsed, theme, breakpoint]
  );

  return css;
}

// Usage
function MyComponent() {
  const css = useStyles('color:black; dark:color:white; md:font-size:18px');
  return <div style={cssToObject(css)}>Content</div>;
}
```

### Vue 3

```vue
<script setup>
import { computed } from 'vue';
import { parse, getStyle } from '@componentor/breakpoints';

const props = defineProps({
  styles: String,
  theme: String,
  breakpoint: String,
});

const parsed = computed(() => parse(props.styles));
const css = computed(() =>
  getStyle(parsed.value, {
    theme: props.theme,
    breakpoint: props.breakpoint
  })
);

const styleObject = computed(() => {
  const obj = {};
  css.value.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      obj[property] = value;
    }
  });
  return obj;
});
</script>

<template>
  <div :style="styleObject">
    <slot />
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { parse, getStyle } from '@componentor/breakpoints';

  export let styles = '';
  export let theme = 'light';
  export let breakpoint = 'md';

  $: parsed = parse(styles);
  $: css = getStyle(parsed, { theme, breakpoint });

  function cssToObject(cssString) {
    const obj = {};
    cssString.split(';').forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) obj[property] = value;
    });
    return obj;
  }

  $: styleObject = cssToObject(css);
</script>

<div style={Object.entries(styleObject).map(([k, v]) => `${k}:${v}`).join(';')}>
  <slot />
</div>
```

### Vanilla JavaScript

```javascript
import { parse, getStyle } from '@componentor/breakpoints';

class StyledElement {
  constructor(element, styleString) {
    this.element = element;
    this.parsed = parse(styleString);
    this.theme = 'light';
    this.breakpoint = 'md';
    this.state = null;
    this.render();
  }

  setTheme(theme) {
    this.theme = theme;
    this.render();
  }

  setBreakpoint(breakpoint) {
    this.breakpoint = breakpoint;
    this.render();
  }

  setState(state) {
    this.state = state;
    this.render();
  }

  render() {
    const css = getStyle(this.parsed, {
      theme: this.theme,
      breakpoint: this.breakpoint,
      state: this.state,
    });

    // Apply styles
    css.split(';').forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        this.element.style[property] = value;
      }
    });
  }
}

// Usage
const element = document.querySelector('.my-element');
const styled = new StyledElement(
  element,
  'color:black; dark:color:white; md:font-size:18px'
);

// Change theme
styled.setTheme('dark');

// Change breakpoint
styled.setBreakpoint('lg');
```

## Best Practices

### 1. Parse Once, Use Many Times

```typescript
// ❌ Bad - parsing on every render
function Component({ theme }) {
  const css = getStyle(parse('color:red; dark:color:blue'), { theme });
  return <div style={css} />;
}

// ✅ Good - parse once
const PARSED_STYLES = parse('color:red; dark:color:blue');

function Component({ theme }) {
  const css = getStyle(PARSED_STYLES, { theme });
  return <div style={css} />;
}
```

### 2. Organize Styles by Component

```typescript
// styles.ts
export const BUTTON_STYLES = parse(`
  display:inline-flex;
  padding:12px:24px;
  background:blue;
  hover:background:darkblue
`);

export const CARD_STYLES = parse(`
  background:white;
  padding:20px;
  dark:background:gray900
`);

// component.tsx
import { BUTTON_STYLES } from './styles';
```

### 3. Use Constants for Common Values

```typescript
const SPACING = {
  small: '8px',
  medium: '16px',
  large: '24px',
};

const styles = parse(`
  padding-${SPACING.medium};
  md:padding-${SPACING.large}
`);
```

### 4. Combine with CSS Variables

```typescript
const styles = parse(`
  color:var(--primary-color);
  background:var(--bg-color);
  dark:color:var(--primary-color:dark);
  dark:background:var(--bg-color:dark)
`);
```

### 5. Create Helper Functions

```typescript
function createResponsiveStyle(
  property: string,
  mobile: string,
  tablet: string,
  desktop: string
) {
  return `${property}-${mobile}; md:${property}-${tablet}; lg:${property}-${desktop}`;
}

const styles = parse(
  createResponsiveStyle('font-size', '14px', '16px', '18px')
);
```

## Performance Tips

### 1. Cache Parsed Objects

```typescript
const styleCache = new Map();

function getCachedParse(styleString) {
  if (!styleCache.has(styleString)) {
    styleCache.set(styleString, parse(styleString));
  }
  return styleCache.get(styleString);
}
```

### 2. Avoid Unnecessary Re-parsing

```typescript
// ❌ Bad - creates new string on every render
const styles = parse(`color-${dynamicColor}; padding:10px`);

// ✅ Good - parse separately and combine
const baseStyles = parse('padding:10px');
const dynamicStyles = parse(`color-${dynamicColor}`);
```

### 3. Use Memoization in React

```typescript
const parsed = useMemo(() => parse(styleString), [styleString]);
const css = useMemo(
  () => getStyle(parsed, { theme, breakpoint }),
  [parsed, theme, breakpoint]
);
```

### 4. Benchmark Results

Based on performance tests:

- Simple parse: ~0.05ms per operation
- Complex parse: ~0.15ms per operation
- Style extraction: ~0.01ms per operation

Parsing 1000 component styles and extracting for 5 contexts takes ~5ms total.

## Troubleshooting

### Issue: Property not recognized correctly

If a CSS property with dashes is not being parsed correctly:

```typescript
// The library recognizes common properties like 'font-family'
parse('font-family:Arial') // ✅ Works

// For unknown properties, it uses the first segment
parse('custom-property-value') // property: 'custom', value: 'property-value'
```

**Solution**: Add the property to the known properties list or structure your style differently.

### Issue: Value contains dashes

For values with dashes, they are preserved:

```typescript
parse('margin:0-auto') // property: 'margin', value: '0-auto'
```

**Note**: In actual CSS, you'd use `margin: 0 auto`, but in this format, use dashes: `0-auto`.

### Issue: Condition not matching

Ensure you're passing the correct options:

```typescript
const parsed = parse('dark:color:white');

// ❌ Won't match
getStyle(parsed, { theme: 'light' });

// ✅ Matches
getStyle(parsed, { theme: 'dark' });

// ❌ Won't match (missing theme)
getStyle(parsed);
```

### Issue: Multiple conditions not working

All conditions must match:

```typescript
const parsed = parse('dark:md:color:blue');

// ❌ Won't match (missing breakpoint)
getStyle(parsed, { theme: 'dark' });

// ✅ Matches (all conditions present)
getStyle(parsed, { theme: 'dark', breakpoint: 'md' });
```

## Advanced Examples

### Creating a Theme System

```typescript
interface Theme {
  name: string;
  colors: Record<string, string>;
}

const themes: Theme[] = [
  { name: 'light', colors: { primary: 'blue', bg: 'white' } },
  { name: 'dark', colors: { primary: 'lightblue', bg: 'black' } },
];

function createThemedStyles(baseStyles: string, themeColors: Theme[]) {
  const styles = [baseStyles];

  themeColors.forEach(theme => {
    Object.entries(theme.colors).forEach(([key, value]) => {
      styles.push(`${theme.name}:--color-${key}-${value}`);
    });
  });

  return parse(styles.join('; '));
}
```

### Creating a Breakpoint Hook (React)

```typescript
import { useState, useEffect } from 'react';

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Usage
function Component() {
  const breakpoint = useBreakpoint();
  const css = getStyle(PARSED_STYLES, { breakpoint });
  // ...
}
```

## Questions?

For more examples, see the [example.html](example.html) file or check the test files in the repository.
