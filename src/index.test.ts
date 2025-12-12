import { describe, it, expect } from 'vitest';
import { parse, getStyle } from './index.js';

describe('parse', () => {
  it('should parse a simple style without conditions', () => {
    const result = parse('color:red');
    expect(result.styles).toHaveLength(1);
    expect(result.styles[0]).toEqual({
      property: 'color',
      value: 'red',
      conditions: {},
    });
  });

  it('should parse multiple styles separated by semicolons', () => {
    const result = parse('color:red; padding:10px; margin:20px');
    expect(result.styles).toHaveLength(3);
    expect(result.styles[0].property).toBe('color');
    expect(result.styles[1].property).toBe('padding');
    expect(result.styles[2].property).toBe('margin');
  });

  it('should parse style with theme condition', () => {
    const result = parse('dark:color:white');
    expect(result.styles).toHaveLength(1);
    expect(result.styles[0]).toEqual({
      property: 'color',
      value: 'white',
      conditions: { theme: 'dark' },
    });
  });

  it('should parse style with breakpoint condition', () => {
    const result = parse('md:padding:20px');
    expect(result.styles).toHaveLength(1);
    expect(result.styles[0]).toEqual({
      property: 'padding',
      value: '20px',
      conditions: { breakpoint: 'md' },
    });
  });

  it('should parse style with state condition', () => {
    const result = parse('hover:background:blue');
    expect(result.styles).toHaveLength(1);
    expect(result.styles[0]).toEqual({
      property: 'background',
      value: 'blue',
      conditions: { state: 'hover' },
    });
  });

  it('should parse style with multiple conditions', () => {
    const result = parse('dark:md:hover:background:black');
    expect(result.styles).toHaveLength(1);
    expect(result.styles[0]).toEqual({
      property: 'background',
      value: 'black',
      conditions: {
        theme: 'dark',
        breakpoint: 'md',
        state: 'hover',
      },
    });
  });

  it('should handle conditions in any order', () => {
    const result1 = parse('md:dark:hover:color:red');
    const result2 = parse('hover:md:dark:color:red');

    expect(result1.styles[0].conditions).toEqual({
      theme: 'dark',
      breakpoint: 'md',
      state: 'hover',
    });

    expect(result2.styles[0].conditions).toEqual({
      theme: 'dark',
      breakpoint: 'md',
      state: 'hover',
    });
  });

  it('should parse all standard breakpoints', () => {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    for (const bp of breakpoints) {
      const result = parse(`${bp}:width:100px`);
      expect(result.styles[0].conditions.breakpoint).toBe(bp);
    }
  });

  it('should parse all standard states', () => {
    const states = ['hover', 'active', 'focus', 'visited', 'focus-visible', 'focus-within', 'disabled', 'enabled', 'checked'];

    for (const state of states) {
      const result = parse(`${state}:opacity:0.5`);
      expect(result.styles[0].conditions.state).toBe(state);
    }
  });

  it('should handle custom theme names', () => {
    const result = parse('midnight:color:purple');
    expect(result.styles[0].conditions.theme).toBe('midnight');
  });

  it('should handle custom breakpoints', () => {
    const result = parse('3xl:padding:50px');
    expect(result.styles[0].conditions.breakpoint).toBe('3xl');
  });

  it('should handle style values with dashes', () => {
    const result = parse('font-family:Times-New-Roman');
    expect(result.styles[0]).toEqual({
      property: 'font-family',
      value: 'Times-New-Roman',
      conditions: {},
    });
  });

  it('should handle CSS values with spaces (using dashes)', () => {
    const result = parse('margin:0-auto');
    expect(result.styles[0].value).toBe('0-auto');
  });

  it('should handle complex real-world example', () => {
    const result = parse('color:black; dark:color:white; md:padding:20px; lg:padding:30px; hover:opacity:0.8; dark:hover:opacity:0.6; md:dark:hover:background:gray');

    expect(result.styles).toHaveLength(7);

    // Base color
    expect(result.styles[0]).toEqual({
      property: 'color',
      value: 'black',
      conditions: {},
    });

    // Dark theme color
    expect(result.styles[1]).toEqual({
      property: 'color',
      value: 'white',
      conditions: { theme: 'dark' },
    });

    // Responsive padding
    expect(result.styles[2].conditions.breakpoint).toBe('md');
    expect(result.styles[3].conditions.breakpoint).toBe('lg');

    // State styles
    expect(result.styles[4].conditions.state).toBe('hover');

    // Combined conditions
    expect(result.styles[5].conditions).toEqual({
      theme: 'dark',
      state: 'hover',
    });

    expect(result.styles[6].conditions).toEqual({
      theme: 'dark',
      breakpoint: 'md',
      state: 'hover',
    });
  });

  it('should handle empty input', () => {
    const result = parse('');
    expect(result.styles).toHaveLength(0);
  });

  it('should handle input with only semicolons', () => {
    const result = parse(';;;');
    expect(result.styles).toHaveLength(0);
  });

  it('should skip invalid declarations', () => {
    const result = parse('color:red; invalid; padding:10px');
    expect(result.styles).toHaveLength(2);
    expect(result.styles[0].property).toBe('color');
    expect(result.styles[1].property).toBe('padding');
  });

  it('should handle trailing semicolons', () => {
    const result = parse('color:red; padding:10px;');
    expect(result.styles).toHaveLength(2);
  });

  it('should handle whitespace', () => {
    const result = parse('  color:red  ;  padding:10px  ');
    expect(result.styles).toHaveLength(2);
    expect(result.styles[0].property).toBe('color');
  });
});

