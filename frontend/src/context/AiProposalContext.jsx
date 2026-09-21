import React, { createContext, useContext, useState } from 'react';
import { useCv } from './CvContext.jsx';
import { applySmartPatches, getAffectedPaths, createEphemeralJsonWithDiff } from '../utils/jsonPatch.js';
import { mergeVariantToMaster } from '../utils/variantProjection.js';

const AiProposalContext = createContext(null);

export function AiProposalProvider({ children }) {
  const {
    cvData,
    styleData,
    handleUpdateCvData,
    handleUpdateStyleData,
    handleCreateVariant,
  } = useCv();

  const [pendingProposal, setPendingProposal] = useState(null);
  const [proposalViewMode, setProposalViewMode] = useState('after'); // 'before' | 'after'
  const [appliedMessageIds, setAppliedMessageIds] = useState(() => new Set());

  const markMessageApplied = (messageId) => {
    if (!messageId) return;
    setAppliedMessageIds((prev) => {
      const next = new Set(prev);
      next.add(messageId);
      return next;
    });
  };

  const handleApplyPatches = ({ explanation, patches, messageId, onApplied }) => {
    if (!Array.isArray(patches) || patches.length === 0) return;
    if (messageId && appliedMessageIds.has(messageId)) return;

    const { newContent, newStyle } = applySmartPatches(cvData, styleData, patches);
    const { contentPaths, stylePaths } = getAffectedPaths(patches);
    const ephemeralCvData = createEphemeralJsonWithDiff(cvData, newContent, patches);

    setPendingProposal({
      explanation,
      patches,
      messageId,
      onApplied,
      contentPaths,
      stylePaths,
      beforeContent: cvData,
      beforeStyle: styleData,
      afterContent: newContent,
      afterStyle: newStyle,
      ephemeralCvData,
    });
    setProposalViewMode('after');
  };

  const handleAcceptCurrent = (proposal) => {
    const active = proposal || pendingProposal;
    if (!active) return;
    if (active.afterContent) {
      handleUpdateCvData(active.afterContent);
    }
    if (active.afterStyle) {
      handleUpdateStyleData(active.afterStyle);
    }
    if (active.messageId) {
      markMessageApplied(active.messageId);
      if (typeof active.onApplied === 'function') {
        active.onApplied(active.messageId);
      }
    }
    setPendingProposal(null);
  };

  const handleAcceptNewProfile = (proposal, profileName) => {
    const active = proposal || pendingProposal;
    if (!active) return;
    const newVariantId = 'var-' + Date.now();
    const newVariant = { id: newVariantId, label: profileName };

    handleCreateVariant(newVariant, active.afterContent, active.afterStyle);
    if (active.messageId) {
      markMessageApplied(active.messageId);
      if (typeof active.onApplied === 'function') {
        active.onApplied(active.messageId);
      }
    }
    setPendingProposal(null);
  };

  const handleRejectProposal = () => {
    setPendingProposal(null);
  };

  const value = {
    pendingProposal,
    setPendingProposal,
    proposalViewMode,
    setProposalViewMode,
    appliedMessageIds,
    markMessageApplied,
    handleApplyPatches,
    handleAcceptCurrent,
    handleAcceptNewProfile,
    handleRejectProposal,
  };

  return <AiProposalContext.Provider value={value}>{children}</AiProposalContext.Provider>;
}

export function useAiProposal() {
  const context = useContext(AiProposalContext);
  if (!context) {
    throw new Error('useAiProposal must be used within an AiProposalProvider');
  }
  return context;
}
