import React from 'react';
import { X, GitCompare, GitCommit, FileDiff } from '../Icons';

export default function VisualDiffModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const diffLines = [
    { type: 'unchanged', text: '  "role": "Lead Full Stack Engineer",' },
    { type: 'unchanged', text: '  "company": "TechScale Solutions",' },
    { type: 'deleted', text: '- "bullet": "Improved website load speed and optimized server backend."' },
    { type: 'added', text: '+ "bullet": "Accelerated page load speed by 62% as measured by Lighthouse Core Web Vitals, by implementing SSR and route code splitting."' },
    { type: 'added', text: '+ "bullet": "Increased system throughput by 45% (handling 12,000 req/sec), by redesigning event-driven architecture using Redis and Kafka."' },
    { type: 'unchanged', text: '  "skills": ["React", "TypeScript", "Node.js", "GraphQL"]' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <FileDiff size={20} style={{ color: '#c084fc' }} /> Git Visual Diff: v1.3 vs v1.4 (Current Draft)
          </div>
          <button style={{ background: 'transparent', color: '#9ca3af' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} />
              <span style={{ color: '#34d399', fontWeight: 600 }}>+2 Additions (Google XYZ Formula)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '3px' }} />
              <span style={{ color: '#f87171', fontWeight: 600 }}>-1 Deletion (Weak generic bullet)</span>
            </div>
          </div>

          <div className="diff-container">
            {diffLines.map((line, idx) => (
              <div 
                key={idx} 
                className={`diff-line ${line.type === 'added' ? 'diff-added' : line.type === 'deleted' ? 'diff-deleted' : 'diff-unchanged'}`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn action-btn-primary" onClick={onClose}>
            Close Diff View
          </button>
        </div>
      </div>
    </div>
  );
}
