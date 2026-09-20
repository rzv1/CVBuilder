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
    setMasterCvData,
    setVariants,
    setActiveVariant,
  } = useCv();

  const [pendingProposal, setPendingProposal] = useState(null);
  const [proposalViewMode, setProposalViewMode] = useState('after'); // 'before' | 'after'

  const handleApplyPatches = ({ explanation, patches }) => {
    if (!Array.isArray(patches) || patches.length === 0) return;
    const { newContent, newStyle } = applySmartPatches(cvData, styleData, patches);
    const { contentPaths, stylePaths } = getAffectedPaths(patches);
    const ephemeralCvData = createEphemeralJsonWithDiff(cvData, newContent, patches);

    setPendingProposal({
      explanation,
      patches,
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
    setPendingProposal(null);
  };

  const handleAcceptNewProfile = (proposal, profileName) => {
    const active = proposal || pendingProposal;
    if (!active) return;
    const newVariantId = 'var-' + Date.now();

    setVariants((prev) => [
      ...prev,
      { id: newVariantId, label: profileName },
    ]);

    if (active.afterContent) {
      setMasterCvData((prevMaster) => {
        return mergeVariantToMaster(prevMaster, active.afterContent, newVariantId);
      });
    }

    if (active.afterStyle) {
      handleUpdateStyleData(active.afterStyle);
    }

    setActiveVariant(newVariantId);
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
