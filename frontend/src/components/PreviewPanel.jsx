import React, { useState, useEffect, useRef } from 'react';
import { usePDF, PDFViewer } from '@react-pdf/renderer';
import CVDocument from './pdf/CVDocument.jsx';
import PDFCanvasViewer from './PDFCanvasViewer.jsx';
import {
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Eye,
  CheckCircle,
  XCircle,
  Check,
  X,
  FileCode
} from './Icons.jsx';
import { MOCK_ANALYTICS } from '../mockData.js';

export default function PreviewPanel({
  cvData,
  styleData,
  activeVariant,
  pendingProposal,
  proposalViewMode,
  setProposalViewMode,
  onAcceptCurrent,
  onAcceptNewProfile,
  onRejectProposal
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [themeTemplate, setThemeTemplate] = useState('modern');
  const [layoutTemplate, setLayoutTemplate] = useState(styleData?.layout?.template || 'classic');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewEngine, setPreviewEngine] = useState('react-pdf'); // 'react-pdf' | 'html'
  const cvContentRef = useRef(null);

  // Sync layoutTemplate if styleData changes
  useEffect(() => {
    if (styleData?.layout?.template && styleData.layout.template !== layoutTemplate) {
      setLayoutTemplate(styleData.layout.template);
    }
  }, [styleData?.layout?.template]);

  // Determine active display state based on proposal view mode
  const activeCv = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeContent || cvData) : (pendingProposal.afterContent || cvData))
    : cvData;

  const activeStyle = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeStyle || styleData) : (pendingProposal.afterStyle || styleData))
    : styleData;

  const [pdfInstance, updatePdfInstance] = usePDF({
    document: (
      <CVDocument
        cvData={activeCv}
        styleData={activeStyle}
        activeVariant={activeVariant}
        pendingProposal={pendingProposal}
        proposalViewMode={proposalViewMode}
        layoutTemplate={layoutTemplate}
      />
    )
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePdfInstance(
        <CVDocument
          cvData={activeCv}
          styleData={activeStyle}
          activeVariant={activeVariant}
          pendingProposal={pendingProposal}
          proposalViewMode={proposalViewMode}
          layoutTemplate={layoutTemplate}
        />
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [activeCv, activeStyle, activeVariant, pendingProposal, proposalViewMode, layoutTemplate]);

  useEffect(() => {
    const updateTotalPages = () => {
      let pages = 1;
      if (previewEngine === 'html' && cvContentRef.current) {
        const height = cvContentRef.current.scrollHeight;
        pages = Math.max(1, Math.ceil(height / 1123));
      } else {
        const expCount = (activeCv.experience || []).length;
        const eduCount = (activeCv.education || []).length;
        const skillCount = (activeCv.skills || []).length;
        const customCount = (activeCv.customSections || []).length;
        const totalItems = expCount + eduCount + skillCount + customCount;
        pages = totalItems > 3 ? 2 : 1;
      }
      setTotalPages(pages);
      if (currentPage > pages) {
        setCurrentPage(pages);
      }
    };

    updateTotalPages();
    const timer = setTimeout(updateTotalPages, 100);
    return () => clearTimeout(timer);
  }, [activeCv, activeStyle, activeVariant, proposalViewMode, previewEngine, currentPage]);

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleCreateProfileSubmit = (e) => {
    e.preventDefault();
    const profileName = newProfileName.trim() || `Profile Tailored (${new Date().toLocaleDateString('ro-RO')})`;
    onAcceptNewProfile(pendingProposal, profileName);
    setIsCreatingProfile(false);
    setNewProfileName('');
  };

  const filteredExperience = (activeCv.experience || []).filter(exp => {
    if (activeVariant === 'all') return true;
    if (!exp.variant && (!exp.variants || exp.variants.length === 0)) return true;
    const itemVars = exp.variants || (exp.variant ? [exp.variant] : ['all']);
    return itemVars.includes('all') || itemVars.includes(activeVariant);
  });

  // Helper to check if path is in JSON patch contentPaths
  const isPathModified = (pathStr) => {
    if (!pendingProposal || !pendingProposal.contentPaths) return false;
    if (pendingProposal.contentPaths.has(pathStr)) return true;
    for (const p of pendingProposal.contentPaths) {
      if (p.startsWith(pathStr) || pathStr.startsWith(p)) return true;
    }
    return false;
  };

  const sectionTitleFontSize = activeStyle?.typography?.sectionTitleSize || '1.1rem';

  return (
    <div className="right-panel">
      {/* Top Preview Toolbar */}
      <div className="preview-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} style={{ color: '#60a5fa' }} /> CV Preview
          </span>
          <div style={{ display: 'flex', background: '#0f172a', padding: '3px', borderRadius: '6px', border: '1px solid #334155' }}>
            <button
              type="button"
              onClick={() => setPreviewEngine('react-pdf')}
              style={{
                padding: '0.2rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: previewEngine === 'react-pdf' ? '#2563eb' : 'transparent',
                color: previewEngine === 'react-pdf' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              @react-pdf/renderer
            </button>
            <button
              type="button"
              onClick={() => setPreviewEngine('html')}
              style={{
                padding: '0.2rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: previewEngine === 'html' ? '#2563eb' : 'transparent',
                color: previewEngine === 'html' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              HTML Canvas
            </button>
          </div>

          {/* Layout Template Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#0f172a', padding: '3px 6px', borderRadius: '6px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, paddingRight: '2px' }}>Layout:</span>
            <button
              type="button"
              onClick={() => setLayoutTemplate('classic')}
              style={{
                padding: '0.2rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: layoutTemplate === 'classic' ? '#2563eb' : 'transparent',
                color: layoutTemplate === 'classic' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
              title="Layout Clasic - O singură coloană"
            >
              📄 Clasic
            </button>
            <button
              type="button"
              onClick={() => setLayoutTemplate('modern')}
              style={{
                padding: '0.2rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: layoutTemplate === 'modern' ? '#10b981' : 'transparent',
                color: layoutTemplate === 'modern' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
              title="Layout Modern - 2 Coloane, Dark Header & QR Code"
            >
              🎨 Modern (QR & 2 Col)
            </button>
          </div>
        </div>

        <div className="preview-controls">
          {/* Page Navigation Controls */}
          <div className="page-navigator" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#1e293b', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              style={{
                background: 'transparent',
                color: currentPage === 1 ? '#475569' : '#38bdf8',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                border: 'none',
                opacity: currentPage === 1 ? 0.4 : 1
              }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ◀
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', minWidth: '42px', textAlign: 'center' }}>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              style={{
                background: 'transparent',
                color: currentPage >= totalPages ? '#475569' : '#38bdf8',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                border: 'none',
                opacity: currentPage >= totalPages ? 0.4 : 1
              }}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              ▶
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <button style={{ background: 'transparent', color: '#9ca3af' }} onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}>
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '38px', textAlign: 'center' }}>
              {zoomLevel}%
            </span>
            <button style={{ background: 'transparent', color: '#9ca3af' }} onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}>
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating AI Proposal Bar */}
      {pendingProposal && (
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderBottom: '2px solid #8b5cf6',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.25rem',
          zIndex: 10,
          boxShadow: '0 6px 16px rgba(0,0,0,0.35)'
        }}>
          {/* Left Side: AI Explanation & Token Savings Indicator */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <div style={{ background: '#7c3aed', padding: '0.3rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} style={{ color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f3f4f6' }}>
                Propunere de Optimizare AI (JSON Patch RFC 6902)
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <FileCode size={12} /> ~85% TOKEN SAVINGS
              </span>
              {pendingProposal.stylePaths && pendingProposal.stylePaths.size > 0 && (
                <span className="badge" style={{ fontSize: '0.68rem', fontWeight: 700, background: '#4c1d95', color: '#e9d5ff', border: '1px solid #7e22ce' }}>
                  🎨 Stil Modificat ({pendingProposal.stylePaths.size})
                </span>
              )}
            </div>

            <div style={{
              fontSize: '0.8rem',
              color: '#cbd5e1',
              lineHeight: '1.45',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              borderLeft: '3px solid #8b5cf6',
              wordBreak: 'break-word',
              whiteSpace: 'normal'
            }}>
              <strong>Explicație AI:</strong> {pendingProposal.explanation || "Am generat patch-uri JSON restrânse conform schemelor din content-schema.json."}
              {pendingProposal.stylePaths && pendingProposal.stylePaths.size > 0 && (
                <div style={{ marginTop: '0.35rem', fontSize: '0.74rem', color: '#c084fc' }}>
                  <strong>Câmpuri de Stil Schimbate:</strong> {Array.from(pendingProposal.stylePaths).join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Stacked Controls (BEFORE/AFTER Toggle + Action Buttons) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', flexShrink: 0 }}>
            {/* Top Right: Before / After Toggle Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Mod Diferențe:
              </span>
              <div style={{ display: 'flex', background: '#090d16', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
                <button
                  type="button"
                  onClick={() => setProposalViewMode('before')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: proposalViewMode === 'before' ? '#ef4444' : 'transparent',
                    color: proposalViewMode === 'before' ? '#ffffff' : '#9ca3af',
                    transition: 'all 0.15s ease'
                  }}
                >
                  BEFORE
                </button>

                <button
                  type="button"
                  onClick={() => setProposalViewMode('after')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: proposalViewMode === 'after' ? '#10b981' : 'transparent',
                    color: proposalViewMode === 'after' ? '#ffffff' : '#9ca3af',
                    transition: 'all 0.15s ease'
                  }}
                >
                  AFTER
                </button>
              </div>
            </div>

            {/* Bottom Right: Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isCreatingProfile ? (
                <form onSubmit={handleCreateProfileSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', width: '180px' }}
                    placeholder="Nume Profil Nou..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="action-btn action-btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: '#10b981', borderColor: '#059669' }}>
                    <Check size={14} /> Salvează
                  </button>
                  <button type="button" className="action-btn" style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setIsCreatingProfile(false)}>
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <>
                  <button
                    type="button"
                    className="action-btn action-btn-primary"
                    style={{ padding: '0.38rem 0.75rem', fontSize: '0.75rem', background: '#10b981', borderColor: '#059669' }}
                    onClick={() => onAcceptCurrent(pendingProposal)}
                    title="Aplică patch-ul pe profilul curent"
                  >
                    <CheckCircle size={14} /> Acceptă pe Profil Curent
                  </button>

                  <button
                    type="button"
                    className="action-btn"
                    style={{ padding: '0.38rem 0.75rem', fontSize: '0.75rem', background: '#4c1d95', color: '#e9d5ff', borderColor: '#7e22ce' }}
                    onClick={() => setIsCreatingProfile(true)}
                    title="Aplică patch-ul și salvează ca un profil nou"
                  >
                    <Layers size={14} style={{ color: '#c084fc' }} /> Acceptă & Profil Nou
                  </button>

                  <button
                    type="button"
                    className="action-btn"
                    style={{ padding: '0.38rem 0.65rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
                    onClick={onRejectProposal}
                    title="Anulează propunerea"
                  >
                    <XCircle size={14} /> Respinge
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* A4 Sheet View Area */}
      <div className="preview-scroll-area">
        {previewEngine === 'react-pdf' ? (
          <div className="react-pdf-container">
            <div
              className="react-pdf-wrapper"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                position: 'relative'
              }}
            >
              {!pdfInstance.url ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                  Se generează PDF-ul Canvas...
                </div>
              ) : (
                <>
                  <PDFCanvasViewer
                    pdfUrl={pdfInstance.url}
                    pageNumber={currentPage}
                    zoomLevel={zoomLevel}
                    onDocumentLoad={({ numPages }) => {
                      setTotalPages(numPages);
                      if (currentPage > numPages) {
                        setCurrentPage(numPages);
                      }
                    }}
                  />
                  {pdfInstance.loading && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: '#60a5fa',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.7rem',
                      borderRadius: '20px',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
                      backdropFilter: 'blur(6px)',
                      pointerEvents: 'none',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        display: 'inline-block',
                        boxShadow: '0 0 8px #38bdf8'
                      }} />
                      Se actualizează...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div
            className="a4-single-page-viewport"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              fontFamily: themeTemplate === 'executive' ? 'Georgia, serif' : (activeStyle?.theme?.fontFamily || 'Inter, sans-serif')
            }}
          >
            <div
              ref={cvContentRef}
              className="a4-content-wrapper"
              style={{
                transform: `translateY(-${(currentPage - 1) * 1123}px)`,
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* CV HEADER */}
              <div className="cv-header-layout">
                <div>
                  <h1 className="cv-name">{activeCv.personal?.name || "Your Full Name"}</h1>
                  <div className="cv-title">{activeCv.personal?.title || "Professional Title"}</div>
                  <div className="cv-contacts">
                    <span>{activeCv.personal?.email}</span>
                    <span>•</span>
                    <span>{activeCv.personal?.phone}</span>
                    <span>•</span>
                    <span>{activeCv.personal?.address}</span>
                  </div>
                </div>

                <div className="cv-qr-code">
                  <img src={MOCK_ANALYTICS.qrCodeUrl} alt="CV QR Link" />
                  <span style={{ marginTop: '2px', fontWeight: 600 }}>Scan for Live CV</span>
                </div>
              </div>

              {/* PROFESSIONAL SUMMARY */}
              {activeCv.personal?.summary && (
                <div className="cv-section">
                  <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize }}>
                    Professional Summary
                  </div>
                  {isPathModified('/personal/summary') ? (
                    <div style={{
                      background: proposalViewMode === 'before' ? '#fee2e2' : '#dcfce7',
                      color: proposalViewMode === 'before' ? '#991b1b' : '#166534',
                      border: proposalViewMode === 'before' ? '2px dashed #ef4444' : '2px solid #22c55e',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      margin: '4px 0',
                      boxShadow: proposalViewMode === 'after' ? '0 0 12px rgba(34,197,94,0.3)' : 'none'
                    }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '3px', color: proposalViewMode === 'before' ? '#ef4444' : '#15803d' }}>
                        {proposalViewMode === 'before' ? '✖ VERSIUNE ANTERIOARĂ (BEFORE)' : '✓ MODIFICAT PRIN JSON PATCH (RFC 6902)'}
                      </div>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.5, textDecoration: proposalViewMode === 'before' ? 'line-through' : 'none' }}>
                        {activeCv.personal.summary}
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                      {activeCv.personal.summary}
                    </p>
                  )}
                </div>
              )}

              {/* WORK EXPERIENCE */}
              <div className="cv-section">
                <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Work Experience</span>
                </div>

                {filteredExperience.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="cv-item">
                    <div className="cv-item-head">
                      <div>
                        <span className="cv-role">{exp.role}</span> — <span className="cv-company">{exp.company}</span>
                      </div>
                      <span className="cv-date">{exp.start} – {exp.end}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                      {exp.description}
                    </div>
                    <ul className="cv-bullets">
                      {(exp.bullets || []).map((b, i) => {
                        const pathKey = `/experience/${expIdx}/bullets/${i}`;
                        const isBulletModified = isPathModified(pathKey) || (pendingProposal && (pendingProposal.expId === exp.id || expIdx === 0) && i === (pendingProposal.bulletIndex || 0));

                        if (isBulletModified) {
                          return (
                            <li key={i} style={{ margin: '6px 0' }}>
                              <span style={{
                                background: proposalViewMode === 'before' ? '#fee2e2' : '#dcfce7',
                                color: proposalViewMode === 'before' ? '#991b1b' : '#166534',
                                border: proposalViewMode === 'before' ? '2px dashed #ef4444' : '2px solid #22c55e',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.82rem',
                                lineHeight: 1.45,
                                display: 'inline-block',
                                textDecoration: proposalViewMode === 'before' ? 'line-through' : 'none',
                                boxShadow: proposalViewMode === 'after' ? '0 0 10px rgba(34,197,94,0.25)' : 'none'
                              }}>
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', marginRight: '6px', color: proposalViewMode === 'before' ? '#ef4444' : '#15803d' }}>
                                  {proposalViewMode === 'before' ? '[BEFORE]' : '[RFC 6902 PATCH]'}
                                </span>
                                {b}
                              </span>
                            </li>
                          );
                        }

                        return <li key={i}>{b}</li>;
                      })}
                    </ul>
                    {exp.skills && (
                      <div className="cv-tags">
                        {exp.skills.map((s, i) => (
                          <span key={i} className="cv-tag">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* EDUCATION */}
              {activeCv.education && activeCv.education.length > 0 && (
                <div className="cv-section">
                  <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize }}>Education</div>
                  {activeCv.education.map((edu) => (
                    <div key={edu.id} className="cv-item">
                      <div className="cv-item-head">
                        <div>
                          <span className="cv-role">{edu.degree}</span> — <span className="cv-company">{edu.institution}</span>
                        </div>
                        <span className="cv-date">{edu.start} – {edu.end}</span>
                      </div>
                      {edu.description && (
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                          {edu.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* SKILLS */}
              {activeCv.skills && activeCv.skills.length > 0 && (
                <div className="cv-section">
                  <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize }}>Skills & Competencies</div>
                  {activeCv.skills.map((skillGroup, sIdx) => {
                    const isSkillGroupModified = isPathModified(`/skills/${sIdx}`);

                    return (
                      <div
                        key={skillGroup.id || sIdx}
                        style={{
                          marginBottom: '0.5rem',
                          ...(isSkillGroupModified ? {
                            background: proposalViewMode === 'before' ? '#fee2e2' : '#dcfce7',
                            border: proposalViewMode === 'before' ? '2px dashed #ef4444' : '2px solid #22c55e',
                            borderRadius: '6px',
                            padding: '6px 10px'
                          } : {})
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.2rem' }}>
                          {skillGroup.category}:
                        </div>
                        <div className="cv-tags">
                          {(skillGroup.items || []).map((sk, idx) => (
                            <span key={idx} className="cv-tag" style={{
                              ...(sk === 'Kubernetes' && proposalViewMode === 'after' ? {
                                background: '#22c55e',
                                color: '#ffffff',
                                fontWeight: 700
                              } : {})
                            }}>{sk}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* LANGUAGES */}
              {activeCv.languages && activeCv.languages.length > 0 && (
                <div className="cv-section">
                  <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize }}>Languages</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem' }}>
                    {activeCv.languages.map(lang => (
                      <span key={lang.id}>
                        <strong>{lang.name}:</strong> {lang.level}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AWARDS */}
              {activeCv.awards && activeCv.awards.length > 0 && (
                <div className="cv-section">
                  <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize }}>Honors & Awards</div>
                  {activeCv.awards.map((awd) => (
                    <div key={awd.id} className="cv-item">
                      <div className="cv-item-head">
                        <div>
                          <span className="cv-role">{awd.title}</span> — <span className="cv-company">{awd.issuer}</span>
                        </div>
                        <span className="cv-date">{awd.date}</span>
                      </div>
                      {awd.description && (
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                          {awd.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CUSTOM MODULAR SECTIONS */}
              {(activeCv.customSections || []).map(sec => (
                <div key={sec.id} className="cv-section">
                  <div className="cv-section-title" style={{ fontSize: sectionTitleFontSize }}>{sec.title}</div>
                  {(sec.items || []).map(item => (
                    <div key={item.id} className="cv-item">
                      <div className="cv-item-head">
                        <div>
                          <span className="cv-role">{item.heading}</span> {item.subheading && `— ${item.subheading}`}
                        </div>
                        <span className="cv-date">
                          {item.start && item.end ? `${item.start} – ${item.end}` : item.start || item.end || item.date || ''}
                        </span>
                      </div>
                      {item.detail && (
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                          {item.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="a4-single-page-footer">
              <span>CV Document • Pagină {currentPage} din {totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
