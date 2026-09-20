import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../lib/queryClient.js';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { CvProvider, useCv } from './CvContext.jsx';
import { AiProposalProvider, useAiProposal } from './AiProposalContext.jsx';
import { UIProvider, useUI } from './UIContext.jsx';

import { TRPCProvider, trpcClient, useTRPC } from '../lib/trpc.js';

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <AuthProvider>
          <CvProvider>
            <AiProposalProvider>
              <UIProvider>
                {children}
              </UIProvider>
            </AiProposalProvider>
          </CvProvider>
        </AuthProvider>
      </TRPCProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export {
  useAuth,
  useCv,
  useAiProposal,
  useUI,
  useTRPC,
  trpcClient,
  queryClient,
};

