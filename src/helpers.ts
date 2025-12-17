/**
 * Normalizes adapt input to a string format
 */
export function normalizeAdapt(adapt: string | object | any[] | null | undefined): string {
	if (!adapt) return '';
	if (typeof adapt === 'string') return adapt;
	if (Array.isArray(adapt)) {
		return adapt.map(item => {
			if (typeof item === 'string') return item;
			return Object.entries(item)
				.map(([key, value]) => `${key}:${value}`)
				.join('; ');
		}).join('; ');
	}
	return Object.entries(adapt)
		.map(([key, value]) => `${key}:${value}`)
		.join('; ');
}

type AdaptInput = string | object | any[] | null | undefined;

/**
 * Merges multiple adapt inputs
 * Left arguments override right arguments
 * @example mergeAdapt(child, parent) - child overrides parent
 * @example mergeAdapt(a, b, c, d) - a overrides b, b overrides c, c overrides d
 */
export function mergeAdapt(...adapts: AdaptInput[]): string {
	if (adapts.length === 0) return '';
	if (adapts.length === 1) return normalizeAdapt(adapts[0]);

	const styleMap: Record<string, string> = {};

	// Process right-to-left so left args override right args
	for (let i = adapts.length - 1; i >= 0; i--) {
		const normalized = normalizeAdapt(adapts[i]);
		if (!normalized) continue;

		normalized.split(';').forEach(prop => {
			const trimmed = prop.trim();
			if (trimmed) {
				// Find the last colon that separates the key from value
				// Format: conditions:property:value (e.g., "hover:dark:bg:red" or "bg:red")
				// The key is everything except the final value segment
				// We need to find where the property:value boundary is
				const lastColonIndex = trimmed.lastIndexOf(':');
				if (lastColonIndex > -1) {
					// The key is everything before the last colon (conditions + property)
					// The value is everything after the last colon
					const key = trimmed.substring(0, lastColonIndex).trim();
					const value = trimmed.substring(lastColonIndex + 1).trim();
					if (key) styleMap[key] = value;
				}
			}
		});
	}

	return Object.entries(styleMap)
		.map(([key, value]) => `${key}:${value}`)
		.join(';');
}
