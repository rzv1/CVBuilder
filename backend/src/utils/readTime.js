/**
 * Helper to calculate estimated read time for content
 * @param {string} content
 * @returns {string}
 */
export function calculateReadTime(content) {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}
