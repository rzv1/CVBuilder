import React, { useState } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  GitCompare, 
  Plus, 
  Clock, 
  User, 
  Check, 
  Sparkles,
  FileDiff
} from '../Icons';
import { MOCK_GIT_COMMITS } from '../../mockData';

export default function GitVersioningTab({ onOpenDiffModal }) {
  const [commits, setCommits] = useState(MOCK_GIT_COMMITS);
  const [snapshotMsg, setSnapshotMsg] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleCreateSnapshot = () => {
    if (!snapshotMsg.trim()) return;
    
    const newCommit = {
      id: `c-${Date.now()}`,
      hash: Math.random().toString(16).substring(2, 9),
      author: "Alexandru Popescu (You)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      timestamp: "Just now",
      tag: `v1.${commits.length + 1}`,
      message: snapshotMsg,
      changes: { added: 2, deleted: 0 }
    };

    setCommits([newCommit, ...commits]);
    setSnapshotMsg('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="git-versioning-tab">
      {/* Header Info */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 800, color: '#f3f4f6' }}>
          <GitBranch size={18} style={{ color: '#c084fc' }} /> Git-Style Versioning & Commit Snapshots
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
          Full revision history for your CV data store with instant visual side-by-side diffing.
        </p>
      </div>

      {/* Save New Commit / Snapshot Box */}
      <div className="item-card" style={{ border: '1px solid rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.05)' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', display: 'block', marginBottom: '0.4rem' }}>
          Create New Snapshot / Commit
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Commit message (e.g. Added Google XYZ metrics to Lead role)"
            value={snapshotMsg} 
            onChange={(e) => setSnapshotMsg(e.target.value)} 
          />
          <button 
            className="action-btn action-btn-primary" 
            style={{ whiteSpace: 'nowrap' }}
            onClick={handleCreateSnapshot}
          >
            <GitCommit size={15} /> Save Snapshot
          </button>
        </div>
        {isSaved && (
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Check size={12} /> Snapshot saved to version tree!
          </div>
        )}
      </div>

      {/* Timeline of Commits */}
      <div className="timeline" style={{ marginTop: '1.5rem' }}>
        {commits.map(commit => (
          <div key={commit.id} className="timeline-item">
            <div className="timeline-dot" />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-purple" style={{ marginRight: '0.4rem' }}>
                  <GitCommit size={10} /> {commit.tag}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {commit.hash}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> {commit.timestamp}
              </span>
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f3f4f6', marginTop: '0.4rem' }}>
              {commit.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                <img src={commit.avatar} alt={commit.author} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                <span>{commit.author}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                  +{commit.changes.added} / -{commit.changes.deleted}
                </span>

                <button 
                  className="action-btn" 
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                  onClick={onOpenDiffModal}
                >
                  <FileDiff size={12} /> Visual Diff
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
