import React, { useState, useEffect, useRef } from 'react';
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
} from './Icons';
import { MOCK_ANALYTICS } from '../mockData';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cvContentRef = useRef(null);

  // Determine active display state based on proposal view mode
  const activeCv = pendingProposal 
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeContent || cvData) : (pendingProposal.afterContent || cvData))
    : cvData;

  const activeStyle = pendingProposal
    ? (proposalViewMode === 'before' ? (pendingProposal.beforeStyle || styleData) : (pendingProposal.afterStyle || styleData))
    : styleData;

  useEffect(() => {
    const updateTotalPages = () => {
      if (cvContentRef.current) {
        const height = cvContentRef.current.scrollHeight;
        const pages = Math.max(1, Math.ceil(height / 1123));
        setTotalPages(pages);
        if (currentPage > pages) {
          setCurrentPage(pages);
        }
      }
    };

    updateTotalPages();
    const timer = setTimeout(updateTotalPages, 100);
    return () => clearTimeout(timer);
  }, [activeCv, activeStyle, activeVariant, proposalViewMode, currentPage]);

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
    return exp.variant === 'all' || exp.variant === activeVariant;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={16} style={{ color: '#60a5fa' }} /> A4 Live Canvas Preview
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
            Deterministic Typst/@react-pdf
          </span>
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
              <strong>Explicație AI:</strong> {pendingProposal.explanation || "Am generat patch-uri JSON restrânse conform schemelor din schema.json."}
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
                {activeVariant !== 'all' && (
                  <span style={{ fontSize: '0.65rem', textTransform: 'none', color: '#2563eb', fontWeight: 600 }}>
                    Filtered by: {activeVariant.toUpperCase()}
                  </span>
                )}
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
      </div>
    </div>
  );
}
