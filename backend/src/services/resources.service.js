import fs from 'fs';
import { BLOG_DATA_PATH } from '../config/paths.js';
import { prisma } from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { calculateReadTime } from '../utils/readTime.js';
import { getFormattedDate } from '../utils/dateFormatter.js';
import { formatArticleToMarkdown, formatDocToMarkdown } from '../utils/markdownFormatter.js';

export const CATEGORY_NAMES = {
  'cv-preview': 'CV Preview',
  'cv-as-code': 'CV-as-Code',
  'ai-agent': 'AI Agent',
  'social': 'Social',
  'misc': 'Misc'
};

export async function loadBlogData() {
  const fileUri = `file://${BLOG_DATA_PATH.replace(/\\/g, '/')}?t=${Date.now()}`;
  const blogModule = await import(fileUri);
  return {
    BLOG_CATEGORIES: JSON.parse(JSON.stringify(blogModule.BLOG_CATEGORIES || [])),
    DOCS_SECTIONS: JSON.parse(JSON.stringify(blogModule.DOCS_SECTIONS || [])),
    BLOG_ARTICLES: JSON.parse(JSON.stringify(blogModule.BLOG_ARTICLES || [])),
    DOCS_CONTENT: JSON.parse(JSON.stringify(blogModule.DOCS_CONTENT || {}))
  };
}

export function recalculateCategoryCounts(articles, categories) {
  const counts = {};
  articles.forEach(art => {
    if (art.category) {
      counts[art.category] = (counts[art.category] || 0) + 1;
    }
  });
  return categories.map(cat => {
    if (cat.id === 'all') {
      return { ...cat, count: articles.length };
    }
    return { ...cat, count: counts[cat.id] || 0 };
  });
}

export function saveBlogDataFile(categories, docsSections, articles, docsContent) {
  const updatedCategories = recalculateCategoryCounts(articles, categories);

  const formattedArticles = articles.map(art => {
    return `  {
    id: ${JSON.stringify(art.id || '')},
    title: ${JSON.stringify(art.title || '')},
    category: ${JSON.stringify(art.category || '')},
    categoryName: ${JSON.stringify(art.categoryName || '')},
    date: ${JSON.stringify(art.date || '')},
    readTime: ${JSON.stringify(art.readTime || '')},
    author: ${JSON.stringify(art.author || '')},
    avatar: ${JSON.stringify(art.avatar || '')},
    summary: ${JSON.stringify(art.summary || '')},
    tags: ${JSON.stringify(art.tags || [])},
    content: ${JSON.stringify(art.content || '')}
  }`;
  }).join(',\n');

  const fileContent = `export const BLOG_CATEGORIES = ${JSON.stringify(updatedCategories, null, 2)};

export const DOCS_SECTIONS = ${JSON.stringify(docsSections, null, 2)};

export const BLOG_ARTICLES = [
${formattedArticles}
];

export const DOCS_CONTENT = ${JSON.stringify(docsContent, null, 2)};
`;

  fs.writeFileSync(BLOG_DATA_PATH, fileContent, 'utf-8');
  return updatedCategories;
}

// Service Methods for Blog & Docs
export async function getResources(resourceType = 'blog') {
  const data = await loadBlogData();
  if (resourceType === 'docs') {
    return {
      type: 'docs',
      docsSections: data.DOCS_SECTIONS,
      docsContent: data.DOCS_CONTENT
    };
  }
  return {
    type: 'blog',
    articles: data.BLOG_ARTICLES,
    categories: data.BLOG_CATEGORIES
  };
}

