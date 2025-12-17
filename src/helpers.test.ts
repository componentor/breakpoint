import { describe, it, expect } from 'vitest';
import { normalizeAdapt, mergeAdapt } from './helpers.js';

describe('normalizeAdapt', () => {
	it('should return empty string for null/undefined', () => {
		expect(normalizeAdapt(null)).toBe('');
		expect(normalizeAdapt(undefined)).toBe('');
	});

	it('should return string as-is', () => {
		expect(normalizeAdapt('bg:red; color:white')).toBe('bg:red; color:white');
	});

	it('should convert simple object to string', () => {
		expect(normalizeAdapt({ bg: 'red', color: 'white' })).toBe('bg:red; color:white');
	});

	it('should convert array of strings to string', () => {
		expect(normalizeAdapt(['bg:red', 'color:white'])).toBe('bg:red; color:white');
	});

	it('should convert array of objects to string', () => {
		expect(normalizeAdapt([{ bg: 'red' }, { color: 'white' }])).toBe('bg:red; color:white');
	});

	it('should handle mixed array of strings and objects', () => {
		expect(normalizeAdapt(['bg:red', { color: 'white' }])).toBe('bg:red; color:white');
	});
});

describe('mergeAdapt', () => {
	it('should return empty string for no arguments', () => {
		expect(mergeAdapt()).toBe('');
	});

	it('should return normalized single argument', () => {
		expect(mergeAdapt('bg:red')).toBe('bg:red');
	});

	it('should merge two simple styles', () => {
		const result = mergeAdapt('bg:red', 'color:white');
		expect(result).toContain('bg:red');
		expect(result).toContain('color:white');
	});

	it('should allow left to override right for same property', () => {
		const result = mergeAdapt('bg:red', 'bg:blue');
		expect(result).toBe('bg:red');
	});

	it('should handle multiple arguments with left-to-right priority', () => {
		const result = mergeAdapt('bg:red', 'bg:green', 'bg:blue');
		expect(result).toBe('bg:red');
	});

	// Critical test for the bug fix: different conditions should not collide
	describe('key extraction (regression tests for #1.5.2)', () => {
		it('should not confuse hover:bg with hover:dark:bg', () => {
			const result = mergeAdapt('hover:bg:white', 'hover:dark:bg:black');
			expect(result).toContain('hover:bg:white');
			expect(result).toContain('hover:dark:bg:black');
		});

		it('should not confuse base with themed styles', () => {
			const result = mergeAdapt('bg:white', 'dark:bg:black');
			expect(result).toContain('bg:white');
			expect(result).toContain('dark:bg:black');
		});

		it('should not confuse different breakpoints', () => {
			const result = mergeAdapt('md:bg:gray', 'lg:bg:white');
			expect(result).toContain('md:bg:gray');
			expect(result).toContain('lg:bg:white');
		});

		it('should not confuse different states', () => {
			const result = mergeAdapt('hover:bg:blue', 'active:bg:red');
			expect(result).toContain('hover:bg:blue');
			expect(result).toContain('active:bg:red');
		});

		it('should handle complex conditions without collision', () => {
			const result = mergeAdapt(
				'hover:bg:white',
				'hover:dark:bg:black',
				'active:bg:gray',
				'active:dark:bg:darkgray',
				'md:hover:bg:lightblue',
				'md:hover:dark:bg:darkblue'
			);
			expect(result).toContain('hover:bg:white');
			expect(result).toContain('hover:dark:bg:black');
			expect(result).toContain('active:bg:gray');
			expect(result).toContain('active:dark:bg:darkgray');
			expect(result).toContain('md:hover:bg:lightblue');
			expect(result).toContain('md:hover:dark:bg:darkblue');
		});

		it('should correctly override same condition+property', () => {
			const result = mergeAdapt('hover:bg:red', 'hover:bg:blue');
			expect(result).toBe('hover:bg:red');
			expect(result).not.toContain('blue');
		});

		it('should correctly override themed condition+property', () => {
			const result = mergeAdapt('hover:dark:bg:red', 'hover:dark:bg:blue');
			expect(result).toBe('hover:dark:bg:red');
			expect(result).not.toContain('blue');
		});

		it('should preserve current state separately from hover', () => {
			const result = mergeAdapt(
				'current:bg:blue',
				'current:dark:bg:darkblue',
				'hover:bg:gray',
				'hover:dark:bg:darkgray'
			);
			expect(result).toContain('current:bg:blue');
			expect(result).toContain('current:dark:bg:darkblue');
			expect(result).toContain('hover:bg:gray');
			expect(result).toContain('hover:dark:bg:darkgray');
		});

		it('should handle color-mix values correctly', () => {
			const result = mergeAdapt(
				'hover:bg:color-mix(in oklch, var(--color-transparent) 70%, white)',
				'hover:dark:bg:color-mix(in oklch, var(--color-transparent) 75%, black)'
			);
			expect(result).toContain('hover:bg:color-mix(in oklch, var(--color-transparent) 70%, white)');
			expect(result).toContain('hover:dark:bg:color-mix(in oklch, var(--color-transparent) 75%, black)');
		});
	});

	describe('merge with objects and arrays', () => {
		it('should merge object with string', () => {
			const result = mergeAdapt({ bg: 'red' }, 'color:white');
			expect(result).toContain('bg:red');
			expect(result).toContain('color:white');
		});

		it('should allow object to override string for same property', () => {
			const result = mergeAdapt({ bg: 'red' }, 'bg:blue');
			expect(result).toBe('bg:red');
		});
	});
});
