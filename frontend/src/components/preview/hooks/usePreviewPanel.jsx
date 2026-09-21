import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePDF } from '@react-pdf/renderer';
import CVDocument from '../../pdf/CVDocument.jsx';
import { useCv, useAiProposal } from '../../../context/index.jsx';

export function usePreviewPanel(props = {}) {
  const cvCtx = useCv();
  const aiPropCtx = useAiProposal();

  const cvData = props.cvData ?? cvCtx.cvData;
  const styleData = props.styleData ?? cvCtx.styleData;
  const activeVariant = props.activeVariant ?? cvCtx.activeVariant;

  const pendingProposal = props.pendingProposal ?? aiPropCtx.pendingProposal;
  const proposalViewMode = props.proposalViewMode ?? aiPropCtx.proposalViewMode;
  const setProposalViewMode = props.setProposalViewMode ?? aiPropCtx.setProposalViewMode;
  const onAcceptCurrent = props.onAcceptCurrent ?? aiPropCtx.handleAcceptCurrent;
  const onAcceptNewProfile = props.onAcceptNewProfile ?? aiPropCtx.handleAcceptNewProfile;
  const onRejectProposal = props.onRejectProposal ?? aiPropCtx.handleRejectProposal;

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
    document: <CVDocument layoutTemplate={layoutTemplate} />
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePdfInstance(<CVDocument layoutTemplate={layoutTemplate} />);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeCv, activeStyle, activeVariant, pendingProposal, proposalViewMode, layoutTemplate]);

  useEffect(() => {
    // When logged out or no CV data, reset page to 1
    if (!activeCv || !activeCv.personal) {
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    if (previewEngine === 'html' && cvContentRef.current) {
      const height = cvContentRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(height / 1123));
      setTotalPages(pages);
      if (currentPage > pages) {
        setCurrentPage(pages);
      }
    }
    // Note: For react-pdf engine, totalPages is set accurately by PDFCanvasViewer onDocumentLoad,
    // avoiding synthetic page count bouncing and flickering between 1 and 2 pages on proposal before/after toggles!
  }, [activeCv, previewEngine, currentPage]);

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
    setZoomLevel,
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