describe('getStyle', () => {
  it('should return base styles when no options provided', () => {
    const parsed = parse('color:red; padding:10px');
    const result = getStyle(parsed);
    expect(result).toBe('color: red; padding: 10px;');
  });

  it('should return only matching theme styles', () => {
    const parsed = parse('color:black; dark:color:white');
    const result = getStyle(parsed, { theme: 'dark' });
    expect(result).toBe('color: white;');
  });

  it('should return base styles plus matching theme styles', () => {
    const parsed = parse('padding:10px; dark:color:white');
    const result = getStyle(parsed, { theme: 'dark' });
    expect(result).toContain('padding: 10px;');
    expect(result).toContain('color: white;');
  });

  it('should return only matching breakpoint styles', () => {
    const parsed = parse('padding:10px; md:padding:20px; lg:padding:30px');
    const result = getStyle(parsed, { breakpoint: 'md' });
    expect(result).toContain('padding: 20px;');
  });

  it('should return only matching state styles', () => {
    const parsed = parse('opacity:1; hover:opacity:0.8');
    const result = getStyle(parsed, { state: 'hover' });
    expect(result).toContain('opacity: 0.8;');
  });

  it('should handle multiple matching conditions', () => {
    const parsed = parse('color:black; dark:md:hover:color:purple');
    const result = getStyle(parsed, {
      theme: 'dark',
      breakpoint: 'md',
      state: 'hover',
    });
    expect(result).toContain('color: purple;');
  });

  it('should not return styles when conditions do not match', () => {
    const parsed = parse('dark:color:white');
    const result = getStyle(parsed, { theme: 'light' });
    expect(result).toBe('');
  });

  it('should handle partial condition matches', () => {
    const parsed = parse('dark:md:color:red');

    // Only theme matches
    let result = getStyle(parsed, { theme: 'dark' });
    expect(result).toBe('');

    // Only breakpoint matches
    result = getStyle(parsed, { breakpoint: 'md' });
    expect(result).toBe('');

    // Both match
    result = getStyle(parsed, { theme: 'dark', breakpoint: 'md' });
    expect(result).toBe('color: red;');
  });

  it('should override properties with later values', () => {
    const parsed = parse('color:black; dark:color:white');
    const result = getStyle(parsed, { theme: 'dark' });

    // Should only have one color property (the dark one)
    const colorMatches = result.match(/color:/g);
    expect(colorMatches).toHaveLength(1);
    expect(result).toBe('color: white;');
  });

  it('should handle complex real-world scenario', () => {
    const parsed = parse('display:block; padding:10px; color:black; md:padding:20px; lg:padding:30px; dark:color:white; hover:opacity:0.9; dark:hover:opacity:0.7');

    // Desktop dark mode with hover
    const result = getStyle(parsed, {
      theme: 'dark',
      breakpoint: 'lg',
      state: 'hover',
    });

    expect(result).toContain('display: block;');
    expect(result).toContain('padding: 30px;');
    expect(result).toContain('color: white;');
    expect(result).toContain('opacity: 0.7;');
  });

  it('should return empty string for no matches', () => {
    const parsed = parse('dark:color:white');
    const result = getStyle(parsed, { theme: 'light' });
    expect(result).toBe('');
  });

  it('should handle empty parsed styles', () => {
    const parsed = parse('');
    const result = getStyle(parsed);
    expect(result).toBe('');
  });

  it('should handle custom themes', () => {
    const parsed = parse('midnight:color:purple');
    const result = getStyle(parsed, { theme: 'midnight' });
    expect(result).toBe('color: purple;');
  });

  it('should handle custom breakpoints', () => {
    const parsed = parse('3xl:width:2000px');
    const result = getStyle(parsed, { breakpoint: '3xl' });
    expect(result).toBe('width: 2000px;');
  });

  it('should apply base styles regardless of context', () => {
    const parsed = parse('margin:0; dark:padding:20px');

    const result1 = getStyle(parsed, { theme: 'dark' });
    expect(result1).toContain('margin: 0;');

    const result2 = getStyle(parsed, { theme: 'light' });
    expect(result2).toContain('margin: 0;');

    const result3 = getStyle(parsed);
    expect(result3).toContain('margin: 0;');
  });
});

