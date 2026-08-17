import React, { useState } from 'react';
import { DOCS_CONTENT } from '@/frontend/src/data/blogData.js';
import SyntaxPlayground from './SyntaxPlayground.jsx';
import { Copy, Check, Terminal, Cpu, Printer, Target } from '../Icons.jsx';

export default function DocsSection({ selectedDocId }) {
  const doc = DOCS_CONTENT[selectedDocId] || DOCS_CONTENT.architecture;
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderDocsContent = (rawContent) => {
    const parts = rawContent.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const firstLineEnd = part.indexOf('\n');
        const language = part.substring(0, firstLineEnd).trim() || 'yaml';
        const codeText = part.substring(firstLineEnd + 1).trim();

        return (
          <div key={index} className="article-code-block glass-panel">
            <div className="code-block-header">
              <span className="code-lang-label">{language}</span>
              <button 
                className="copy-snippet-btn"
                onClick={() => handleCopyCode(codeText, index)}
              >
                {copiedIndex === index ? (
                  <>
                    <Check size={13} style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981' }}>Copiat!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="code-pre">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      } else {
        const lines = part.split('\n');
        return (
          <div key={index} className="docs-text-block">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('# ')) {
                return <h1 key={lIdx} className="docs-h1">{trimmed.replace('# ', '')}</h1>;
              } else if (trimmed.startsWith('### ')) {
                return <h3 key={lIdx} className="docs-h3">{trimmed.replace('### ', '')}</h3>;
              } else if (trimmed.startsWith('- ')) {
                return <li key={lIdx} className="docs-li">{trimmed.replace('- ', '')}</li>;
              } else if (trimmed.startsWith('* ')) {
                return <li key={lIdx} className="docs-li">{trimmed.replace('* ', '')}</li>;
              } else if (trimmed) {
                return <p key={lIdx} className="docs-p">{trimmed}</p>;
              }
              return null;
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="docs-section-container glass-panel">
      <div className="docs-header">
        <h1 className="docs-main-title">{doc.title}</h1>
        <p className="docs-subtitle">{doc.subtitle}</p>
      </div>

      <div className="docs-body">
        {renderDocsContent(doc.content)}
      </div>

      {/* Show live Syntax Playground if viewer is looking at Code Editor Syntax */}
      {selectedDocId === 'editor-syntax' && (
        <div style={{ marginTop: '2rem' }}>
          <SyntaxPlayground />
        </div>
      )}
    </div>
  );
}
