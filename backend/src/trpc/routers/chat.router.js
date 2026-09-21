import { router, publicProcedure, TRPCError } from '../trpc.js';
import {
  getChatSessions,
  saveChatSession,
  deleteChatSession
} from '../../services/chat.service.js';
import { generateChatMessage } from '../../services/ai.service.js';


export const chatRouter = router({
  list: publicProcedure
    .input((val) => (typeof val === 'string' ? { userId: val } : val || {}))
    .query(async ({ input }) => {
      try {
        const userId = input?.userId;
        const sessions = await getChatSessions(userId);
        return {
          success: true,
          sessions
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message
        });
      }
    }),

  save: publicProcedure
    .input((val) => val || {})
    .mutation(async ({ input }) => {
      try {
        const { sessionId, userId, title, messages } = input;
        const result = await saveChatSession({ sessionId, userId, title, messages });
        return {
          success: true,
          ...result
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message
        });
      }
    }),

  delete: publicProcedure
    .input((val) => (typeof val === 'string' ? { sessionId: val } : val || {}))
    .mutation(async ({ input }) => {
      try {
        const { sessionId, userId } = input;
        const result = await deleteChatSession(sessionId, userId);
        return {
          success: true,
          ...result
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message
        });
      }
    }),

  generate: publicProcedure
    .input((val) => val || {})
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = input?.userId || ctx?.userId;
        const result = await generateChatMessage({ ...(input || {}), userId });
        return {
          success: true,
          ...result
        };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message
        });
      }
    })
});

