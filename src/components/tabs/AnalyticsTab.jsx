import React, { useState } from 'react';
import { 
  BarChart3, 
  Globe, 
  QrCode, 
  Download, 
  Eye, 
  Link, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Check
} from '../Icons';
import { MOCK_ANALYTICS } from '../../mockData';

export default function AnalyticsTab({ onOpenShareModal }) {
  const [analyticsData] = useState(MOCK_ANALYTICS);
  const [isPublished, setIsPublished] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(analyticsData.hostedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="analytics-tab">
      {/* Header Info */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800, color: '#f3f4f6' }}>
          <BarChart3 size={18} style={{ color: '#38bdf8' }} /> Hosted CV & Privacy-First Analytics
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          Publish your CV on a dedicated link, embed QR codes in PDF headers, and track recruiter engagement without cookies or personal data tracking.
        </p>
      </div>

      {/* Hosted Subdomain Box */}
      <div className="item-card" style={{ background: '#1e293b', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Public CV URL
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Globe size={14} /> {analyticsData.hostedUrl}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="action-btn" onClick={handleCopyLink}>
              <Link size={14} /> {copiedLink ? "Copied!" : "Copy URL"}
            </button>
            <button className="action-btn action-btn-primary" onClick={onOpenShareModal}>
              <QrCode size={14} /> View QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={14} style={{ color: '#60a5fa' }} /> Total Views
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6', marginTop: '0.2rem' }}>
            {analyticsData.stats.totalViews}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '0.2rem' }}>
            +18.4% vs last week
          </div>
        </div>

        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Download size={14} style={{ color: '#34d399' }} /> PDF Downloads
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6', marginTop: '0.2rem' }}>
            {analyticsData.stats.pdfDownloads}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '0.2rem' }}>
            26% conversion rate
          </div>
        </div>

        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <QrCode size={14} style={{ color: '#c084fc' }} /> QR Code Scans
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f3f4f6', marginTop: '0.2rem' }}>
            {analyticsData.stats.qrScans}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#c084fc', marginTop: '0.2rem' }}>
            From print & PDF headers
          </div>
        </div>
      </div>

      {/* Referrer Breakdown Table */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={14} /> Traffic Sources & Referrers
        </div>

        <div style={{ background: '#1e293b', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {analyticsData.topReferrers.map((ref, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: idx < analyticsData.topReferrers.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>{ref.source}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ref.count} views</span>
                <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{ref.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#34d399' }}>
        <ShieldCheck size={16} /> Privacy-First Tracking: Zero cookies, GDPR compliant, no IP storage.
      </div>
    </div>
  );
}
