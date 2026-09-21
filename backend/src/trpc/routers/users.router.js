import { router, publicProcedure, TRPCError } from '../trpc.js';
import { 
  getUsers, 
  getUserById, 
  getOrCreateUserByName,
  registerUser, 
  updateUser, 
  deleteUser, 
  deductUserCredits 
} from '../../services/users.service.js';

export const usersRouter = router({

  auth: publicProcedure
    .input((val) => typeof val === 'string' ? val : (val?.name || val?.username))
    .mutation(async ({ input }) => {
      const name = typeof input === 'string' ? input.trim() : (input?.name?.trim() || input?.username?.trim());
      if (!name) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You must provide a username.',
        });
      }

      try {
        const user = await getOrCreateUserByName(name);
        return {
          success: true,
          id: user.id,
          userId: user.id,
          message: `Welcome, ${user.name}!`,
          user,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: err.message,
        });
      }
    }),
});