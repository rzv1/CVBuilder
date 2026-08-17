import React from 'react';
import { 
  Sparkles, 
  GitCommit, 
  Share2, 
  FileCode, 
  BarChart3, 
  Download, 
  Users, 
  CheckCircle2, 
  Layers,
  BookOpen,
  User,
  Terminal,
  Zap
} from './Icons.jsx';
import { MOCK_COLLABORATORS } from '../mockData.js';

export default function Header({ 
  activeVariant, 
  setActiveVariant, 
  variants = [
    { id: 'all', label: 'Full Stack Developer (Default)' },
    { id: 'frontend', label: 'Frontend Specialist' },
    { id: 'backend', label: 'Backend Architect' }
  ],
  latestCommit, 
  onOpenJsonModal, 
  onOpenDiffModal, 
  onOpenAnalyticsModal, 
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
  return (
    <header className="app-header">
      {/* Brand & Status */}
      <div className="header-brand">
        <div className="logo-box">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="brand-title">CVBuilder AI Studio</div>
          <div className="badge badge-green" style={{ fontSize: '0.65rem' }}>
            <CheckCircle2 size={10} /> Live Sync Active
          </div>
        </div>
      </div>

      {/* Center - Mode Switcher, Dynamic Tailoring Variant Selector & Git Commit Pill */}
      <div className="header-center">
        {/* Discrete Mode Switcher Segmented Control */}
        <div className={`mode-switcher-container ${isDevMode ? 'dev-active' : ''}`} title="Comută între Normal View și Dev View">
          <button 
            className={`mode-switch-btn ${!isDevMode ? 'active' : ''}`}
            onClick={() => onToggleDevMode(false)}
          >
            <User size={13} />
            <span>Normal</span>
          </button>
          <button 
            className={`mode-switch-btn ${isDevMode ? 'active' : ''}`}
            onClick={() => onToggleDevMode(true)}
          >
            <Terminal size={13} style={{ color: isDevMode ? '#a855f7' : '#9ca3af' }} />
            <span>Dev Mode</span>
            {isDevMode && <span className="dev-glow-dot" />}
          </button>
        </div>

        {/* Dynamic Tailoring Selector */}
        <div className="variant-selector" title="Dynamic Tailoring: Filter CV entries by active profile">
          <Layers size={14} style={{ color: '#60a5fa' }} />
          <label>Profile Variant:</label>
          <select 
            className="variant-select"
            value={activeVariant}
            onChange={(e) => setActiveVariant(e.target.value)}
          >
            {variants.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Git Version Pill */}
        <button 
          className="action-btn" 
          onClick={onOpenDiffModal}
          title="Git-style Snapshot Versioning"
        >
          <GitCommit size={14} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{latestCommit?.tag || 'v1.4'}</span>
          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>({latestCommit?.hash || 'a7f3b91'})</span>
        </button>

        {/* Real-time Collaborators stack */}
        <div className="collaborators-pill" title="Live Collaboration Room">
          <div className="avatar-stack">
            {MOCK_COLLABORATORS.map(collab => (
              <img 
                key={collab.id} 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collab.name.split(' ')[0]}`}
                alt={collab.name}
                className="avatar-circle"
                title={`${collab.name} - ${collab.status}`}
              />
            ))}
          </div>
          <span className="badge badge-purple" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>
            <Users size={10} /> 2 Online
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="header-actions">

        {/* User Registration / Account Profile Button */}
        <button 
          className="action-btn user-profile-header-btn" 
          onClick={onOpenAuthModal}
          title={currentUser ? `Autentificat ca ${currentUser.name} (${currentUser.credits ?? 0} credite AI)` : "Înregistrează-te pentru 100 credite AI gratuit"}
          style={{
            background: currentUser ? 'rgba(99, 102, 241, 0.15)' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))',
            borderColor: currentUser ? 'rgba(99, 102, 241, 0.4)' : 'rgba(168, 85, 247, 0.6)'
          }}
        >
          <User size={15} style={{ color: currentUser ? '#818cf8' : '#c084fc' }} />
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#f8fafc', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.18)', padding: '1px 6px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <Zap size={11} /> {currentUser.credits ?? 0}
              </span>
            </div>
          ) : (
            <span style={{ color: '#e0e7ff', fontWeight: 600 }}>Înregistrare</span>
          )}
        </button>

        {/* Tech Blog & Docs Button */}
        <button 
          className={`action-btn ${viewMode === 'blog' ? 'active-blog-btn' : ''}`}
          onClick={onOpenBlog}
          title="Tech Blog & Documentație"
          style={{ borderColor: 'rgba(96, 165, 250, 0.4)', background: 'rgba(59, 130, 246, 0.15)' }}
        >
          <BookOpen size={15} style={{ color: '#60a5fa' }} />
          <span style={{ color: '#93c5fd', fontWeight: 600 }}>Blog & Docs</span>
          <span className="badge badge-blue" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '2px' }}>NEW</span>
        </button>

        {/* Analytics Button */}
        <button 
          className="action-btn" 
          onClick={onOpenAnalyticsModal}
          title="Privacy-First Analytics Dashboard"
        >
          <BarChart3 size={15} />
          <span>Analytics</span>
        </button>

        {/* JSON Resume Import/Export Button */}
        <button 
          className="action-btn" 
          onClick={onOpenJsonModal}
          title="JSON Resume Standard Import/Export"
        >
          <FileCode size={15} />
          <span>JSON Resume</span>
        </button>

        {/* Share & QR Button */}
        <button 
          className="action-btn" 
          onClick={onOpenShareModal}
          title="Hosted Dynamic CV & QR Code"
        >
          <Share2 size={15} />
          <span>Share & QR</span>
        </button>

        {/* Export PDF Button */}
        <button 
          className="action-btn action-btn-primary" 
          onClick={onExportPdf}
          disabled={isExportingPdf}
          title="Deterministic PDF Export via @react-pdf/renderer"
          style={{ opacity: isExportingPdf ? 0.7 : 1, cursor: isExportingPdf ? 'wait' : 'pointer' }}
        >
          <Download size={15} />
          <span>{isExportingPdf ? 'Se generează...' : 'Export PDF'}</span>
        </button>
      </div>
    </header>
  );


}
