import React, { createContext, useContext, useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import CVDocument from '../components/pdf/CVDocument.jsx';
import { useCv } from './CvContext.jsx';
import { useAiProposal } from './AiProposalContext.jsx';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const { cvData, styleData, activeVariant, handleRecordAnalytics } = useCv();
  const { pendingProposal, proposalViewMode } = useAiProposal();

  // Navigation & View Mode State
  const [isDevMode, setIsDevMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'ats' | 'git' | 'collab' | 'analytics'
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);

  // Modals Visibility State
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // PDF Export State
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const toggleDevMode = useCallback((devState) => {
    setIsDevMode((prev) => {
      const next = typeof devState === 'boolean' ? devState : !prev;
      if (!next && activeTab === 'git') {
        setActiveTab('editor');
      }
      return next;
    });
  }, [activeTab]);


  const toggleAiChat = useCallback(() => {
    setIsAiChatOpen((prev) => !prev);
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      if (handleRecordAnalytics) {
        handleRecordAnalytics('download', 'pdf_export', 0);
      }
      const doc = <CVDocument />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const nameStr = (cvData?.personal?.name || 'Resume').replace(/[^a-zA-Z0-9_\-]/g, '_');
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
  }, [isExportingPdf, handleRecordAnalytics, cvData, styleData, activeVariant, pendingProposal, proposalViewMode]);

  const value = {
    isDevMode,
    setIsDevMode,
    toggleDevMode,
    activeTab,
    setActiveTab,
    isAiChatOpen,
    setIsAiChatOpen,
    toggleAiChat,
    isJsonModalOpen,
    setIsJsonModalOpen,
    isDiffModalOpen,
    setIsDiffModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    isExportingPdf,
    handleExportPdf,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
