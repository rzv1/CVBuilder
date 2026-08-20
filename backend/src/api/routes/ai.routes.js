import { Router } from 'express';
import { processChatStream, parseCvFromText } from '../../services/ai.service.js';

const router = Router();

// POST /api/ai/chat or POST /api/chat
router.post('/', async (req, res, next) => {
  try {
    await processChatStream(req.body || {}, res);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
});

// POST /api/ai/chat
router.post('/chat', async (req, res, next) => {
  try {
    await processChatStream(req.body || {}, res);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
});

// POST /api/ai/parse-cv
router.post('/parse-cv', async (req, res, next) => {
  try {
    const { text, userId, userName } = req.body || {};
    const parsedCv = await parseCvFromText({ text, userId, userName });
    return res.json({
      success: true,
      cvData: parsedCv
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Eroare la parsarea CV-ului.'
    });
  }
});

export default router;
