import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { PORT } from './config/env.js';
import { CMS_UI_DIR } from './config/paths.js';
import { recordApiLog } from './utils/logger.js';

import usersRoutes from './api/routes/users.routes.js';
import cvRoutes from './api/routes/cv.routes.js';
import resourcesRoutes from './api/routes/resources.routes.js';
import chatRoutes from './api/routes/chat.routes.js';
import logsRoutes from './api/routes/logs.routes.js';
import utilsRoutes from './api/routes/utils.routes.js';

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// API Request Logger Middleware - monkey patching
app.use((req, res, next) => {
  const startTime = Date.now();
  const requestId = 'req_' + Math.random().toString(36).substring(2, 9);
  const pathname = req.path;
  const method = req.method.toUpperCase();

  const originalSend = res.send;
  let responseBodyData = null;

  res.send = function (body) {
    responseBodyData = body;
    return originalSend.apply(res, arguments);
  };

  res.on('finish', () => {
    if (pathname.startsWith('/api') && !pathname.startsWith('/api/logs')) {
      let parsedResBody = null;
      if (typeof responseBodyData === 'string') {
        try {
          parsedResBody = JSON.parse(responseBodyData);
        } catch (e) {
          parsedResBody = responseBodyData.length > 50000 ? responseBodyData.slice(0, 50000) + '...' : responseBodyData;
        }
      } else if (typeof responseBodyData === 'object') {
        parsedResBody = responseBodyData;
      }

      recordApiLog({
        id: requestId,
        timestamp: new Date().toISOString(),
        method,
        url: req.originalUrl,
        pathname,
        queryParams: req.query,
        headers: {
          host: req.headers.host || '',
          'content-type': req.headers['content-type'] || '',
          'user-agent': req.headers['user-agent'] || '',
          accept: req.headers.accept || ''
        },
        body: req.body || null,
        responseBody: parsedResBody,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage || '',
        durationMs: Date.now() - startTime
      });
    }
  });

  next();
});

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/articles', resourcesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/utils', utilsRoutes);
app.use('/api/export-md', utilsRoutes);

// Static Admin CMS UI Middleware & SPA Fallback
app.use(express.static(CMS_UI_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const targetFile = path.join(CMS_UI_DIR, 'index.html');
  if (fs.existsSync(targetFile)) {
    return res.sendFile(targetFile);
  }
  return res.status(404).send('CMS UI Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Application Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

export default app;
