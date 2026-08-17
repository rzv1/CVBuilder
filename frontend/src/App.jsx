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

import JsonResumeModal from './components/modals/JsonResumeModal.jsx';
import VisualDiffModal from './components/modals/VisualDiffModal.jsx';
import AnalyticsModal from './components/modals/AnalyticsModal.jsx';
import ShareQrModal from './components/modals/ShareQrModal.jsx';
import UserAuthModal from './components/modals/UserAuthModal.jsx';
import AiChatDrawer from './components/ai/AiChatDrawer.jsx';

import INITIAL_CONTENT from './data/content.json';
import INITIAL_STYLE from './data/style.json';
import { MOCK_GIT_COMMITS } from './mockData.js';
import { applySmartPatches, getAffectedPaths, generateJsonPatch, createEphemeralJsonWithDiff } from './utils/jsonPatch.js';
import { projectMasterToVariant, mergeVariantToMaster } from './utils/variantProjection.js';
import { Edit3, Target, GitBranch, Users, BarChart3, GripVertical, Sparkles } from './components/Icons.jsx';


export default function App() {
  const [masterCvData, setMasterCvData] = useState(INITIAL_CONTENT);
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

  // User Auth & AI Credits state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cv_builder_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Sync user state with localStorage and backend on boot
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem('cv_builder_user', JSON.stringify(currentUser));
      fetch(`/api/users/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('cv_builder_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    } else {
      localStorage.removeItem('cv_builder_user');
    }
  }, [currentUser?.id]);

  const handleUserAuth = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('cv_builder_user', JSON.stringify(user));
    }
  };

  // Derived filtered RAM state for the active variant
  const cvData = React.useMemo(() => {
    return projectMasterToVariant(masterCvData, activeVariant);
  }, [masterCvData, activeVariant]);

  // Keep track of the variant RAM snapshot at last sync for minimum bandwidth patch calculation
  const lastSyncedVariantRAMRef = React.useRef(null);

  useEffect(() => {
    lastSyncedVariantRAMRef.current = cvData;
  }, [activeVariant]);

  // Load latest Master data from disk on boot
  useEffect(() => {
    fetch('http://localhost:3001/api/cv')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          if (data.content) {
            setMasterCvData(data.content);
            lastSyncedVariantRAMRef.current = projectMasterToVariant(data.content, activeVariant);
          }
          if (data.style) setStyleData(data.style);
        }
      })
      .catch(() => {
        // Dev server not active, fallback to local imported content
      });
  }, []);

  // Debounced API persist handle using RFC 6902 JSON Patches
  const saveTimerRef = React.useRef(null);

  const triggerDebouncedPersist = (variantId, nextVariantRAM, style) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const baseRAM = lastSyncedVariantRAMRef.current || {};
      const patches = generateJsonPatch(baseRAM, nextVariantRAM);

      // If no patches and style hasn't changed, skip API call to save bandwidth
      if (patches.length === 0 && !style) return;

      fetch('http://localhost:3001/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          patches,
          style: style || styleData
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          lastSyncedVariantRAMRef.current = nextVariantRAM;
        }
      })
      .catch(() => {
        // Ignored if offline
      });
    }, 2000);
  };

  // State update callback for active variant RAM content
  const handleUpdateCvData = (updater) => {
    const currentVariantRAM = cvData;
    const nextVariantRAM = typeof updater === 'function' ? updater(currentVariantRAM) : updater;
    setMasterCvData(prevMaster => mergeVariantToMaster(prevMaster, nextVariantRAM, activeVariant));
    triggerDebouncedPersist(activeVariant, nextVariantRAM, styleData);
  };

  // State update callback for style data
  const handleUpdateStyleData = (updater) => {
    const nextStyle = typeof updater === 'function' ? updater(styleData) : updater;
    setStyleData(nextStyle);
    triggerDebouncedPersist(activeVariant, cvData, nextStyle);
  };

  // AI JSON Patch Proposal State
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

  const handleTriggerMockProposal = (proposal) => {
    const afterContent = {
      ...cvData,
      experience: cvData.experience.map(exp => {
        if (exp.id === proposal.expId || exp.id === 'exp-1') {
          const updatedBullets = [...exp.bullets];
          updatedBullets[proposal.bulletIndex || 0] = proposal.proposedText;
          return { ...exp, bullets: updatedBullets };
        }
        return exp;
      })
    };
    const patches = generateJsonPatch(cvData, afterContent);
    const ephemeralCvData = createEphemeralJsonWithDiff(cvData, afterContent, patches);

    setPendingProposal({
      explanation: proposal.reason || 'Propunere de optimizare AI',
      expId: proposal.expId,
      bulletIndex: proposal.bulletIndex,
      proposedText: proposal.proposedText,
      atsGain: proposal.atsGain || 12,
      patches,
      beforeContent: cvData,
      afterContent,
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
        persistToDisk(mergedMaster, proposal.afterStyle || styleData);
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


  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
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
        latestCommit={MOCK_GIT_COMMITS[0]}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenDiffModal={() => setIsDiffModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
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
                <ContentEditorTab 
                  cvData={cvData} 
                  setCvData={handleUpdateCvData} 
                  styleData={styleData} 
                  setStyleData={handleUpdateStyleData} 
                  isDevMode={isDevMode} 
                />
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

      <UserAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        currentUser={currentUser}
        onUserAuth={handleUserAuth}
      />
    </div>
  );
}


