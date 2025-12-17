# Quick Start Guide

Get started with `@componentor/adaptive` in 5 minutes!

## Installation

```bash
npm install @componentor/adaptive
```

## Basic Usage

```typescript
import { parse, getStyle } from '@componentor/adaptive';

// 1. Parse your style string (do this once, cache the result)
const styles = parse('color:blue; dark:color:white; md:font-size:18px');

// 2. Get CSS for your current context
const css = getStyle(styles, { theme: 'dark', breakpoint: 'md' });
// Result: "color: white; font-size: 18px;"
```

## Syntax

Format: `condition1:condition2:property:value;`

- **No conditions**: `color:red` → Always applies
- **With theme**: `dark:color:white` → Applies in dark theme
- **With breakpoint**: `md:padding:20px` → Applies at md breakpoint
- **With state**: `hover:opacity:0.8` → Applies on hover
- **Combined**: `dark:md:hover:background:blue` → All conditions must match

## Common Patterns

### Responsive Design

```typescript
const styles = parse(`
  font-size:14px;
  sm:font-size:16px;
  md:font-size:18px;
  lg:font-size:20px
`);

// Mobile
getStyle(styles); // "font-size: 14px;"

// Desktop
getStyle(styles, { breakpoint: 'lg' }); // "font-size: 20px;"
```

### Dark Mode

```typescript
const styles = parse(`
  background:white;
  color:black;
  dark:background:black;
  dark:color:white
`);

// Light theme
getStyle(styles, { theme: 'light' });
// "background: white; color: black;"

// Dark theme
getStyle(styles, { theme: 'dark' });
// "background: black; color: white;"
```

### Interactive States

```typescript
const button = parse(`
  background:blue;
  color:white;
  hover:background:darkblue;
  active:transform:scale(0.95)
`);

// Normal
getStyle(button); // "background: blue; color: white;"

// Hover
getStyle(button, { states: ['hover'] });
// "background: darkblue; color: white;"
```

## React Example

```typescript
import { parse, getStyle } from '@componentor/adaptive';
import { useMemo } from 'react';

// Parse once outside component
const BUTTON_STYLES = parse(`
  padding:12px 24px;
  background:blue;
  color:white;
  hover:background:darkblue;
  dark:background:lightblue
`);

function Button({ theme, isHovered }) {
  const css = useMemo(
    () => getStyle(BUTTON_STYLES, {
      theme,
      states: isHovered ? ['hover'] : undefined
    }),
    [theme, isHovered]
  );

  // Convert CSS string to React style object
  const style = cssStringToObject(css);

  return <button style={style}>Click me</button>;
}
```

## Vanilla JavaScript Example

```javascript
import { parse, getStyle } from '@componentor/adaptive';

const styles = parse('color:black; dark:color:white');

// Detect theme
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDark ? 'dark' : 'light';

// Apply styles
const css = getStyle(styles, { theme });
document.body.setAttribute('style', css);
```

## Performance Tips

### 1. Parse Once

```typescript
// ❌ Bad - parsing every time
function render() {
  const styles = parse('color:red');
  return getStyle(styles);
}

// ✅ Good - parse once
const STYLES = parse('color:red');
function render() {
  return getStyle(STYLES);
}
```

### 2. Cache Results

```typescript
const cache = new Map();

function getStylesCached(styleString, options) {
  const key = `${styleString}-${JSON.stringify(options)}`;
  if (!cache.has(key)) {
    const parsed = parse(styleString);
    cache.set(key, getStyle(parsed, options));
  }
  return cache.get(key);
}
```

## Supported Conditions

### Themes
- Built-in: `dark`, `light`
- Custom: Any string (e.g., `midnight`, `highcontrast`)

### Breakpoints
- Built-in: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- Custom: Any string (e.g., `3xl`, `mobile`)

### States
- Built-in: `hover`, `active`, `focus`, `visited`, `disabled`, `checked`
- Custom: Any string (e.g., `loading`, `error`)

## Next Steps

- Read the [full documentation](./USAGE.md) for advanced patterns
- Check out [example.html](./example.html) for a browser demo
- See [README.md](./README.md) for API reference

## Questions?

- File an issue on GitHub
- Check the [USAGE.md](./USAGE.md) for troubleshooting
- See test files for more examples
