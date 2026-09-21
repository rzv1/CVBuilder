import React from 'react';
import { createPDFStyles } from '../../utils/pdfStyles.js';
import { DEFAULT_AVATAR, isItemInVariant } from './pdfHelpers.js';
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import ModernTemplate from './templates/ModernTemplate.jsx';
import { useCv, useAiProposal, useAuth } from '../../context/index.jsx';

export default function CVDocument(props = {}) {
  const cvCtx = useCv();
  const aiPropCtx = useAiProposal();
  const auth = useAuth();

  const cvData = props.cvData ?? cvCtx?.cvData ?? {};
  const styleData = props.styleData ?? cvCtx?.styleData ?? {};
  const activeVariant = props.activeVariant ?? cvCtx?.activeVariant ?? 'all';
  const pendingProposal = props.pendingProposal ?? aiPropCtx?.pendingProposal ?? null;
  const proposalViewMode = props.proposalViewMode ?? aiPropCtx?.proposalViewMode ?? 'after';
  const layoutTemplate = props.layoutTemplate ?? styleData?.layout?.template ?? 'classic';
  const currentUser = props.currentUser ?? auth?.currentUser ?? null;

  const activeCv = pendingProposal
    ? (pendingProposal.ephemeralCvData || (proposalViewMode === 'before' ? (pendingProposal.beforeContent || cvData) : (pendingProposal.afterContent || cvData)))
    : cvData;

  const activeStyle = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeStyle || styleData) : (pendingProposal.afterStyle || styleData))
    : styleData;

  const styles = React.useMemo(() => createPDFStyles(activeStyle), [activeStyle]);
  if (!activeCv || Object.keys(activeCv).length === 0) return null;
  const showQrCode = activeStyle?.features?.showQrCode !== false;
  const currentTemplate = layoutTemplate || activeStyle?.layout?.template || 'classic';

  const personal = activeCv.personal || {};
  const experience = (activeCv.experience || []).filter(exp => isItemInVariant(exp, activeVariant));
  const education = (activeCv.education || []).filter(edu => isItemInVariant(edu, activeVariant));
  const skills = (activeCv.skills || []).filter(sk => isItemInVariant(sk, activeVariant));
  const languages = (activeCv.languages || []).filter(lang => isItemInVariant(lang, activeVariant));
  const awards = (activeCv.awards || []).filter(awd => isItemInVariant(awd, activeVariant));
  const customSections = (activeCv.customSections || []).filter(sec => isItemInVariant(sec, activeVariant));
  const hobbies = (activeCv.hobbies || []).filter(hb => isItemInVariant(hb, activeVariant));

  const fontFamily = activeStyle?.theme?.fontFamily === 'executive' ? 'Times-Roman' : (activeStyle?.theme?.fontFamily || 'Helvetica');
  const qrCodeUrl = personal.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://cvbuilder.live/alex-popescu";
  const avatarUrl = props.avatarUrl || personal.avatar || personal.photo || currentUser?.avatar || DEFAULT_AVATAR;

  const templateProps = {
    personal,
    experience,
    education,
    skills,
    languages,
    awards,
    customSections,
    hobbies,
    styles,
    fontFamily,
    showQrCode,
    qrCodeUrl,
    avatarUrl,
    proposalViewMode
  };

  if (currentTemplate === 'modern') {
    return <ModernTemplate {...templateProps} />;
  }

  return <ClassicTemplate {...templateProps} />;
}
