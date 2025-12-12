import { describe, it, expect } from 'vitest';
import { parse, getStyle } from './index.js';

describe('breakpoint strategy', () => {
  const styleString = 'font-size:14px; sm:font-size:16px; md:font-size:18px; lg:font-size:20px; xl:font-size:24px';
  const parsed = parse(styleString);

  describe('exact strategy (default)', () => {
    it('should only match exact breakpoint', () => {
      const result = getStyle(parsed, { breakpoint: 'md' });
      expect(result).toBe('font-size: 18px;');
    });

    it('should include base styles with exact breakpoint', () => {
      const result = getStyle(parsed, { breakpoint: 'md', breakpointStrategy: 'exact' });
      expect(result).toBe('font-size: 18px;');
    });

    it('should return only base styles when no breakpoint matches', () => {
      const result = getStyle(parsed, { breakpoint: 'xs', breakpointStrategy: 'exact' });
      expect(result).toBe('font-size: 14px;');
    });
  });

  describe('mobile-first strategy', () => {
    it('should include base and all breakpoints up to current', () => {
      const result = getStyle(parsed, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
      // Should include base (14px), sm (16px), and md (18px)
      // Last one wins: md
      expect(result).toBe('font-size: 18px;');
    });

    it('should include all styles at xl breakpoint', () => {
      const result = getStyle(parsed, { breakpoint: 'xl', breakpointStrategy: 'mobile-first' });
      // Should include base, sm, md, lg, xl
      // Last one wins: xl
      expect(result).toBe('font-size: 24px;');
    });

    it('should only include base at xs breakpoint', () => {
      const result = getStyle(parsed, { breakpoint: 'xs', breakpointStrategy: 'mobile-first' });
      expect(result).toBe('font-size: 14px;');
    });

    it('should work with complex styles', () => {
      const complex = parse(`
        padding:10px;
        sm:padding:15px;
        md:padding:20px;
        color:black;
        lg:color:blue
      `);

      const result = getStyle(complex, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });

      expect(result).toContain('padding: 20px;');
      expect(result).toContain('color: black;');
      expect(result).not.toContain('color: blue;');
    });
  });

  describe('desktop-first strategy', () => {
    it('should include current breakpoint and larger ones', () => {
      const result = getStyle(parsed, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });
      // Should include base, md, lg, xl
      // Last one wins: xl
      expect(result).toBe('font-size: 24px;');
    });

    it('should include only base and xl at xl breakpoint', () => {
      const result = getStyle(parsed, { breakpoint: 'xl', breakpointStrategy: 'desktop-first' });
      expect(result).toBe('font-size: 24px;');
    });

    it('should include all breakpoints at xs', () => {
      const result = getStyle(parsed, { breakpoint: 'xs', breakpointStrategy: 'desktop-first' });
      // Should include base, xs (none), sm, md, lg, xl
      // Last one wins: xl
      expect(result).toBe('font-size: 24px;');
    });

    it('should work with complex styles', () => {
      const complex = parse(`
        padding:10px;
        sm:padding:15px;
        md:padding:20px;
        lg:padding:25px;
        color:black;
        md:color:blue
      `);

      const result = getStyle(complex, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });

      expect(result).toContain('padding: 25px;'); // lg wins
      expect(result).toContain('color: blue;'); // md wins (no lg)
    });
  });

  describe('strategy with multiple conditions', () => {
    it('should apply mobile-first with theme', () => {
      const complex = parse(`
        color:black;
        dark:color:white;
        sm:font-size:16px;
        md:font-size:18px;
        dark:md:background:gray
      `);

      const result = getStyle(complex, {
        theme: 'dark',
        breakpoint: 'md',
        breakpointStrategy: 'mobile-first'
      });

      expect(result).toContain('color: white;');
      expect(result).toContain('font-size: 18px;');
      expect(result).toContain('background: gray;');
    });

    it('should apply desktop-first with state', () => {
      const complex = parse(`
        opacity:1;
        hover:opacity:0.8;
        md:padding:20px;
        lg:padding:30px;
        hover:lg:transform:scale(1.1)
      `);

      const result = getStyle(complex, {
        state: 'hover',
        breakpoint: 'md',
        breakpointStrategy: 'desktop-first'
      });

      expect(result).toContain('opacity: 0.8;');
      expect(result).toContain('padding: 30px;'); // lg wins
      expect(result).toContain('transform: scale(1.1)');
    });
  });

  describe('custom breakpoints', () => {
    it('should use exact matching for custom breakpoints', () => {
      const custom = parse('font-size:14px; 3xl:font-size:32px; 4xl:font-size:40px');

      // Custom breakpoints always use exact matching
      const result1 = getStyle(custom, { breakpoint: '3xl', breakpointStrategy: 'mobile-first' });
      expect(result1).toBe('font-size: 32px;');

      const result2 = getStyle(custom, { breakpoint: '4xl', breakpointStrategy: 'mobile-first' });
      expect(result2).toBe('font-size: 40px;');
    });
  });

  describe('edge cases', () => {
    it('should handle no breakpoint with strategy specified', () => {
      const result = getStyle(parsed, { breakpointStrategy: 'mobile-first' });
      expect(result).toBe('font-size: 14px;');
    });

    it('should handle empty parsed styles', () => {
      const empty = parse('');
      const result = getStyle(empty, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
      expect(result).toBe('');
    });

    it('should handle styles with no breakpoints', () => {
      const noBreakpoints = parse('color:red; padding:10px');
      const result = getStyle(noBreakpoints, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
      expect(result).toContain('color: red;');
      expect(result).toContain('padding: 10px;');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle responsive typography mobile-first', () => {
      const typography = parse(`
        font-size:16px;
        line-height:1.5;
        sm:font-size:18px;
        md:font-size:20px;
        md:line-height:1.6;
        lg:font-size:24px
      `);

      // On tablet
      const tablet = getStyle(typography, { breakpoint: 'md', breakpointStrategy: 'mobile-first' });
      expect(tablet).toBe('font-size: 20px; line-height: 1.6;');

      // On mobile
      const mobile = getStyle(typography, { breakpoint: 'sm', breakpointStrategy: 'mobile-first' });
      expect(mobile).toBe('font-size: 18px; line-height: 1.5;');
    });

    it('should handle responsive spacing desktop-first', () => {
      const spacing = parse(`
        padding:40px;
        lg:padding:30px;
        md:padding:20px;
        sm:padding:15px
      `);

      // On tablet with desktop-first
      const tablet = getStyle(spacing, { breakpoint: 'md', breakpointStrategy: 'desktop-first' });
      expect(tablet).toBe('padding: 20px;');

      // On desktop
      const desktop = getStyle(spacing, { breakpoint: 'lg', breakpointStrategy: 'desktop-first' });
      expect(desktop).toBe('padding: 30px;');
    });

    it('should handle grid layouts mobile-first', () => {
      const grid = parse(`
        display:grid;
        grid-template-columns:1fr;
        gap:10px;
        md:grid-template-columns:1fr-1fr;
        md:gap:20px;
        lg:grid-template-columns:1fr-1fr-1fr;
        lg:gap:30px
      `);

      const desktop = getStyle(grid, { breakpoint: 'lg', breakpointStrategy: 'mobile-first' });
      expect(desktop).toContain('display: grid;');
      expect(desktop).toContain('grid-template-columns: 1fr-1fr-1fr;');
      expect(desktop).toContain('gap: 30px;');
    });
  });
});
