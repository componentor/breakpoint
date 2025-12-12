# @componentor/breakpoints

A TypeScript library for parsing and managing CSS styles with breakpoints, themes, and states in a compact syntax.

## Features

- Parse enhanced style strings with conditional prefixes
- **Unlimited custom themes** (dark/light/custom) with smart fallback strategies
- **Breakpoint strategies** (mobile-first/desktop-first/exact) for responsive design
- Support for interactive states (hover/active/focus/etc.)
- **Theme strategies** (strict/fallback) for graceful degradation
- System theme detection support
- Full TypeScript support with type definitions
- ESM modules that work in browsers and Node.js
- Zero dependencies
- Comprehensive test coverage (103 tests)

## Installation

```bash
npm install @componentor/breakpoints
```

## Usage

### Basic Example

```typescript
import { parse, getStyle } from '@componentor/breakpoints';

// Parse a style string
const styleString = 'color:red; padding:10px; dark:color:white';
const parsed = parse(styleString);

// Get CSS for different contexts
const lightCSS = getStyle(parsed, { theme: 'light' });
// Returns: "color: red; padding: 10px;"

const darkCSS = getStyle(parsed, { theme: 'dark' });
// Returns: "color: white; padding: 10px;"
```

### Syntax

The format follows HTML style attributes, but with optional conditional prefixes:

```
${condition1}:${condition2}:${property}:${value};
```

Where conditions can be:
- **Theme**: `dark`, `light`, or custom theme names
- **Breakpoint**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, or custom breakpoints
- **State**: `hover`, `active`, `focus`, `visited`, `focus-visible`, `disabled`, etc.

### Examples

#### Theme-based Styling

```typescript
const parsed = parse('background:white; color-black; dark:background:black; dark:color:white');

getStyle(parsed, { theme: 'light' });
// "background: white; color: black;"

getStyle(parsed, { theme: 'dark' });
// "background: black; color: white;"
```

#### Responsive Design

```typescript
const parsed = parse('font-size:14px; sm:font-size-16px; md:font-size:18px; lg:font-size:24px');

getStyle(parsed); // Mobile
// "font-size: 14px;"

getStyle(parsed, { breakpoint: 'md' }); // Tablet
// "font-size: 18px;"

getStyle(parsed, { breakpoint: 'lg' }); // Desktop
// "font-size: 24px;"
```

#### Interactive States

```typescript
const parsed = parse('opacity:1; color:blue; hover:opacity:0.8; hover:color:darkblue');

getStyle(parsed); // Normal state
// "opacity: 1; color: blue;"

getStyle(parsed, { state: 'hover' }); // Hover state
// "opacity: 0.8; color: darkblue;"
```

#### Combined Conditions

```typescript
const parsed = parse('padding:10px; dark:md:hover:padding:30px; dark:md:hover:background:purple');

// Base styling
getStyle(parsed);
// "padding: 10px;"

// Dark theme + tablet + hover
getStyle(parsed, { theme: 'dark', breakpoint: 'md', state: 'hover' });
// "padding: 30px; background: purple;"
```

#### Real-World Component

```typescript
const buttonStyles = parse(`
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:12px-24px;
  background:blue;
  color:white;
  border-radius:4px;
  cursor:pointer;
  hover:background:darkblue;
  active:transform:scale(0.98);
  disabled:opacity:0.5;
  disabled:cursor:not-allowed;
  dark:background:lightblue;
  dark:hover:background:blue;
  md:padding:16px-32px;
  lg:font-size:18px
`);

// Mobile, light theme, normal state
getStyle(buttonStyles);

// Desktop, dark theme, hover state
getStyle(buttonStyles, { breakpoint: 'lg', theme: 'dark', state: 'hover' });
```

## Theme Strategies

The library supports two theme matching strategies:

### Strict (Default)

Only matches the exact theme specified:

```typescript
const styles = parse('color:blue; dark:color:white; light:color:black');

getStyle(styles, { theme: 'dark' });
// Returns: "color: white;"

getStyle(styles, { theme: 'custom' });
// Returns: "color: blue;" (only base, no custom theme defined)
```

### Fallback

Automatically falls back to other available themes when the requested theme doesn't exist:

```typescript
const styles = parse('color:blue; dark:color:white');

// Light theme doesn't exist, falls back to dark
getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
// Returns: "color: white;"

// Custom theme doesn't exist, falls back to dark
getStyle(styles, { theme: 'midnight', themeStrategy: 'fallback' });
// Returns: "color: white;"
```

### Helper for Common Pattern

Use `getThemedStyle` for automatic dark/light theming with fallback:

```typescript
import { parse, getThemedStyle } from '@componentor/breakpoints';

const styles = parse('bg:white; dark:bg:black; color:gray; dark:color:white');

// Light theme (default)
getThemedStyle(styles, {});
// Returns: "bg: white; color: gray;"

// Dark theme
getThemedStyle(styles, {}, true);
// Returns: "bg: black; color: white;"

// With breakpoints and states
getThemedStyle(styles, { breakpoint: 'md', state: 'hover' });
```

### System Theme Detection

```typescript
// Detect user's system preference
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

const styles = parse(`
  background:white;
  color:black;
  dark:background:#1a1a1a;
  dark:color:#e5e5e5
