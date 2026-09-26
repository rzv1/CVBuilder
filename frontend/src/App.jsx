import React, { useEffect, useRef } from 'react';
import './App.css';

import Header from './components/header/Header.jsx';
import PreviewPanel from './components/preview/PreviewPanel.jsx';

import ContentEditorTab from './components/tabs/ContentEditorTab.jsx';
import AtsOptimizerTab from './components/tabs/AtsOptimizerTab.jsx';
import GitVersioningTab from './components/tabs/GitVersioningTab.jsx';
import CollaborationTab from './components/tabs/CollaborationTab.jsx';
import AnalyticsTab from './components/tabs/AnalyticsTab.jsx';

import AiChatDrawer from './components/ai/AiChatDrawer.jsx';

import { useUI } from './context/index.jsx';
import { Edit3, GitBranch, Users, BarChart3, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollFade } from '@/components/ui/scroll-fade';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';

export default function App() {
  const {
    isDevMode,
    activeTab,
    setActiveTab,
    isAiChatOpen,
    setIsAiChatOpen,
  } = useUI();

  // Resizable Panels Ref
  const leftPanelRef = useRef(null);

  // Auto-expand left panel width when Dev Mode is active on Content Editor
  useEffect(() => {
    if (isDevMode && activeTab === 'editor') {
      const maxLeftWidth = Math.min(900, Math.max(360, window.innerWidth - 280));
      const devWidth = Math.min(780, Math.max(520, maxLeftWidth - 50));
      leftPanelRef.current?.resize(devWidth);
    } else if (!isDevMode) {
      leftPanelRef.current?.resize(520);
    }
  }, [isDevMode, activeTab]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header />

      {/* Main Workspace Resizable Panels */}
      <ResizablePanelGroup 
        orientation="horizontal"
        className="workspace"
      >
        {/* Left Side: Editor & Smart Tools Panel */}
        <ResizablePanel
          id="left-panel"
          panelRef={leftPanelRef}
          defaultSize={520}
          minSize={360}
          maxSize={900}
          className="left-panel border-r-0 min-w-[360px]"
        >
          {/* Tabs Navigation */}
          <Tabs
            variant="underline"
            value={activeTab}
            onValueChange={(details) => setActiveTab(details.value)}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto border-b border-slate-800 bg-transparent px-3">
              <TabsTrigger value="editor" className="gap-1.5 text-xs py-2.5">
                <Edit3 size={14} /> Content Editor
              </TabsTrigger>

              <TabsTrigger value="ats" className="gap-1.5 text-xs py-2.5">
                <Sparkles size={14} /> Job ATS Optimizer
              </TabsTrigger>

              {isDevMode && (
                <TabsTrigger value="git" className="gap-1.5 text-xs py-2.5">
                  <GitBranch size={14} /> Git Versioning
                </TabsTrigger>
              )}

              <TabsTrigger value="collab" className="gap-1.5 text-xs py-2.5">
                <Users size={14} /> Collaboration
              </TabsTrigger>

              <TabsTrigger value="analytics" className="gap-1.5 text-xs py-2.5">
                <BarChart3 size={14} /> Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tab Content Area with Scroll Fade */}
          <ScrollFade className="tab-content" fadeSize="lg">
            {activeTab === 'editor' && <ContentEditorTab />}
            {activeTab === 'ats' && <AtsOptimizerTab />}
            {activeTab === 'git' && <GitVersioningTab />}
            {activeTab === 'collab' && <CollaborationTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </ScrollFade>
        </ResizablePanel>

        {/* Left Workspace Resizer Handle */}
        <ResizableHandle withHandle className="hover:bg-indigo-500 transition-colors" />

        {/* Center: Live A4 Paper Preview Engine */}
        <ResizablePanel id="preview-panel" minSize={320} className="min-w-0">
          <PreviewPanel />
        </ResizablePanel>

        {/* Right Workspace Resizer Handle & AI Chat Panel */}
        {isAiChatOpen && (
          <>
            <ResizableHandle withHandle className="bg-slate-800 hover:bg-indigo-500 transition-colors" />
            <ResizablePanel
              id="ai-panel"
              defaultSize={360}
              minSize={280}
              maxSize={550}
              className="min-w-[280px]"
            >
              <AiChatDrawer />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

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
          <span className="trigger-label">AI Rewriter</span>
        </button>
      )}

    </div>
  );
}
