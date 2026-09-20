import { useAiProposal as useAiProposalFromContext } from '../../../context/index.jsx';

/**
 * Hook delegat catre AiProposalContext pentru eliminarea duplicarii starii.
 */
export function useAiProposal() {
  return useAiProposalFromContext();
}

