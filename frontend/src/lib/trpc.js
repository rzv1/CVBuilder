import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';

export const trpcClient = createTRPCClient({
  links: [
    httpBatchLink({
      url: '/trpc',
      headers() {
        const token = localStorage.getItem('cv_builder_token') || localStorage.getItem('cv_builder_user_id');
        return token
          ? {
              'x-user-id': token,
              authorization: `Bearer ${token}`,
            }
          : {};
      },
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext();
