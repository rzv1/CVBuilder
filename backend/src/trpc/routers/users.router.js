import { router, publicProcedure, TRPCError } from '../trpc.js';
import { 
  getUsers, 
  getUserById, 
  loginUserByName,
  registerUserByName,
  getOrCreateUserByName,
  updateUser, 
  deleteUser
} from '../../services/users.service.js';

export const usersRouter = router({
  login: publicProcedure
    .input((val) => typeof val === 'string' ? { name: val } : val)
    .mutation(async ({ input }) => {
      const name = typeof input === 'string' ? input.trim() : (input?.name?.trim() || input?.username?.trim());
      if (!name) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Numele de utilizator este obligatoriu.',
        });
      }

      try {
        const user = await loginUserByName(name);
        return {
          success: true,
          id: user.id,
          userId: user.id,
          message: `Bine ai revenit, ${user.name}!`,
          user,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: err.message,
        });
      }
    }),

  auth: publicProcedure
    .input((val) => typeof val === 'string' ? { name: val } : val)
    .mutation(async ({ input }) => {
      const name = typeof input === 'string' ? input.trim() : (input?.name?.trim() || input?.username?.trim());
      const avatar = typeof input === 'object' ? input?.avatar : undefined;
      if (!name) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Numele de utilizator este obligatoriu.',
        });
      }

      try {
        const user = await registerUserByName(name, avatar);
        return {
          success: true,
          id: user.id,
          userId: user.id,
          message: `Bun venit, ${user.name}!`,
          user,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: err.message,
        });
      }
    }),

  register: publicProcedure
    .input((val) => typeof val === 'string' ? { name: val } : val)
    .mutation(async ({ input }) => {
      const name = typeof input === 'string' ? input.trim() : (input?.name?.trim() || input?.username?.trim());
      const avatar = typeof input === 'object' ? input?.avatar : undefined;
      if (!name) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Numele de utilizator este obligatoriu.',
        });
      }

      try {
        const user = await registerUserByName(name, avatar);
        return {
          success: true,
          id: user.id,
          userId: user.id,
          message: `Bun venit, ${user.name}!`,
          user,
        };
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: err.message,
        });
      }
    }),

  getById: publicProcedure
    .input((val) => typeof val === 'string' ? val : val?.id)
    .query(async ({ input, ctx }) => {
      const id = input || ctx?.userId;
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User ID is required.',
        });
      }
      try {
        const user = await getUserById(id);
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