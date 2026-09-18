import { Router } from 'express';
import { 
  getCvData, 
  saveCvData, 
  addGitCommit, 
  addGroupComment, 
  toggleGroupComment, 
  recordAnalyticsEvent 
} from '../../services/cv.service.js';

const router = Router();

// GET /api/cv
router.get('/', async (req, res, next) => {
  try {
    const data = await getCvData();
    return res.json({
      success: true,
      ...data
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cv/commits
router.post('/commits', async (req, res) => {
  try {
    const commit = await addGitCommit(req.body || {});
    return res.json({ success: true, commit });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cv/comments
router.post('/comments', async (req, res) => {
  try {
    const comment = await addGroupComment(req.body || {});
    return res.json({ success: true, comment });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/cv/comments/:id
router.patch('/comments/:id', async (req, res) => {
  try {
    const comment = await toggleGroupComment(req.params.id);
    return res.json({ success: true, comment });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cv/analytics
router.post('/analytics', async (req, res) => {
  try {
    const event = await recordAnalyticsEvent(req.body || {});
    return res.json({ success: true, event });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST / PUT / PATCH /api/cv
const handleSave = async (req, res, next) => {
  try {
    const result = await saveCvData(req.body || {});
    return res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ success: false, error: err.message });
  }
};

router.post('/', handleSave);
router.put('/', handleSave);
router.patch('/', handleSave);

export default router;
