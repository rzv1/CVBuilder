import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BLOG_DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'blogData.js');
const CMS_UI_DIR = path.join(__dirname, 'cms-ui');

const PORT = process.env.PORT || 3001;

// Helper to load blogData dynamically
async function loadBlogData() {
  const fileUri = `file://${BLOG_DATA_PATH.replace(/\\/g, '/')}?t=${Date.now()}`;
  const blogModule = await import(fileUri);
  return {
    BLOG_CATEGORIES: JSON.parse(JSON.stringify(blogModule.BLOG_CATEGORIES || [])),
    DOCS_SECTIONS: JSON.parse(JSON.stringify(blogModule.DOCS_SECTIONS || [])),
    BLOG_ARTICLES: JSON.parse(JSON.stringify(blogModule.BLOG_ARTICLES || [])),
    DOCS_CONTENT: JSON.parse(JSON.stringify(blogModule.DOCS_CONTENT || {}))
  };
}

// Helper to update category counts
function recalculateCategoryCounts(articles, categories) {
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

// Helper to write updated data back to blogData.js
function saveBlogDataFile(categories, docsSections, articles, docsContent) {
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

// Helper for slug generation
function slugify(text) {
  if (!text) return 'articol-nou';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Helper for read time
function calculateReadTime(content) {
  if (!content) return '1 min citire';
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min citire`;
}

// Helper for formatted date
function getFormattedDate() {
  const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

const CATEGORY_NAMES = {
  'cv-preview': 'CV Preview',
  'cv-as-code': 'CV-as-Code',
  'ai-agent': 'AI Agent',
  'social': 'Social',
  'misc': 'Misc'
};

function normalizeNewlines(str) {
  if (!str) return '';
  let result = str.replace(/\r\n/g, '\n');
  if (!result.includes('\n') && result.includes('\\n')) {
    result = result.replace(/\\n/g, '\n');
  }
  return result;
}

function formatArticleToMarkdown(article) {
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

// Request Body Parser
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Static File Server
function serveStatic(req, res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(data);
    }
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    // API Routes
    if (pathname === '/api/articles' && method === 'GET') {
      const data = await loadBlogData();
      return sendJson(res, 200, {
        success: true,
        articles: data.BLOG_ARTICLES,
        categories: data.BLOG_CATEGORIES
      });
    }

    if (pathname === '/api/articles' && method === 'POST') {
      const body = await parseJsonBody(req);
      const data = await loadBlogData();

      if (!body.title || !body.category) {
        return sendJson(res, 400, { success: false, error: 'Titlul și categoria sunt obligatorii.' });
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

      return sendJson(res, 200, {
        success: true,
        article: newArticle,
        articles: data.BLOG_ARTICLES,
        categories: updatedCategories
      });
    }

    if (pathname.startsWith('/api/articles/') && method === 'PUT') {
      const targetId = pathname.replace('/api/articles/', '');
      const body = await parseJsonBody(req);
      const data = await loadBlogData();
      const index = data.BLOG_ARTICLES.findIndex(a => a.id === targetId);

      if (index === -1) {
        return sendJson(res, 404, { success: false, error: 'Articolul nu a fost găsit.' });
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

      return sendJson(res, 200, {
        success: true,
        article: updatedArticle,
        articles: data.BLOG_ARTICLES,
        categories: updatedCategories
      });
    }

    if (pathname.startsWith('/api/articles/') && method === 'DELETE') {
      const targetId = pathname.replace('/api/articles/', '');
      const data = await loadBlogData();
      const initialLength = data.BLOG_ARTICLES.length;
      data.BLOG_ARTICLES = data.BLOG_ARTICLES.filter(a => a.id !== targetId);

      if (data.BLOG_ARTICLES.length === initialLength) {
        return sendJson(res, 404, { success: false, error: 'Articolul nu a fost găsit.' });
      }

      const updatedCategories = saveBlogDataFile(data.BLOG_CATEGORIES, data.DOCS_SECTIONS, data.BLOG_ARTICLES, data.DOCS_CONTENT);

      return sendJson(res, 200, {
        success: true,
        articles: data.BLOG_ARTICLES,
        categories: updatedCategories
      });
    }

    if (pathname.endsWith('/export') && pathname.startsWith('/api/articles/') && method === 'GET') {
      const targetId = pathname.replace('/api/articles/', '').replace('/export', '');
      const data = await loadBlogData();
      const article = data.BLOG_ARTICLES.find(a => a.id === targetId);

      if (!article) {
        return sendJson(res, 404, { success: false, error: 'Articolul nu a fost găsit.' });
      }

      const mdContent = formatArticleToMarkdown(article);
      res.writeHead(200, {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${article.id}.md"`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(mdContent);
    }

    if (pathname === '/api/export-md' && method === 'POST') {
      const body = await parseJsonBody(req);
      const mdContent = formatArticleToMarkdown(body);
      res.writeHead(200, {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(mdContent);
    }

    if (pathname === '/api/utils/readtime' && method === 'POST') {
      const body = await parseJsonBody(req);
      return sendJson(res, 200, { readTime: calculateReadTime(body.content || '') });
    }

    if (pathname === '/api/utils/slugify' && method === 'POST') {
      const body = await parseJsonBody(req);
      return sendJson(res, 200, { slug: slugify(body.text || '') });
    }

    if (pathname === '/api/chat' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { messages = [], content = {}, style = {} } = body;
      const userMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || '';

      // Read schema.json syntax rules
      const schemaPath = path.join(PROJECT_ROOT, 'schema.json');
      let schemaContent = '';
      if (fs.existsSync(schemaPath)) {
        schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      });

      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

      if (apiKey) {
        try {
          const { streamText } = await import('ai');
          const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
          const google = createGoogleGenerativeAI({ apiKey });

          const systemPrompt = `You are an expert AI Resume Assistant specializing in token-efficient smart file rewriting using JSON Patches (RFC 6902).

CONTEXT:
1. schema.json (rules of syntax and structure):
${schemaContent.slice(0, 3000)} ...

2. content.json (active CV content):
${JSON.stringify(content, null, 2)}

3. style.json (active CV styling):
${JSON.stringify(style, null, 2)}

INSTRUCTIONS:
- You must fulfill the user's request by modifying content or style.
- To maximize speed and minimize token consumption, NEVER output the full updated JSON file or re-write unchanged sections.
- Output ONLY:
  1. A concise, professional explanation in Romanian explaining what changes were made.
  2. A valid JSON array of RFC 6902 JSON Patches wrapped in a \`\`\`json patch code block.

FORMAT EXAMPLE:
Am optimizat bullet point-ul pentru ...

\`\`\`json patch
[
  { "target": "content", "op": "replace", "path": "/experience/0/bullets/0", "value": "..." },
  { "target": "content", "op": "add", "path": "/skills/1/items/-", "value": "Kubernetes" },
  { "target": "style", "op": "replace", "path": "/typography/sectionTitleSize", "value": "1.25rem" }
]
\`\`\`
`;

          const result = streamText({
            model: google('gemini-3.6-flash'),
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }]
          });

          for await (const textPart of result.textStream) {
            res.write(textPart);
          }
          res.end();
          return;
        } catch (apiErr) {
          console.warn('Gemini API call warning, falling back to smart server simulation:', apiErr.message);
        }
      }

      // Fallback intelligent simulated streaming response
      let replyText = '';
      let patches = [];
      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes('kubernetes') || lowerMsg.includes('cloud') || lowerMsg.includes('lead') || lowerMsg.includes('experien')) {
        replyText = `Am rescris inteligent secțiunea de experiență și competențe pentru a include impactul pe Cloud Architect și Kubernetes. Pentru a economisi jetoane (tokens), am generat doar diferențele sub formă de JSON Patch RFC 6902.`;
        patches = [
          {
            target: 'content',
            op: 'replace',
            path: '/experience/0/bullets/0',
            value: 'Accelerated page load speed by 62% using React 19 SSR, route splitting, and Kubernetes pod auto-scaling.'
          },
          {
            target: 'content',
            op: 'add',
            path: '/skills/1/items/-',
            value: 'Kubernetes'
          }
        ];
      } else if (lowerMsg.includes('rezumat') || lowerMsg.includes('summary')) {
        replyText = `Am optimizat rezumatul profesional conform regulilor din schema.json, evidențiind capacitățile de arhitectură cloud și leadership tehnic.`;
        patches = [
          {
            target: 'content',
            op: 'replace',
            path: '/personal/summary',
            value: 'Senior Full Stack Engineer & Cloud Architect cu peste 7 ani de experiență în scalarea aplicațiilor web distribuite. Expert în React, Node.js, Kubernetes și arhitecturi AWS high-availability.'
          }
        ];
      } else if (lowerMsg.includes('stil') || lowerMsg.includes('font') || lowerMsg.includes('titlu') || lowerMsg.includes('culoare') || lowerMsg.includes('mărește')) {
        replyText = `Am actualizat parametrii din style.json pentru a mări dimensiunea titlurilor de secțiune și a ajusta paleta de culori a CV-ului conform solicitării tale.`;
        patches = [
          {
            target: 'style',
            op: 'replace',
            path: '/typography/sectionTitleSize',
            value: '1.25rem'
          },
          {
            target: 'style',
            op: 'replace',
            path: '/theme/primaryColor',
            value: '#1d4ed8'
          }
        ];
      } else {
        replyText = `Am analizat contextul primit din schema.json, content.json și style.json și am generat modificările cerute sub formă de patch JSON restrâns.`;
        patches = [
          {
            target: 'content',
            op: 'replace',
            path: '/personal/summary',
            value: (content?.personal?.summary || 'Senior Software Engineer') + ' (Optimizat de Gemini AI Agent)'
          }
        ];
      }

      const fullResponse = `${replyText}\n\n\`\`\`json patch\n${JSON.stringify(patches, null, 2)}\n\`\`\``;

      // Stream in small chunks to simulate Vercel AI SDK real-time streaming
      const chunks = fullResponse.match(/.{1,15}/g) || [fullResponse];
      for (const chunk of chunks) {
        res.write(chunk);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      res.end();
      return;
    }


    // Serve Static UI
    let targetFile = path.join(CMS_UI_DIR, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(targetFile)) {
      targetFile = path.join(CMS_UI_DIR, 'index.html');
    }
    return serveStatic(req, res, targetFile);

  } catch (error) {
    console.error('Server error:', error);
    return sendJson(res, 500, { success: false, error: error.message });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n🚀 CVBuilder CMS Server pornit cu succes!`);
  console.log(`🔗 Accesează Dashboard-ul Admin CMS la: ${url}\n`);
});
