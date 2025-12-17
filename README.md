# @componentor/adaptive

> Write styles once. Use them everywhere.

A compact, powerful syntax for responsive, themed, and stateful CSS—all in one string.

```typescript
parse('bg:blue; text:white; hover:bg:navy; dark:bg:purple; md:p:20px')
```

Instead of juggling CSS files, media queries, and theme logic, write `dark:md:hover:bg:purple` and move on with your life.

---

## ⚡ Quick Start

**1. Install**
```bash
npm install @componentor/adaptive
```

**2. Write your first style**
```typescript
import { parse, getStyle } from '@componentor/adaptive';

const styles = parse('bg:blue; text:white; hover:bg:darkblue; dark:bg:purple');

getStyle(styles);                           // → "background: blue; color: white;"
getStyle(styles, { states: ['hover'] });    // → "background: darkblue; color: white;"
getStyle(styles, { theme: 'dark' });        // → "background: purple; color: white;"
```

**That's it!** 🎉 You're managing themes, states, and responsive design with simple colon syntax.

---

## 🚀 What Can You Do?

| Feature | Example | Result |
|---------|---------|--------|
| **Themes** | `dark:bg:black` | Different colors for dark mode |
| **Breakpoints** | `md:p:20px` | Responsive padding on tablets |
| **States** | `hover:opacity:0.8` | Hover effects |
| **Multiple States** | `hover:active:bg:red` | Combine states! |
| **Combine All** | `dark:md:hover:bg:purple` | All conditions at once! |
| **Aliases** | `bg` instead of `background` | 95+ shortcuts built-in |
| **Custom Themes** | `sunset:bg:orange` | Name your themes anything |

---

## 💡 Why Use This?

**The Old Way:**
```css
.button {
  background: blue;
}
.button:hover {
  background: darkblue;
}
@media (min-width: 768px) {
  .button {
    padding: 20px;
  }
}
@media (prefers-color-scheme: dark) {
  .button {
    background: purple;
  }
  .button:hover {
    background: navy;
  }
}
```

**The New Way:**
```typescript
parse('bg:blue; hover:bg:darkblue; md:p:20px; dark:bg:purple; dark:hover:bg:navy')
```

Same functionality. **90% less code.** No CSS file needed.

---

## 🎨 Examples That'll Make You Smile

### Build a Complete Button

```typescript
const button = parse(`
  bg:blue; text:white; p:12px 24px; rounded:8px; cursor:pointer;
  hover:bg:darkblue;
  active:scale(0.98);
  disabled:opacity:0.5;
  dark:bg:purple; dark:hover:bg:navy;
  md:p:16px 32px;
  lg:text:18px
`);

// Mobile light mode → Blue button, 12px padding
getStyle(button);

// Desktop dark mode hover → Navy button, 16px padding, 18px text
getStyle(button, { breakpoint: 'lg', theme: 'dark', states: ['hover'] });
```

### Responsive Card Layout

```typescript
const card = parse(`
  bg:white; p:1rem; shadow:0 2px 4px rgba(0,0,0,0.1); rounded:8px;
  md:p:1.5rem;
  lg:p:2rem;
  dark:bg:#1f2937; dark:shadow:0 2px 8px rgba(0,0,0,0.3);
  hover:shadow:0 4px 12px rgba(0,0,0,0.15)
`);
```

### Auto Dark Mode

```typescript
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const styles = parse('bg:white; text:black; dark:bg:black; dark:text:white');

getThemedStyle(styles, {}, isDark);  // Automatically picks the right theme!
```

---

## 🎯 The Syntax (It's Super Simple)

```
condition:condition:property:value;
```

**Conditions** can be:
- **Theme**: `dark`, `light`, or `midnight`, `sunset`, `ocean` (you name it!)
- **Breakpoint**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- **State**: `hover`, `focus`, `active`, `disabled`, etc.

**Mix and match:**
```typescript
'color:blue'                    // Base color
'dark:color:white'              // Dark theme
'md:color:purple'               // Medium breakpoint
'hover:color:red'               // Hover state
'hover:active:bg:red'           // Multiple states! 🆕
'dark:md:hover:color:orange'    // All three! 🔥
```

**CamelCase & PascalCase properties work too!** 🆕
```typescript
parse('fontSize:16px');           // → font-size: 16px
parse('backgroundColor:blue');    // → background-color: blue
parse('borderTopLeftRadius:8px'); // → border-top-left-radius: 8px
```

