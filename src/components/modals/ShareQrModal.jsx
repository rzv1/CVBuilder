import React, { useState } from 'react';
import { X, Share2, QrCode, Copy, Globe, Check, ExternalLink } from '../Icons';
import { MOCK_ANALYTICS } from '../../mockData';

export default function ShareQrModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_ANALYTICS.hostedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Share2 size={20} style={{ color: '#60a5fa' }} /> Hosted Dynamic CV & QR Code
          </div>
          <button style={{ background: 'transparent', color: '#9ca3af' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <img src={MOCK_ANALYTICS.qrCodeUrl} alt="CV QR Code" style={{ width: '160px', height: '160px' }} />
          </div>

          <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
            Scan to view live digital CV on any mobile device
          </div>

          <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600 }}>
              {MOCK_ANALYTICS.hostedUrl}
            </span>
            <button className="action-btn" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} onClick={handleCopy}>
              <Copy size={12} /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
            This QR code is automatically embedded in the top-right header of your generated PDF downloads.
          </p>
        </div>

        <div className="modal-footer">
          <button className="action-btn action-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
