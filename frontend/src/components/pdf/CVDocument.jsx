import React from 'react';
import { MOCK_ANALYTICS } from '../../mockData.js';
import { createPDFStyles } from '../../utils/pdfStyles.js';
import { DEFAULT_AVATAR, isItemInVariant } from './pdfHelpers.js';
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import ModernTemplate from './templates/ModernTemplate.jsx';

export default function CVDocument({
  cvData = {},
  styleData = {},
  activeVariant = 'all',
  pendingProposal = null,
  proposalViewMode = 'after',
  layoutTemplate = 'classic'
}) {
  const activeCv = pendingProposal
    ? (pendingProposal.ephemeralCvData || (proposalViewMode === 'before' ? (pendingProposal.beforeContent || cvData) : (pendingProposal.afterContent || cvData)))
    : cvData;

  const activeStyle = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeStyle || styleData) : (pendingProposal.afterStyle || styleData))
    : styleData;

  const styles = React.useMemo(() => createPDFStyles(activeStyle), [activeStyle]);
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
  const qrCodeUrl = personal.qrCodeUrl || MOCK_ANALYTICS.qrCodeUrl;
  const avatarUrl = personal.avatar || personal.photo || DEFAULT_AVATAR;

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
