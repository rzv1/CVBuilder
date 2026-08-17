import { Router } from 'express';
import { getCvData, saveCvData } from '../../services/cv.service.js';

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

// POST / PUT / PATCH /api/cv
const handleSave = async (req, res, next) => {
  try {
    const result = await saveCvData(req.body || {});
    return res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

router.post('/', handleSave);
router.put('/', handleSave);
router.patch('/', handleSave);

export default router;
