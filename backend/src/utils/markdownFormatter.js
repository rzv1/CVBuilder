/**
 * Normalize newlines in string
 * @param {string} str
 * @returns {string}
 */
export function normalizeNewlines(str) {
  if (!str) return '';
  let result = str.replace(/\r\n/g, '\n');
  if (!result.includes('\n') && result.includes('\\n')) {
    result = result.replace(/\\n/g, '\n');
  }
  return result;
}

/**
 * Format article object into Markdown string with frontmatter
 * @param {object} article
 * @returns {string}
 */
export function formatArticleToMarkdown(article) {
  const tagsList = Array.isArray(article.tags) ? article.tags : [];
  const formattedTags = tagsList.length > 0
    ? 'tags:\n' + tagsList.map(t => `  - ${t}`).join('\n')
    : 'tags: []';

  const cleanContent = normalizeNewlines(article.content || '');

  return `---
id: ${JSON.stringify(article.id || '')}
title: ${JSON.stringify(article.title || '')}
category: ${JSON.stringify(article.category || '')}
categoryName: ${JSON.stringify(article.categoryName || '')}
date: ${JSON.stringify(article.date || '')}
readTime: ${JSON.stringify(article.readTime || '')}
author: ${JSON.stringify(article.author || '')}
avatar: ${JSON.stringify(article.avatar || '')}
summary: ${JSON.stringify(article.summary || '')}
${formattedTags}
---

${cleanContent}
`;
}

/**
 * Format doc object into Markdown string with frontmatter
 * @param {object} doc
 * @returns {string}
 */
export function formatDocToMarkdown(doc) {
  const cleanContent = normalizeNewlines(doc.content || '');
  return `---
id: ${JSON.stringify(doc.id || '')}
sectionTitle: ${JSON.stringify(doc.sectionTitle || doc.title || '')}
icon: ${JSON.stringify(doc.icon || 'BookOpen')}
title: ${JSON.stringify(doc.title || '')}
subtitle: ${JSON.stringify(doc.subtitle || '')}
---

${cleanContent}
`;
}
