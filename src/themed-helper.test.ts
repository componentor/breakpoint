import { describe, it, expect } from 'vitest';
import { parse, getThemedStyle } from './index.js';

describe('getThemedStyle helper', () => {
  describe('basic usage', () => {
    it('should use light theme by default', () => {
      const styles = parse('color:gray; dark:color:white; light:color:black');

      const result = getThemedStyle(styles, {});
      expect(result).toBe('color: black;');
    });

    it('should use dark theme when preferDark is true', () => {
      const styles = parse('color:gray; dark:color:white; light:color:black');

      const result = getThemedStyle(styles, {}, true);
      expect(result).toBe('color: white;');
    });

    it('should fallback to available theme when requested theme does not exist', () => {
      const styles = parse('color:gray; dark:color:white');

      // Light theme doesn't exist, should fallback to dark
      const result = getThemedStyle(styles, {});
      expect(result).toBe('color: white;');
    });

    it('should use base styles when no themed styles exist', () => {
      const styles = parse('color:blue; padding:10px');

      const result = getThemedStyle(styles, {});
      expect(result).toContain('color: blue;');
      expect(result).toContain('padding: 10px;');
    });
  });

  describe('with custom theme', () => {
    it('should use custom theme when specified in options', () => {
      const styles = parse('color:gray; midnight:color:purple; dark:color:white');

      const result = getThemedStyle(styles, { theme: 'midnight' });
      expect(result).toBe('color: purple;');
    });

    it('should fallback when custom theme does not exist', () => {
      const styles = parse('color:gray; dark:color:white');

      const result = getThemedStyle(styles, { theme: 'sunset' });
      expect(result).toBe('color: white;'); // Falls back to dark
    });

    it('should prefer custom theme over preferDark parameter', () => {
      const styles = parse('color:gray; midnight:color:purple; dark:color:white; light:color:black');

      const result = getThemedStyle(styles, { theme: 'midnight' }, true);
      expect(result).toBe('color: purple;'); // Uses midnight, not dark
    });
  });

  describe('with breakpoints', () => {
    it('should work with breakpoints', () => {
      const styles = parse(`
        font-size:14px;
        md:font-size:18px;
        light:md:font-size:19px;
        dark:font-size:15px;
        dark:md:font-size:20px
      `);

      const lightMd = getThemedStyle(styles, { breakpoint: 'md' });
      expect(lightMd).toBe('font-size: 19px;');

      const darkMd = getThemedStyle(styles, { breakpoint: 'md' }, true);
      expect(darkMd).toBe('font-size: 20px;');
    });

    it('should respect base styles at breakpoints over themed fallback', () => {
      const styles = parse(`
        color:black;
        md:padding:20px;
        dark:color:white
      `);

      const result = getThemedStyle(styles, { breakpoint: 'md' });
      expect(result).toContain('color: black;'); // Uses base, not dark fallback
      expect(result).toContain('padding: 20px;');
    });
  });

  describe('with states', () => {
    it('should work with states', () => {
      const styles = parse(`
        opacity:1;
        hover:opacity:0.8;
        light:hover:opacity:0.85;
        dark:opacity:0.9;
        dark:hover:opacity:0.7
      `);

      const lightHover = getThemedStyle(styles, { state: 'hover' });
      expect(lightHover).toBe('opacity: 0.85;');

      const darkHover = getThemedStyle(styles, { state: 'hover' }, true);
      expect(darkHover).toBe('opacity: 0.7;');
    });

    it('should prefer base styles when state requested but themed style lacks it', () => {
      const styles = parse(`
        background:blue;
        dark:background:lightblue;
        active:transform:scale(0.98)
      `);

      const result = getThemedStyle(styles, { state: 'active' });
      expect(result).toContain('background: blue;'); // Base, not dark fallback
      expect(result).toContain('transform: scale(0.98);');
    });
  });

  describe('combined conditions', () => {
    it('should handle theme + breakpoint + state together', () => {
      const styles = parse(`
        transform:scale(1);
        md:transform:scale(1.05);
        hover:transform:scale(1.1);
        light:md:hover:transform:scale(1.12);
        dark:hover:transform:scale(1.15);
        dark:md:hover:transform:scale(1.2)
      `);

      const lightMdHover = getThemedStyle(styles, {
        breakpoint: 'md',
        state: 'hover'
      });
      expect(lightMdHover).toBe('transform: scale(1.12);');

      const darkMdHover = getThemedStyle(styles, {
        breakpoint: 'md',
        state: 'hover'
      }, true);
      expect(darkMdHover).toBe('transform: scale(1.2);');
    });
  });

  describe('real-world usage patterns', () => {
    it('should work for button theming', () => {
      const buttonStyles = parse(`
        background:blue;
        color:white;
        padding:10px-20px;
        border-radius:4px;
        light:background:#3b82f6;
        light:color:#ffffff;
        dark:background:#1e40af;
        dark:color:#e5e5e5;
        hover:opacity:0.9;
        dark:hover:opacity:0.85
      `);

      // Light theme button
      const light = getThemedStyle(buttonStyles, {});
      expect(light).toContain('background: #3b82f6;');
      expect(light).toContain('color: #ffffff;');
      expect(light).toContain('padding: 10px-20px;');

      // Dark theme button
      const dark = getThemedStyle(buttonStyles, {}, true);
      expect(dark).toContain('background: #1e40af;');
      expect(dark).toContain('color: #e5e5e5;');

      // Dark theme hover
      const darkHover = getThemedStyle(buttonStyles, { state: 'hover' }, true);
      expect(darkHover).toContain('opacity: 0.85;');
    });

    it('should work for responsive card theming', () => {
      const cardStyles = parse(`
        background:white;
        padding:1rem;
        border:1px-solid-#e5e7eb;
        md:padding:1.5rem;
        lg:padding:2rem;
        light:background:#ffffff;
        light:border:1px-solid-#d1d5db;
        dark:background:#1f2937;
        dark:border:1px-solid-#374151;
        hover:shadow:0-4px-6px-rgba(0,0,0,0.1);
        dark:hover:shadow:0-4px-6px-rgba(0,0,0,0.3)
      `);

      // Light theme, large screen
      const lightLg = getThemedStyle(cardStyles, { breakpoint: 'lg' });
      expect(lightLg).toContain('background: #ffffff;');
      expect(lightLg).toContain('padding: 2rem;');

      // Dark theme, medium screen, hover
      const darkMdHover = getThemedStyle(cardStyles, {
        breakpoint: 'md',
        state: 'hover'
      }, true);
      expect(darkMdHover).toContain('background: #1f2937;');
      expect(darkMdHover).toContain('padding: 1.5rem;');
      expect(darkMdHover).toContain('shadow: 0-4px-6px-rgba(0,0,0,0.3);');
    });
  });
});
