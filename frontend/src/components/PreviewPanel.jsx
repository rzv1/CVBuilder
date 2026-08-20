import React from 'react';
import { usePreviewPanel } from './preview/hooks/usePreviewPanel.jsx';
import PreviewToolbar from './preview/PreviewToolbar.jsx';
import AiProposalBar from './preview/AiProposalBar.jsx';
import PreviewCanvas from './preview/PreviewCanvas.jsx';

export default function PreviewPanel(props) {
  const {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
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
    isCreatingProfile,
    setIsCreatingProfile,
    newProfileName,
    setNewProfileName,
    handleCreateProfileSubmit,
    pendingProposal,
    proposalViewMode,
    setProposalViewMode,
    onAcceptCurrent,
    onRejectProposal
  } = usePreviewPanel(props);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative">
      {/* Top Preview Toolbar */}
      <PreviewToolbar
        previewEngine={previewEngine}
        setPreviewEngine={setPreviewEngine}
        layoutTemplate={layoutTemplate}
        setLayoutTemplate={setLayoutTemplate}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        zoomLevel={zoomLevel}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />

      {/* Floating AI Proposal Bar */}
      <AiProposalBar
        pendingProposal={pendingProposal}
        proposalViewMode={proposalViewMode}
        setProposalViewMode={setProposalViewMode}
        isCreatingProfile={isCreatingProfile}
        setIsCreatingProfile={setIsCreatingProfile}
        newProfileName={newProfileName}
        setNewProfileName={setNewProfileName}
        handleCreateProfileSubmit={handleCreateProfileSubmit}
        onAcceptCurrent={onAcceptCurrent}
        onRejectProposal={onRejectProposal}
      />

      {/* A4 Sheet View Area */}
      <PreviewCanvas
        pdfInstance={pdfInstance}
        currentPage={currentPage}
        zoomLevel={zoomLevel}
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
