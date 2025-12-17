# Theme Strategies

The library supports two different theme matching strategies to accommodate different theming approaches.

## Strategies

### 1. Strict (Default)

Matches only the exact theme specified. Base styles are always included.

```typescript
const styles = parse('color:blue; dark:color:white; light:color:black');

getStyle(styles, { theme: 'dark' });
// Returns: "color: white;"
// Only includes base + dark

getStyle(styles, { theme: 'dark', themeStrategy: 'strict' });
// Returns: "color: white;"
// Same as above (explicit)
```

**Use case**: When you want precise control and each theme defines its own complete styles without borrowing from other themes.

### 2. Fallback

Uses other available themes when the requested theme doesn't exist for a property. Enables graceful degradation across themes.

```typescript
const styles = parse('color:blue; dark:color:white');

getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
// Returns: "color: white;"
// No light:color exists, falls back to dark:color

getStyle(styles, { theme: 'midnight', themeStrategy: 'fallback' });
// Returns: "color: white;"
// No midnight:color exists, falls back to dark:color
```

**Use case**: Flexible theming where you want themes to share styles when specific theme variants aren't defined.

## Fallback Priority System

When using `themeStrategy: 'fallback'`, the priority is:

1. **Exact theme match** (highest priority)
2. **Other theme fallback**
3. **Base styles** (lowest priority, always included)

However, the priority is **context-aware** based on breakpoints and states:

### Without Breakpoint/State Context

```typescript
const styles = parse('background:gray; dark:background:black');

getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
// Returns: "background: black;"
// Falls back to dark theme (no base preferred)
```

### With Breakpoint Context

When a breakpoint is requested, base styles at that context are preferred over themed fallbacks:

```typescript
const styles = parse(`
  color:black;
  md:padding:20px;
  dark:color:white;
  dark:md:padding:30px
`);

getStyle(styles, {
  theme: 'light',
  breakpoint: 'md',
  themeStrategy: 'fallback'
});
// Returns: "color: black; padding: 20px;"
// Uses base (color:black, md:padding:20px)
// NOT dark fallback (dark:color:white has no breakpoint context)
```

**Rule**: If a breakpoint is requested but the themed fallback doesn't have that breakpoint, prefer base styles.

### With State Context

Similarly, when a state is requested, base styles are preferred over themed fallbacks without that state:

```typescript
const styles = parse(`
  background:blue;
  dark:background:lightblue;
  active:transform:scale(0.98)
`);

getStyle(styles, {
  theme: 'light',
  states: ['active'],
  themeStrategy: 'fallback'
});
// Returns: "background: blue; transform: scale(0.98);"
// Uses base background (not dark fallback without state context)
```

## Fallback Order with Multiple Themes

When multiple themes exist and fallback is needed, the **first matching theme in parse order** is used:

```typescript
const styles = parse('color:red; dark:color:blue; midnight:color:purple; sunset:color:orange');

getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
// Returns: "color: blue;"
// Uses dark:color (first theme found in parse order)
```

**Best Practice**: Define themes in a consistent order (e.g., always `dark` before `light`) for predictable fallback behavior.

## Custom Themes

The library supports **unlimited custom theme names** beyond just `dark` and `light`:

```typescript
const styles = parse(`
  background:white;
  dark:background:black;
  midnight:background:#1a1a2e;
  sunset:background:#ff6b6b;
  ocean:background:#006994
`);

getStyle(styles, { theme: 'midnight', themeStrategy: 'strict' });
// Returns: "background: #1a1a2e;"

getStyle(styles, { theme: 'forest', themeStrategy: 'fallback' });
// Returns: "background: black;"
// No forest theme, falls back to dark (first available)
```

### Important: Naming Conventions

**Avoid naming themes the same as breakpoints or states**:

```typescript
// ❌ BAD - 'md' conflicts with breakpoint
const bad = parse('md:background:blue');
// Interpreted as breakpoint, not theme!

// ✅ GOOD - Use distinct theme names
const good = parse('medium-theme:background:blue');
// Clearly a custom theme
```

**Condition Resolution Order**:
1. If name matches known breakpoint → treat as breakpoint
2. Else if name matches known state → treat as state
3. Else → treat as custom theme

Known breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
Known states: `hover`, `active`, `focus`, `visited`, `focus-visible`, `focus-within`, `disabled`, `enabled`, `checked`

## Combining with Breakpoint Strategies

Theme strategies work seamlessly with breakpoint strategies:

```typescript
const styles = parse(`
  font-size:14px;
  sm:font-size:16px;
  md:font-size:18px;
  dark:font-size:15px;
  dark:md:font-size:20px
`);

// Mobile-first with theme fallback
getStyle(styles, {
  theme: 'light',
  breakpoint: 'md',
  breakpointStrategy: 'mobile-first',
  themeStrategy: 'fallback'
});
// Returns: "font-size: 18px;"
// Includes base → sm → md (mobile-first)
// Light theme doesn't have md:font-size, uses base md:font-size
```

