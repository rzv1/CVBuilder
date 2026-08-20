import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePDF } from '@react-pdf/renderer';
import CVDocument from '../../pdf/CVDocument.jsx';

export function usePreviewPanel({
  cvData,
  styleData,
  activeVariant,
  pendingProposal,
  proposalViewMode,
  setProposalViewMode,
  onAcceptCurrent,
  onAcceptNewProfile,
  onRejectProposal
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [themeTemplate, setThemeTemplate] = useState('modern');
  const [layoutTemplate, setLayoutTemplate] = useState(styleData?.layout?.template || 'classic');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewEngine, setPreviewEngine] = useState('react-pdf');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const cvContentRef = useRef(null);

  // Sync layoutTemplate if styleData changes
  useEffect(() => {
    if (styleData?.layout?.template && styleData.layout.template !== layoutTemplate) {
      setLayoutTemplate(styleData.layout.template);
    }
  }, [styleData?.layout?.template]);

  // Determine active display state based on proposal view mode
  const activeCv = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeContent || cvData) : (pendingProposal.afterContent || cvData))
    : cvData;

  const activeStyle = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeStyle || styleData) : (pendingProposal.afterStyle || styleData))
    : styleData;

  const [pdfInstance, updatePdfInstance] = usePDF({
    document: (
      <CVDocument
        cvData={activeCv}
        styleData={activeStyle}
        activeVariant={activeVariant}
        pendingProposal={pendingProposal}
        proposalViewMode={proposalViewMode}
        layoutTemplate={layoutTemplate}
      />
    )
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePdfInstance(
        <CVDocument
          cvData={activeCv}
          styleData={activeStyle}
          activeVariant={activeVariant}
          pendingProposal={pendingProposal}
          proposalViewMode={proposalViewMode}
          layoutTemplate={layoutTemplate}
        />
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [activeCv, activeStyle, activeVariant, pendingProposal, proposalViewMode, layoutTemplate]);

  useEffect(() => {
    const updateTotalPages = () => {
      let pages = 1;
      if (previewEngine === 'html' && cvContentRef.current) {
        const height = cvContentRef.current.scrollHeight;
        pages = Math.max(1, Math.ceil(height / 1123));
      } else {
        const expCount = (activeCv.experience || []).length;
        const eduCount = (activeCv.education || []).length;
        const skillCount = (activeCv.skills || []).length;
        const customCount = (activeCv.customSections || []).length;
        const totalItems = expCount + eduCount + skillCount + customCount;
        pages = totalItems > 3 ? 2 : 1;
      }
      setTotalPages(pages);
      if (currentPage > pages) {
        setCurrentPage(pages);
      }
    };

    updateTotalPages();
    const timer = setTimeout(updateTotalPages, 100);
    return () => clearTimeout(timer);
  }, [activeCv, activeStyle, activeVariant, proposalViewMode, previewEngine, currentPage]);

  const handleCreateProfileSubmit = (e) => {
    e.preventDefault();
    const profileName = newProfileName.trim() || `Profile Tailored (${new Date().toLocaleDateString('ro-RO')})`;
    onAcceptNewProfile(pendingProposal, profileName);
    setIsCreatingProfile(false);
    setNewProfileName('');
  };

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(130, prev + 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(60, prev - 10));
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    themeTemplate,
    setThemeTemplate,
    layoutTemplate,
    setLayoutTemplate,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    handlePrevPage,
    handleNextPage,
    previewEngine,
    setPreviewEngine,
    pdfInstance,
    cvContentRef,
    isCreatingProfile,
    setIsCreatingProfile,
    newProfileName,
    setNewProfileName,
    handleCreateProfileSubmit,
    activeCv,
    activeStyle,
    pendingProposal,
    proposalViewMode,
    setProposalViewMode,
    onAcceptCurrent,
    onRejectProposal
  };
}
