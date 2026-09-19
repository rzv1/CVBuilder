import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import CVDocument from './components/pdf/CVDocument.jsx';
import './App.css';

import Header from './components/Header.jsx';
import PreviewPanel from './components/PreviewPanel.jsx';

import ContentEditorTab from './components/tabs/ContentEditorTab.jsx';
import AtsOptimizerTab from './components/tabs/AtsOptimizerTab.jsx';
import GitVersioningTab from './components/tabs/GitVersioningTab.jsx';
import CollaborationTab from './components/tabs/CollaborationTab.jsx';
import AnalyticsTab from './components/tabs/AnalyticsTab.jsx';
import TechBlogView from './components/blog/TechBlogView.jsx';

import AppModals from './components/modals/AppModals';
import AiChatDrawer from './components/ai/AiChatDrawer.jsx';

import { useCvState } from './hooks/useCvState.js';
import { useAiProposal } from './hooks/useAiProposal.js';
import { useUserAuth } from './hooks/useUserAuth.js';
import { Edit3, GitBranch, Users, BarChart3, GripVertical, Sparkles } from 'lucide-react';

export default function App() {
  // Custom Hooks for State Management
  const {
    masterCvData,
    setMasterCvData,
    styleData,
    setStyleData,
    activeVariant,
    setActiveVariant,
    variants,
    setVariants,
    cvData,
    handleUpdateCvData,
    handleUpdateStyleData,
    gitCommits,
    groupMembers,
    comments,
    analyticsEvents,
    slug,
    handleAddGitCommit,
    handleAddGroupComment,
    handleToggleGroupComment,
    handleRecordAnalytics
  } = useCvState();

  const {
    pendingProposal,
    proposalViewMode,
    setProposalViewMode,
    handleApplyPatches,
    handleAcceptCurrent,
    handleAcceptNewProfile,
    handleRejectProposal
  } = useAiProposal({
    cvData,
    styleData,
    handleUpdateCvData,
    handleUpdateStyleData,
    setMasterCvData,
    setVariants,
    setActiveVariant
  });

  const {
    currentUser,
    setCurrentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleUserAuth
  } = useUserAuth();

  // Navigation & View Mode State
  const [viewMode, setViewMode] = useState('app'); // 'app' | 'blog'
  const [isDevMode, setIsDevMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'ats' | 'git' | 'collab' | 'analytics'
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);

  // Modals Visibility State
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Resizable Left Panel State
  const [leftPanelWidth, setLeftPanelWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);

  // Resizable Right AI Panel State
  const [rightPanelWidth, setRightPanelWidth] = useState(360);
  const [isRightResizing, setIsRightResizing] = useState(false);

  const handleRightMouseDown = (e) => {
    e.preventDefault();
    setIsRightResizing(true);
  };

  useEffect(() => {
    const handleRightMouseMove = (e) => {
      if (!isRightResizing) return;
      const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 280), 550);
      setRightPanelWidth(newWidth);
    };

    const handleRightMouseUp = () => {
      if (isRightResizing) {
        setIsRightResizing(false);
      }
    };

    if (isRightResizing) {
      window.addEventListener('mousemove', handleRightMouseMove);
      window.addEventListener('mouseup', handleRightMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleRightMouseMove);
      window.removeEventListener('mouseup', handleRightMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isRightResizing]);

  
  // Auto-expand left panel width when Dev Mode is active on Content Editor
  useEffect(() => {
    if (isDevMode && activeTab === 'editor') {
      const maxLeftWidth = Math.min(900, Math.max(360, window.innerWidth - 280));
      const devWidth = Math.min(780, Math.max(520, maxLeftWidth - 50));
      setLeftPanelWidth(devWidth);
    } else if (!isDevMode) {
      setLeftPanelWidth(520);
    }
  }, [isDevMode, activeTab]);

  // Mouse Drag Resizing Logic for Left Panel
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const maxLeftWidth = Math.min(900, Math.max(360, window.innerWidth - 280));
      const newWidth = Math.min(Math.max(e.clientX, 360), maxLeftWidth);
      setLeftPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  // Toggle dev mode and handle active tab fallback
  const handleToggleDevMode = (devState) => {
    const nextDevMode = typeof devState === 'boolean' ? devState : !isDevMode;
    setIsDevMode(nextDevMode);
    if (!nextDevMode && activeTab === 'git') {
      setActiveTab('editor');
    }
  };

  // PDF Export Handler
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      handleRecordAnalytics('download', 'pdf_export', 0);
      const doc = (
        <CVDocument 
          cvData={cvData} 
          styleData={styleData} 
          activeVariant={activeVariant} 
          pendingProposal={pendingProposal} 
          proposalViewMode={proposalViewMode} 
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const nameStr = (cvData.personal?.name || 'Resume').replace(/[^a-zA-Z0-9_\-]/g, '_');
      link.href = url;
      link.download = `CV_${nameStr}_${activeVariant}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Export Error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header 
        activeVariant={activeVariant}
        setActiveVariant={setActiveVariant}
        variants={variants}
        latestCommit={gitCommits[0]}
        groupMembers={groupMembers}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenDiffModal={() => setIsDiffModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
        onOpenBlog={() => setViewMode(prev => prev === 'blog' ? 'app' : 'blog')}
        viewMode={viewMode}
        isDevMode={isDevMode}
        onToggleDevMode={handleToggleDevMode}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {viewMode === 'blog' ? (
        <TechBlogView onBackToApp={() => setViewMode('app')} />
      ) : (
        /* Main Workspace Grid */
        <div 
          className={`workspace ${(isResizing || isRightResizing) ? 'is-resizing' : ''}`}
          style={{ 
            gridTemplateColumns: isAiChatOpen 
              ? `${leftPanelWidth}px 6px 1fr 6px ${rightPanelWidth}px` 
              : `${leftPanelWidth}px 6px 1fr` 
          }}
        >
          {/* Left Side: Editor & Smart Tools Panel */}
          <div className="left-panel">
            {/* Tabs Navigation */}
            <div className="editor-tabs-nav">
              <button 
                className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveTab('editor')}
              >
                <Edit3 size={14} /> Content Editor
              </button>

              <button 
                className={`tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
                onClick={() => setActiveTab('ats')}
              >
                <Sparkles size={14} /> Job ATS Optimizer
              </button>

              {isDevMode && (
                <button 
                  className={`tab-btn ${activeTab === 'git' ? 'active' : ''}`}
                  onClick={() => setActiveTab('git')}
                >
                  <GitBranch size={14} /> Git Versioning
                </button>
              )}

              <button 
                className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`}
                onClick={() => setActiveTab('collab')}
              >
                <Users size={14} /> Collaboration
              </button>

              <button 
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={14} /> Analytics
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="tab-content">
              {activeTab === 'editor' && (
                <ContentEditorTab 
                  cvData={cvData} 
                  setCvData={handleUpdateCvData} 
                  styleData={styleData} 
                  setStyleData={handleUpdateStyleData} 
                  isDevMode={isDevMode} 
                  onOpenImportModal={() => setIsImportModalOpen(true)}
                />
              )}

              {activeTab === 'ats' && (
                <AtsOptimizerTab cvData={cvData} />
              )}

              {activeTab === 'git' && (
                <GitVersioningTab 
                  gitCommits={gitCommits}
                  onAddCommit={handleAddGitCommit}
                  onOpenDiffModal={() => setIsDiffModalOpen(true)} 
                />
              )}

              {activeTab === 'collab' && (
                <CollaborationTab 
                  groupMembers={groupMembers}
                  comments={comments}
                  onAddComment={handleAddGroupComment}
                  onToggleComment={handleToggleGroupComment}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab 
                  analyticsEvents={analyticsEvents}
                  slug={slug}
                  onOpenShareModal={() => setIsShareModalOpen(true)} 
                />
              )}
            </div>
          </div>

          {/* Left Workspace Resizer Handle */}
          <div 
            className={`workspace-resizer ${isResizing ? 'active' : ''}`}
            onMouseDown={handleMouseDown}
            title="Trage cu mouse-ul pentru a redimensiona panoul din stânga"
          >
            <div className="resizer-handle-pill">
              <GripVertical size={10} />
            </div>
          </div>

          {/* Center: Live A4 Paper Preview Engine */}
          <PreviewPanel 
            cvData={cvData} 
            styleData={styleData}
            activeVariant={activeVariant}
            pendingProposal={pendingProposal}
            proposalViewMode={proposalViewMode}
            setProposalViewMode={setProposalViewMode}
            onAcceptCurrent={handleAcceptCurrent}
            onAcceptNewProfile={handleAcceptNewProfile}
            onRejectProposal={handleRejectProposal}
          />

          {/* Right Workspace Resizer Handle & AI Chat Panel */}
          {isAiChatOpen && (
            <>
              <div 
                className={`workspace-resizer ${isRightResizing ? 'active' : ''}`}
                onMouseDown={handleRightMouseDown}
                title="Trage cu mouse-ul pentru a redimensiona panoul AI Agent din dreapta"
              >
                <div className="resizer-handle-pill">
                  <GripVertical size={10} />
                </div>
              </div>

              <AiChatDrawer 
                cvData={cvData}
                styleData={styleData}
                isOpen={isAiChatOpen}
                setIsOpen={setIsAiChatOpen}
                onApplyPatches={handleApplyPatches}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            </>
          )}
        </div>
      )}

      {/* Floating Bottom-Right Trigger Button when AI Chat is closed */}
      {!isAiChatOpen && (
        <button 
          className="ai-chat-trigger-btn"
          onClick={() => setIsAiChatOpen(true)}
          title="Deschide panou AI Assistant"
        >
          <div className="trigger-icon-wrapper">
            <Sparkles size={22} className="sparkles-icon" />
          </div>
          <span className="trigger-label">AI Agent</span>
          <span className="trigger-badge">Pro</span>
        </button>
      )}

      {/* Modals Container */}
      <AppModals 
        isJsonModalOpen={isJsonModalOpen}
        setIsJsonModalOpen={setIsJsonModalOpen}
        masterCvData={masterCvData}
        isImportModalOpen={isImportModalOpen}
        setIsImportModalOpen={setIsImportModalOpen}
        currentUser={currentUser}
        setMasterCvData={setMasterCvData}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        handleUserAuth={handleUserAuth}
      />
    </div>
  );
}
