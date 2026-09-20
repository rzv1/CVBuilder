import { router, createCallerFactory } from './trpc.js';
import { cvRouter } from './routers/cv.router.js';
import { usersRouter } from './routers/users.router.js';
import { resourcesRouter } from './routers/blog/resources.router.js';
import { logsRouter } from './routers/blog/logs.router.js';
import { utilsRouter } from './routers/blog/utils.router.js';
import { aiRouter } from './routers/ai.router.js';

export const appRouter = router({
  cv: cvRouter,
  users: usersRouter,
  resources: resourcesRouter,
  logs: logsRouter,
  utils: utilsRouter,
  ai: aiRouter,
});

export const createCaller = createCallerFactory(appRouter);
