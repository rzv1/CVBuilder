import { Router } from 'express';
import { getUsers, getUserById, registerUser, updateUser, deleteUser, deductUserCredits } from '../../services/users.service.js';

const router = Router();

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await getUsers();
    return res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  try {
    const { name } = req.body || {};
    const user = await registerUser(name);
    return res.json({
      success: true,
      message: `Bine ai revenit, ${user.name}!`,
      user
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/users/:id/deduct
router.post('/:id/deduct', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const amount = parseInt(req.body?.amount, 10) || 1;
    const user = await deductUserCredits(userId, amount);
    return res.json({
      success: true,
      credits: user.credits,
      user
    });
  } catch (err) {
    const status = err.credits !== undefined ? 400 : 404;
    return res.status(status).json({
      success: false,
      error: err.message,
      credits: err.credits
    });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilizatorul nu a fost găsit.' });
    }
    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUser(userId, req.body || {});
    const users = await getUsers();
    return res.json({
      success: true,
      message: 'Utilizatorul a fost actualizat cu succes.',
      user: updatedUser,
      users
    });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    const users = await deleteUser(userId);
    return res.json({
      success: true,
      message: 'Utilizatorul a fost șters cu succes.',
      users
    });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
});

export default router;
