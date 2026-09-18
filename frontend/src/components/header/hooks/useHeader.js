import { useCallback } from 'react';

export function useHeader({
  activeVariant,
  setActiveVariant,
  variants = [
    { id: 'all', label: 'Full Stack Developer (Default)' }
  ],
  latestCommit,
  groupMembers = [],
  onOpenJsonModal,
  onOpenDiffModal,
  onOpenImportModal,
  onOpenShareModal,
  onExportPdf,
  isExportingPdf = false,
  onOpenBlog,
  viewMode,
  isDevMode,
  onToggleDevMode,
  currentUser,
  onOpenAuthModal
}) {
  const handleVariantChange = useCallback((e) => {
    if (setActiveVariant) {
      setActiveVariant(e.target.value);
    }
  }, [setActiveVariant]);

  const handleNormalMode = useCallback(() => {
    if (onToggleDevMode) {
      onToggleDevMode(false);
    }
  }, [onToggleDevMode]);

  const handleDevMode = useCallback(() => {
    if (onToggleDevMode) {
      onToggleDevMode(true);
    }
  }, [onToggleDevMode]);

  const commitTag = latestCommit?.tag || 'v1.4';
  const commitHash = latestCommit?.hash || 'a7f3b91';
  const userCredits = currentUser ? (currentUser.credits ?? 0) : 0;
  const collaborators = groupMembers || [];

  return {
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
  };
}