---

## ✨ Property Aliases (Type Less, Do More)

We've got **95+ shortcuts** so you can write styles faster:

```typescript
// These are the same:
parse('background:blue; color:white; padding:20px; box-shadow:0 2px 4px black');
parse('bg:blue; text:white; p:20px; shadow:0 2px 4px black');  // ✨ Much better!
```

### Popular Aliases

| Alias | Full Property |
|-------|--------------|
| `bg` | `background` |
| `text` | `color` |
| `op` | `opacity` |
| `p` | `padding` |
| `m` | `margin` |
| `w` | `width` |
| `h` | `height` |
| `fw` | `font-weight` |
| `rounded` | `border-radius` |
| `shadow` | `box-shadow` |
| `justify` | `justify-content` |
| `items` | `align-items` |
| `grid-cols` | `grid-template-columns` |
| `inset` | `inset` |

[See all 95+ aliases →](src/aliases.ts)

### Make Your Own Aliases

```typescript
import { registerAlias } from '@componentor/adaptive';

registerAlias('bgc', 'background-color');
registerAlias('fw', 'font-weight');

parse('bgc:red; fw:bold');  // Works! 🎉
```

---

## 🎭 Theme Strategies

### Default: Strict Mode

Only uses the exact theme you ask for:

```typescript
const styles = parse('color:gray; dark:color:white; light:color:black');

getStyle(styles, { theme: 'dark' });   // → "color: white;"
getStyle(styles, { theme: 'custom' }); // → "color: gray;" (no custom theme, uses base)
```

### Fallback Mode (Smart!)

Automatically finds the best match when your theme doesn't exist:

```typescript
const styles = parse('color:gray; dark:color:white');

// Light theme doesn't exist, so falls back to dark
getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
// → "color: white;"
```

**Pro tip:** Use `getThemedStyle()` for automatic dark/light switching:

```typescript
const styles = parse('bg:white; dark:bg:black');

getThemedStyle(styles, {});        // Light mode
getThemedStyle(styles, {}, true);  // Dark mode
```

---

## 📱 Responsive Breakpoint Strategies

Choose how breakpoints cascade:

```typescript
const styles = parse('size:14px; sm:size:16px; md:size:18px; lg:size:20px');
```

### Exact (Default)
```typescript
getStyle(styles, { breakpoint: 'md' });
// → "font-size: 18px;"  (only md)
```

### Mobile-First
```typescript
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
// → "font-size: 18px;"  (base → sm → md, last wins)
```

### Desktop-First
```typescript
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });
// → "font-size: 20px;"  (md → lg, last wins)
```

---

## 🧰 Want IntelliSense & Autocomplete?

We've got a **type-safe builder API** with full autocomplete for all CSS properties!

```typescript
import { createStyleBuilder } from '@componentor/adaptive';

const styles = createStyleBuilder()
  .style('background', 'blue')     // ← Full CSS autocomplete!
  .themed('dark', 'bg', 'purple')
  .responsive('md', 'padding', '20px')
  .state('hover', 'opacity', '0.8')
  .build();
```

**[Check out INTELLISENSE.md for the full guide →](docs/INTELLISENSE.md)**

---

## 🎨 Custom Themes (Go Wild!)

```typescript
const styles = parse(`
  bg:white;
  dark:bg:black;
  midnight:bg:#001a33;
  sunset:bg:#ff6b6b;
  ocean:bg:#006994;
  forest:bg:#2d5016
`);

getStyle(styles, { theme: 'sunset' });  // → "background: #ff6b6b;"
getStyle(styles, { theme: 'ocean' });   // → "background: #006994;"
```

⚠️ **Just don't name your themes `md`, `hover`, `sm`, etc.** Those are reserved for breakpoints and states!

---

## 🔧 API Reference

### Core Functions

#### `parse(input: string): ParsedStyles`

Turn a style string into a parsed object.

```typescript
const parsed = parse('bg:blue; dark:bg:purple; hover:opacity:0.8');
```

#### `getStyle(parsedStyles, options?): string`

Extract CSS for a specific context.

```typescript
getStyle(parsed, { theme: 'dark', states: ['hover'] });
// → "background: purple; opacity: 0.8;"
```

