import { router, createCallerFactory } from './trpc.js';
import { cvRouter } from './routers/cv.router.js';
import { usersRouter } from './routers/users.router.js';
import { aiRouter } from './routers/ai.router.js';
import { targetJobsRouter } from './routers/targetJobs.router.js';
import { chatRouter } from './routers/chat.router.js';

export const appRouter = router({
  cv: cvRouter,
  users: usersRouter,
  ai: aiRouter,
  targetJobs: targetJobsRouter,
  chat: chatRouter,
});

export const createCaller = createCallerFactory(appRouter);
