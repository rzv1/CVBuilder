import React, { useState } from 'react';
import { X, FileCode, Check, Copy, Download, Upload } from '../Icons';
import { SAMPLE_JSON_RESUME } from '../../mockData';

export default function JsonResumeModal({ isOpen, onClose }) {
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLE_JSON_RESUME, null, 2));
  const [copied, setCopied] = useState(false);
  const [isValid, setIsValid] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonChange = (e) => {
    const txt = e.target.value;
    setJsonText(txt);
    try {
      JSON.parse(txt);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <FileCode size={20} style={{ color: '#60a5fa' }} /> JSON Resume Schema Standard
          </div>
          <button style={{ background: 'transparent', color: '#9ca3af' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className={`badge ${isValid ? 'badge-green' : 'badge-danger'}`}>
              {isValid ? '✓ Valid JSON Resume Schema v1.0.0' : '✕ Invalid JSON Syntax'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Interoperable schema compatible with standard resume parsers & tools
            </span>
          </div>

          <textarea 
            className="input-field" 
            rows={16}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#0b0f19', color: '#38bdf8' }}
            value={jsonText}
            onChange={handleJsonChange}
          />
        </div>

        <div className="modal-footer">
          <button className="action-btn" onClick={handleCopy}>
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button className="action-btn action-btn-primary" onClick={onClose}>
            <Check size={14} /> Import & Apply Schema
          </button>
        </div>
      </div>
    </div>
  );
}
