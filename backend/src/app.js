import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.js';

import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/appRouter.js';
import {
  getTargetJobs,
  createTargetJob,
  updateTargetJob,
  deleteTargetJob,
} from './services/targetJobs.service.js';
import { getOrCreateUserByName } from './services/users.service.js';

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'X-User-Id']
}));

app.use(express.json({ limit: '10mb' }));

// Helper to resolve user ID from request headers or query
const extractUserId = (req) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  return req.headers['x-user-id'] || bearerToken || req.query.userId || null;
};

// tRPC API Middleware (Used by Frontend)
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      const userId = extractUserId(req);
      return { userId, req, res };
    },
  })
);

// Unified Authentication & User Creation REST Endpoint (Used by Extension)
const handleUnifiedAuth = async (req, res, next) => {
  try {
    const name = (req.body?.name || req.body?.username || req.query?.name || req.query?.username || '').trim();
    if (!name) {
      return res.status(400).json({ success: false, error: 'Numele de utilizator este obligatoriu.' });
    }
    const user = await getOrCreateUserByName(name);
    return res.json({
      success: true,
      id: user.id,
      userId: user.id,
      user
    });
  } catch (err) {
    next(err);
  }
};

app.get('/api/users/auth', handleUnifiedAuth);
app.post('/api/users/auth', handleUnifiedAuth);

// REST API for Target Jobs (Used directly by Web Extension)
app.get('/api/target-jobs', async (req, res, next) => {
  try {
    const userId = extractUserId(req);
    const jobs = await getTargetJobs(userId);
    return res.json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
});

app.post('/api/target-jobs', async (req, res, next) => {
  try {
    const userId = req.body?.userId || extractUserId(req);
    const job = await createTargetJob({ ...req.body, userId });
    return res.status(201).json({ success: true, job, data: job });
  } catch (err) {
    next(err);
  }
});

app.put('/api/target-jobs/:id', async (req, res, next) => {
  try {
    const job = await updateTargetJob(req.params.id, req.body);
    return res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/target-jobs/:id', async (req, res, next) => {
  try {
    await deleteTargetJob(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Application Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`server online on: http://localhost:${PORT}\n`);
  });
}


export default app;