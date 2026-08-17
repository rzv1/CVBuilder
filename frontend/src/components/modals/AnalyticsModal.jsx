import React from 'react';
import { X, BarChart3, Download, Eye, QrCode, Globe, ShieldCheck } from '../Icons.jsx';
import { MOCK_ANALYTICS } from '../../mockData.js';

export default function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <BarChart3 size={20} style={{ color: '#38bdf8' }} /> Privacy-First Analytics Dashboard
          </div>
          <button style={{ background: 'transparent', color: '#9ca3af' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
              <Eye size={20} style={{ margin: '0 auto', color: '#60a5fa' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{MOCK_ANALYTICS.stats.totalViews}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Total CV Page Views</div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
              <Download size={20} style={{ margin: '0 auto', color: '#34d399' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{MOCK_ANALYTICS.stats.pdfDownloads}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>PDF Downloads</div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
              <QrCode size={20} style={{ margin: '0 auto', color: '#c084fc' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{MOCK_ANALYTICS.stats.qrScans}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Header QR Code Scans</div>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
            Weekly Traffic Breakdown
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '140px', background: '#0b0f19', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
            {MOCK_ANALYTICS.recentViews.map((item, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(item.views / 90) * 100}%`, background: 'linear-gradient(to top, #2563eb, #38bdf8)', borderRadius: '4px' }} title={`${item.views} views`} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.4rem' }}>{item.date}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} /> Privacy Guard Active: Aggregate telemetry only. No cookies, tracking pixels, or fingerprinting.
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn action-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
