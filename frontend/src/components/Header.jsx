import React from 'react';
import { useHeader } from './header/hooks/useHeader.js';
import HeaderBrand from './header/HeaderBrand.jsx';
import HeaderCenter from './header/HeaderCenter.jsx';
import HeaderActions from './header/HeaderActions.jsx';

export default function Header(props) {
  const {
    activeVariant,
    handleVariantChange,
    variants,
    commitTag,
    commitHash,
    collaborators,
    userCredits,
    handleNormalMode,
    handleDevMode,
    isDevMode,
    onOpenJsonModal,
    onOpenDiffModal,
    onOpenImportModal,
    onOpenShareModal,
    onExportPdf,
    isExportingPdf,
    onOpenBlog,
    viewMode,
    currentUser,
    onOpenAuthModal
  } = useHeader(props);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900/95 border-b border-slate-800 z-50 shrink-0">
      {/* Brand & Status */}
      <HeaderBrand />

      {/* Center - Mode Switcher, Dynamic Tailoring Variant Selector & Git Commit Pill */}
      <HeaderCenter
        isDevMode={isDevMode}
        handleNormalMode={handleNormalMode}
        handleDevMode={handleDevMode}
        activeVariant={activeVariant}
        handleVariantChange={handleVariantChange}
        variants={variants}
        commitTag={commitTag}
        commitHash={commitHash}
        collaborators={collaborators}
        onOpenDiffModal={onOpenDiffModal}
      />

      {/* Right Actions */}
      <HeaderActions
        currentUser={currentUser}
        userCredits={userCredits}
        onOpenAuthModal={onOpenAuthModal}
        viewMode={viewMode}
        onOpenBlog={onOpenBlog}
        onOpenImportModal={onOpenImportModal}
        onOpenJsonModal={onOpenJsonModal}
        onOpenShareModal={onOpenShareModal}
        onExportPdf={onExportPdf}
        isExportingPdf={isExportingPdf}
      />
    </header>
  );
}
