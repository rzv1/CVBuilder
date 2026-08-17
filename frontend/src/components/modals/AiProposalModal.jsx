import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle, 
  XCircle, 
  Layers, 
  ArrowRight, 
  Eye, 
  Plus, 
  AlertCircle 
} from '../Icons.jsx';

export default function AiProposalModal({ 
  isOpen, 
  onClose, 
  proposal, 
  proposalViewMode, 
  setProposalViewMode, 
  onAcceptCurrent, 
  onAcceptNewProfile, 
  onReject 
}) {
  const [showNewProfileInput, setShowNewProfileInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  if (!isOpen || !proposal) return null;

  const handleCreateProfileSubmit = (e) => {
    e.preventDefault();
    const profileName = newProfileName.trim() || `Profile Tailored (${new Date().toLocaleDateString('ro-RO')})`;
    onAcceptNewProfile(proposal, profileName);
    setShowNewProfileInput(false);
    setNewProfileName('');
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-card" style={{ maxWidth: '680px', width: '92%' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1e1b4b, #1e293b)', borderBottom: '1px solid #4338ca' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#c084fc' }}>
            <div style={{ background: '#4c1d95', padding: '0.4rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} style={{ color: '#a855f7' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f3f4f6' }}>
                Propunere de Optimizare AI CV
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 500 }}>
                {proposal.sectionTitle || 'Optimizare Experiență'} — Score ATS +{proposal.atsGain || 12}%
              </div>
            </div>
          </div>

          <button style={{ background: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.25rem' }}>
          {/* Reason & Context Card */}
          <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '10px', borderLeft: '4px solid #8b5cf6', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              💡 Motivare & Formula Optimizare
            </div>
            <div style={{ fontSize: '0.83rem', color: '#e2e8f0', marginTop: '0.25rem', lineHeight: 1.4 }}>
              {proposal.reason || "Optimizat conform formulei Google XYZ pentru a adăuga metrici cuantificabile și cuvinte cheie ATS relevante."}
            </div>
          </div>

          {/* Interactive Before / After View Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Eye size={16} style={{ color: '#60a5fa' }} /> Comutator Vizualizare Preview:
            </span>

            <div style={{ display: 'flex', background: '#0f172a', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
              <button
                type="button"
                onClick={() => setProposalViewMode('before')}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: proposalViewMode === 'before' ? '#ef4444' : 'transparent',
                  color: proposalViewMode === 'before' ? '#ffffff' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                🔴 Varianta BEFORE (Modificat)
              </button>

              <button
                type="button"
                onClick={() => setProposalViewMode('after')}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: proposalViewMode === 'after' ? '#10b981' : 'transparent',
                  color: proposalViewMode === 'after' ? '#ffffff' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                🟢 Varianta AFTER (Nouă)
              </button>
            </div>
          </div>

          {/* Visual Diff Comparison Box for Content */}
          {(proposal.originalText || proposal.proposedText) && (
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.6rem 0.9rem', background: '#1e293b', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Comparație Text Modificat</span>
                <span style={{ color: proposalViewMode === 'before' ? '#f87171' : '#34d399' }}>
                  Stare curentă activată pe preview: <strong>{proposalViewMode.toUpperCase()}</strong>
                </span>
              </div>

              {/* Stacked Diff Container */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Original Text Box */}
                {proposal.originalText && (
                  <div 
                    style={{ 
                      background: proposalViewMode === 'before' ? '#450a0a' : '#18181b', 
                      border: proposalViewMode === 'before' ? '1.5px solid #ef4444' : '1px solid #27272a',
                      padding: '0.75rem', 
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                      BEFORE (Text Original):
                    </div>
                    <div style={{ fontSize: '0.83rem', color: '#fca5a5', textDecoration: 'line-through', lineHeight: 1.4 }}>
                      "{proposal.originalText}"
                    </div>
                  </div>
                )}

                {proposal.originalText && proposal.proposedText && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ArrowRight size={18} style={{ color: '#6366f1', transform: 'rotate(90deg)' }} />
                  </div>
                )}

                {/* Proposed Text Box */}
                {proposal.proposedText && (
                  <div 
                    style={{ 
                      background: proposalViewMode === 'after' ? '#064e3b' : '#18181b', 
                      border: proposalViewMode === 'after' ? '1.5px solid #10b981' : '1px solid #27272a',
                      padding: '0.75rem', 
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                      AFTER (Varianta Propusă de AI):
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 600, lineHeight: 1.4 }}>
                      "{proposal.proposedText}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visual Diff Comparison Box for Style & Layout */}
          {Array.isArray(proposal.patches) && proposal.patches.some(p => p.target === 'style' || p.path?.startsWith('/theme') || p.path?.startsWith('/typography') || p.path?.startsWith('/layout') || p.path?.startsWith('/features')) && (
            <div style={{ background: '#090d16', border: '1px solid #312e81', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.6rem 0.9rem', background: 'linear-gradient(90deg, #1e1b4b, #1e293b)', fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🎨 Modificări de Stil & Layout (style.json)</span>
                <span style={{ color: proposalViewMode === 'before' ? '#f87171' : '#34d399', fontSize: '0.7rem' }}>
                  Stare preview: <strong>{proposalViewMode.toUpperCase()}</strong>
                </span>
              </div>

              <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {proposal.patches
                  .filter(p => p.target === 'style' || p.path?.startsWith('/theme') || p.path?.startsWith('/typography') || p.path?.startsWith('/layout') || p.path?.startsWith('/features'))
                  .map((p, idx) => {
                    const parts = (p.path || '').split('/').filter(Boolean);
                    const category = parts[0] || 'style';
                    const propName = parts.slice(1).join('.');

                    const beforeVal = proposal.beforeStyle ? parts.reduce((acc, curr) => acc?.[curr], proposal.beforeStyle) : null;
                    const afterVal = p.value !== undefined ? p.value : (proposal.afterStyle ? parts.reduce((acc, curr) => acc?.[curr], proposal.afterStyle) : null);

                    return (
                      <div key={idx} style={{ background: '#1e1b4b', borderRadius: '6px', padding: '0.6rem 0.75rem', border: '1px solid #4338ca', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e0e7ff' }}>
                          <span style={{ color: '#a855f7' }}>[{category.toUpperCase()}]</span> {propName}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <span style={{ background: '#450a0a', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px', textDecoration: 'line-through', border: '1px solid #ef4444' }}>
                            BEFORE: {beforeVal !== null && beforeVal !== undefined ? (typeof beforeVal === 'object' ? JSON.stringify(beforeVal) : String(beforeVal)) : 'N/A'}
                          </span>

                          <ArrowRight size={14} style={{ color: '#a855f7' }} />

                          <span style={{ background: '#064e3b', color: '#a7f3d0', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #10b981' }}>
                            AFTER: {afterVal !== null && afterVal !== undefined ? (typeof afterVal === 'object' ? JSON.stringify(afterVal) : String(afterVal)) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* New Profile Input Section (when expanding "Acceptă & Creează Profil Nou") */}
          {showNewProfileInput && (
            <form onSubmit={handleCreateProfileSubmit} style={{ background: '#1e1b4b', padding: '1rem', borderRadius: '10px', border: '1px solid #6366f1', marginBottom: '1.25rem', animation: 'fadeIn 0.2s ease' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem' }}>
                Nume Noul Profil / Varianta CV-ului:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input-field"
                  style={{ flex: 1, fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                  placeholder="Ex: Senior Fullstack - AI Optimized"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="action-btn action-btn-primary" style={{ padding: '0.45rem 1rem' }}>
                  <CheckCircle size={14} /> Salvează & Comută
                </button>
                <button type="button" className="action-btn" style={{ padding: '0.45rem 0.75rem' }} onClick={() => setShowNewProfileInput(false)}>
                  Anulează
                </button>
              </div>
            </form>
          )}

          {/* Action Prompt Instructions */}
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '0.5rem' }}>
            Alege cum dorești să aplici această modificare în profilul tău de CV:
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', background: '#0f172a', borderTop: '1px solid #1e293b', padding: '1rem 1.25rem' }}>
          {/* Reject Button */}
          <button 
            type="button" 
            className="action-btn" 
            style={{ color: '#ef4444', borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}
            onClick={onReject}
          >
            <XCircle size={16} /> Respinge Propunerea
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Accept & Create New Profile Button */}
            <button 
              type="button" 
              className="action-btn" 
              style={{ background: '#4c1d95', color: '#e9d5ff', borderColor: '#7e22ce' }}
              onClick={() => setShowNewProfileInput(true)}
            >
              <Layers size={16} style={{ color: '#c084fc' }} /> Acceptă & Creează Profil Nou
            </button>

            {/* Accept on Current Profile Button */}
            <button 
              type="button" 
              className="action-btn action-btn-primary"
              style={{ background: '#10b981', borderColor: '#059669', color: '#ffffff' }}
              onClick={() => onAcceptCurrent(proposal)}
            >
              <CheckCircle size={16} /> Acceptă pe Profilul Curent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
