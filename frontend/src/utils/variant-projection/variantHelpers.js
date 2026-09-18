export const ARRAY_SECTIONS = [
  'experience',
  'education',
  'skills',
  'languages',
  'awards'
];

/**
 * Normalizes item variants to a clean string array.
 */
export function getItemVariants(item) {
  if (Array.isArray(item.variants)) {
    return item.variants;
  }
  if (typeof item.variant === 'string' && item.variant.trim()) {
    return [item.variant.trim()];
  }
  return ['all'];
}

/**
 * Checks if an item belongs to a specific active variant.
 */
export function itemBelongsToVariant(item, activeVariantId) {
  if (!activeVariantId || activeVariantId === 'all') return true;
  const variants = getItemVariants(item);
  return variants.includes('all') || variants.includes(activeVariantId);
}
