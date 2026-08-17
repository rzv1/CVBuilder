import { Router } from 'express';
import { fetchApiLogs, clearAllApiLogs } from '../../services/logs.service.js';

const router = Router();

// GET /api/logs
router.get('/', async (req, res, next) => {
  try {
    const data = await fetchApiLogs();
    return res.json({
      success: true,
      logs: data.logs,
      stats: data.stats
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/logs
router.delete('/', async (req, res, next) => {
  try {
    const result = await clearAllApiLogs();
    return res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
