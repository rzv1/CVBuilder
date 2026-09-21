import { router, publicProcedure, TRPCError } from '../trpc.js';
import { 
  getCvData, 
  saveCvData, 
  addGitCommit, 
  addGroupComment, 
  toggleGroupComment, 
  recordAnalyticsEvent 
} from '../../services/cv.service.js';

export const cvRouter = router({
  get: publicProcedure
    .input((val) => (typeof val === 'string' ? { userId: val } : val || {}))
    .query(async ({ input, ctx }) => {
      try {
        const userId = input?.userId || ctx?.userId;
        const data = await getCvData(userId);
        return {
          success: true,
          ...data,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),

  save: publicProcedure
    .input((val) => val) // Accept dynamic patch/content/style payload
    .mutation(async ({ input, ctx }) => {
      try {
        const payload = { ...(input || {}), userId: input?.userId || ctx?.userId };
        const result = await saveCvData(payload);
        return {
          success: true,
          ...result,
        };
      } catch (err) {
        throw new TRPCError({
          code: err.statusCode === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),

  addCommit: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      try {
        const commit = await addGitCommit(input || {});
        return { success: true, commit };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),

  addComment: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      try {
        const comment = await addGroupComment(input || {});
        return { success: true, comment };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),

  toggleComment: publicProcedure
    .input((val) => typeof val === 'string' ? val : val?.id)
    .mutation(async ({ input }) => {
      try {
        const comment = await toggleGroupComment(input);
        return { success: true, comment };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),

  recordAnalytics: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      try {
        const event = await recordAnalyticsEvent(input || {});
        return { success: true, event };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),
});