describe('integration tests', () => {
  it('should handle a complete style attribute example', () => {
    const styleString = 'display:flex; flex-direction:column; gap:10px; padding:15px; background:white; color:black; dark:background:black; dark:color:white; md:flex-direction:row; md:gap:20px; lg:padding:30px; hover:opacity:0.95';

    const parsed = parse(styleString);

    // Light theme, mobile
    let css = getStyle(parsed, {});
    expect(css).toContain('display: flex;');
    expect(css).toContain('background: white;');
    expect(css).toContain('color: black;');

    // Dark theme, tablet
    css = getStyle(parsed, { theme: 'dark', breakpoint: 'md' });
    expect(css).toContain('background: black;');
    expect(css).toContain('color: white;');
    expect(css).toContain('flex-direction: row;');
    expect(css).toContain('gap: 20px;');

    // Light theme, desktop, hover
    css = getStyle(parsed, { breakpoint: 'lg', state: 'hover' });
    expect(css).toContain('padding: 30px;');
    expect(css).toContain('opacity: 0.95;');
  });

  it('should handle progressive enhancement pattern', () => {
    const styleString = 'font-size:14px; sm:font-size:16px; md:font-size:18px; lg:font-size:20px; xl:font-size:24px';

    const parsed = parse(styleString);

    expect(getStyle(parsed, {})).toContain('font-size: 14px;');
    expect(getStyle(parsed, { breakpoint: 'sm' })).toContain('font-size: 16px;');
    expect(getStyle(parsed, { breakpoint: 'md' })).toContain('font-size: 18px;');
    expect(getStyle(parsed, { breakpoint: 'lg' })).toContain('font-size: 20px;');
    expect(getStyle(parsed, { breakpoint: 'xl' })).toContain('font-size: 24px;');
  });
});