## Real-World Examples

### System Theme Detection

```typescript
import { parse, getStyle } from '@componentor/adaptive';

// Detect system preference
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

const buttonStyles = parse(`
  background:blue;
  color:white;
  padding:10px 20px;
  dark:background:#1e40af;
  light:background:#3b82f6;
  hover:opacity:0.9;
  dark:hover:opacity:0.8
`);

const css = getStyle(buttonStyles, {
  theme: systemTheme,
  states: ['hover'],
  themeStrategy: 'fallback'
});
```

### Multi-Brand Theming

```typescript
const brandStyles = parse(`
  --primary:blue;
  --secondary:gray;
  brand-a:--primary:#ff6b6b;
  brand-a:--secondary:#4ecdc4;
  brand-b:--primary:#95e1d3;
  brand-b:--secondary:#f38181;
  dark:--primary:lightblue;
  dark:--secondary:lightgray
`);

// Use brand theme with fallback to dark
function getBrandStyles(brand: string) {
  return getStyle(brandStyles, {
    theme: brand,
    themeStrategy: 'fallback'
  });
}

getBrandStyles('brand-a'); // Uses brand-a colors
getBrandStyles('brand-c'); // Falls back to dark colors
```

### Component Library Theming

```typescript
const cardStyles = parse(`
  background:white;
  border:1px solid #e5e7eb;
  padding:1rem;
  border-radius:0.5rem;

  dark:background:#1f2937;
  dark:border:1px solid #374151;

  light:background:#ffffff;
  light:border:1px solid #d1d5db;

  hover:shadow:0 4px 6px rgba(0,0,0,0.1);
  dark:hover:shadow:0 4px 6px rgba(0,0,0,0.3)
`);

function Card({ theme = 'light', children }) {
  const css = getStyle(cardStyles, {
    theme,
    states: isHovered ? ['hover'] : undefined,
    themeStrategy: 'fallback'
  });

  return <div style={parseCSS(css)}>{children}</div>;
}
```

## Best Practices

### 1. Use Strict for Explicit Theming

When each theme should have complete, independent styles:

```typescript
const strictStyles = parse(`
  color:black;
  background:white;
  dark:color:white;
  dark:background:black;
  light:color:#111;
  light:background:#fafafa
`);

// Each theme gets exactly what's defined
getStyle(strictStyles, { theme: 'dark', themeStrategy: 'strict' });
```

### 2. Use Fallback for Graceful Degradation

When themes can share base styles:

```typescript
const fallbackStyles = parse(`
  padding:1rem;
  margin:0.5rem;
  dark:color:white;
  dark:background:black
`);

// Custom themes inherit base layout, override colors
getStyle(fallbackStyles, { theme: 'custom', themeStrategy: 'fallback' });
```

### 3. Consistent Theme Ordering

Define themes in a predictable order:

```typescript
// ✅ GOOD - Consistent order
const good = parse(`
  color:gray;
  dark:color:white;
  light:color:black;
  midnight:color:purple
`);

// ❌ LESS IDEAL - Random order makes fallback unpredictable
const lessIdeal = parse(`
  color:gray;
  midnight:color:purple;
  dark:color:white;
  light:color:black
`);
```

### 4. Document Your Theme Names

Keep a reference of custom theme names:

```typescript
// themes.ts
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  MIDNIGHT: 'midnight',
  SUNSET: 'sunset',
  OCEAN: 'ocean'
} as const;

export type AppTheme = typeof THEMES[keyof typeof THEMES];
```

### 5. Combine with Breakpoints Thoughtfully

Use breakpoint context to control fallback behavior:

```typescript
const responsive = parse(`
  width:100%;
  padding:1rem;
  md:width:768px;
  md:padding:2rem;
  dark:background:black;
  dark:md:background:#1a1a1a
`);

// At 'md' breakpoint, prefer base layout over dark fallback
getStyle(responsive, {
  theme: 'light',
  breakpoint: 'md',
  themeStrategy: 'fallback'
});
```

## Default Behavior

If no `themeStrategy` is specified, the default is **'strict'** for backwards compatibility:

```typescript
// These are equivalent:
getStyle(styles, { theme: 'dark' });
getStyle(styles, { theme: 'dark', themeStrategy: 'strict' });
```

## Performance

Both strategies have similar performance characteristics. The fallback strategy performs additional checks but these are optimized for typical use cases:

```typescript
// Both are fast (~0.001-0.003ms per operation)
getStyle(styles, { theme: 'dark', themeStrategy: 'strict' });
getStyle(styles, { theme: 'dark', themeStrategy: 'fallback' });
```

For extremely large style sets (100+ properties), consider caching parsed results:

```typescript
// Parse once, reuse many times
const parsed = parse(largeStyleString);

// Fast subsequent lookups
const darkCSS = getStyle(parsed, { theme: 'dark', themeStrategy: 'fallback' });
const lightCSS = getStyle(parsed, { theme: 'light', themeStrategy: 'fallback' });
```
