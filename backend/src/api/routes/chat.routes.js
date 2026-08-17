import { Router } from 'express';
import { processChatStream } from '../../services/chat.service.js';

const router = Router();

// POST /api/chat
router.post('/', async (req, res, next) => {
  try {
    await processChatStream(req.body || {}, res);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
});

export default router;
