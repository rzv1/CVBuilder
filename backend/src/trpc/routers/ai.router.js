import { router, publicProcedure, TRPCError } from '../trpc.js';
import { parseCvFromText } from '../../services/ai.service.js';

export const aiRouter = router({
  parseCv: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      const { text, userId, userName } = input || {};
      try {
        const cvData = await parseCvFromText({ text, userId, userName });
        return {
          success: true,
          cvData,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message || 'Eroare la parsarea CV-ului.',
        });
      }
    }),
});
