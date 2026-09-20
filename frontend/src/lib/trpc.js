import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';

export const trpcClient = createTRPCClient({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext();