export async function createResource(resourceType, body) {
  const data = await loadBlogData();

  if (resourceType === 'docs') {
    if (!body.title && !body.sectionTitle) {
      throw new Error('Titlul secțiunii sau al articolului este obligatoriu.');
    }
    let docId = body.id ? slugify(body.id) : slugify(body.sectionTitle || body.title);
    let finalId = docId;
    let counter = 1;
    while (data.DOCS_SECTIONS.some(s => s.id === finalId) || data.DOCS_CONTENT[finalId]) {
      finalId = `${docId}-${counter}`;
      counter++;
    }

    const newSection = {
      id: finalId,
      title: body.sectionTitle || body.title || 'Secțiune Nouă',
      icon: body.icon || 'FileText'
    };
    const newContent = {
      title: body.title || body.sectionTitle || 'Titlu Documentație',
      subtitle: body.subtitle || '',
      content: body.content || ''
    };

    data.DOCS_SECTIONS.push(newSection);
    data.DOCS_CONTENT[finalId] = newContent;

    const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);
    return {
      type: 'docs',
      activeId: finalId,
      docsSections: data.DOCS_SECTIONS,
      docsContent: data.DOCS_CONTENT,
      categories: updatedCategories
    };
  }

  // Blog Article
  if (!body.title || !body.category) {
    throw new Error('Titlul și categoria sunt obligatorii.');
  }

  let articleId = body.id ? slugify(body.id) : slugify(body.title);
  let finalId = articleId;
  let counter = 1;
  while (data.BLOG_ARTICLES.some(a => a.id === finalId)) {
    finalId = `${articleId}-${counter}`;
    counter++;
  }

  const newArticle = {
    id: finalId,
    title: body.title,
    category: body.category,
    categoryName: CATEGORY_NAMES[body.category] || body.categoryName || body.category,
    date: body.date || getFormattedDate(),
    readTime: body.readTime || calculateReadTime(body.content || ''),
    author: body.author || 'Echipa CVBuilder',
    avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.author || 'Author')}`,
    summary: body.summary || '',
    tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    content: body.content || ''
  };

  data.BLOG_ARTICLES.unshift(newArticle);
  const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);

  return {
    type: 'blog',
    article: newArticle,
    articles: data.BLOG_ARTICLES,
    categories: updatedCategories
  };
}

export async function updateResource(resourceType, targetId, body) {
  const data = await loadBlogData();

  if (resourceType === 'docs') {
    const secIndex = data.DOCS_SECTIONS.findIndex(s => s.id === targetId);
    if (secIndex === -1 && !data.DOCS_CONTENT[targetId]) {
      const err = new Error('Secțiunea de documentație nu a fost găsită.');
      err.status = 404;
      throw err;
    }

    const newId = body.id && body.id !== targetId ? slugify(body.id) : targetId;
    const updatedSection = {
      id: newId,
      title: body.sectionTitle !== undefined ? body.sectionTitle : (data.DOCS_SECTIONS[secIndex]?.title || 'Secțiune'),
      icon: body.icon !== undefined ? body.icon : (data.DOCS_SECTIONS[secIndex]?.icon || 'FileText')
    };
    const updatedContent = {
      title: body.title !== undefined ? body.title : (data.DOCS_CONTENT[targetId]?.title || ''),
      subtitle: body.subtitle !== undefined ? body.subtitle : (data.DOCS_CONTENT[targetId]?.subtitle || ''),
      content: body.content !== undefined ? body.content : (data.DOCS_CONTENT[targetId]?.content || '')
    };

    if (secIndex !== -1) {
      data.DOCS_SECTIONS[secIndex] = updatedSection;
    } else {
      data.DOCS_SECTIONS.push(updatedSection);
    }

    if (newId !== targetId) {
      delete data.DOCS_CONTENT[targetId];
    }
    data.DOCS_CONTENT[newId] = updatedContent;

    const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);
    return {
      type: 'docs',
      activeId: newId,
      docsSections: data.DOCS_SECTIONS,
      docsContent: data.DOCS_CONTENT,
      categories: updatedCategories
    };
  }

  // Blog Article update
  const index = data.BLOG_ARTICLES.findIndex(a => a.id === targetId);
  if (index === -1) {
    const err = new Error('Articolul nu a fost găsit.');
    err.status = 404;
    throw err;
  }

  const existing = data.BLOG_ARTICLES[index];
  const updatedArticle = {
    id: body.id && body.id !== existing.id ? slugify(body.id) : existing.id,
    title: body.title !== undefined ? body.title : existing.title,
    category: body.category !== undefined ? body.category : existing.category,
    categoryName: CATEGORY_NAMES[body.category] || body.categoryName || existing.categoryName,
    date: body.date !== undefined ? body.date : existing.date,
    readTime: body.readTime !== undefined && body.readTime !== '' ? body.readTime : calculateReadTime(body.content || existing.content),
    author: body.author !== undefined ? body.author : existing.author,
    avatar: body.avatar !== undefined ? body.avatar : existing.avatar,
    summary: body.summary !== undefined ? body.summary : existing.summary,
    tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map(t => t.trim()).filter(Boolean) : existing.tags),
    content: body.content !== undefined ? body.content : existing.content
  };

  data.BLOG_ARTICLES[index] = updatedArticle;
  const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);

  return {
    type: 'blog',
    article: updatedArticle,
    articles: data.BLOG_ARTICLES,
    categories: updatedCategories
  };
}

export async function deleteResource(resourceType, targetId) {
  const data = await loadBlogData();

  if (resourceType === 'docs') {
    const secIndex = data.DOCS_SECTIONS.findIndex(s => s.id === targetId);
    if (secIndex === -1 && !data.DOCS_CONTENT[targetId]) {
      const err = new Error('Secțiunea de documentație nu a fost găsită.');
      err.status = 404;
      throw err;
    }

    if (secIndex !== -1) {
      data.DOCS_SECTIONS.splice(secIndex, 1);
    }
    delete data.DOCS_CONTENT[targetId];

    const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);
    return {
      type: 'docs',
      docsSections: data.DOCS_SECTIONS,
      docsContent: data.DOCS_CONTENT,
      categories: updatedCategories
    };
  }

  // Blog Article delete
  const initialLength = data.BLOG_ARTICLES.length;
  data.BLOG_ARTICLES = data.BLOG_ARTICLES.filter(a => a.id !== targetId);

  if (data.BLOG_ARTICLES.length === initialLength) {
    const err = new Error('Articolul nu a fost găsit.');
    err.status = 404;
    throw err;
  }

  const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);
  return {
    type: 'blog',
    articles: data.BLOG_ARTICLES,
    categories: updatedCategories
  };
}

export async function exportResourceMarkdown(resourceType, targetId) {
  const data = await loadBlogData();

  if (resourceType === 'docs') {
    const section = data.DOCS_SECTIONS.find(s => s.id === targetId);
    const docContent = data.DOCS_CONTENT[targetId];
    if (!docContent && !section) {
      const err = new Error('Secțiunea de documentație nu a fost găsită.');
      err.status = 404;
      throw err;
    }
    const docObj = {
      id: targetId,
      sectionTitle: section?.title || docContent?.title || 'Secțiune',
      icon: section?.icon || 'BookOpen',
      title: docContent?.title || '',
      subtitle: docContent?.subtitle || '',
      content: docContent?.content || ''
    };
    return { filename: `${targetId}.md`, content: formatDocToMarkdown(docObj) };
  }

  const article = data.BLOG_ARTICLES.find(a => a.id === targetId);
  if (!article) {
    const err = new Error('Articolul nu a fost găsit.');
    err.status = 404;
    throw err;
  }

  return { filename: `${article.id}.md`, content: formatArticleToMarkdown(article) };
}
