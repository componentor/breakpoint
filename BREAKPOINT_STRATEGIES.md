# Breakpoint Strategies

The library supports three different breakpoint matching strategies to accommodate different responsive design approaches.

## Strategies

### 1. Exact (Default)

Matches only the exact breakpoint specified.

```typescript
const styles = parse('font-size:14px; sm:font-size:16px; md:font-size:18px; lg:font-size:20px');

getStyle(styles, { breakpoint: 'md' });
// Returns: "font-size: 18px;"
// Only includes base + md

getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'exact' });
// Returns: "font-size: 18px;"
// Same as above (explicit)
```

**Use case**: When you want precise control and each breakpoint defines complete styles.

### 2. Mobile-First

Includes styles from the base level up to and including the current breakpoint.

```typescript
const styles = parse('font-size:14px; sm:font-size:16px; md:font-size:18px; lg:font-size:20px');

getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
// Returns: "font-size: 18px;"
// Includes: base (14px) → sm (16px) → md (18px)
// Later declarations override earlier ones, so md wins

getStyle(styles, { breakpoint: 'lg', breakpointStrategy: 'mobile-first' });
// Returns: "font-size: 20px;"
// Includes: base → sm → md → lg
```

**Use case**: Traditional mobile-first responsive design. Start with mobile styles and progressively enhance for larger screens.

### 3. Desktop-First

Includes styles from the current breakpoint and all larger breakpoints.

```typescript
const styles = parse('font-size:14px; sm:font-size:16px; md:font-size:18px; lg:font-size:20px');

getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });
// Returns: "font-size: 20px;"
// Includes: base (14px) → md (18px) → lg (20px)
// lg wins

getStyle(styles, { breakpoint: 'sm', breakpointStrategy: 'desktop-first' });
// Returns: "font-size: 20px;"
// Includes: base → sm → md → lg
```

**Use case**: Desktop-first design. Start with desktop styles and adapt down for smaller screens.

## Breakpoint Order

The standard breakpoints are ordered as follows:

```
xs → sm → md → lg → xl → 2xl
0     1    2    3    4     5
```

## Examples

### Mobile-First Layout

```typescript
const layout = parse(`
  display:block;
  padding:10px;
  sm:padding:15px;
  md:display:flex;
  md:padding:20px;
  lg:padding:30px
`);

// Mobile (no breakpoint)
getStyle(layout, { breakpointStrategy: 'mobile-first' });
// "display: block; padding: 10px;"

// Tablet
getStyle(layout, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
// "display: flex; padding: 20px;"

// Desktop
getStyle(layout, { breakpoint: 'lg', breakpointStrategy: 'mobile-first' });
// "display: flex; padding: 30px;"
```

### Desktop-First Typography

```typescript
const typography = parse(`
  font-size:24px;
  line-height:1.8;
  lg:font-size:20px;
  md:font-size:18px;
  sm:font-size:16px;
  sm:line-height:1.5
`);

// Desktop
getStyle(typography, { breakpoint: 'xl', breakpointStrategy: 'desktop-first' });
// "font-size: 24px; line-height: 1.8;"

// Tablet
getStyle(typography, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });
// "font-size: 18px; line-height: 1.8;"

// Mobile
getStyle(typography, { breakpoint: 'sm', breakpointStrategy: 'desktop-first' });
// "font-size: 16px; line-height: 1.5;"
```

### Exact Matching for Precise Control

```typescript
const precise = parse(`
  width:100%;
  xs:width:320px;
  sm:width:640px;
  md:width:768px;
  lg:width:1024px;
  xl:width:1280px
`);

// Each breakpoint gets exactly what's specified
getStyle(precise, { breakpoint: 'md', breakpointStrategy: 'exact' });
// "width: 768px;"

getStyle(precise, { breakpoint: 'lg', breakpointStrategy: 'exact' });
// "width: 1024px;"
```

## Combined with Themes and States

Breakpoint strategies work seamlessly with themes and states:

```typescript
const complex = parse(`
  padding:10px;
  color:black;
  dark:color:white;
  sm:padding:15px;
  md:padding:20px;
  dark:md:background:gray;
  hover:opacity:0.9;
  dark:hover:lg:transform:scale(1.05)
`);

// Dark theme, large screen, hover state, mobile-first
getStyle(complex, {
  theme: 'dark',
  breakpoint: 'lg',
  state: 'hover',
  breakpointStrategy: 'mobile-first'
});
// Includes: base + dark + sm + md + lg + hover + dark:hover:lg
// Results in: "padding: 20px; color: white; background: gray; opacity: 0.9; transform: scale(1.05);"
```

## Custom Breakpoints

Custom breakpoints (not in the standard set) always use **exact matching**, regardless of strategy:

```typescript
const custom = parse(`
  font-size:16px;
  tablet:font-size:18px;
  desktop:font-size:20px
`);

// Custom breakpoints ignore strategy
getStyle(custom, { breakpoint: 'tablet', breakpointStrategy: 'mobile-first' });
// "font-size: 18px;" (exact match only)
```

## Best Practices

### 1. Choose One Strategy Per Project

Be consistent throughout your application:

```typescript
// ✅ Good - consistent strategy
const BREAKPOINT_STRATEGY = 'mobile-first';

function Component1() {
  const css = getStyle(styles, { breakpoint: 'md', breakpointStrategy: BREAKPOINT_STRATEGY });
}

function Component2() {
  const css = getStyle(styles, { breakpoint: 'lg', breakpointStrategy: BREAKPOINT_STRATEGY });
}
```

### 2. Mobile-First for Progressive Enhancement

Most modern web development follows mobile-first:

```typescript
const responsive = parse(`
  width:100%;
  padding:15px;
  sm:padding:20px;
  md:width:768px;
  md:padding:30px;
  lg:width:1024px;
  lg:padding:40px
`);

// Works naturally with mobile-first approach
getStyle(responsive, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
```

### 3. Desktop-First for Legacy Support

If you need to support older browsers or have desktop-first requirements:

```typescript
const legacy = parse(`
  width:1200px;
  padding:40px;
  md:width:960px;
  md:padding:30px;
  sm:width:720px;
  sm:padding:20px;
  xs:width:100%;
  xs:padding:15px
`);

getStyle(legacy, { breakpoint: 'sm', breakpointStrategy: 'desktop-first' });
```

### 4. Exact for Component Libraries

Component libraries may want precise control:

```typescript
const button = parse(`
  padding:8px-16px;
  font-size:14px;
  sm:padding:10px-20px;
  sm:font-size:16px;
  lg:padding:12px-24px;
  lg:font-size:18px
`);

// Each size gets exactly what's defined
getStyle(button, { breakpoint: 'sm', breakpointStrategy: 'exact' });
```

## Default Behavior

If no `breakpointStrategy` is specified, the default is **'exact'** to maintain backwards compatibility and predictable behavior.

```typescript
// These are equivalent:
getStyle(styles, { breakpoint: 'md' });
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'exact' });
```

## Performance

All strategies have similar performance characteristics. The strategy only affects which styles are matched, not the parsing or rendering speed.

```typescript
// All strategies are equally fast
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'exact' });        // ~0.001ms
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'mobile-first' }); // ~0.001ms
getStyle(styles, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });// ~0.001ms
```
