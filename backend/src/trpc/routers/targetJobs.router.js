import { router, publicProcedure, TRPCError } from '../trpc.js';
import {
  getTargetJobs,
  createTargetJob,
  updateTargetJob,
  deleteTargetJob,
} from '../../services/targetJobs.service.js';

export const targetJobsRouter = router({
  getAll: publicProcedure
    .input((val) => (typeof val === 'string' ? val : val?.userId))
    .query(async ({ input, ctx }) => {
        const userId = input || ctx?.userId;
        const jobs = await getTargetJobs(userId);
        return { success: true, jobs };
    }),

  create: publicProcedure
    .input((val) => val)
    .mutation(async ({ input, ctx }) => {
        const payload = { ...(input || {}), userId: input?.userId || ctx?.userId };
        const job = await createTargetJob(payload);
        return { success: true, job };
    }),

  update: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      const { id, ...data } = input || {};
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Job ID is required for update.',
        });
      }
        const job = await updateTargetJob(id, data);
        return { success: true, job };
    }),

  delete: publicProcedure
    .input((val) => (typeof val === 'string' ? val : val?.id))
    .mutation(async ({ input }) => {
      if (!input) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Job ID is required for deletion.',
        });
      }
      await deleteTargetJob(input);
      return { success: true };
    }),
});
