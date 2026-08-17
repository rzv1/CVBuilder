/**
 * Helper to convert text into URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return 'new-article';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // normalization for non-English words consistency
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
