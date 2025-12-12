import { describe, it, expect } from 'vitest';
import { parse, getStyle } from './index.js';

describe('performance tests', () => {
  it('should parse simple styles quickly', () => {
    const styleString = 'color:red; padding:10px; margin:20px';
    const iterations = 10000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      parse(styleString);
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Parse simple styles: ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(1); // Should be under 1ms per operation
  });

  it('should parse complex styles with conditions quickly', () => {
    const styleString = 'display:flex; flex-direction:column; gap:10px; padding:15px; background:white; color:black; dark:background:black; dark:color:white; md:flex-direction:row; md:gap:20px; lg:padding:30px; hover:opacity:0.95';
    const iterations = 5000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      parse(styleString);
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Parse complex styles: ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(2); // Should be under 2ms per operation
  });

  it('should extract styles quickly', () => {
    const styleString = 'display:flex; flex-direction:column; gap:10px; padding:15px; background:white; color:black; dark:background:black; dark:color:white; md:flex-direction:row; md:gap:20px; lg:padding:30px; hover:opacity:0.95';
    const parsed = parse(styleString);
    const iterations = 50000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      getStyle(parsed, { theme: 'dark', breakpoint: 'md', state: 'hover' });
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Extract styles: ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(0.5); // Should be under 0.5ms per operation
  });

  it('should handle large style strings efficiently', () => {
    // Generate a large style string with many rules
    const rules = [];
    const properties = ['margin', 'padding', 'width', 'height', 'color', 'background'];
    const conditions = ['', 'dark:', 'md:', 'lg:', 'hover:', 'dark:md:', 'dark:lg:hover:'];

    for (const condition of conditions) {
      for (const property of properties) {
        rules.push(`${condition}${property}-${Math.random().toString(36).substring(7)}`);
      }
    }

    const styleString = rules.join('; ');
    const iterations = 1000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      const parsed = parse(styleString);
      getStyle(parsed, { theme: 'dark', breakpoint: 'lg', state: 'hover' });
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Large style string (${rules.length} rules): ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(10); // Should be under 10ms per operation
  });

  it('should demonstrate caching benefits', () => {
    const styleString = 'color:red; dark:color:white; md:padding:20px; hover:opacity:0.8';

    // Parse once (simulating cached parse)
    const parsed = parse(styleString);

    // Measure multiple getStyle calls with same parsed object
    const iterations = 100000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      getStyle(parsed, { theme: 'dark' });
      getStyle(parsed, { breakpoint: 'md' });
      getStyle(parsed, { state: 'hover' });
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Cached parse with multiple getStyle calls: ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(0.5);
  });

  it('should measure memory footprint', () => {
    const styleString = 'display:flex; flex-direction:column; gap:10px; padding:15px; background:white; color:black; dark:background:black; dark:color:white; md:flex-direction:row; md:gap:20px; lg:padding:30px; hover:opacity:0.95';

    // Parse multiple times and store
    const parsedObjects = [];
    const count = 1000;

    for (let i = 0; i < count; i++) {
      parsedObjects.push(parse(styleString));
    }

    // Verify they're all properly structured
    expect(parsedObjects).toHaveLength(count);
    expect(parsedObjects[0].styles.length).toBeGreaterThan(0);

    console.log(`Memory footprint test: ${count} parsed objects created`);
  });

  it('should benchmark real-world usage pattern', () => {
    // Simulate a real application with multiple components
    const componentStyles = [
      'display:flex; align-items:center; padding:10px; background:white; dark:background:gray',
      'font-size:14px; color:black; dark:color:white; md:font-size:16px; lg:font-size:18px',
      'margin:0; padding:20px; border:1px-solid-gray; hover:border:blue; active:border:darkblue',
      'width:100%; max-width:800px; margin:0-auto; padding:15px; md:padding:30px',
      'display:grid; grid-template-columns:1fr; gap:20px; md:grid-template-columns:1fr-1fr; lg:grid-template-columns:1fr-1fr-1fr',
    ];

    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      // Parse all component styles
      const parsed = componentStyles.map(s => parse(s));

      // Extract styles for different contexts
      parsed.forEach(p => {
        getStyle(p); // Base
        getStyle(p, { theme: 'dark' }); // Dark theme
        getStyle(p, { breakpoint: 'md' }); // Tablet
        getStyle(p, { theme: 'dark', breakpoint: 'lg' }); // Dark desktop
        getStyle(p, { state: 'hover' }); // Hover state
      });
    }

    const end = performance.now();
    const totalTime = end - start;
    const timePerIteration = totalTime / iterations;

    console.log(`Real-world usage (${componentStyles.length} components): ${timePerIteration.toFixed(4)}ms per render cycle (${iterations} iterations)`);
    console.log(`Total time: ${totalTime.toFixed(2)}ms`);

    expect(timePerIteration).toBeLessThan(5); // Full render cycle should be under 5ms
  });

  it('should efficiently handle deeply nested conditions', () => {
    const styleString = 'padding:10px; dark:md:hover:active:focus:padding:50px';
    const iterations = 10000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      const parsed = parse(styleString);
      getStyle(parsed, { theme: 'dark', breakpoint: 'md', state: 'hover' });
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Deeply nested conditions: ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(1);
  });

  it('should handle empty and invalid input gracefully', () => {
    const inputs = ['', ';;;', 'invalid', '-', ':', 'no-dashes-here'];
    const iterations = 10000;

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      inputs.forEach(input => {
        const parsed = parse(input);
        getStyle(parsed);
      });
    }
    const end = performance.now();
    const timePerOperation = (end - start) / iterations;

    console.log(`Invalid input handling: ${timePerOperation.toFixed(4)}ms per operation (${iterations} iterations)`);
    expect(timePerOperation).toBeLessThan(1);
  });
});
