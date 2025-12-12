/**
 * Integration utilities for other libraries to use the alias and parsing system
 */

import { resolveProperty, getAllAliases, registerAlias, registerAliases } from './aliases.js';
import { parse as coreParse } from './index.js';
import type { ParsedStyles, ParsedStyle } from './types.js';

/**
 * Integration helper for external libraries
 * Provides utilities to integrate with the breakpoint parsing and alias system
 */
export class BreakpointIntegration {
  /**
   * Resolve a property alias to its full CSS property name
   *
   * @example
   * const integration = new BreakpointIntegration();
   * integration.resolveAlias('bg'); // Returns: 'background'
   * integration.resolveAlias('unknown'); // Returns: 'unknown'
   */
  resolveAlias(alias: string): string {
    return resolveProperty(alias);
  }

  /**
   * Get all registered aliases (built-in + custom)
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const aliases = integration.getAliases();
   * // { bg: 'background', text: 'color', ... }
   */
  getAliases(): Record<string, string> {
    return getAllAliases();
  }

  /**
   * Register custom aliases for your library
   *
   * @example
   * const integration = new BreakpointIntegration();
   * integration.addAlias('bgc', 'background-color');
   * integration.addAliases({
   *   'txt': 'color',
   *   'fw': 'font-weight'
   * });
   */
  addAlias(alias: string, property: string): this {
    registerAlias(alias, property);
    return this;
  }

  addAliases(aliases: Record<string, string>): this {
    registerAliases(aliases);
    return this;
  }

  /**
   * Parse a style string and extract structured data
   * Returns the parsed styles with resolved aliases
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const parsed = integration.parseStyles('bg:blue; dark:text:white');
   * // Returns: ParsedStyles with resolved properties
   */
  parseStyles(input: string): ParsedStyles {
    return coreParse(input);
  }

  /**
   * Extract all properties from a style string (with aliases resolved)
   * Useful for analysis, validation, or generating CSS
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const properties = integration.extractProperties('bg:blue; text:white; dark:bg:black');
   * // Returns: ['background', 'color']
   */
  extractProperties(input: string): string[] {
    const parsed = this.parseStyles(input);
    const properties = new Set(parsed.styles.map(s => s.property));
    return Array.from(properties).sort();
  }

  /**
   * Extract all themes used in a style string
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const themes = integration.extractThemes('bg:blue; dark:bg:black; light:bg:white');
   * // Returns: ['dark', 'light']
   */
  extractThemes(input: string): string[] {
    const parsed = this.parseStyles(input);
    const themes = new Set<string>();
    parsed.styles.forEach(s => {
      if (s.conditions.theme) themes.add(s.conditions.theme);
    });
    return Array.from(themes).sort();
  }

  /**
   * Extract all breakpoints used in a style string
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const breakpoints = integration.extractBreakpoints('p:10px; md:p:20px; lg:p:30px');
   * // Returns: ['md', 'lg']
   */
  extractBreakpoints(input: string): string[] {
    const parsed = this.parseStyles(input);
    const breakpoints = new Set<string>();
    parsed.styles.forEach(s => {
      if (s.conditions.breakpoint) breakpoints.add(s.conditions.breakpoint);
    });
    return Array.from(breakpoints).sort();
  }

  /**
   * Extract all states used in a style string
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const states = integration.extractStates('bg:blue; hover:bg:darkblue; active:bg:navy');
   * // Returns: ['active', 'hover']
   */
  extractStates(input: string): string[] {
    const parsed = this.parseStyles(input);
    const states = new Set<string>();
    parsed.styles.forEach(s => {
      if (s.conditions.state) states.add(s.conditions.state);
    });
    return Array.from(states).sort();
  }

  /**
   * Filter styles by condition
   * Useful for analyzing what styles apply under specific conditions
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const darkStyles = integration.filterByCondition(
   *   'bg:blue; text:white; dark:bg:black; dark:text:gray',
   *   { theme: 'dark' }
   * );
   * // Returns: ParsedStyles containing only dark theme styles
   */
  filterByCondition(
    input: string,
    conditions: {
      theme?: string;
      breakpoint?: string;
      state?: string;
    }
  ): ParsedStyle[] {
    const parsed = this.parseStyles(input);
    return parsed.styles.filter(style => {
      if (conditions.theme && style.conditions.theme !== conditions.theme) return false;
      if (conditions.breakpoint && style.conditions.breakpoint !== conditions.breakpoint) return false;
      if (conditions.state && style.conditions.state !== conditions.state) return false;
      return true;
    });
  }

  /**
   * Convert parsed styles to a plain object
   * Useful for integrating with CSS-in-JS libraries
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const cssObject = integration.toObject('bg:blue; text:white; p:10px');
   * // Returns: { background: 'blue', color: 'white', padding: '10px' }
   */
  toObject(input: string): Record<string, string> {
    const parsed = this.parseStyles(input);
    const obj: Record<string, string> = {};

    // Only include base styles (no conditions)
    parsed.styles.forEach(style => {
      if (!style.conditions.theme && !style.conditions.breakpoint && !style.conditions.state) {
        obj[style.property] = style.value;
      }
    });

    return obj;
  }

  /**
   * Validate a style string
   * Returns validation errors if any
   *
   * @example
   * const integration = new BreakpointIntegration();
   * const errors = integration.validate('bg:blue; invalid-syntax');
   * // Returns: Array of validation error messages
   */
  validate(input: string): string[] {
    const errors: string[] = [];

    try {
      const parsed = this.parseStyles(input);

      // Check for empty styles
      if (parsed.styles.length === 0 && input.trim().length > 0) {
        errors.push('No valid styles found');
      }

      // Check for styles without values
      parsed.styles.forEach((style, index) => {
        if (!style.value || style.value.trim() === '') {
          errors.push(`Style at position ${index} has no value`);
        }
        if (!style.property || style.property.trim() === '') {
          errors.push(`Style at position ${index} has no property`);
        }
      });
    } catch (error) {
      errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return errors;
  }
}

/**
 * Create a new integration instance
 *
 * @example
 * import { createIntegration } from '@componentor/breakpoint';
 *
 * const integration = createIntegration();
 * integration.addAlias('primary', 'background-color');
 * const properties = integration.extractProperties('primary:blue; dark:primary:black');
 */
export function createIntegration(): BreakpointIntegration {
  return new BreakpointIntegration();
}

/**
 * Quick utilities for common integration tasks
 */
export const integrationUtils = {
  /**
   * Quickly resolve an alias
   */
  resolveAlias: (alias: string) => resolveProperty(alias),

  /**
   * Quickly get all aliases
   */
  getAllAliases: () => getAllAliases(),

  /**
   * Quickly parse and extract properties
   */
  extractProperties: (input: string): string[] => {
    const integration = new BreakpointIntegration();
    return integration.extractProperties(input);
  },

  /**
   * Quickly convert to CSS object
   */
  toObject: (input: string): Record<string, string> => {
    const integration = new BreakpointIntegration();
    return integration.toObject(input);
  },

  /**
   * Quickly validate input
   */
  validate: (input: string): string[] => {
    const integration = new BreakpointIntegration();
    return integration.validate(input);
  }
};
