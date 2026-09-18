import { useState } from 'react';
import { applySmartPatches, getAffectedPaths, createEphemeralJsonWithDiff } from '../utils/jsonPatch.js';
import { mergeVariantToMaster } from '../utils/variantProjection.js';

export function useAiProposal({
  cvData,
  styleData,
  handleUpdateCvData,
  handleUpdateStyleData,
  setMasterCvData,
  setVariants,
  setActiveVariant
}) {
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
      ephemeralCvData
    });
    setProposalViewMode('after');
  };

  const handleAcceptCurrent = (proposal) => {
    if (!proposal) return;
    if (proposal.afterContent) {
      handleUpdateCvData(proposal.afterContent);
    }
    if (proposal.afterStyle) {
      handleUpdateStyleData(proposal.afterStyle);
    }
    setPendingProposal(null);
  };

  const handleAcceptNewProfile = (proposal, profileName) => {
    if (!proposal) return;
    const newVariantId = 'var-' + Date.now();
    
    setVariants(prev => [
      ...prev,
      { id: newVariantId, label: profileName }
    ]);

    if (proposal.afterContent) {
      setMasterCvData(prevMaster => {
        const mergedMaster = mergeVariantToMaster(prevMaster, proposal.afterContent, newVariantId);
        return mergedMaster;
      });
    }

    if (proposal.afterStyle) {
      handleUpdateStyleData(proposal.afterStyle);
    }

    setActiveVariant(newVariantId);
    setPendingProposal(null);
  };

  const handleRejectProposal = () => {
    setPendingProposal(null);
  };

  return {
    pendingProposal,
    setPendingProposal,
    proposalViewMode,
    setProposalViewMode,
    handleApplyPatches,
    handleAcceptCurrent,
    handleAcceptNewProfile,
    handleRejectProposal
  };
}