**Options:**
```typescript
{
  theme?: 'dark' | 'light' | string;
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  states?: ('hover' | 'active' | 'focus' | 'disabled' | string)[];
  breakpointStrategy?: 'exact' | 'mobile-first' | 'desktop-first';
  themeStrategy?: 'strict' | 'fallback';
}
```

#### `getThemedStyle(parsedStyles, options?, preferDark?): string`

Convenience helper for dark/light themes (always uses fallback strategy).

```typescript
getThemedStyle(parsed, {});           // Light mode
getThemedStyle(parsed, {}, true);     // Dark mode
getThemedStyle(parsed, { breakpoint: 'md' }, true);  // Dark mode + tablet
```

### Alias Functions

```typescript
// Register custom aliases
registerAlias('bgc', 'background-color');
registerAliases({ txt: 'color', fw: 'font-weight' });

// Check aliases
isAlias('bg');        // → true
isAlias('background'); // → false

// Get all aliases
getAllAliases();      // → { bg: 'background', text: 'color', ... }

// Clear custom aliases
clearCustomAliases();

// View built-in aliases
DEFAULT_ALIASES;      // → Read-only map of all 95+ built-in aliases
```

---

## 🌐 Browser Usage

Works out of the box in modern browsers:

```html
<script type="module">
  import { parse, getStyle } from './node_modules/@componentor/adaptive/dist/index.js';

  const parsed = parse('color:blue; dark:color:purple');
  console.log(getStyle(parsed, { theme: 'dark' }));
</script>
```

[See example.html for a full demo →](example.html)

---

## 📚 Advanced Guides

- **[IntelliSense Guide](docs/INTELLISENSE.md)** - Type-safe builder API with autocomplete
- **[Theme Strategies](docs/THEME_STRATEGIES.md)** - Deep dive into theme fallback logic
- **[Breakpoint Strategies](docs/BREAKPOINT_STRATEGIES.md)** - Mobile-first vs desktop-first
- **[Usage Examples](docs/USAGE.md)** - Real-world integration patterns

---

## 🧪 Integration Examples

### React Component

```typescript
import { parse, getStyle } from '@componentor/adaptive';
import { useMemo } from 'react';

function Button({ variant = 'primary', size = 'md', isDark = false }) {
  const styles = useMemo(() => parse(`
    bg:blue; text:white; p:12px 24px; rounded:8px;
    hover:bg:darkblue;
    dark:bg:purple; dark:hover:bg:navy;
    md:p:16px 32px;
    ${variant === 'secondary' ? 'bg:gray; hover:bg:darkgray' : ''}
  `), [variant]);

  const css = getStyle(styles, {
    breakpoint: size,
    theme: isDark ? 'dark' : 'light',
  });

  return <button style={{ cssText: css }}>Click me</button>;
}
```

### Vue Component

```vue
<script setup>
import { parse, getThemedStyle } from '@componentor/adaptive';
import { computed } from 'vue';

const isDark = inject('isDark');
const parsed = parse('bg:white; dark:bg:black; p:20px; rounded:8px');

const styles = computed(() => getThemedStyle(parsed, {}, isDark.value));
</script>

<template>
  <div :style="styles">
    Themed card
  </div>
</template>
```

---

## 💪 TypeScript Support

Fully typed with IntelliSense support!

```typescript
import type { ParsedStyles, GetStyleOptions, Theme, Breakpoint, State } from '@componentor/adaptive';

const options: GetStyleOptions = {
  theme: 'dark',
  breakpoint: 'md',
  states: ['hover'],
  breakpointStrategy: 'mobile-first',
  themeStrategy: 'fallback'
};
```

---

## 🧪 Testing

140 tests. 100% passing. Built with confidence.

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run build      # Build the library
```

---

## 📄 License

MIT - Go build something awesome!

---

## ⭐ Why You'll Love This

✅ **Write less** - One string instead of CSS files, classes, and media queries
✅ **Type safe** - Full TypeScript support with IntelliSense
✅ **Zero dependencies** - Just 1 tiny dependency (csstype for types)
✅ **Tiny** - ESM-only, tree-shakeable
✅ **Fast** - Parsed once, used everywhere
✅ **Flexible** - Unlimited themes, custom breakpoints, custom aliases
✅ **Simple** - If you know CSS, you already know this

**[Get started now →](#-quick-start)**
