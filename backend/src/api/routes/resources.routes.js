import { Router } from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  exportResourceMarkdown
} from '../../services/resources.service.js';

const router = Router();

// Helper to determine resource type from query param
function getResourceType(req) {
  return req.query.type || 'blog';
}

// GET /api/resources
router.get('/', async (req, res, next) => {
  try {
    const resourceType = getResourceType(req);
    const result = await getResources(resourceType);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/resources
router.post('/', async (req, res, next) => {
  try {
    const resourceType = getResourceType(req);
    const result = await createResource(resourceType, req.body || {});
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/resources/:id/export
router.get('/:id/export', async (req, res, next) => {
  try {
    const resourceType = getResourceType(req);
    const targetId = req.params.id;
    const { filename, content } = await exportResourceMarkdown(resourceType, targetId);

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(content);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

// PUT /api/resources/:id
router.put('/:id', async (req, res, next) => {
  try {
    const resourceType = getResourceType(req);
    const targetId = req.params.id;
    const result = await updateResource(resourceType, targetId, req.body || {});
    return res.json({ success: true, ...result });
  } catch (err) {
    const status = err.status || 400;
    return res.status(status).json({ success: false, error: err.message });
  }
});

// DELETE /api/resources/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const resourceType = getResourceType(req);
    const targetId = req.params.id;
    const result = await deleteResource(resourceType, targetId);
    return res.json({ success: true, ...result });
  } catch (err) {
    const status = err.status || 404;
    return res.status(status).json({ success: false, error: err.message });
  }
});

export default router;
