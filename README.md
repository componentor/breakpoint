# @componentor/breakpoints

A TypeScript library for parsing and managing CSS styles with breakpoints, themes, and states in a compact syntax.

## Features

- Parse enhanced style strings with conditional prefixes
- Support for themes (dark/light/custom)
- Support for breakpoints (xs/sm/md/lg/xl/2xl/custom)
- Support for states (hover/active/focus/etc.)
- Full TypeScript support with type definitions
- ESM modules that work in browsers and Node.js
- Zero dependencies
- Comprehensive test coverage

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

### Types

```typescript
type Theme = 'dark' | 'light' | string;
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
type State = 'hover' | 'active' | 'focus' | 'visited' | 'disabled' | string;

interface GetStyleOptions {
  theme?: Theme;
  state?: State;
  breakpoint?: Breakpoint;
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
