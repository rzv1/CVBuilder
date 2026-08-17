import { Router } from 'express';
import { slugify } from '../../utils/slugify.js';
import { calculateReadTime } from '../../utils/readTime.js';
import { formatArticleToMarkdown, formatDocToMarkdown } from '../../utils/markdownFormatter.js';

const router = Router();

// POST /api/utils/readtime
router.post('/readtime', (req, res) => {
  const { content } = req.body || {};
  return res.json({ readTime: calculateReadTime(content || '') });
});

// POST /api/utils/slugify
router.post('/slugify', (req, res) => {
  const { text } = req.body || {};
  return res.json({ slug: slugify(text || '') });
});

const handleExportMd = (req, res) => {
  const body = req.body || {};
  const isDoc = body.type === 'docs' || body.sectionTitle !== undefined || body.subtitle !== undefined;
  const mdContent = isDoc ? formatDocToMarkdown(body) : formatArticleToMarkdown(body);
  
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  return res.send(mdContent);
};

// POST /api/export-md or /api/utils/export-md
router.post('/export-md', handleExportMd);
router.post('/', handleExportMd);

export default router;