`);

const css = getStyle(styles, {
  theme: systemTheme,
  themeStrategy: 'fallback'
});
```

See [THEME_STRATEGIES.md](THEME_STRATEGIES.md) for detailed documentation.

## Custom Themes

The library supports **unlimited custom theme names** beyond `dark` and `light`:

```typescript
const styles = parse(`
  background:white;
  dark:background:black;
  midnight:background:#1a1a2e;
  sunset:background:#ff6b6b;
  ocean:background:#006994
`);

getStyle(styles, { theme: 'midnight' });
// Returns: "background: #1a1a2e;"

getStyle(styles, { theme: 'sunset' });
// Returns: "background: #ff6b6b;"
```

### Important: Avoid Name Conflicts

**Do not use the same names as breakpoints or states for themes:**

```typescript
// ❌ BAD - 'md' is a known breakpoint
parse('md:background:blue');
// Interpreted as breakpoint, not theme!

// ✅ GOOD - Use distinct theme names
parse('medium-theme:background:blue');
// Clearly a custom theme
```

**Condition Resolution Order:**
1. If name matches a known breakpoint (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`) → treated as **breakpoint**
2. Else if name matches a known state (`hover`, `active`, `focus`, etc.) → treated as **state**
3. Else → treated as **custom theme**

This allows infinite theme names while maintaining predictable behavior. Just avoid using `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `hover`, `active`, `focus`, `visited`, `focus-visible`, `focus-within`, `disabled`, `enabled`, or `checked` as theme names.

## Breakpoint Strategies

The library supports three breakpoint matching strategies:

```typescript
const styles = parse('font-size:14px; sm:font-size:16px; md:font-size:18px; lg:font-size:20px');

// Exact (default): Only match the specified breakpoint
getStyle(styles, { breakpoint: 'md' });
// Returns: "font-size: 18px;"

// Mobile-first: Include base up to current breakpoint
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
// Returns: "font-size: 18px;" (includes base → sm → md)

// Desktop-first: Include current breakpoint and larger
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });
// Returns: "font-size: 20px;" (includes md → lg)
```

See [BREAKPOINT_STRATEGIES.md](BREAKPOINT_STRATEGIES.md) for detailed documentation.

## API

### `parse(input: string): ParsedStyles`

Parses an enhanced style string into a structured object.

**Parameters:**
- `input` - Style string with optional conditional prefixes

**Returns:**
- `ParsedStyles` object containing parsed style rules

### `getStyle(parsedStyles: ParsedStyles, options?: GetStyleOptions): string`

Extracts CSS styles matching the given context.

**Parameters:**
- `parsedStyles` - The parsed styles object from `parse()`
- `options` - Optional context (theme, state, breakpoint)

**Returns:**
- CSS style string with matching properties

### `getThemedStyle(parsedStyles: ParsedStyles, options?, preferDark?): string`

Convenience helper for dark/light theming with automatic fallback. Always uses `themeStrategy: 'fallback'`.

**Parameters:**
- `parsedStyles` - The parsed styles object from `parse()`
- `options` - Optional context (breakpoint, state, theme)
- `preferDark` - If `true`, uses 'dark' theme; if `false`, uses 'light' theme (default: `false`)

**Returns:**
- CSS style string with matching properties

**Example:**
```typescript
const styles = parse('bg:white; dark:bg:black');

getThemedStyle(styles, {});           // Light theme
getThemedStyle(styles, {}, true);     // Dark theme
getThemedStyle(styles, { theme: 'custom' }); // Custom theme with fallback
```

### Types

```typescript
type Theme = 'dark' | 'light' | string;
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
type State = 'hover' | 'active' | 'focus' | 'visited' | 'disabled' | string;
type BreakpointStrategy = 'mobile-first' | 'desktop-first' | 'exact';
type ThemeStrategy = 'strict' | 'fallback';

interface GetStyleOptions {
  theme?: Theme;
  state?: State;
  breakpoint?: Breakpoint;
  breakpointStrategy?: BreakpointStrategy;
  themeStrategy?: ThemeStrategy;
}

interface ParsedStyles {
  styles: ParsedStyle[];
}

interface ParsedStyle {
  property: string;
  value: string;
  conditions: StyleConditions;
}
```

## Browser Usage

The library works directly in browsers using ESM imports:

```html
<script type="module">
  import { parse, getStyle } from './dist/index.js';

  const parsed = parse('color:blue; dark:color-lightblue');
  console.log(getStyle(parsed, { theme: 'dark' }));
</script>
```

See [example.html](example.html) for a complete browser demo.

## CSS Property Support

The parser recognizes common CSS properties including:
- Layout: `display`, `position`, `flex`, `grid`, `gap`
- Spacing: `margin`, `padding`, `margin-top`, `padding-left`, etc.
- Sizing: `width`, `height`, `min-width`, `max-height`, etc.
- Colors: `color`, `background`, `background-color`, etc.
- Typography: `font-family`, `font-size`, `font-weight`, `line-height`, etc.
- Borders: `border`, `border-radius`, `border-color`, etc.
- Effects: `opacity`, `box-shadow`, `text-shadow`, `transform`, `transition`

For unknown properties, the parser uses a heuristic approach (first segment as property name).

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Watch mode for tests
npm run test:watch
```

## License

MIT
