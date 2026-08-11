import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import PreviewPanel from './components/PreviewPanel';

import ContentEditorTab from './components/tabs/ContentEditorTab';
import AtsOptimizerTab from './components/tabs/AtsOptimizerTab';
import GitVersioningTab from './components/tabs/GitVersioningTab';
import CollaborationTab from './components/tabs/CollaborationTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import TechBlogView from './components/blog/TechBlogView';

import JsonResumeModal from './components/modals/JsonResumeModal';
import VisualDiffModal from './components/modals/VisualDiffModal';
import AnalyticsModal from './components/modals/AnalyticsModal';
import ShareQrModal from './components/modals/ShareQrModal';
import AiChatDrawer from './components/ai/AiChatDrawer';

import INITIAL_CONTENT from './data/content.json';
import INITIAL_STYLE from './data/style.json';
import { MOCK_GIT_COMMITS } from './mockData';
import { applySmartPatches, getAffectedPaths } from './utils/jsonPatch';
import { Edit3, Target, GitBranch, Users, BarChart3, GripVertical, Sparkles } from './components/Icons';


export default function App() {
  const [cvData, setCvData] = useState(INITIAL_CONTENT);
  const [styleData, setStyleData] = useState(INITIAL_STYLE);
  const [viewMode, setViewMode] = useState('app'); // 'app' | 'blog'

  const [isDevMode, setIsDevMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'ats' | 'git' | 'collab' | 'analytics'
  const [activeVariant, setActiveVariant] = useState('all'); // 'all' | 'frontend' | 'backend'
  const [variants, setVariants] = useState([
    { id: 'all', label: 'Full Stack Developer (Default)' },
    { id: 'frontend', label: 'Frontend Specialist' },
    { id: 'backend', label: 'Backend Architect' }
  ]);
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);

  // AI JSON Patch Proposal State
  const [pendingProposal, setPendingProposal] = useState(null);
  const [proposalViewMode, setProposalViewMode] = useState('after'); // 'before' | 'after'

  const handleApplyPatches = ({ explanation, patches }) => {
    if (!Array.isArray(patches) || patches.length === 0) return;
    const { newContent, newStyle } = applySmartPatches(cvData, styleData, patches);
    const { contentPaths, stylePaths } = getAffectedPaths(patches);

    setPendingProposal({
      explanation,
      patches,
      contentPaths,
      stylePaths,
      beforeContent: cvData,
      beforeStyle: styleData,
      afterContent: newContent,
      afterStyle: newStyle
    });
    setProposalViewMode('after');
  };

  const handleTriggerMockProposal = (proposal) => {
    setPendingProposal({
      explanation: proposal.reason || 'Propunere de optimizare AI',
      expId: proposal.expId,
      bulletIndex: proposal.bulletIndex,
      proposedText: proposal.proposedText,
      atsGain: proposal.atsGain || 12,
      beforeContent: cvData,
      afterContent: {
        ...cvData,
        experience: cvData.experience.map(exp => {
          if (exp.id === proposal.expId || exp.id === 'exp-1') {
            const updatedBullets = [...exp.bullets];
            updatedBullets[proposal.bulletIndex || 0] = proposal.proposedText;
            return { ...exp, bullets: updatedBullets };
          }
          return exp;
        })
      }
    });
    setProposalViewMode('after');
  };

  const handleAcceptCurrent = (proposal) => {
    if (!proposal) return;
    if (proposal.afterContent) {
      setCvData(proposal.afterContent);
      if (proposal.afterStyle) setStyleData(proposal.afterStyle);
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
      setCvData(proposal.afterContent);
      if (proposal.afterStyle) setStyleData(proposal.afterStyle);
    }

    setActiveVariant(newVariantId);
    setPendingProposal(null);
  };

  const handleRejectProposal = () => {
    setPendingProposal(null);
  };


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
      const maxLeftWidth = Math.min(1100, Math.max(360, window.innerWidth - 280));
      const devWidth = Math.min(980, Math.max(720, maxLeftWidth - 50));
      setLeftPanelWidth(devWidth);
    } else if (!isDevMode) {
      setLeftPanelWidth(520);
    }
  }, [isDevMode, activeTab]);

  // Mouse Drag Resizing Logic
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      // Maximum width for left panel is 1100px (double of right panel's 550px max limit)
      const maxLeftWidth = Math.min(1100, Math.max(360, window.innerWidth - 280));
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

  // Toggle dev mode and handle active tab fallback if needed
  const handleToggleDevMode = (devState) => {
    const nextDevMode = typeof devState === 'boolean' ? devState : !isDevMode;
    setIsDevMode(nextDevMode);
    if (!nextDevMode && activeTab === 'git') {
      setActiveTab('editor');
    }
  };

  // Modals state
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);


  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header 
        activeVariant={activeVariant}
        setActiveVariant={setActiveVariant}
        variants={variants}
        latestCommit={MOCK_GIT_COMMITS[0]}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenDiffModal={() => setIsDiffModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onExportPdf={handleExportPdf}
        onOpenBlog={() => setViewMode(prev => prev === 'blog' ? 'app' : 'blog')}
        viewMode={viewMode}
        isDevMode={isDevMode}
        onToggleDevMode={handleToggleDevMode}
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
                <Target size={14} /> ATS & AI Optimizer
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
                <ContentEditorTab cvData={cvData} setCvData={setCvData} isDevMode={isDevMode} />
              )}

              {activeTab === 'ats' && (
                <AtsOptimizerTab cvData={cvData} onTriggerMockProposal={handleTriggerMockProposal} />
              )}

              {activeTab === 'git' && (
                <GitVersioningTab onOpenDiffModal={() => setIsDiffModalOpen(true)} />
              )}

              {activeTab === 'collab' && (
                <CollaborationTab />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab onOpenShareModal={() => setIsShareModalOpen(true)} />
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

      {/* Modals */}
      <JsonResumeModal 
        isOpen={isJsonModalOpen} 
        onClose={() => setIsJsonModalOpen(false)} 
      />

      <VisualDiffModal 
        isOpen={isDiffModalOpen} 
        onClose={() => setIsDiffModalOpen(false)} 
      />

      <AnalyticsModal 
        isOpen={isAnalyticsModalOpen} 
        onClose={() => setIsAnalyticsModalOpen(false)} 
      />

      <ShareQrModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
}


