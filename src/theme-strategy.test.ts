import { describe, it, expect } from 'vitest';
import { parse, getStyle } from './index.js';

describe('theme strategy', () => {
  describe('strict strategy (default)', () => {
    it('should only match exact theme', () => {
      const styles = parse('color:black; dark:color:white; light:color:gray');

      const darkResult = getStyle(styles, { theme: 'dark' });
      expect(darkResult).toBe('color: white;');

      const lightResult = getStyle(styles, { theme: 'light' });
      expect(lightResult).toBe('color: gray;');
    });

    it('should not include other theme styles', () => {
      const styles = parse('padding:10px; dark:padding:20px; light:padding:15px');

      const darkResult = getStyle(styles, { theme: 'dark', themeStrategy: 'strict' });
      expect(darkResult).toBe('padding: 20px;');
      expect(darkResult).not.toContain('15px');
    });

    it('should return base styles when no theme matches', () => {
      const styles = parse('color:blue; dark:color:white');

      const result = getStyle(styles, { theme: 'light', themeStrategy: 'strict' });
      expect(result).toBe('color: blue;');
    });

    it('should handle missing theme gracefully', () => {
      const styles = parse('color:blue; dark:color:white; light:color:black');

      const result = getStyle(styles, { themeStrategy: 'strict' });
      expect(result).toBe('color: blue;');
    });
  });

  describe('fallback strategy', () => {
    it('should use current theme if it exists', () => {
      const styles = parse('color:blue; dark:color:white; light:color:black');

      const darkResult = getStyle(styles, { theme: 'dark', themeStrategy: 'fallback' });
      expect(darkResult).toBe('color: white;');

      const lightResult = getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
      expect(lightResult).toBe('color: black;');
    });

    it('should fallback to other theme when current theme does not exist', () => {
      const styles = parse('color:blue; dark:color:white');

      // Light theme requested but doesn't exist, should fallback to dark
      const lightResult = getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
      expect(lightResult).toContain('color:');
      expect(lightResult).toContain('white'); // Falls back to dark theme
    });

    it('should fallback to dark when light is not defined', () => {
      const styles = parse('background:gray; dark:background:black');

      const result = getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
      expect(result).toBe('background: black;'); // Falls back to dark
    });

    it('should fallback to light when dark is not defined', () => {
      const styles = parse('background:gray; light:background:white');

      const result = getStyle(styles, { theme: 'dark', themeStrategy: 'fallback' });
      expect(result).toBe('background: white;'); // Falls back to light
    });

    it('should use base style when no theme styles exist', () => {
      const styles = parse('color:blue; padding:10px');

      const result = getStyle(styles, { theme: 'dark', themeStrategy: 'fallback' });
      expect(result).toContain('color: blue;');
      expect(result).toContain('padding: 10px;');
    });

    it('should prioritize exact theme match over fallback', () => {
      const styles = parse('color:blue; dark:color:white; light:color:black');

      // Should use light (exact match), not dark (fallback)
      const result = getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
      expect(result).toBe('color: black;');
      expect(result).not.toContain('white');
    });
  });

  describe('theme strategy with breakpoints', () => {
    it('should apply strict theme with breakpoints', () => {
      const styles = parse(`
        font-size:14px;
        md:font-size:18px;
        dark:font-size:16px;
        dark:md:font-size:20px
      `);

      const result = getStyle(styles, {
        theme: 'dark',
        breakpoint: 'md',
        themeStrategy: 'strict'
      });

      expect(result).toBe('font-size: 20px;');
    });

    it('should apply fallback theme with breakpoints', () => {
      const styles = parse(`
        font-size:14px;
        md:font-size:18px;
        dark:md:font-size:20px
      `);

      // Light theme doesn't have md:font-size, should fallback to dark:md
      const result = getStyle(styles, {
        theme: 'light',
        breakpoint: 'md',
        themeStrategy: 'fallback'
      });

      expect(result).toContain('font-size:');
      expect(result).toContain('20px'); // Fallback to dark:md
    });

    it('should handle complex breakpoint and theme combinations', () => {
      const styles = parse(`
        padding:10px;
        color:black;
        md:padding:20px;
        dark:color:white;
        dark:md:padding:30px;
        dark:md:background:gray
      `);

      const strictResult = getStyle(styles, {
        theme: 'light',
        breakpoint: 'md',
        themeStrategy: 'strict'
      });
      expect(strictResult).toContain('padding: 20px;');
      expect(strictResult).toContain('color: black;');
      expect(strictResult).not.toContain('background');

      const fallbackResult = getStyle(styles, {
        theme: 'light',
        breakpoint: 'md',
        themeStrategy: 'fallback'
      });
      expect(fallbackResult).toContain('padding:');
      expect(fallbackResult).toContain('color: black;');
      expect(fallbackResult).toContain('background: gray;'); // Fallback
    });
  });

  describe('theme strategy with states', () => {
    it('should apply strict theme with states', () => {
      const styles = parse(`
        opacity:1;
        hover:opacity:0.8;
        dark:opacity:0.9;
        dark:hover:opacity:0.7
      `);

      const result = getStyle(styles, {
        theme: 'dark',
        state: 'hover',
        themeStrategy: 'strict'
      });

      expect(result).toBe('opacity: 0.7;');
    });

    it('should apply fallback theme with states', () => {
      const styles = parse(`
        opacity:1;
        hover:opacity:0.8;
        dark:hover:opacity:0.6
      `);

      // Light theme doesn't have hover:opacity, should fallback to dark:hover
      const result = getStyle(styles, {
        theme: 'light',
        state: 'hover',
        themeStrategy: 'fallback'
      });

      expect(result).toContain('opacity:');
      expect(result).toContain('0.6'); // Fallback to dark:hover
    });
  });

  describe('theme strategy with all conditions', () => {
    it('should handle strict strategy with theme + breakpoint + state', () => {
      const styles = parse(`
        transform:scale(1);
        md:transform:scale(1.05);
        hover:transform:scale(1.1);
        dark:hover:transform:scale(1.15);
        dark:md:hover:transform:scale(1.2)
      `);

      const result = getStyle(styles, {
        theme: 'dark',
        breakpoint: 'md',
        state: 'hover',
        themeStrategy: 'strict'
      });

      expect(result).toBe('transform: scale(1.2);');
    });

    it('should handle fallback strategy with theme + breakpoint + state', () => {
      const styles = parse(`
        transform:scale(1);
        md:transform:scale(1.05);
        hover:transform:scale(1.1);
        dark:md:hover:transform:scale(1.2)
      `);

      // Light theme doesn't have md:hover, should fallback to dark:md:hover
      const result = getStyle(styles, {
        theme: 'light',
        breakpoint: 'md',
        state: 'hover',
        themeStrategy: 'fallback'
      });

      expect(result).toContain('transform:');
      expect(result).toContain('1.2'); // Fallback to dark
    });
  });

  describe('custom themes', () => {
    it('should work with custom theme names in strict mode', () => {
      const styles = parse('color:blue; midnight:color:purple; sunset:color:orange');

      const midnightResult = getStyle(styles, { theme: 'midnight', themeStrategy: 'strict' });
      expect(midnightResult).toBe('color: purple;');

      const sunsetResult = getStyle(styles, { theme: 'sunset', themeStrategy: 'strict' });
      expect(sunsetResult).toBe('color: orange;');
    });

    it('should work with custom theme names in fallback mode', () => {
      const styles = parse('color:blue; midnight:color:purple');

      // Sunset theme doesn't exist, fallback to midnight
      const result = getStyle(styles, { theme: 'sunset', themeStrategy: 'fallback' });
      expect(result).toContain('color:');
      expect(result).toContain('purple'); // Fallback to midnight
    });
  });

  describe('edge cases', () => {
    it('should handle empty styles with theme strategy', () => {
      const empty = parse('');

      const result = getStyle(empty, { theme: 'dark', themeStrategy: 'fallback' });
      expect(result).toBe('');
    });

    it('should handle no theme specified with fallback strategy', () => {
      const styles = parse('color:blue; dark:color:white');

      const result = getStyle(styles, { themeStrategy: 'fallback' });
      expect(result).toBe('color: blue;');
    });

    it('should handle multiple properties with mixed theme availability', () => {
      const styles = parse(`
        color:black;
        padding:10px;
        margin:5px;
        dark:color:white;
        light:padding:15px
      `);

      // Dark theme: has color, doesn't have padding, has margin
      const darkStrict = getStyle(styles, { theme: 'dark', themeStrategy: 'strict' });
      expect(darkStrict).toContain('color: white;');
      expect(darkStrict).toContain('padding: 10px;');
      expect(darkStrict).toContain('margin: 5px;');

      // Light theme with fallback: doesn't have color (fallback to dark), has padding
      const lightFallback = getStyle(styles, { theme: 'light', themeStrategy: 'fallback' });
      expect(lightFallback).toContain('color: white;'); // Fallback to dark
      expect(lightFallback).toContain('padding: 15px;'); // Has light
      expect(lightFallback).toContain('margin: 5px;'); // Base
    });
  });

  describe('real-world scenarios', () => {
    it('should handle comprehensive theme system', () => {
      const componentStyles = parse(`
        background:white;
        color:black;
        border:1px solid gray;
        padding:20px;

        dark:background:black;
        dark:color:white;
        dark:border:1px solid lightgray;

        light:background:#fafafa;
        light:color:#333;

        md:padding:30px;
        dark:md:padding:35px;
        light:md:padding:25px
      `);

      // Dark theme with exact breakpoint
      const darkMd = getStyle(componentStyles, {
        theme: 'dark',
        breakpoint: 'md',
        themeStrategy: 'strict'
      });
      expect(darkMd).toContain('background: black;');
      expect(darkMd).toContain('color: white;');
      expect(darkMd).toContain('padding: 35px;');

      // Light theme with fallback
      const lightMd = getStyle(componentStyles, {
        theme: 'light',
        breakpoint: 'md',
        themeStrategy: 'fallback'
      });
      expect(lightMd).toContain('background: #fafafa;');
      expect(lightMd).toContain('padding: 25px;');
    });

    it('should handle button with theme variations', () => {
      const buttonStyles = parse(`
        background:blue;
        color:white;
        padding:10px 20px;
        border:none;

        hover:background:darkblue;
        active:transform:scale(0.98);

        dark:background:lightblue;
        dark:hover:background:skyblue;

        disabled:opacity:0.5;
        disabled:cursor:not-allowed
      `);

      // Dark theme hover
      const darkHover = getStyle(buttonStyles, {
        theme: 'dark',
        state: 'hover',
        themeStrategy: 'strict'
      });
      expect(darkHover).toContain('background: skyblue;');
      expect(darkHover).toContain('color: white;');

      // Light theme with fallback (no explicit light theme, uses base + dark fallback where needed)
      const lightActive = getStyle(buttonStyles, {
        theme: 'light',
        state: 'active',
        themeStrategy: 'fallback'
      });
      expect(lightActive).toContain('background: blue;'); // Base (light theme not defined)
      expect(lightActive).toContain('transform: scale(0.98);');
    });
  });
});
