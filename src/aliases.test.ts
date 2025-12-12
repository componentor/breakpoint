import { describe, it, expect, beforeEach } from 'vitest';
import {
  parse,
  getStyle,
  registerAlias,
  registerAliases,
  clearCustomAliases,
  getAllAliases,
  isAlias,
  DEFAULT_ALIASES
} from './index.js';

describe('CSS Property Aliases', () => {
  beforeEach(() => {
    // Clear custom aliases before each test
    clearCustomAliases();
  });

  describe('Built-in property aliases', () => {
    it('should resolve bg to background', () => {
      const styles = parse('bg:blue; dark:bg:black');

      expect(styles.styles[0].property).toBe('background');
      expect(styles.styles[1].property).toBe('background');

      const result = getStyle(styles, { theme: 'dark' });
      expect(result).toBe('background: black;');
    });

    it('should resolve text to color', () => {
      const styles = parse('text:red; hover:text:blue');

      expect(styles.styles[0].property).toBe('color');
      expect(styles.styles[1].property).toBe('color');

      const result = getStyle(styles, { state: 'hover' });
      expect(result).toBe('color: blue;');
    });

    it('should resolve spacing aliases (m, p, mt, px, etc.)', () => {
      const styles = parse('m:10px; mt:20px; px:15px; py:5px');

      expect(styles.styles[0].property).toBe('margin');
      expect(styles.styles[1].property).toBe('margin-top');
      expect(styles.styles[2].property).toBe('padding-inline');
      expect(styles.styles[3].property).toBe('padding-block');
    });

    it('should resolve size aliases (w, h, min-w, max-h)', () => {
      const styles = parse('w:100px; h:50px; min-w:200px; max-h:300px');

      expect(styles.styles[0].property).toBe('width');
      expect(styles.styles[1].property).toBe('height');
      expect(styles.styles[2].property).toBe('min-width');
      expect(styles.styles[3].property).toBe('max-height');
    });

    it('should resolve border aliases (border-w)', () => {
      const styles = parse('border-w:2px; border:1px solid red');

      expect(styles.styles[0].property).toBe('border-width');
      expect(styles.styles[1].property).toBe('border');
    });

    it('should resolve flexbox aliases (justify, items, gap)', () => {
      const styles = parse('justify:center; items:center; gap:10px');

      expect(styles.styles[0].property).toBe('justify-content');
      expect(styles.styles[1].property).toBe('align-items');
      expect(styles.styles[2].property).toBe('gap');
    });

    it('should resolve grid aliases (grid-cols, col, row)', () => {
      const styles = parse('grid-cols:3; col:span-2; gap-x:10px');

      expect(styles.styles[0].property).toBe('grid-template-columns');
      expect(styles.styles[1].property).toBe('grid-column');
      expect(styles.styles[2].property).toBe('column-gap');
    });

    it('should resolve effect aliases (shadow, opacity)', () => {
      const styles = parse('shadow:0 4px 6px rgba(0,0,0,0.1); opacity:0.5');

      expect(styles.styles[0].property).toBe('box-shadow');
      expect(styles.styles[1].property).toBe('opacity');
    });

  });

  describe('combined with themes, breakpoints, and states', () => {
    it('should work with dark theme', () => {
      const styles = parse('bg:white; text:black; dark:bg:black; dark:text:white');

      const light = getStyle(styles, { theme: 'light' });
      expect(light).toContain('background: white;');
      expect(light).toContain('color: black;');

      const dark = getStyle(styles, { theme: 'dark' });
      expect(dark).toContain('background: black;');
      expect(dark).toContain('color: white;');
    });

    it('should work with breakpoints', () => {
      const styles = parse('w:100%; md:w:768px; lg:w:1024px');

      const mobile = getStyle(styles, {});
      expect(mobile).toBe('width: 100%;');

      const tablet = getStyle(styles, { breakpoint: 'md' });
      expect(tablet).toBe('width: 768px;');

      const desktop = getStyle(styles, { breakpoint: 'lg' });
      expect(desktop).toBe('width: 1024px;');
    });

    it('should work with states', () => {
      const styles = parse('bg:blue; opacity:1; hover:bg:darkblue; hover:opacity:0.8');

      const normal = getStyle(styles, {});
      expect(normal).toContain('background: blue;');
      expect(normal).toContain('opacity: 1;');

      const hover = getStyle(styles, { state: 'hover' });
      expect(hover).toContain('background: darkblue;');
      expect(hover).toContain('opacity: 0.8;');
    });

    it('should work with all conditions combined', () => {
      const styles = parse(`
        p:10px;
        text:black;
        md:p:20px;
        dark:text:white;
        dark:md:p:30px;
        hover:opacity:0.9;
        dark:md:hover:opacity:0.7
      `);

      const result = getStyle(styles, {
        theme: 'dark',
        breakpoint: 'md',
        state: 'hover'
      });

      expect(result).toContain('padding: 30px;');
      expect(result).toContain('color: white;');
      expect(result).toContain('opacity: 0.7;');
    });
  });

  describe('custom alias registration', () => {
    it('should allow registering a single custom alias', () => {
      registerAlias('bgc', 'background-color');

      const styles = parse('bgc:red; hover:bgc:blue');

      expect(styles.styles[0].property).toBe('background-color');
      expect(styles.styles[1].property).toBe('background-color');
    });

    it('should allow registering multiple custom aliases', () => {
      registerAliases({
        'txt': 'color',
        'fw': 'font-weight',
        'fs': 'font-size'
      });

      const styles = parse('txt:red; fw:bold; fs:16px');

      expect(styles.styles[0].property).toBe('color');
      expect(styles.styles[1].property).toBe('font-weight');
      expect(styles.styles[2].property).toBe('font-size');
    });

    it('should allow custom aliases to override built-in aliases', () => {
      // Override 'bg' to mean 'background-color' instead of 'background'
      registerAlias('bg', 'background-color');

      const styles = parse('bg:red');
      expect(styles.styles[0].property).toBe('background-color');
    });

    it('should clear custom aliases', () => {
      registerAlias('custom', 'some-property');

      let styles = parse('custom:value');
      expect(styles.styles[0].property).toBe('some-property');

      clearCustomAliases();

      styles = parse('custom:value');
      expect(styles.styles[0].property).toBe('custom'); // No longer aliased
    });
  });

  describe('alias utilities', () => {
    it('should check if a property is an alias', () => {
      expect(isAlias('bg')).toBe(true);
      expect(isAlias('text')).toBe(true);
      expect(isAlias('m')).toBe(true);
      expect(isAlias('background')).toBe(false);
      expect(isAlias('color')).toBe(false);
      expect(isAlias('unknown-property')).toBe(false);
    });

    it('should check custom aliases', () => {
      expect(isAlias('custom')).toBe(false);

      registerAlias('custom', 'some-property');

      expect(isAlias('custom')).toBe(true);
    });

    it('should get all aliases', () => {
      const allAliases = getAllAliases();

      expect(allAliases['bg']).toBe('background');
      expect(allAliases['text']).toBe('color');
      expect(allAliases['m']).toBe('margin');

      registerAlias('custom', 'custom-property');

      const updated = getAllAliases();
      expect(updated['custom']).toBe('custom-property');
    });

    it('should have all default built-in aliases', () => {
      expect(DEFAULT_ALIASES['bg']).toBe('background');
      expect(DEFAULT_ALIASES['text']).toBe('color');
      expect(DEFAULT_ALIASES['w']).toBe('width');
      expect(DEFAULT_ALIASES['h']).toBe('height');
      expect(DEFAULT_ALIASES['p']).toBe('padding');
      expect(DEFAULT_ALIASES['m']).toBe('margin');
      expect(DEFAULT_ALIASES['shadow']).toBe('box-shadow');
    });
  });

  describe('non-aliased properties', () => {
    it('should leave non-aliased properties unchanged', () => {
      const styles = parse('display:flex; position:absolute; z-index:10');

      expect(styles.styles[0].property).toBe('display');
      expect(styles.styles[1].property).toBe('position');
      expect(styles.styles[2].property).toBe('z-index');
    });

    it('should mix aliases and non-aliases', () => {
      const styles = parse('bg:blue; display:flex; text:white; position:relative');

      expect(styles.styles[0].property).toBe('background');
      expect(styles.styles[1].property).toBe('display');
      expect(styles.styles[2].property).toBe('color');
      expect(styles.styles[3].property).toBe('position');
    });
  });

  describe('real-world examples', () => {
    it('should handle a complete button style with aliases', () => {
      const buttonStyles = parse(`
        bg:blue;
        text:white;
        p:10px 20px;
        rounded:4px;
        border:none;
        cursor:pointer;
        hover:bg:darkblue;
        hover:shadow:0 2px 4px rgba(0,0,0,0.2);
        dark:bg:#1e40af;
        dark:hover:bg:#1e3a8a
      `);

      const lightHover = getStyle(buttonStyles, { state: 'hover' });
      expect(lightHover).toContain('background: darkblue;');
      expect(lightHover).toContain('box-shadow: 0 2px 4px rgba(0,0,0,0.2);');

      const darkHover = getStyle(buttonStyles, { theme: 'dark', state: 'hover' });
      expect(darkHover).toContain('background: #1e3a8a;');
    });

    it('should handle a responsive card layout with aliases', () => {
      const cardStyles = parse(`
        bg:white;
        p:1rem;
        rounded:8px;
        shadow:0 1px 3px rgba(0,0,0,0.1);
        md:p:1.5rem;
        lg:p:2rem;
        dark:bg:#1f2937;
        dark:shadow:0 1px 3px rgba(0,0,0,0.5)
      `);

      const lightMobile = getStyle(cardStyles, {});
      expect(lightMobile).toContain('background: white;');
      expect(lightMobile).toContain('padding: 1rem;');

      const darkDesktop = getStyle(cardStyles, { theme: 'dark', breakpoint: 'lg' });
      expect(darkDesktop).toContain('background: #1f2937;');
      expect(darkDesktop).toContain('padding: 2rem;');
    });

    it('should handle flexbox layout with aliases', () => {
      const flexStyles = parse(`
        display:flex;
        justify:center;
        items:center;
        gap:10px;
        md:gap:20px;
        lg:justify:space-between
      `);

      const mobile = getStyle(flexStyles, {});
      expect(mobile).toContain('display: flex;');
      expect(mobile).toContain('justify-content: center;');
      expect(mobile).toContain('align-items: center;');

      const desktop = getStyle(flexStyles, { breakpoint: 'lg' });
      expect(desktop).toContain('justify-content: space-between;');
    });
  });
});
