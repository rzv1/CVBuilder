import { router, publicProcedure, TRPCError } from '../trpc.js';
import { 
  getUsers, 
  getUserById, 
  registerUser, 
  updateUser, 
  deleteUser, 
  deductUserCredits 
} from '../../services/users.service.js';

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const users = await getUsers();
      return { success: true, users };
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      });
    }
  }),

  getById: publicProcedure
    .input((val) => typeof val === 'string' ? val : val?.id)
    .query(async ({ input }) => {
      try {
        const user = await getUserById(input);
        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Utilizatorul nu a fost găsit.',
          });
        }
        return { success: true, user };
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message,
        });
      }
    }),

  register: publicProcedure
    .input((val) => typeof val === 'string' ? val : val?.name)
    .mutation(async ({ input }) => {
      const name = typeof input === 'string' ? input.trim() : input?.name?.trim();
      if (!name) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Numele este obligatoriu pentru înregistrare.',
        });
      }

      try {
        const user = await registerUser(name);
        return {
          success: true,
          message: `Bine ai revenit, ${user.name}!`,
          user,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: err.message,
        });
      }
    }),

  update: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      const { id, ...data } = input || {};
      try {
        const updatedUser = await updateUser(id, data);
        const users = await getUsers();
        return {
          success: true,
          message: 'Utilizatorul a fost actualizat cu succes.',
          user: updatedUser,
          users,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: err.message,
        });
      }
    }),

  deductCredits: publicProcedure
    .input((val) => val)
    .mutation(async ({ input }) => {
      const id = typeof input === 'string' ? input : input?.id;
      const amount = input?.amount || 1;
      try {
        const user = await deductUserCredits(id, amount);
        return {
          success: true,
          credits: user.credits,
          user,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: err.message,
        });
      }
    }),

  delete: publicProcedure
    .input((val) => typeof val === 'string' ? val : val?.id)
    .mutation(async ({ input }) => {
      try {
        const users = await deleteUser(input);
        return {
          success: true,
          message: 'Utilizatorul a fost șters cu succes.',
          users,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: err.message,
        });
      }
    }),
});
